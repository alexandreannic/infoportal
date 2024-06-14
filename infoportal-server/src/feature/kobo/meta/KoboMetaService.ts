import {Prisma, PrismaClient} from '@prisma/client'
import {GlobalEvent} from '../../../core/GlobalEvent'
import {KoboMetaBasicneeds} from './KoboMetaMapperBasicneeds'
import {KoboMetaCreate} from './KoboMetaType'
import {app, AppLogger} from '../../../index'
import {KoboService} from '../KoboService'
import {map, Obj, seq, Seq} from '@alexandreannic/ts-utils'
import {KoboMetaMapperEcrec} from './KoboMetaMapperEcrec'
import {KoboMetaMapperShelter} from './KoboMetaMapperShelter'
import {DrcDonor, DrcProgram, DrcProject, IKoboMeta, KoboAnswerId, KoboId, KoboIndex, KoboMetaStatus, PersonDetails, UUID} from '@infoportal-common'
import {appConf} from '../../../core/conf/AppConf'
import {genUUID, yup} from '../../../helper/Utils'
import {InferType} from 'yup'
import {KoboMetaMapperProtection} from './KoboMetaMapperProtection'
import {SytemCache} from '../../../helper/IpCache'
import {PromisePool} from '@supercharge/promise-pool'
import Event = GlobalEvent.Event

export type MetaMapped<TTag extends Record<string, any> = any> = Omit<KoboMetaCreate<TTag>, 'koboId' | 'id' | 'uuid' | 'date' | 'updatedAt' | 'formId'>
export type MetaMapperMerge<T extends Record<string, any> = any, TTag extends Record<string, any> = any> = (_: T) => [KoboId, Partial<MetaMapped<TTag>>] | undefined
export type MetaMapperInsert<T extends Record<string, any> = any> = (_: T) => MetaMapped | MetaMapped[] | undefined

export class KoboMetaMapper {
  static readonly make = (_: Omit<MetaMapped, 'project' | 'donor'> & {
    project?: DrcProject[]
    donor?: DrcDonor[]
    persons?: PersonDetails[]
  }): MetaMapped => {
    if (!_.project) _.project = []
    if (!_.donor) _.donor = []
    return _ as any
  }

  static readonly mappersCreate: Record<KoboId, MetaMapperInsert> = {
    [KoboIndex.byName('bn_re').id]: KoboMetaBasicneeds.bn_re,
    [KoboIndex.byName('bn_rapidResponse').id]: KoboMetaBasicneeds.bn_rrm,
    [KoboIndex.byName('ecrec_cashRegistration').id]: KoboMetaMapperEcrec.cashRegistration,
    [KoboIndex.byName('ecrec_cashRegistrationBha').id]: KoboMetaMapperEcrec.cashRegistrationBha,
    [KoboIndex.byName('shelter_nta').id]: KoboMetaMapperShelter.createNta,
    [KoboIndex.byName('bn_cashForRentRegistration').id]: KoboMetaMapperShelter.createCfRent,
    [KoboIndex.byName('shelter_cashForShelter').id]: KoboMetaMapperShelter.createCfShelter,
    [KoboIndex.byName('protection_pss').id]: KoboMetaMapperProtection.pss,
    [KoboIndex.byName('protection_gbv').id]: KoboMetaMapperProtection.gbv,
    [KoboIndex.byName('protection_hhs3').id]: KoboMetaMapperProtection.hhs,
    [KoboIndex.byName('protection_groupSession').id]: KoboMetaMapperProtection.groupSession,
    [KoboIndex.byName('protection_referral').id]: KoboMetaMapperProtection.referral,
    [KoboIndex.byName('protection_communityMonitoring').id]: KoboMetaMapperProtection.communityMonitoring,
    [KoboIndex.byName('ecrec_vetApplication').id]: KoboMetaMapperEcrec.vetApplication,
  }
  static readonly mappersUpdate: Record<KoboId, MetaMapperMerge> = {
    [KoboIndex.byName('shelter_ta').id]: KoboMetaMapperShelter.updateTa,
    [KoboIndex.byName('ecrec_vetEvaluation').id]: KoboMetaMapperEcrec.vetEvaluation,
  }
  static readonly triggerUpdate = {
    [KoboIndex.byName('shelter_nta').id]: [KoboIndex.byName('shelter_ta').id],
    [KoboIndex.byName('ecrec_vetApplication').id]: [KoboIndex.byName('ecrec_vetEvaluation').id],
  }
}

