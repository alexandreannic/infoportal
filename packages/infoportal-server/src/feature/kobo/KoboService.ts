import {KoboForm, Prisma, PrismaClient} from '@prisma/client'
import {
  ApiPaginate,
  ApiPaginateHelper,
  ApiPagination,
  KoboCustomDirective,
  KoboHelper,
  KoboIndex,
  KoboSubmission,
  KoboSubmissionMetaData,
  KoboValidation,
  logPerformance,
  UUID,
} from 'infoportal-common'
import {KoboSdkGenerator} from './KoboSdkGenerator'
import {duration, fnSwitch, Obj, seq} from '@alexandreannic/ts-utils'
import {format} from 'date-fns'
import {KoboAnswersFilters} from '../../server/controller/kobo/ControllerKoboAnswer'
import {UserSession} from '../session/UserSession'
import {AccessService} from '../access/AccessService'
import {AppFeatureId} from '../access/AccessType'
import {GlobalEvent} from '../../core/GlobalEvent'
import {defaultPagination} from '../../core/Type'
import {app, AppCacheKey} from '../../index'
import {appConf} from '../../core/conf/AppConf'
import {KoboAnswerHistoryService} from './history/KoboAnswerHistoryService'
import {AppError} from '../../helper/Errors'
import {Util} from '../../helper/Utils'
import {Kobo} from 'kobo-sdk'
import Event = GlobalEvent.Event

export type DbKoboAnswer<T extends Record<string, any> = Record<string, any>> = KoboSubmission<T, any> & {
  formId: Kobo.FormId
}

export interface KoboAnswerFilter {
  filters?: KoboAnswersFilters
  paginate?: ApiPagination
}

interface KoboAnswerSearch<
  TAnswer extends Record<string, any> = Record<string, string | undefined>,
  TTags extends Record<string, any> | undefined = undefined,
> extends KoboAnswerFilter {
  formId: UUID
  fnMap?: (_: Record<string, string | undefined>) => TAnswer
  fnMapTags?: (_?: any) => TTags
}

export class KoboService {
  constructor(
    private prisma: PrismaClient,
    private access = new AccessService(prisma),
    private sdkGenerator: KoboSdkGenerator = KoboSdkGenerator.getSingleton(prisma),
    private history = new KoboAnswerHistoryService(prisma),
    private event: GlobalEvent.Class = GlobalEvent.Class.getInstance(),
    private log = app.logger('KoboService'),
    private conf = appConf,
  ) {}

  static readonly largeForm = new Set([
    KoboIndex.byName('bn_re').id,
    KoboIndex.byName('ecrec_cashRegistration').id,
    KoboIndex.byName('ecrec_cashRegistrationBha').id,
  ])

  readonly getForms = async (): Promise<KoboForm[]> => {
    return this.prisma.koboForm.findMany()
  }

