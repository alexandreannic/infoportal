import {Prisma, PrismaClient, User} from '@prisma/client'
import {KoboSdkGenerator} from '../../kobo/KoboSdkGenerator.js'
import {duration, Obj, seq} from '@axanc/ts-utils'
import {KoboAnswersFilters} from '../../../server/controller/kobo/ControllerKoboAnswer.js'
import {FormAccessService} from '../access/FormAccessService.js'
import {GlobalEvent} from '../../../core/GlobalEvent.js'
import {defaultPagination} from '../../../core/Type.js'
import {app, AppCacheKey} from '../../../index.js'
import {appConf} from '../../../core/conf/AppConf.js'
import {FormAnswerHistoryService} from '../history/FormAnswerHistoryService.js'
import {AppError} from '../../../helper/Errors.js'
import {Util} from '../../../helper/Utils.js'
import {Kobo} from 'kobo-sdk'
import {Ip, Paginate} from 'infoportal-api-sdk'
import {
  KoboCustomDirective,
  KoboHelper,
  KoboSubmission,
  KoboSubmissionMetaData,
  logPerformance,
  UUID,
} from 'infoportal-common'
import Event = GlobalEvent.Event

export type DbFormAnswer = KoboSubmission & {
  formId: Ip.FormId
}

export class FormAnswersService {
  constructor(
    private prisma: PrismaClient,
    private access = new FormAccessService(prisma),
    private sdkGenerator: KoboSdkGenerator = KoboSdkGenerator.getSingleton(prisma),
    private history = new FormAnswerHistoryService(prisma),
    private event: GlobalEvent.Class = GlobalEvent.Class.getInstance(),
    private log = app.logger('KoboService'),
    private conf = appConf,
  ) {}

  private readonly _searchAnswersByUsersAccess = async ({
    user,
    workspaceId,
    ...params
  }: {
    formId: string
    filters: KoboAnswersFilters
    paginate?: Partial<Ip.Pagination>
    user?: User
    workspaceId: UUID
  }): Promise<Ip.Paginate<Ip.Submission>> => {
    if (!user) return Paginate.make()([])
    // TODO(Alex) reimplement
    if (user.accessLevel !== Ip.AccessLevel.Admin) {
      const access = await this.access
        .search({workspaceId, user})
        .then(_ => seq(_).filter(_ => _.formId === params.formId))
      if (access.length === 0) return Paginate.make()([])
      const hasEmptyFilter = access.some(_ => !_?.filters || Object.keys(_.filters).length === 0)
      if (!hasEmptyFilter) {
        const accessFilters = access
          .map(_ => _.filters)
          .compact()
          .reduce<Record<string, string[]>>((acc, x) => {
            Obj.entries(x).forEach(([k, v]) => {
              if (Array.isArray(x[k])) {
                acc[k] = seq([...(acc[k] ?? []), ...(x[k] ?? [])]).distinct(_ => _)
              } else {
                acc[k] = v as any
              }
            })
            return acc
          }, {} as const)
        Obj.entries(accessFilters).forEach(([question, answer]) => {
          if (!params.filters.filterBy) params.filters.filterBy = []
          params.filters.filterBy?.push({
            column: question,
            value: answer,
          })
        })
      }
    }
    return this.searchAnswers(params)
  }

  readonly searchAnswersByUsersAccess = logPerformance({
    message: p => `Fetch ${p.formId} by ${p.user?.email}`,
    showResult: res => `(${res ? res.data.length : '...'} rows)`,
    logger: (m: string) => this.log.info(m),
    fn: this._searchAnswersByUsersAccess,
  })

  readonly searchAnswers = app.cache.request({
    key: AppCacheKey.KoboAnswers,
    cacheIf: params => {
      return false
    },
    genIndex: p => p.formId,
    ttlMs: duration(1, 'day').toMs,
    fn: (params: {
      formId: string
      filters?: KoboAnswersFilters
      paginate?: Partial<Ip.Pagination>
    }): Promise<Ip.Paginate<Ip.Submission>> => {
      const {formId, filters = {}, paginate = defaultPagination} = params
      return (
        this.prisma.formSubmission
          .findMany({
            take: paginate.limit,
            skip: paginate.offset,
            orderBy: [{submissionTime: 'desc'}],
            where: {
              deletedAt: null,
              submissionTime: {
                gte: filters.start,
                lt: filters.end,
              },
              formId,
              AND: {
                OR: filters.filterBy?.flatMap(filter =>
                  Util.ensureArr(filter.value).map(v => ({
                    answers: {
                      path: [filter.column],
                      ...(v
                        ? {
                            ['string_contains']: v,
                          }
                        : {
                            equals: Prisma.DbNull,
                          }),
                    },
                  })),
                ),
              },
            },
          })
          // .then(_ => {
          //   if (_?.[0].answers.date)
          //     return _.sort((a, b) => {
          //       return (b.answers.date as string ?? b.submissionTime.toISOString()).localeCompare(
          //         a.answers.date as string ?? a.submissionTime.toISOString()
          //       )
          //     })
          //   return _
          // })
          .then(Paginate.make()) as Promise<Ip.Paginate<Ip.Submission>>
      )
    },
  })

