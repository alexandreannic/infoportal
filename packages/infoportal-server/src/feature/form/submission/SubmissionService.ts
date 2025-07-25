import {Prisma, PrismaClient} from '@prisma/client'
import {KoboSdkGenerator} from '../../kobo/KoboSdkGenerator.js'
import {duration, Obj, seq} from '@axanc/ts-utils'
import {FormAccessService} from '../access/FormAccessService.js'
import {app, AppCacheKey} from '../../../index.js'
import {appConf} from '../../../core/conf/AppConf.js'
import {SubmissionHistoryService} from '../history/SubmissionHistoryService.js'
import {AppError} from '../../../helper/Errors.js'
import {genShortid, genUUID, Util} from '../../../helper/Utils.js'
import {Kobo} from 'kobo-sdk'
import {Ip, Paginate} from 'infoportal-api-sdk'
import {KoboCustomDirective, logPerformance} from 'infoportal-common'
import {KoboMapper} from '../../kobo/KoboMapper.js'
import {FormService} from '../FormService.js'
import {IpEvent} from 'infoportal-event'
import {PrismaHelper} from '../../../core/PrismaHelper.js'

export class SubmissionService {
  constructor(
    private prisma: PrismaClient,
    private form = new FormService(prisma),
    private access = new FormAccessService(prisma),
    private sdkGenerator: KoboSdkGenerator = KoboSdkGenerator.getSingleton(prisma),
    private history = new SubmissionHistoryService(prisma),
    private event = app.event,
    private log = app.logger('KoboService'),
    private conf = appConf,
  ) {}

  private readonly _searchAnswersByUsersAccess = async (
    params: Ip.Submission.Payload.Search,
  ): Promise<Ip.Paginate<Ip.Submission>> => {
    if (!params.user) return Paginate.make()([])
    // TODO(Alex) reimplement
    if (params.user.accessLevel !== Ip.AccessLevel.Admin) {
      const access = await this.access
        .search({workspaceId: params.workspaceId, user: params.user})
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
          if (!params.filters) params.filters = {}
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
    fn: ({formId, filters = {}, paginate = {}}: Ip.Submission.Payload.Search): Promise<Ip.Paginate<Ip.Submission>> => {
      return (
        this.prisma.formSubmission
          .findMany({
            select: {
              id: true,
              start: true,
              end: true,
              submissionTime: true,
              submittedBy: true,
              version: true,
              validationStatus: true,
              geolocation: true,
              answers: true,
              attachments: true,
            },
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

  private static readonly genId = () => genShortid(10)

  private static readonly mapPayload = ({
    answers,
    formId,
    attachments,
    author,
  }: {
    author?: string
    formId: Ip.FormId
  } & Ip.Submission.Payload.Submit): Prisma.FormSubmissionUncheckedCreateInput => {
    return {
      formId: formId,
      id: this.genId(),
      start: new Date(),
      end: new Date(),
      uuid: genUUID(),
      submissionTime: new Date(),
      source: 'internal',
      submittedBy: author,
      answers,
      attachments,
    }
  }

  readonly submit = async (
    props: Ip.Submission.Payload.Submit & {
      workspaceId: Ip.WorkspaceId
      formId: Ip.FormId
      author?: string
    },
  ): Promise<Ip.Submission> => {
    const form = await this.form.get(props.formId)
    if (!form) throw new AppError.NotFound(`Form ${props.formId} does not exists.`)
    if (form.kobo) throw new AppError.BadRequest(`Cannot submit in a Kobo form. Submissions must be done in Kobo.`)
    return this.create({workspaceId: props.workspaceId, answers: SubmissionService.mapPayload(props)})
  }

  readonly create = async ({
    workspaceId,
    answers,
  }: {
    workspaceId: Ip.WorkspaceId
    answers: Prisma.FormSubmissionUncheckedCreateInput
  }): Promise<Ip.Submission> => {
    const submission: any = await this.prisma.formSubmission
      .create({
        select: {
          id: true,
          start: true,
          end: true,
          submissionTime: true,
          submittedBy: true,
          version: true,
          validationStatus: true,
          geolocation: true,
          answers: true,
          attachments: true,
        },
        data: answers,
      })
      .then(PrismaHelper.mapSubmission)
    this.event.emit(IpEvent.SUBMISSION_NEW, {workspaceId, formId: submission.formId, submission})
    return submission
  }

  readonly createMany = (inserts: Prisma.FormSubmissionUncheckedCreateInput[]) => {
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
    answerIds: Ip.SubmissionId[]
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
         SET answers = jsonb_set(answers, '{${question}}', '"${SubmissionService.safeJsonValue(answer ?? '')}"'),
             "end"   = NOW()
         WHERE id IN (${SubmissionService.safeIds(answerIds).join(',')})
        `,
      ),
    ])
    this.event.emit(IpEvent.SUBMISSION_EDITED, {formId, submissionIds: answerIds, answer: {[question]: answer}})
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
    const mappedValidation = KoboMapper.mapValidation.toKobo(status)
    const validationKey: keyof Ip.Submission.Meta = 'validationStatus'
    const sdk = await this.sdkGenerator.getBy.formId(formId)
    const [sqlRes] = await Promise.all([
      this.prisma.formSubmission.updateMany({
        where: {id: {in: answerIds}},
        data: {
          validationStatus: status,
          end: new Date(),
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
        type: 'validation',
        formId,
        answerIds,
        property: validationKey,
        newValue: status,
        authorEmail,
      }),
    ])
  }
}