  private readonly _searchAnswersByUsersAccess = async ({
    user,
    ...params
  }: {
    formId: string
    filters: KoboAnswersFilters
    paginate?: Partial<ApiPagination>
    user?: UserSession
  }): Promise<ApiPaginate<DbKoboAnswer>> => {
    if (!user) return ApiPaginateHelper.make()([])
    if (!user.admin) {
      const access = await this.access
        .searchForUser({featureId: AppFeatureId.kobo_database, user})
        .then((_) => seq(_).filter((_) => _.params?.koboFormId === params.formId))
      if (access.length === 0) return ApiPaginateHelper.make()([])
      const hasEmptyFilter = access.some((_) => !_.params?.filters || Object.keys(_.params.filters).length === 0)
      if (!hasEmptyFilter) {
        const accessFilters = access
          .map((_) => _.params?.filters)
          .compact()
          .reduce<Record<string, string[]>>((acc, x) => {
            Obj.entries(x).forEach(([k, v]) => {
              if (Array.isArray(x[k])) {
                acc[k] = seq([...(acc[k] ?? []), ...(x[k] ?? [])]).distinct((_) => _)
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
    message: (p) => `Fetch ${KoboIndex.searchById(p.formId)?.name ?? p.formId} by ${p.user?.email}`,
    showResult: (res) => `(${res ? res.data.length : '...'} rows)`,
    logger: (m: string) => this.log.info(m),
    fn: this._searchAnswersByUsersAccess,
  })

  readonly searchAnswers = app.cache.request({
    key: AppCacheKey.KoboAnswers,
    cacheIf: (params) => {
      return false
      // return KoboService.largeForm.has(params.formId)
      //   && Object.keys(params.filters ?? {}).length === 0
      //   && Object.keys(params.paginate ?? {}).length === 0
    },
    genIndex: (p) => p.formId,
    ttlMs: duration(1, 'day').toMs,
    fn: (params: {
      // includeMeta?: boolean
      formId: string
      filters?: KoboAnswersFilters
      paginate?: Partial<ApiPagination>
    }): Promise<ApiPaginate<DbKoboAnswer>> => {
      const {
        formId,
        filters = {},
        paginate = defaultPagination,
        // includeMeta,
      } = params
      return (
        this.prisma.koboAnswers
          .findMany({
            take: paginate.limit,
            skip: paginate.offset,
            orderBy: [{date: 'desc'}, {submissionTime: 'desc'}],
            // ...includeMeta ? {
            //   include: {
            //     meta: includeMeta,
            //   }
            // } : {},
            where: {
              deletedAt: null,
              date: {
                gte: filters.start,
                lt: filters.end,
              },
              formId,
              AND: {
                OR: filters.filterBy?.flatMap((filter) =>
                  Util.ensureArr(filter.value).map((v) => ({
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
          .then((_) =>
            _.map((d) => ({
              start: d.start,
              end: d.end,
              date: d.date,
              version: d.version ?? undefined,
              attachments: d.attachments as Kobo.Submission.Attachment[],
              geolocation: d.geolocation as any,
              submissionTime: d.submissionTime,
              id: d.id,
              uuid: d.uuid,
              validationStatus: d.validationStatus as any,
              validatedBy: d.validatedBy ?? undefined,
              lastValidatedTimestamp: d.lastValidatedTimestamp ?? undefined,
              answers: d.answers as any,
              formId: d.formId,
              tags: d.tags,
            })),
          )
          // .then(_ => {
          //   if (_?.[0].answers.date)
          //     return _.sort((a, b) => {
          //       return (b.answers.date as string ?? b.submissionTime.toISOString()).localeCompare(
          //         a.answers.date as string ?? a.submissionTime.toISOString()
          //       )
          //     })
          //   return _
          // })
          .then(ApiPaginateHelper.make())
      )
    },
  })

  private static readonly mapKoboAnswer = (
    formId: Kobo.FormId,
    _: KoboSubmission,
  ): Prisma.KoboAnswersUncheckedCreateInput => {
    return {
      formId,
      answers: _.answers,
      id: _.id,
      uuid: _.uuid,
      date: _.date,
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

  readonly create = (formId: Kobo.FormId, answer: KoboSubmission) => {
    return this.prisma.koboAnswers.create({data: KoboService.mapKoboAnswer(formId, answer)})
  }

  readonly createMany = (formId: Kobo.FormId, answers: KoboSubmission[]) => {
    const inserts = answers.map((_) => KoboService.mapKoboAnswer(formId, _))
    return this.prisma.koboAnswers.createMany({
      data: inserts,
      skipDuplicates: true,
    })
  }

  // readonly generateXLSForHHS = async ({start, end}: {start?: Date, end?: Date}) => {
  //   const filePattern = (oblast: string) => `drc.ua.prot.hh2.${start ? format(start, 'yyyy-MM') + '.' : ''}${oblast}`
  //   const oblasts = [
  //     'chernihiv',
  //     'lviv',
  //     'kharkiv',
  //     'mykolaiv',
  //     'dnipro',
  //   ]
  //   const requests = oblasts.map(oblast => this.searchAnswers({
  //     formId: KoboIndex.byName('protection_hhs2_1').id,
  //     filters: {
  //       start: start,
  //       end: end,
  //       filterBy: [{
  //         column: 'staff_to_insert_their_DRC_office',
  //         value: [oblast],
  //       }]
  //     }
  //   }))
  //   const requestAll = this.searchAnswers({
  //     formId: KoboIndex.byName('protection_hhs2_1').id,
  //     filters: {start: start, end: end}
  //   })
  //   await Promise.all([requestAll, ...requests]).then(_ => _.map(_ => _.data)).then(([
  //     all,
  //     chernihiv,
  //     lviv,
  //     kharkiv,
  //     mykolaiv,
  //     dnipro,
  //   ]) => {
  //     return [
  //       this.generateXLSFromAnswers({
  //         fileName: filePattern('all'),
  //         formId: KoboIndex.byName('protection_hhs2_1').id,
  //         langIndex: 0,
  //         data: all,
  //       }),
  //       this.generateXLSFromAnswers({
  //         fileName: filePattern('chernihivska'),
  //         formId: KoboIndex.byName('protection_hhs2_1').id,
  //         langIndex: 0,
  //         data: chernihiv,
  //         password: 'HHDataCEJ$!', //113
  //       }),
  //       this.generateXLSFromAnswers({
  //         fileName: filePattern('lvivska'),
  //         formId: KoboIndex.byName('protection_hhs2_1').id,
  //         langIndex: 0,
  //         data: lviv,
  //         password: 'YW!(78', // 143
  //       }),
  //       this.generateXLSFromAnswers({
  //         fileName: filePattern('kharkivska'),
  //         formId: KoboIndex.byName('protection_hhs2_1').id,
  //         langIndex: 0,
  //         data: kharkiv,
  //         password: 'ZK38^&', // 59
  //       }),
  //       this.generateXLSFromAnswers({
  //         fileName: filePattern('mykolaivska'),
  //         formId: KoboIndex.byName('protection_hhs2_1').id,
  //         langIndex: 0,
  //         data: mykolaiv,
  //         password: 'b53d', // 104
  //       }),
  //       this.generateXLSFromAnswers({
  //         fileName: filePattern('dnipropetrovska'),
  //         formId: KoboIndex.byName('protection_hhs2_1').id,
  //         langIndex: 0,
  //         data: dnipro,
  //         password: 'PL09!@', // 47
  //       }),
  //     ]
  //   })
  // }

  readonly getSchema = app.cache.request({
    key: AppCacheKey.KoboSchema,
    genIndex: (_) => _.formId,
    ttlMs: duration(2, 'day').toMs,
    fn: async ({formId}: {formId: Kobo.FormId}): Promise<Kobo.Form> => {
      const sdk = await this.sdkGenerator.getBy.formId(formId)
      return sdk.v2.form.get({formId, use$autonameAsName: true})
    },
  })

  readonly translateForm = async ({
    formId,
    langIndex,
    data,
  }: {
    formId: Kobo.FormId
    langIndex: number
    data: DbKoboAnswer[]
  }) => {
    const koboQuestionType: Kobo.Form.QuestionType[] = [
      'text',
      'start',
      'end',
      'integer',
      'select_one',
      'select_multiple',
      'date',
    ]
    const flatAnswers = data.map(({answers, ...meta}) => ({...meta, ...answers}))
    const koboFormDetails = await this.getSchema({formId})
    const indexLabel = seq(koboFormDetails.content.survey)
      .compactBy('name')
      .filter((_) => koboQuestionType.includes(_.type))
      .reduceObject<Record<string, Kobo.Form.Question>>((_) => [_.name, _])
    const indexOptionsLabels = seq(koboFormDetails.content.choices).reduceObject<Record<string, undefined | string>>(
      (_) => [_.name, _.label?.[langIndex]],
    )
    return flatAnswers.map((d) => {
      const translated = {} as DbKoboAnswer
      Obj.keys(d).forEach((k) => {
        const translatedKey = indexLabel[k]?.label?.[langIndex] ?? k
        const translatedValue = (() => {
          if (k === 'submissionTime') {
            return format(d[k], 'yyyy-MM-dd')
          }
          return fnSwitch(
            indexLabel[k]?.type,
            {
              select_multiple: () =>
                d[k]
                  ?.split(' ')
                  .map((_: any) => indexOptionsLabels[_])
                  .join('|'),
              start: () => format(d[k], 'yyyy-MM-dd'),
              end: () => format(d[k], 'yyyy-MM-dd'),
            },
            (_) => indexOptionsLabels[d[k]] ?? d[k],
          )
        })()
        ;(translated as any)[translatedKey.replace(/(<([^>]+)>)/gi, '')] = translatedValue
      })
      return translated
    })
  }

  // readonly generateXLSFromAnswers = async ({
  //   fileName,
  //   formId,
  //   data,
  //   langIndex,
  //   password,
  // }: {
  //   fileName: string
  //   formId: Kobo.FormId,
  //   data: DbKoboAnswer[],
  //   langIndex?: number
  //   password?: string
  // }) => {
  //   const koboFormDetails = await this.getFormDetails(formId)
  //   const translated = langIndex !== undefined ? await this.translateForm({formId, langIndex, data}) : data
  //   const flatTranslated = translated.map(({answers, ...meta}) => ({...meta, ...answers}))
  //   const columns = (() => {
  //     const metaColumns: (keyof Kobo.Submission.MetaData)[] = ['id', 'submissionTime', 'version']
  //     const schemaColumns = koboFormDetails.content.survey.filter(filterKoboQuestionType)
  //       .map(_ => langIndex !== undefined && _.label
  //         ? removeHtml(_.label[langIndex]) ?? _.name
  //         : _.name)
  //     return [...metaColumns, ...schemaColumns]
  //   })()
  //   const workbook = await XlsxPopulate.fromBlankAsync()
  //   const sheet = workbook.sheet('Sheet1')
  //   sheet.cell('A1').value([columns] as any)
  //   sheet.cell('A2').value(flatTranslated.map(a =>
  //     columns.map(_ => a[_])
  //   ) as any)
  //
  //   const findColumnByName = (name: string) => convertNumberIndexToLetter(Object.keys(columns).indexOf(name))
  //
  //   sheet.freezePanes(2, 1)
  //   // const ['start', 'end', 'su']
  //   sheet.column('A').width(11)
  //   sheet.column('B').width(11)
  //   sheet.row(1).style({
  //     'bold': true,
  //     'fill': 'f2f2f2',
  //     'fontColor': '6e7781',
  //   })
  //
  //   workbook.toFileAsync(appConf.rootProjectDir + `/${fileName}.xlsx`, {password})
  // }

  private static readonly safeJsonValue = (_: string): string => _.replace(/'/g, "''")

  private static readonly safeIds = (ids: string[]): string[] => {
    return ids.map((_) => {
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
    formId: Kobo.FormId
    authorEmail?: string
  }) => {
    await Promise.all([
      this.prisma.koboAnswers.updateMany({
        data: {
          deletedAt: new Date(),
          deletedBy: authorEmail,
        },
        where: {
          formId,
          id: {in: answerIds},
        },
      }),
      this.sdkGenerator.getBy.formId(formId).then((_) => _.v2.submission.delete({formId, ids: answerIds})),
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
    formId: Kobo.FormId
    answerIds: Kobo.SubmissionId[]
    question: string
    answer?: string
  }) => {
    answer = Array.isArray(answer) ? answer.join(' ') : answer
    const [sdk, xpath] = await Promise.all([
      this.sdkGenerator.getBy.formId(formId),
      this.getSchema({formId}).then((_) => _.content.survey.find((_) => _.name === question)?.$xpath),
    ])
    if (!xpath) throw new Error(`Cannot find xpath for ${formId} ${question}.`)
    await Promise.all([
      this.history.create({
        type: 'answer',
        formId,
        answerIds,
        property: question,
        newValue: answer,
        authorEmail,
      }),
      sdk.v2.submission.update({formId, submissionIds: answerIds, data: {[xpath]: answer}}),
      await this.prisma.$executeRawUnsafe(
        `UPDATE "KoboAnswers"
         SET answers     = jsonb_set(answers, '{${question}}', '"${KoboService.safeJsonValue(answer ?? '')}"'),
             "updatedAt" = NOW()
         WHERE id IN (${KoboService.safeIds(answerIds).join(',')})
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
    formId: Kobo.FormId
    answerIds: Kobo.SubmissionId[]
    status: KoboValidation
    authorEmail: string
  }) => {
    const mappedValidation = KoboHelper.mapValidation.toKobo(status)
    const validationKey: keyof KoboSubmissionMetaData = 'validationStatus'
    const sdk = await this.sdkGenerator.getBy.formId(formId)
    const [sqlRes] = await Promise.all([
      this.prisma.koboAnswers.updateMany({
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

  readonly updateTags = async ({
    formId,
    answerIds,
    tags,
    authorEmail,
  }: {
    formId: Kobo.FormId
    answerIds: Kobo.SubmissionId[]
    tags: Record<string, any>
    authorEmail: string
  }) => {
    const safeTags = Obj.keys(tags)
      .map((key) => {
        if (/[{}'"]/.test(key)) throw new AppError.WrongFormat(`Invalid key ${key}`)
        return `tags = jsonb_set(COALESCE(tags, '{}'::jsonb), '{${key}}', '${KoboService.safeJsonValue(JSON.stringify(tags[key]))}')`
      })
      .join(',')
    await Promise.all([
      Obj.keys(tags).map((tag) => {
        this.history.create({
          type: 'tag',
          formId,
          answerIds,
          property: tag,
          newValue: tags[tag],
          authorEmail,
        })
      }),
      await this.prisma.$executeRawUnsafe(
        `UPDATE "KoboAnswers"
         SET ${safeTags},
             "updatedAt" = NOW()
         WHERE id IN (${KoboService.safeIds(answerIds).join(',')})
        `,
      ),
    ])
    // const answers = await this.prisma.koboAnswers.findMany({
    //   select: {
    //     id: true,
    //     tags: true,
    //   },
    //   where: {
    //     formId,
    //     id: {
    //       in: answerIds
    //     }
    //   }
    // })
    // await PromisePool.withConcurrency(this.conf.db.maxConcurrency).for(answers).process((answer => {
    //   const newTag = {...answer.tags as any, ...tags}
    //   return this.prisma.koboAnswers.update({
    //     where: {
    //       id: answer.id,
    //     },
    //     data: {
    //       updatedAt: new Date(),
    //       tags: newTag,
    //     }
    //   })
    // }))
    this.event.emit(Event.KOBO_TAG_EDITED, {formId, answerIds, tags})
  }
}