  private static readonly mapAnswer = (
    formId: Ip.FormId,
    _: KoboSubmission,
  ): Prisma.FormSubmissionUncheckedCreateInput => {
    return {
      formId,
      answers: _.answers,
      id: _.id,
      uuid: _.uuid,
      start: _.start,
      end: _.end,
      submissionTime: _.submissionTime,
      validationStatus: _.validationStatus,
      lastValidatedTimestamp: _.lastValidatedTimestamp,
      validatedBy: _.validatedBy,
      version: _.version,
      // source: serverId,
      attachments: _.attachments,
    }
  }

  readonly create = (formId: Ip.FormId, answer: KoboSubmission) => {
    return this.prisma.formSubmission.create({data: FormAnswersService.mapAnswer(formId, answer)})
  }

  readonly createMany = (formId: Ip.FormId, answers: KoboSubmission[]) => {
    const inserts = answers.map(_ => FormAnswersService.mapAnswer(formId, _))
    return this.prisma.formSubmission.createMany({
      data: inserts,
      skipDuplicates: true,
    })
  }

  private static readonly safeJsonValue = (_: string): string => _.replace(/'/g, "''")

  private static readonly safeIds = (ids: string[]): string[] => {
    return ids.map(_ => {
      if (!/^\d+$/.test(_)) throw new AppError.WrongFormat(`Invalid id ${_}`)
      return `'${_}'`
    })
  }

  readonly deleteAnswers = async ({
    answerIds,
    formId,
    authorEmail = 'system',
  }: {
    answerIds: Kobo.SubmissionId[]
    formId: Ip.FormId
    authorEmail?: string
  }) => {
    await Promise.all([
      this.prisma.formSubmission.updateMany({
        data: {
          deletedAt: new Date(),
          deletedBy: authorEmail,
        },
        where: {
          formId,
          id: {in: answerIds},
        },
      }),
      this.sdkGenerator.getBy.formId(formId).then(_ => _.v2.submission.delete({formId, submissionIds: answerIds})),
    ])
    this.history.create({
      type: 'delete',
      formId,
      answerIds,
      authorEmail,
    })
  }

  readonly updateAnswers = async ({
    formId,
    answerIds,
    question,
    answer,
    authorEmail = 'system',
  }: {
    authorEmail?: string
    formId: Ip.FormId
    answerIds: Kobo.SubmissionId[]
    question: string
    answer?: string
  }) => {
    answer = Array.isArray(answer) ? answer.join(' ') : answer
    const sdk = await this.sdkGenerator.getBy.formId(formId)
    await Promise.all([
      this.history.create({
        type: 'answer',
        formId,
        answerIds,
        property: question,
        newValue: answer,
        authorEmail,
      }),
      sdk.v2.submission.update({formId, submissionIds: answerIds, data: {[question]: answer}}),
      await this.prisma.$executeRawUnsafe(
        `UPDATE "KoboAnswers"
         SET answers     = jsonb_set(answers, '{${question}}', '"${FormAnswersService.safeJsonValue(answer ?? '')}"'),
             "updatedAt" = NOW()
         WHERE id IN (${FormAnswersService.safeIds(answerIds).join(',')})
        `,
      ),
    ])
    this.event.emit(Event.KOBO_ANSWER_EDITED_FROM_IP, {formId, answerIds, answer: {[question]: answer}})
  }

  readonly updateValidation = async ({
    formId,
    answerIds,
    status,
    authorEmail,
  }: {
    formId: Ip.FormId
    answerIds: Kobo.SubmissionId[]
    status: Ip.Submission.Validation
    authorEmail: string
  }) => {
    const mappedValidation = KoboHelper.mapValidation.toKobo(status)
    const validationKey: keyof KoboSubmissionMetaData = 'validationStatus'
    const sdk = await this.sdkGenerator.getBy.formId(formId)
    const [sqlRes] = await Promise.all([
      this.prisma.formSubmission.updateMany({
        where: {id: {in: answerIds}},
        data: {
          validationStatus: status,
          updatedAt: new Date(),
        },
      }),
      (async () => {
        if (mappedValidation._validation_status) {
          await Promise.all([
            sdk.v2.submission.updateValidation({
              formId,
              submissionIds: answerIds,
              status: mappedValidation._validation_status,
            }),
            sdk.v2.submission.update({
              formId,
              submissionIds: answerIds,
              data: {[KoboCustomDirective.Name._IP_VALIDATION_STATUS_EXTRA]: null},
            }),
          ])
        } else {
          await Promise.all([
            sdk.v2.submission.update({
              formId,
              submissionIds: answerIds,
              data: {
                [KoboCustomDirective.Name._IP_VALIDATION_STATUS_EXTRA]: mappedValidation._IP_VALIDATION_STATUS_EXTRA,
              },
            }),
            sdk.v2.submission.updateValidation({
              formId,
              submissionIds: answerIds,
              status: Kobo.Submission.Validation.no_status,
            }),
          ])
        }
      })(),
      this.history.create({
        type: 'tag',
        formId,
        answerIds,
        property: validationKey,
        newValue: status,
        authorEmail,
      }),
    ])
    return sqlRes
  }
}
