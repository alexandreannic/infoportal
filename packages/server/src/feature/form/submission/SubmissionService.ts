import {Prisma, PrismaClient} from '@prisma/client'
import {KoboSdkGenerator} from '../../kobo/KoboSdkGenerator.js'
import {duration, Obj, seq} from '@axanc/ts-utils'
import {FormAccessService} from '../access/FormAccessService.js'
import {app, AppCacheKey} from '../../../index.js'
import {appConf} from '../../../core/AppConf.js'
import {SubmissionHistoryService} from '../history/SubmissionHistoryService.js'
import {Api, HttpError} from '@infoportal/api-sdk'
import {Util} from '../../../helper/Utils.js'
import {Kobo} from 'kobo-sdk'
import {genUUID, IpEvent, logPerformance} from '@infoportal/common'
import {KoboMapper} from '../../kobo/KoboMapper.js'
import {FormService} from '../FormService.js'
import {prismaMapper} from '../../../core/prismaMapper/PrismaMapper.js'
import {nanoid} from 'nanoid'

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
    params: Api.Submission.Payload.Search,
  ): Promise<Api.Paginate<Api.Submission>> => {
    if (!params.user) return Api.Paginate.make()([])
    // TODO(Alex) reimplement
    if (params.user.accessLevel !== Api.AccessLevel.Admin) {
      const access = await this.access
        .search({workspaceId: params.workspaceId, user: params.user})
        .then(_ => seq(_).filter(_ => _.formId === params.formId))
      if (access.length === 0) return Api.Paginate.make()([])
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
    fn: ({
      formId,
      filters = {},
      paginate = {},
    }: Api.Submission.Payload.Search): Promise<Api.Paginate<Api.Submission>> => {
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
              isoCode: true,
              validationStatus: true,
              geolocation: true,
              answers: true,
              attachments: true,
              originId: true,
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
          .then(Api.Paginate.make()) as Promise<Api.Paginate<Api.Submission>>
      )
    },
  })

  private static readonly mapPayload = ({
    answers,
    formId,
    attachments,
    author,
    isoCode,
    version,
    geolocation,
  }: {
    geolocation?: Api.Geolocation
    version: string
    author?: string
    formId: Api.FormId
    isoCode?: string
  } & Api.Submission.Payload.Submit): Prisma.FormSubmissionUncheckedCreateInput => {
    return {
      formId: formId,
      id: this.genId(),
      start: new Date(),
      end: new Date(),
      uuid: genUUID(),
      geolocation,
      submissionTime: new Date(),
      version,
      isoCode,
      submittedBy: author,
      answers,
      attachments,
    }
  }

  private readonly getIsoFromGeopoint = async (geolocation?: Api.Geolocation) => {
    if (!geolocation) return
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${geolocation[0]}&lon=${geolocation[1]}&format=json`
    return fetch(url)
      .then(_ => _.json())
      .then(_ => _.address['ISO3166-2-lvl4'])
      .catch(() => {
        this.log.warn('Cannot retrieve ISO code from nominatim.openstreetmap.org API')
        return undefined
      })
      .then(iso => {
        if (iso || !this.conf.openCageDataApiKey) return iso
        // OpenCageData is limited to 2,500 requests/day.
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${geolocation[0]}+${geolocation[1]}&key=${this.conf.openCageDataApiKey}`
        return fetch(url)
          .then(_ => _.json())
          .then(_ => _.results[0].components['ISO_3166-2'][0])
      })
      .catch(() => {
        this.log.warn('Cannot retrieve ISO code from OpenCageData API')
        return undefined
      })
  }
  readonly submit = async (
    props: Api.Submission.Payload.Submit & {
      workspaceId: Api.WorkspaceId
      formId: Api.FormId
      author?: string
    },
  ): Promise<Api.Submission> => {
    const {formId, workspaceId} = props
    const form = await this.form.get(formId)
    const formVersion = await this.prisma.formVersion.findFirst({
      select: {version: true},
      where: {formId, status: 'active'},
    })
    if (!formVersion) throw new HttpError.BadRequest(`No active version found for Form ${formId}.`)
    if (!form) throw new HttpError.NotFound(`Form ${formId} does not exists.`)
    if (Api.Form.isConnectedToKobo(form))
      throw new HttpError.BadRequest(`Cannot submit in a Kobo form. Submissions must be done in Kobo.`)
    if (form.type === 'smart') throw new HttpError.BadRequest(`Cannot manually submit in a Smart form.`)
    const isoCode = await this.getIsoFromGeopoint(props.geolocation)
    return this.create({
      workspaceId,
      data: SubmissionService.mapPayload({...props, version: 'v' + formVersion.version, isoCode}),
    })
  }

  readonly create = async ({
    workspaceId,
    data,
  }: {
    workspaceId: Api.WorkspaceId
    data: Prisma.FormSubmissionUncheckedCreateInput
  }): Promise<Api.Submission> => {
    const submission = await this.prisma.formSubmission
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
        data: data,
      })
      .then(_ => prismaMapper.form.mapSubmission(_) as Api.Submission)
    this.event.emit(IpEvent.SUBMISSION_NEW, {workspaceId, formId: data.formId as Api.FormId, submission})
    return submission
  }

  readonly createMany = ({
    data,
    skipDuplicates,
  }: {
    data: Prisma.FormSubmissionUncheckedCreateInput[]
    skipDuplicates?: boolean
  }) => {
    return this.prisma.formSubmission.createMany({
      data,
      skipDuplicates,
    })
  }

  private static readonly safeJsonValue = (_: string): string => _.replace(/'/g, "''")

  private static readonly safeIds = (ids: string[]): string[] => {
    return ids.map(_ => {
      if (!/^[a-zA-Z0-9_-]{10}$/.test(_)) throw new HttpError.WrongFormat(`Invalid id ${_}`)
      return `'${_}'`
    })
  }

  static readonly genId = (): Api.SubmissionId => nanoid(10)

  readonly remove = async ({
    answerIds,
    formId,
    authorEmail = 'system' as Api.User.Email,
  }: {
    answerIds: Api.SubmissionId[]
    formId: Api.FormId
    authorEmail?: Api.User.Email
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
      this.isConnectedToKobo(formId)
        .then(isConnected => {
          if (!isConnected) return
          return this.sdkGenerator.getBy.formId(formId)
        })
        .then(sdk => {
          return sdk?.v2.submission.delete({formId, submissionIds: answerIds})
        }),
    ])
    this.history.create({
      type: 'delete',
      formId,
      answerIds,
      authorEmail,
    })
    this.event.emit(IpEvent.SUBMISSION_REMOVED, {submissionIds: answerIds, formId})
  }

  private readonly isConnectedToKobo = (formId: Api.FormId) => {
    return this.prisma.formKoboInfo.findFirst({select: {formId: true}, where: {formId}}).then(_ => !!_)
  }

  readonly updateAnswers = async ({
    formId,
    answerIds,
    question,
    answer,
    authorEmail = 'system' as Api.User.Email,
  }: {
    authorEmail?: Api.User.Email
    formId: Api.FormId
    answerIds: Api.SubmissionId[]
    question: string
    answer?: string
  }): Promise<Api.BulkResponse<Api.SubmissionId>> => {
    answer = Array.isArray(answer) ? answer.join(' ') : answer
    await Promise.all([
      this.history.create({
        type: 'answer',
        formId,
        answerIds,
        property: question,
        newValue: answer,
        authorEmail,
      }),
      answer == null || answer === ''
        ? await this.prisma.$executeRaw`
          UPDATE "FormSubmission"
          SET answers = answers - ${question}
          WHERE id IN (${Prisma.join(answerIds)})
        `
        : await this.prisma.$executeRawUnsafe(
            `
              UPDATE "FormSubmission"
              SET answers = jsonb_set(answers, ARRAY[$1], to_jsonb($2::text))
              WHERE id = ANY ($3::text[])
            `,
            question,
            answer,
            answerIds,
          ),
      this.isConnectedToKobo(formId).then(async isConnected => {
        if (!isConnected) return
        const sdk = await this.sdkGenerator.getBy.formId(formId)
        if (!sdk) throw new HttpError.NotFound(`KoboSdk not found for Form ${formId}`)
        const [koboSubmissionIds, koboFormId] = await Promise.all([
          this.getKoboSubmissionIds({submissionIds: answerIds}).then(_ => _.filter(_ => _ !== null)),
          this.form.getKoboIdByFormId(formId),
        ])
        if (!koboFormId) throw new HttpError.NotFound(`Kobo formId not found for form ${formId}`)
        return sdk.v2.submission.update({
          formId: koboFormId,
          submissionIds: koboSubmissionIds,
          data: {[question]: answer},
        })
      }),
    ])
    this.event.emit(IpEvent.SUBMISSION_EDITED, {formId, submissionIds: answerIds, question, answer})
    return answerIds.map(id => ({id, status: 'success'}))
  }

  readonly updateValidation = async ({
    formId,
    answerIds,
    status,
    authorEmail,
  }: {
    formId: Api.FormId
    answerIds: Api.SubmissionId[]
    status: Api.Submission.Validation
    authorEmail: Api.User.Email
  }): Promise<Api.BulkResponse<Api.SubmissionId>> => {
    const mappedValidation = KoboMapper.mapValidation.toKobo(status)
    const validationKey: keyof Api.Submission.Meta = 'validationStatus'
    const [sqlRes] = await Promise.all([
      this.prisma.formSubmission.updateMany({
        where: {id: {in: answerIds}},
        data: {
          validationStatus: status,
          end: new Date(),
        },
      }),
      await this.isConnectedToKobo(formId).then(async isConnected => {
        if (!isConnected) return
        const sdk = await this.sdkGenerator.getBy.formId(formId)
        if (!sdk) throw new HttpError.NotFound(`KoboSdk not found for Form ${formId}`)
        const [koboSubmissionIds, koboFormId] = await Promise.all([
          this.getKoboSubmissionIds({submissionIds: answerIds}).then(_ => _.filter(_ => _ !== null)),
          this.form.getKoboIdByFormId(formId),
        ])
        if (!koboFormId) throw new HttpError.NotFound(`Kobo formId not found for Form ${formId}`)
        if (mappedValidation._validation_status) {
          return Promise.all([
            sdk.v2.submission.updateValidation({
              formId: koboFormId,
              submissionIds: koboSubmissionIds,
              status: mappedValidation._validation_status,
            }),
            sdk.v2.submission.update({
              formId: koboFormId,
              submissionIds: koboSubmissionIds,
              data: {[KoboMapper._IP_VALIDATION_STATUS_EXTRA]: null},
            }),
          ])
        } else {
          return Promise.all([
            sdk.v2.submission.update({
              formId: koboFormId,
              submissionIds: koboSubmissionIds,
              data: {
                [KoboMapper._IP_VALIDATION_STATUS_EXTRA]: mappedValidation._IP_VALIDATION_STATUS_EXTRA,
              },
            }),
            sdk.v2.submission.updateValidation({
              formId: koboFormId,
              submissionIds: koboSubmissionIds,
              status: Kobo.Submission.Validation.no_status,
            }),
          ])
        }
      }),
      this.history.create({
        type: 'validation',
        formId,
        answerIds,
        property: validationKey,
        newValue: status,
        authorEmail,
      }),
    ])
    this.event.emit(IpEvent.SUBMISSION_EDITED_VALIDATION, {formId, submissionIds: answerIds, status})
    return answerIds.map(id => ({id, status: 'success'}))
  }

  private getKoboSubmissionIds = ({submissionIds}: {submissionIds: Api.SubmissionId[]}) => {
    return this.prisma.formSubmission
      .findMany({select: {originId: true}, where: {id: {in: submissionIds}}})
      .then(_ => _.map(_ => _.originId))
  }
}