export namespace KoboMetaParams {
  export const schemaSearchFilter = yup.object({
    status: yup.array().of(yup.mixed<KoboMetaStatus>().defined()).optional(),
    activities: yup.array().of(yup.mixed<DrcProgram>().defined()).optional(),
  }).optional()
  export type SearchFilter = InferType<typeof schemaSearchFilter>
}

export class KoboMetaService {

  constructor(
    private prisma: PrismaClient,
    private kobo = new KoboService(prisma),
    private event = GlobalEvent.Class.getInstance(),
    private conf = appConf,
    private log: AppLogger = app.logger('KoboMetaService'),
  ) {
  }

  readonly start = () => {
    this.info('', `Start listening to ${Event.KOBO_FORM_SYNCHRONIZED}`)
    this.event.listen(Event.KOBO_FORM_SYNCHRONIZED, async _ => {
      const createMapper = KoboMetaMapper.mappersCreate[_.formId]
      const updateMapper = KoboMetaMapper.mappersUpdate[_.formId]
      if (createMapper) {
        await this.syncInsert({formId: _.formId, mapper: createMapper})
        ;(KoboMetaMapper.triggerUpdate[_.formId] ?? []).forEach(triggeredFormId => {
          this.syncMerge({formId: triggeredFormId, mapper: KoboMetaMapper.mappersUpdate[triggeredFormId]})
        })
      } else if (updateMapper) {
        this.syncMerge({formId: _.formId, mapper: updateMapper})
      } else {
        this.log.error(`No mapper implemented for ${JSON.stringify(_.formId)}`)
      }
      // setTimeout(() => {
      //   // Wait for the database to be rebuilt before clearing the cache
      //   app.cache.clear(SytemCache.Meta)
      // }, duration(10, 'minute'))
    })
    this.event.listen(Event.WFP_DEDUPLICATION_SYNCHRONIZED, () => {
      this.syncWfpDeduplication()
    })
  }

  private syncWfpDeduplication = async () => {
    // const data = await this.prisma.mpcaWfpDeduplication.findMany()
    // data.
  }

  readonly search = app.cache.request({
    key: SytemCache.Meta,
    cacheIf: (params) => {
      this.log.info('CHECK META CACHE IF3 ' + JSON.stringify(params) + ' ' + (params === undefined || Object.keys(params).length === 0))
      return params === undefined || Object.keys(params).length === 0
    },
    fn: async (params: KoboMetaParams.SearchFilter = {}) => {
      this.log.info('CALL META SEARCH!!!')
      return await this.prisma.koboMeta.findMany({
        include: {
          persons: true,
        },
        where: {
          ...map(params?.status, _ => ({status: {in: _}})),
          ...map(params?.activities, _ => ({activity: {in: _}}))
        },
        orderBy: {
          date: 'desc',
        }
      }) as IKoboMeta[]
    }
  })

  private info = (formId: KoboId, message: string) => this.log.info(`${KoboIndex.searchById(formId)?.translation ?? formId}: ${message}`)

