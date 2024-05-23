import {KoboForm, Prisma, PrismaClient} from '@prisma/client'
import {ApiPaginate, ApiPaginateHelper, ApiPagination, KoboAnswer, KoboAnswerId, KoboId, KoboIndex, UUID} from '@infoportal-common'
import {DbKoboAnswer, KoboAttachment} from '../connector/kobo/KoboClient/type/KoboAnswer'
import {KoboSdkGenerator} from './KoboSdkGenerator'
import {filterKoboQuestionType, KoboApiQuestion} from '../connector/kobo/KoboClient/type/KoboApiForm'
import {duration, fnSwitch, Obj, seq} from '@alexandreannic/ts-utils'
import {format} from 'date-fns'
import {KoboAnswersFilters} from '../../server/controller/kobo/ControllerKoboAnswer'
import {UserSession} from '../session/UserSession'
import {AccessService} from '../access/AccessService'
import {AppFeatureId} from '../access/AccessType'
import {GlobalEvent} from '../../core/GlobalEvent'
import {defaultPagination} from '../../core/Type'
import {SytemCache} from '../../helper/IpCache'
import {app} from '../../index'
import {appConf} from '../../core/conf/AppConf'
import Event = GlobalEvent.Event

export interface KoboAnswerFilter {
  filters?: KoboAnswersFilters,
  paginate?: ApiPagination
}

interface KoboAnswerSearch<
  TAnswer extends Record<string, any> = Record<string, string | undefined>,
  TTags extends Record<string, any> | undefined = undefined
> extends KoboAnswerFilter {
  formId: UUID,
  fnMap?: (_: Record<string, string | undefined>) => TAnswer
  fnMapTags?: (_?: any) => TTags,
}

export class KoboService {

  constructor(
    private prisma: PrismaClient,
    private access = new AccessService(prisma),
    private sdkGenerator: KoboSdkGenerator = new KoboSdkGenerator(prisma),
    private event: GlobalEvent.Class = GlobalEvent.Class.getInstance(),
    private conf = appConf,
  ) {
  }

  static readonly largeForm = new Set([
    KoboIndex.byName('bn_re').id,
    KoboIndex.byName('ecrec_cashRegistration').id,
    KoboIndex.byName('ecrec_cashRegistrationBha').id,
  ])

  readonly getForms = async (): Promise<KoboForm[]> => {
    return this.prisma.koboForm.findMany()
  }

