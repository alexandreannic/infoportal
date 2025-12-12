import {Prisma, PrismaClient} from '@infoportal/prisma'
import {duration, Obj, seq} from '@axanc/ts-utils'
import {FormAccessService} from '../access/FormAccessService.js'
import {app, AppCacheKey} from '../../../index.js'
import {appConf} from '../../../core/AppConf.js'
import {Api, HttpError} from '@infoportal/api-sdk'
import {Util} from '../../../helper/Utils.js'
import {genUUID, IpEvent, logPerformance} from '@infoportal/common'
import {FormService} from '../FormService.js'
import {nanoid} from 'nanoid'
import {FileStorage} from '../../../core/fileStorage/FileStorage.js'

export class SubmissionService {
  constructor(
    private prisma: PrismaClient,
    private form = new FormService(prisma),
    private access = new FormAccessService(prisma),
    private event = app.event,
    private conf = appConf,
    private fileStorage = FileStorage.getInstance(conf),
    private log = app.logger('KoboService'),
  ) {}

  static readonly SUBMISSION_SELECT = {
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
  }

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
            select: SubmissionService.SUBMISSION_SELECT,
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
    props: Omit<Api.Submission.Payload.Submit, 'attachments'> & {
      workspaceId: Api.WorkspaceId
      formId: Api.FormId
      author?: string
      attachments: Express.Multer.File[]
    },
  ): Promise<Api.Submission> => {
    const {formId, workspaceId, attachments} = props
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
    const newSubmission = await this.create({
      workspaceId,
      data: SubmissionService.mapPayload({...props, version: 'v' + formVersion.version, isoCode}),
    })
    await this.saveSubmissionAttachments({workspaceId, formId, submissionId: newSubmission.id, attachments})
    return newSubmission
  }

  private readonly saveSubmissionAttachments = async ({
    workspaceId,
    formId,
    submissionId,
    attachments,
  }: {
    workspaceId: Api.WorkspaceId
    formId: Api.FormId
    submissionId: Api.SubmissionId
    attachments: Express.Multer.File[]
  }) => {
    return Promise.all(
      attachments.map(async attachment => {
        return this.fileStorage.upload({
          filePath: `/${formId}/${submissionId}/${attachment.originalname}`,
          data: attachment.buffer,
        })
      }),
    )
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
      .then(_ => _ as Api.Submission)
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

  static readonly genId = (): Api.SubmissionId => nanoid(10)
}
