import {Prisma, PrismaClient} from '@prisma/client'
import {app, AppLogger} from '../../../index.js'
import {KoboAnswerHistoryHelper} from './KoboAnswerHistoryType.js'
import {ApiPaginateHelper} from 'infoportal-common'
import {Obj, seq} from '@axanc/ts-utils'
import {Kobo} from 'kobo-sdk'

type Create = {
  authorEmail: string
  formId: Kobo.FormId
  answerIds: Kobo.SubmissionId[]
} & (
  | {
      type: 'answer' | 'tag'
      newValue: any
      property: string
    }
  | {
      type: 'delete'
      newValue?: undefined
      property?: undefined
    }
)

export class KoboAnswerHistoryService {
  constructor(
    private prisma: PrismaClient,
    private log: AppLogger = app.logger('KoboAnswerHistoryService'),
  ) {}

  readonly search = (params: KoboAnswerHistoryHelper.Search) => {
    return this.prisma.koboAnswersHistory
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
      .then((_) => {
        return _.map((history) => ({
          ...history,
          answerIds: history.answers.map((_) => _.id),
        }))
      })
      .then(ApiPaginateHelper.wrap())
  }

  readonly create = async ({authorEmail, formId, answerIds, property, newValue, type}: Create) => {
    if (type === 'delete') {
      return this.prisma.koboAnswersHistory.create({
        data: {
          answers: {
            connect: answerIds.map((id) => ({id})),
          },
          by: authorEmail,
          type: type,
          formId,
        },
      })
    }
    const currentByPrevValue = await this.prisma.koboAnswers
      .findMany({
        where: {
          id: {in: answerIds},
        },
      })
      .then((res) =>
        seq(res).groupBy((_) => {
          const data: any = _[type === 'tag' ? 'tags' : 'answers'] ?? {}
          return data[property]
        }),
      )
    return Promise.all(
      Obj.entries(currentByPrevValue).map(([oldValue, v]) => {
        return this.prisma.koboAnswersHistory.create({
          data: {
            answers: {
              connect: v.map((_) => ({id: _.id})),
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