  readonly searchAnswersByUsersAccess = async ({user, ...params}: {
    formId: string,
    filters: KoboAnswersFilters,
    paginate?: Partial<ApiPagination>
    user?: UserSession
  }) => {
    if (!user) return ApiPaginateHelper.make()([])
    const access = await this.access.searchForUser({featureId: AppFeatureId.kobo_database, user})
      .then(_ => _.filter(_ => _.params?.koboFormId === params.formId))

    if (!user.admin) {
      if (access.length === 0) return ApiPaginateHelper.make()([])
      const accessFilters = seq(access).map(_ => _.params?.filters).compact().reduce<Record<string, string[]>>((acc, x) => {
        Obj.entries(x).forEach(([k, v]) => {
          if (Array.isArray(x[k])) {
            acc[k] = seq([...acc[k] ?? [], ...x[k] ?? []]).distinct(_ => _)
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
          value: answer
        })
      })
    }
    return this.searchAnswers(params)
  }

  readonly searchAnswers =
    app.cache.request({
      key: SytemCache.KoboAnswers,
      cacheIf: (params) => {
        return false
        // return KoboService.largeForm.has(params.formId)
        //   && Object.keys(params.filters ?? {}).length === 0
        //   && Object.keys(params.paginate ?? {}).length === 0
      },
      genIndex: p => p.formId,
      ttlMs: duration(1, 'day'),
      fn:
        (params: {
          includeMeta?: boolean
          formId: string,
          filters?: KoboAnswersFilters,
          paginate?: Partial<ApiPagination>
        }): Promise<ApiPaginate<DbKoboAnswer>> => {
          const {
            formId,
            filters = {},
            paginate = defaultPagination,
            includeMeta,
          } = params
          return this.prisma.koboAnswers.findMany({
            take: paginate.limit,
            skip: paginate.offset,
            orderBy: [
              {date: 'desc',},
              {submissionTime: 'desc',},
            ],
            ...includeMeta ? {
              include: {
                meta: includeMeta,
              }
            } : {},
            where: {
              deletedAt: null,
              date: {
                gte: filters.start,
                lt: filters.end,
              },
              formId,
              AND: filters.filterBy?.map((filter) => ({
                OR: filter.value.map(v => ({
                  answers: {
                    path: [filter.column],
                    ...v ? {
                      ['string_contains']: v
                    } : {
                      equals: Prisma.DbNull,
                    }
                  }
                }))
              })),
            }
          }).then(_ => _.map(d => ({
            start: d.start,
            end: d.end,
            date: d.date,
            version: d.version ?? undefined,
            attachments: d.attachments as KoboAttachment[],
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
          })))
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
        }
    })

  private static readonly mapKoboAnswer = (formId: KoboId, _: KoboAnswer): Prisma.KoboAnswersUncheckedCreateInput => {
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

  readonly create = (formId: KoboId, answer: KoboAnswer) => {
    return this.prisma.koboAnswers.create({data: KoboService.mapKoboAnswer(formId, answer)})
  }

  readonly createMany = (formId: KoboId, answers: KoboAnswer[]) => {
    const inserts = answers.map(_ => KoboService.mapKoboAnswer(formId, _))
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

  readonly getFormDetails = async (formId: KoboId) => {
    const dbForm = await this.prisma.koboForm.findFirstOrThrow({where: {id: formId}})
    const sdk = await this.sdkGenerator.get(dbForm.serverId)
    return sdk.getForm(dbForm.id)
  }

  readonly translateForm = async ({
    formId,
    langIndex,
    data,
  }: {
    formId: KoboId,
    langIndex: number,
    data: DbKoboAnswer[],
  }) => {
    const flatAnswers = data.map(({answers, ...meta}) => ({...meta, ...answers}))
    const koboFormDetails = await this.getFormDetails(formId)
    const indexLabel = seq(koboFormDetails.content.survey).filter(filterKoboQuestionType).reduceObject<Record<string, KoboApiQuestion>>(_ => [_.name, _])
    const indexOptionsLabels = seq(koboFormDetails.content.choices).reduceObject<Record<string, undefined | string>>(_ => [_.name, _.label?.[langIndex]])
    return flatAnswers.map(d => {
      const translated = {} as DbKoboAnswer
      Obj.keys(d).forEach(k => {
        const translatedKey = indexLabel[k]?.label?.[langIndex] ?? k
        const translatedValue = (() => {
          if (k === 'submissionTime') {
            return format(d[k], 'yyyy-MM-dd')
          }
          return fnSwitch(indexLabel[k]?.type, {
            'select_multiple': () => d[k]?.split(' ').map((_: any) => indexOptionsLabels[_]).join('|'),
            'start': () => format(d[k], 'yyyy-MM-dd'),
            'end': () => format(d[k], 'yyyy-MM-dd'),
          }, _ => indexOptionsLabels[d[k]] ?? d[k])
        })();
        (translated as any)[translatedKey.replace(/(<([^>]+)>)/gi, '')] = translatedValue
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
  //   formId: KoboId,
  //   data: DbKoboAnswer[],
  //   langIndex?: number
  //   password?: string
  // }) => {
  //   const koboFormDetails = await this.getFormDetails(formId)
  //   const translated = langIndex !== undefined ? await this.translateForm({formId, langIndex, data}) : data
  //   const flatTranslated = translated.map(({answers, ...meta}) => ({...meta, ...answers}))
  //   const columns = (() => {
  //     const metaColumns: (keyof KoboAnswerMetaData)[] = ['id', 'submissionTime', 'version']
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

  readonly updateAnswers = async ({
    formId,
    answerIds,
    question,
    answer,
    authorEmail,
  }: {
    authorEmail: string,
    formId: KoboId,
    answerIds: KoboAnswerId[],
    question: string,
    answer?: string
  }) => {
    answer = Array.isArray(answer) ? answer.join(' ') : answer
    const [sdk, xpath] = await Promise.all([
      this.sdkGenerator.get(),
      this.getFormDetails(formId).then(_ => _.content.survey.find(_ => _.name === question)?.$xpath),
    ])
    if (!xpath) throw new Error(`Cannot find xpath for ${formId} ${question}.`)
    const [x] = await Promise.all([
      // this.conf.db.url.includes('localhost') ? () => void 0 :
      sdk.updateData({formId, submissionIds: answerIds, data: {[xpath]: answer}}),
      await this.prisma.$executeRawUnsafe(
        `UPDATE "KoboAnswers"
         SET answers     = jsonb_set(answers, '{${question}}', '"${answer}"'),
             "updatedAt" = NOW()
         WHERE id IN (${answerIds.map(_ => `'${_}'`).join(',')})
        `),
      this.prisma.koboAnswersHistory.createMany({
        data: answerIds.map(_ => {
          return {
            by: authorEmail,
            type: 'answer',
            formId,
            property: question,
            newValue: answer as any,
            answerId: _
          }
        })
      })
    ])
    this.event.emit(Event.KOBO_ANSWER_EDITED, {formId, answerIds, answer: {[question]: answer}})
  }

  readonly updateTags = async ({formId, answerIds, tags, authorEmail}: {formId: KoboId, answerIds: KoboAnswerId[], tags: Record<string, any>, authorEmail: string}) => {
    await Promise.all([
      this.prisma.koboAnswersHistory.createMany({
        data: answerIds.flatMap(_ => {
          return Obj.keys(tags).map(tag => {
            return {
              by: authorEmail,
              type: 'tag',
              formId,
              property: tag,
              newValue: tags[tag] as any,
              answerId: _,
            }
          })
        })
      }),
      await this.prisma.$executeRawUnsafe(
        `UPDATE "KoboAnswers"
         SET ${Obj.keys(tags).map(key => `tags = jsonb_set(COALESCE(tags, '{}'::jsonb), '{${key}}', '${JSON.stringify(tags[key])}')`).join(',')},
             "updatedAt" = NOW()
         WHERE id IN (${answerIds.map(_ => `'${_}'`).join(',')})
        `)
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

