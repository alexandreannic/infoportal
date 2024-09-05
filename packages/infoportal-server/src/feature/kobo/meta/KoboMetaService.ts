import {Prisma, PrismaClient} from '@prisma/client'
import {GlobalEvent} from '../../../core/GlobalEvent'
import {KoboMetaBasicneeds} from './KoboMetaMapperBasicneeds'
import {KoboMetaCreate} from './KoboMetaType'
import {app, AppCacheKey, AppLogger} from '../../../index'
import {KoboService} from '../KoboService'
import {duration, map, Obj, seq, Seq} from '@alexandreannic/ts-utils'
import {KoboMetaMapperEcrec} from './KoboMetaMapperEcrec'
import {KoboMetaMapperShelter} from './KoboMetaMapperShelter'
import {DrcDonor, DrcProgram, DrcProject, IKoboMeta, KoboId, KoboIndex, KoboMetaStatus, PersonDetails, UUID} from 'infoportal-common'
import {appConf} from '../../../core/conf/AppConf'
import {genUUID, yup} from '../../../helper/Utils'
import {InferType} from 'yup'
import {KoboMetaMapperProtection} from './KoboMetaMapperProtection'
import {PromisePool} from '@supercharge/promise-pool'
import {KeyOf} from 'infoportal-common/type/Generic'
import Event = GlobalEvent.Event

export type MetaMapped<TTag extends Record<string, any> = any> = Omit<KoboMetaCreate<TTag>, 'koboId' | 'id' | 'uuid' | 'updatedAt' | 'formId' | 'date'> & {date?: Date}
export type MetaMapperMerge<T extends Record<string, any> = any, TTag extends Record<string, any> = any> = (_: T) => {
  originMetaKey: Extract<KeyOf<IKoboMeta>, 'koboId' | 'taxId'>,
  value: number | string,
  changes: Partial<MetaMapped<TTag>>
} | undefined
export type MetaMapperInsert<T extends Record<string, any> = any, TMeta extends Record<string, any> = any> = (_: T) => MetaMapped<TMeta> | MetaMapped<TMeta>[] | undefined

