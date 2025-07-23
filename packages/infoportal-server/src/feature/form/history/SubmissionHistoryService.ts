import {Prisma, PrismaClient} from '@prisma/client'
import {app, AppLogger} from '../../../index.js'
import {Obj, seq} from '@axanc/ts-utils'
import {Kobo} from 'kobo-sdk'
import {KoboAnswerHistoryHelper} from './SubmissionHistoryType.js'
import {Paginate} from 'infoportal-api-sdk'

type Create = {
  authorEmail: string
  formId: Kobo.FormId
  answerIds: Kobo.SubmissionId[]
} & (
  | {
      type: 'answer' | 'validation'
      newValue: any
      property: string
    }
  | {
      type: 'delete'
      newValue?: undefined
      property?: undefined
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
      .then(Paginate.wrap())
  }

  readonly create = async ({authorEmail, formId, answerIds, property, newValue, type}: Create) => {
    if (type === 'delete') {
      return this.prisma.formSubmissionHistory.create({
        data: {
          answers: {
            connect: answerIds.map(id => ({id})),
          },
          by: authorEmail,
          type: type,
          formId,
        },
      })
    }
    const currentByPrevValue = await this.prisma.formSubmission
      .findMany({
        select: {
          id: true,
          validationStatus: true,
          answers: true,
        },
        where: {
          id: {in: answerIds},
        },
      })
      .then(res =>
        seq(res).groupBy(_ => {
          return type === 'answer' ? (_.answers as any)[property] : _.validationStatus
        }),
      )
    return Promise.all(
      Obj.entries(currentByPrevValue).map(([oldValue, v]) => {
        return this.prisma.formSubmissionHistory.create({
          data: {
            answers: {
              connect: v.map(_ => ({id: _.id})),
            },
            by: authorEmail,
            type,
            formId,
            property,
            oldValue,
            newValue: newValue ?? Prisma.JsonNull,
          },
        })
      }),
    )
  }
}
