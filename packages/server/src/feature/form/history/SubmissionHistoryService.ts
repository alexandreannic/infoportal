import {Prisma, PrismaClient} from '@infoportal/prisma'
import {app, AppLogger} from '../../../index.js'
import {Obj, seq} from '@axanc/ts-utils'
import {Kobo} from 'kobo-sdk'
import {KoboAnswerHistoryHelper} from './SubmissionHistoryType.js'
import {Api} from '@infoportal/api-sdk'
import crypto from 'crypto'

type Create = {
  authorEmail: Api.User.Email
  formId: Kobo.FormId
  answerIds: Kobo.SubmissionId[]
} & (
  | {
      type: 'answer'
      newValue: any
      oldValue?: any
      property: string
    }
  | {
      type: 'validation'
      newValue: any
    }
  | {
      type: 'delete'
      newValue?: undefined
    }
)

export class SubmissionHistoryService {
  constructor(
    private prisma: PrismaClient,
    private log: AppLogger = app.logger('KoboAnswerHistoryService'),
  ) {}

  readonly search = (params: KoboAnswerHistoryHelper.Search) => {
    return this.prisma.formSubmissionHistory
      .findMany({
        include: {
          answers: {
            select: {
              id: true,
            },
          },
        },
        where: {
          formId: params.formId,
        },
        orderBy: {date: 'desc'},
      })
      .then(_ => {
        return _.map(history => ({
          ...history,
          answerIds: history.answers.map(_ => _.id),
        }))
      })
      .then(Api.Paginate.wrap())
  }

  readonly create = async (props: Create) => {
    const {authorEmail, formId, answerIds, type} = props

    // ---------------------- DELETE ----------------------
    if (type === 'delete') {
      return this.prisma.formSubmissionHistory.create({
        data: {
          answers: {connect: answerIds.map(id => ({id}))},
          by: authorEmail,
          type,
          formId,
        },
      })
    }

    // ---------------------- PREP ------------------------
    let property: string
    let rows: Array<{id: string; prev: any}> = []

    if (type === 'answer') {
      property = props.property

      if (props.oldValue !== undefined) {
        rows = answerIds.map(id => ({id, prev: props.oldValue}))
      } else {
        const submissions = await this.prisma.formSubmission.findMany({
          where: {id: {in: answerIds}},
          select: {id: true, answers: true},
        })
        rows = submissions.map(s => ({
          id: s.id,
          prev: (s.answers as any)[property],
        }))
      }
    }

    if (type === 'validation') {
      const validationKey: keyof Api.Submission.Meta = 'validationStatus'
      property = validationKey
      const submissions = await this.prisma.formSubmission.findMany({
        where: {id: {in: answerIds}},
        select: {id: true, validationStatus: true},
      })
      rows = submissions.map(s => ({
        id: s.id,
        prev: s.validationStatus!,
      }))
    }

    // Group by previous value
    const grouped = seq(rows).groupBy(r => r.prev)

    // ---------------------- BATCH INSERT HISTORY ----------------------
    const historyRows = Obj.entries(grouped).map(([oldValue]) => ({
      id: crypto.randomUUID(),
      formId,
      by: authorEmail,
      type,
      property,
      oldValue,
      newValue: props.newValue ?? Prisma.JsonNull,
    }))

    await this.prisma.formSubmissionHistory.createMany({
      data: historyRows,
    })

    // ---------------------- BATCH INSERT JOIN TABLE ---------------------
    // Prisma generates join table name deterministically:
    // "_FormSubmissionToHistory"
    const joinRows: {A: string; B: string}[] = []

    let i = 0
    for (const [, items] of Obj.entries(grouped)) {
      const historyId = historyRows[i++].id
      for (const item of items) {
        joinRows.push({
          A: item.id, // submissionId
          B: historyId, // historyId
        })
      }
    }

    // Insert all join rows in one SQL statement
    await this.prisma.$executeRawUnsafe(`
    INSERT INTO "_FormSubmissionToHistory" ("A","B")
    VALUES ${joinRows.map(j => `('${j.A}','${j.B}')`).join(',')}
  `)

    return historyRows
  }
}