export class KoboMetaMapper {
  static readonly make = <T extends Record<string, any>>(_: Omit<MetaMapped<T>, 'project' | 'donor'> & {
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
    [KoboIndex.byName('bn_rapidResponse2').id]: KoboMetaBasicneeds.bn_rrm2,
    [KoboIndex.byName('ecrec_cashRegistration').id]: KoboMetaMapperEcrec.cashRegistration,
    [KoboIndex.byName('ecrec_cashRegistrationBha').id]: KoboMetaMapperEcrec.cashRegistrationBha,
    [KoboIndex.byName('shelter_nta').id]: KoboMetaMapperShelter.createNta,
    [KoboIndex.byName('bn_cashForRentRegistration').id]: KoboMetaMapperShelter.createCfRent,
    [KoboIndex.byName('shelter_cashForShelter').id]: KoboMetaMapperShelter.createCfShelter,
    [KoboIndex.byName('protection_counselling').id]: KoboMetaMapperProtection.counselling,
    [KoboIndex.byName('protection_pss').id]: KoboMetaMapperProtection.pss,
    [KoboIndex.byName('protection_gbv').id]: KoboMetaMapperProtection.gbv,
    [KoboIndex.byName('protection_hhs3').id]: KoboMetaMapperProtection.hhs,
    [KoboIndex.byName('protection_groupSession').id]: KoboMetaMapperProtection.groupSession,
    [KoboIndex.byName('protection_referral').id]: KoboMetaMapperProtection.referral,
    [KoboIndex.byName('protection_communityMonitoring').id]: KoboMetaMapperProtection.communityMonitoring,
    [KoboIndex.byName('ecrec_vetApplication').id]: KoboMetaMapperEcrec.vetApplication,
    [KoboIndex.byName('ecrec_msmeGrantEoi').id]: KoboMetaMapperEcrec.msmeEoi,
  }
  static readonly mappersUpdate: Record<KoboId, MetaMapperMerge> = {
    [KoboIndex.byName('shelter_ta').id]: KoboMetaMapperShelter.updateTa,
    [KoboIndex.byName('ecrec_vetEvaluation').id]: KoboMetaMapperEcrec.vetEvaluation,
    [KoboIndex.byName('ecrec_msmeGrantSelection').id]: KoboMetaMapperEcrec.msmeSelection,
  }
  static readonly triggerUpdate = {
    [KoboIndex.byName('shelter_nta').id]: [KoboIndex.byName('shelter_ta').id],
    [KoboIndex.byName('ecrec_vetApplication').id]: [KoboIndex.byName('ecrec_vetEvaluation').id],
    [KoboIndex.byName('ecrec_msmeGrantEoi').id]: [KoboIndex.byName('ecrec_msmeGrantSelection').id],
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
    key: AppCacheKey.Meta,
    cacheIf: (params) => {
      this.log.info('Check `cacheIf` condition: ' + ' ' + (params === undefined || Object.keys(params).length === 0) + ' ' + JSON.stringify(params))
      return params === undefined || Object.keys(params).length === 0
    },
    fn: async (params: KoboMetaParams.SearchFilter = {}) => {
      const t0 = performance.now()
      this.log.debug('Fetch Meta from database...')
      const res = await this.prisma.koboMeta.findMany({
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
      this.log.info(`Fetch Meta from database... ${res.length} fetched in ${duration(performance.now() - t0)}`)
      return res
    }
  })

  private info = (formId: KoboId, message: string) => this.log.info(`${KoboIndex.searchById(formId)?.translation ?? formId}: ${message}`)
  private debug = (formId: KoboId, message: string) => this.log.debug(`${KoboIndex.searchById(formId)?.translation ?? formId}: ${message}`)

  private syncMerge = async ({
    formId,
    mapper,
  }: {
    formId: KoboId
    mapper: MetaMapperMerge,
  }) => {
    this.debug(formId, `Fetch Kobo answers...`)
    const updates = await this.prisma.koboAnswers.findMany({
      where: {formId},
    }).then(_ => seq(_).map(mapper).compact())
    const JOIN_COL = updates[0].originMetaKey // Assume it never changes for other updates
    const joinToMetaId: Record<string, Seq<UUID>> = await this.prisma.koboMeta.findMany({
      select: {
        id: true,
        [JOIN_COL]: true,
      },
      where: {
        [JOIN_COL]: {in: updates.map(_ => _.value)}
      }
    }).then(_ => seq(_).groupByAndApply(
      _ => (_ as any)[JOIN_COL] as string,
      _ => (_ as unknown as Seq<{id: string}>).map(_ => _.id))
    )

    const metaIdsWithNewPersons = updates.filter(_ => !!_.changes.persons).flatMap(_ => joinToMetaId[_.value])
    await this.prisma.koboPerson.deleteMany({where: {metaId: {in: metaIdsWithNewPersons.filter(_ => _ !== undefined)}}})

    const createPersonInput = updates.flatMap(updates => {
      return (joinToMetaId[updates.value] ?? []).flatMap(metaId => {
        const res: Prisma.KoboPersonCreateManyInput[] = (updates.changes.persons ?? []).map(_ => ({..._, metaId}))
        return res
      })
    })

    await this.prisma.koboPerson.createMany({
      data: createPersonInput,
    })
    this.debug(formId, `Update ${updates.length}...`)
    // await Promise.all(updates.map(async ([koboId, {persons, ...update}], i) => {
    //   return this.prisma.koboMeta.updateMany({
    //     where: {koboId: {in: [koboId]}},
    //     data: update,
    //   })
    // }))
    await PromisePool
      .withConcurrency(this.conf.db.maxConcurrency)
      .for(updates)
      .process(async ({value, changes: {persons, ...update}}, i) => {
        return this.prisma.koboMeta.updateMany({
          where: {[JOIN_COL]: value},
          data: update,
        })
      })
    this.info(formId, `Update ${updates.length}... COMPLETED`)
  }

  private syncInsert = async ({
    formId,
    mapper,
  }: {
    formId: KoboId
    mapper: MetaMapperInsert,
  }) => {
    this.debug(formId, `Fetch Kobo answers...`)
    const koboAnswers: Seq<KoboMetaCreate> = await this.prisma.koboAnswers.findMany({
      select: {
        formId: true,
        uuid: true,
        answers: true,
        date: true,
        submissionTime: true,
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

    let t0 = performance.now()
    this.debug(formId, `Deleting KoboMeta ${koboAnswers.length}...`)
    await this.prisma.koboMeta.deleteMany({where: {formId}})
    this.info(formId, `Deleting KoboMeta ${koboAnswers.length}... Done in ${duration(performance.now() - t0)}`)
    this.debug(formId, `Handle create (${koboAnswers.length})...`)
    t0 = performance.now()
    await handleCreate()
    this.info(formId, `Handle create (${koboAnswers.length})... Done in ${duration(performance.now() - t0)}`)
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