  private syncMerge = async ({
    formId,
    mapper,
  }: {
    formId: KoboId
    mapper: MetaMapperMerge,
  }) => {
    this.info(formId, `Fetch Kobo answers...`)
    const updates = await this.prisma.koboAnswers.findMany({
      where: {formId},
    }).then(_ => seq(_).map(mapper).compact())
    const koboIdToMetaId: Record<KoboAnswerId, Seq<UUID>> = await this.prisma.koboMeta.findMany({
      select: {
        id: true,
        koboId: true,
      },
      where: {
        koboId: {in: updates.map(_ => _[0])}
      }
    }).then(_ => seq(_).groupByAndApply(_ => _.koboId, _ => _.map(_ => _.id)))

    const metaIdsWithNewPersons = updates.filter(_ => !!_[1].persons).flatMap(_ => koboIdToMetaId[_[0]])
    await this.prisma.koboPerson.deleteMany({where: {metaId: {in: metaIdsWithNewPersons}}})

    const createPersonInput = updates.flatMap(([koboId, mapped]) => {
      return (koboIdToMetaId[koboId] ?? []).flatMap(metaId => {
        const res: Prisma.KoboPersonCreateManyInput[] = (mapped.persons ?? []).map(_ => ({..._, metaId}))
        return res
      })
    })

    await this.prisma.koboPerson.createMany({
      data: createPersonInput,
    })
    this.info(formId, `Update ${updates.length}...`)
    // await Promise.all(updates.map(async ([koboId, {persons, ...update}], i) => {
    //   return this.prisma.koboMeta.updateMany({
    //     where: {koboId: {in: [koboId]}},
    //     data: update,
    //   })
    // }))
    await PromisePool
      .withConcurrency(this.conf.db.maxConcurrency)
      .for(updates)
      .process(async ([koboId, {persons, ...update}], i) => {
        return this.prisma.koboMeta.updateMany({
          where: {koboId},
          data: update,
        })
      })
    this.info(formId, `Update ${updates.length}... COMPLETED`)
  }

  static readonly makeMetaId = (koboId: KoboId, activity: DrcProgram) => koboId + activity

  private syncInsert = async ({
    formId,
    mapper,
  }: {
    formId: KoboId
    mapper: MetaMapperInsert,
  }) => {
    this.info(formId, `Fetch Kobo answers...`)
    const koboAnswers: Seq<KoboMetaCreate> = await this.prisma.koboAnswers.findMany({
      select: {
        formId: true,
        uuid: true,
        answers: true,
        date: true,
        id: true,
        tags: true,
        attachments: true,
        updatedAt: true,
      },
      where: {formId}
    }).then(res => {
      return seq(res).flatMap(r => {
        const m = [mapper(r)].flat()
        return seq(m).compact().map(_ => {
          return {
            // id: KoboMetaService.makeMetaId(r.id, _.activity!),
            koboId: r.id,
            uuid: r.uuid,
            formId: r.formId,
            updatedAt: r.updatedAt ?? undefined,
            date: r.date ?? undefined,
            ..._,
          }
        })
      })
    })

    this.info(formId, `Fetch Kobo answers... ${koboAnswers.length} fetched.`)

    const handleCreate = async () => {
      const koboAnswersWithId = (koboAnswers as Seq<Omit<IKoboMeta, 'persons'> & {persons: Prisma.KoboPersonUncheckedCreateInput[]}>).map(p => {
        const genId = genUUID()
        p.id = genId
        p.persons?.map(_ => {
          _.metaId = genId
          return _
        })
        return p
      })
      await this.prisma.koboMeta.createMany({
        data: koboAnswersWithId.map(({persons, ...kobo}) => kobo),
      })
      await this.prisma.koboPerson.createMany({
        data: koboAnswersWithId.flatMap(_ => _.persons),
      })
      return koboAnswersWithId
    }

    this.info(formId, `Deleting KoboMeta ${koboAnswers.length}...`)
    await this.prisma.koboMeta.deleteMany({where: {formId}})
    this.info(formId, `Handle create (${koboAnswers.length})...`)
    await handleCreate()
    this.info(formId, `Handle create (${koboAnswers.length})... CREATED!`)
    return {}
  }

  readonly sync = () => {
    const keys = [
      ...Obj.keys(KoboMetaMapper.mappersCreate),
      ...Obj.keys(KoboMetaMapper.mappersUpdate)
    ]
    keys.forEach((formId, i) => {
      this.event.emit(GlobalEvent.Event.KOBO_FORM_SYNCHRONIZED, {formId, index: i, total: keys.length - 1})
    })
  }
}