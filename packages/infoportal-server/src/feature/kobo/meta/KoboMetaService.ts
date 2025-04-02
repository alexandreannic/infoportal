import {Prisma, PrismaClient} from '@prisma/client'
import {GlobalEvent} from '../../../core/GlobalEvent.js'
import {KoboMetaBasicneeds} from './KoboMetaMapperBasicneeds.js'
import {app, AppCacheKey, AppLogger} from '../../../index.js'
import {KoboService} from '../KoboService.js'
import {duration, map, Obj, seq, Seq, sleep} from '@axanc/ts-utils'
import {KoboMetaMapperEcrec} from './KoboMetaMapperEcrec.js'
import {KoboMetaMapperShelter} from './KoboMetaMapperShelter.js'
import {
  DrcDonor,
  DrcProgram,
  DrcProject,
  DrcSector,
  IKoboMeta,
  KeyOf,
  KoboIndex,
  KoboMetaStatus,
  Person,
  UUID,
} from 'infoportal-common'
import {appConf} from '../../../core/conf/AppConf.js'
import {genUUID, yup} from '../../../helper/Utils.js'
import {InferType} from 'yup'
import {KoboMetaMapperProtection} from './KoboMetaMapperProtection.js'
import {PromisePool} from '@supercharge/promise-pool'
import {Kobo} from 'kobo-sdk'
import {chunkify} from '@axanc/ts-utils'
import Event = GlobalEvent.Event

export type MetaMapped<TTag extends Record<string, any> = any> = Omit<
  IKoboMeta<TTag>,
  'koboId' | 'id' | 'uuid' | 'updatedAt' | 'formId' | 'date'
> & {date?: Date}

export type MetaMapperMerge<T extends Record<string, any> = any, TTag extends Record<string, any> = any> = (_: T) =>
  | {
      originMetaKey: Extract<KeyOf<IKoboMeta>, 'koboId' | 'taxId'>
      value: number | string
      changes: Partial<MetaMapped<TTag>>
    }
  | undefined

export type MetaMapperInsert<T extends Record<string, any> = any, TMeta extends Record<string, any> = any> = (
  _: T,
) => MetaMapped<TMeta> | MetaMapped<TMeta>[] | undefined

export class KoboMetaMapper {
  static readonly make = <T extends Record<string, any>>(
    _: Omit<MetaMapped<T>, 'project' | 'donor'> & {
      project?: DrcProject[]
      donor?: DrcDonor[]
      persons?: Person.Details[]
    },
  ): MetaMapped => {
    if (!_.project) _.project = []
    if (!_.donor) _.donor = []
    return _ as any
  }

  static readonly mappersCreate: Record<Kobo.FormId, MetaMapperInsert> = {
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
    [KoboIndex.byName('ecrec_vet_bha388').id]: KoboMetaMapperEcrec.ecrec_vet_bha388,
    [KoboIndex.byName('ecrec_vet2_dmfa').id]: KoboMetaMapperEcrec.ecrec_vet2_dmfa,
    [KoboIndex.byName('ecrec_msmeGrantReg').id]: KoboMetaMapperEcrec.ecrec_msmeGrantReg,
  }
  static readonly mappersUpdate: Record<Kobo.FormId, MetaMapperMerge> = {
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
  export const schemaSearchFilter = yup
    .object({
      status: yup.array().of(yup.mixed<KoboMetaStatus>().defined()).optional(),
      activities: yup.array().of(yup.mixed<DrcProgram>().defined()).optional(),
      sectors: yup.array().of(yup.mixed<DrcSector>().defined()).optional(),
    })
    .optional()
  export type SearchFilter = InferType<typeof schemaSearchFilter>
}

export class KoboMetaService {
  constructor(
    private prisma: PrismaClient,
    private kobo = new KoboService(prisma),
    private event = GlobalEvent.Class.getInstance(),
    private conf = appConf,
    private log: AppLogger = app.logger('KoboMetaService'),
  ) {}

  readonly start = () => {
    this.info('', `Start listening to ${Event.KOBO_FORM_SYNCHRONIZED}`)
    this.event.listen(Event.KOBO_FORM_SYNCHRONIZED, async (_) => {
      await this.sync(_.formId)
      // setTimeout(() => {
      //   // Wait for the database to be rebuilt before clearing the cache
      //   app.cache.clear(SytemCache.Meta)
      // }, duration(10, 'minute'))
    })
    this.event.listen(Event.WFP_DEDUPLICATION_SYNCHRONIZED, () => {
      this.syncWfpDeduplication()
    })
  }

  private sync = async (formId: Kobo.FormId) => {
    this.log.info(`Sync form ${KoboIndex.searchById(formId)?.name ?? formId}...`)
    const createMapper = KoboMetaMapper.mappersCreate[formId]
    const updateMapper = KoboMetaMapper.mappersUpdate[formId]
    if (createMapper) {
      await this.syncInsert({formId: formId, mapper: createMapper})
      ;(KoboMetaMapper.triggerUpdate[formId] ?? []).forEach((triggeredFormId) => {
        this.syncMerge({formId: triggeredFormId, mapper: KoboMetaMapper.mappersUpdate[triggeredFormId]})
      })
    } else if (updateMapper) {
      await this.syncMerge({formId: formId, mapper: updateMapper})
    } else {
      this.log.error(`No mapper implemented for ${JSON.stringify(formId)}`)
    }
  }

  private syncWfpDeduplication = async () => {
    // const data = await this.prisma.mpcaWfpDeduplication.findMany()
    // data.
  }

  readonly search = app.cache.request({
    key: AppCacheKey.Meta,
    cacheIf: (params) => {
      this.log.info(
        'Check `cacheIf` condition: ' +
          ' ' +
          (params === undefined || Object.keys(params).length === 0) +
          ' ' +
          JSON.stringify(params),
      )
      return params === undefined || Object.keys(params).length === 0
    },
    fn: async (params: KoboMetaParams.SearchFilter = {}) => {
      const t0 = performance.now()
      this.log.debug('Fetch Meta from database...')
      const res = (await this.prisma.koboMeta.findMany({
        include: {
          persons: true,
        },
        where: {
          ...map(params?.status, (_) => ({status: {in: _}})),
          ...map(params?.activities, (_) => ({activity: {in: _}})),
          ...map(params?.sectors, (_) => ({sector: {in: _}})),
        },
        orderBy: {
          date: 'desc',
        },
      })) as IKoboMeta[]
      this.log.info(`Fetch Meta from database... ${res.length} fetched in ${duration(performance.now() - t0)}`)
      return res
    },
  })

  private info = (formId: Kobo.FormId, message: string) =>
    this.log.info(`${KoboIndex.searchById(formId)?.translation ?? formId}: ${message}`)
  private debug = (formId: Kobo.FormId, message: string) =>
    this.log.debug(`${KoboIndex.searchById(formId)?.translation ?? formId}: ${message}`)

  private syncMerge = async ({formId, mapper}: {formId: Kobo.FormId; mapper: MetaMapperMerge}) => {
    const destinationFormId = Obj.entries(KoboMetaMapper.triggerUpdate).find((_) => _[1].includes(formId))![0]
    this.debug(formId, `Fetch Kobo answers...`)
    const updates = await this.prisma.koboAnswers
      .findMany({
        where: {formId, deletedAt: null},
      })
      .then((_) => seq(_).map(mapper).compact())
    const JOIN_COL = updates[0]?.originMetaKey // Assume it never changes for other updates
    if (!JOIN_COL) return
    const joinToMetaId: Record<string, Seq<UUID>> = await this.prisma.koboMeta
      .findMany({
        select: {
          id: true,
          [JOIN_COL]: true,
        },
        where: {
          formId: destinationFormId,
          [JOIN_COL]: {in: updates.map((_) => _.value)},
        },
      })
      .then((_) =>
        seq(_).groupByAndApply(
          (_) => (_ as any)[JOIN_COL] as string,
          (_) => (_ as unknown as Seq<{id: string}>).map((_) => _.id),
        ),
      )

    const metaIdsWithNewPersons = updates.filter((_) => !!_.changes.persons).flatMap((_) => joinToMetaId[_.value])
    await this.prisma.koboPerson.deleteMany({
      where: {metaId: {in: metaIdsWithNewPersons.filter((_) => _ !== undefined)}},
    })

    const createPersonInput = updates.flatMap((updates) => {
      return (joinToMetaId[updates.value] ?? []).flatMap((metaId) => {
        const res: Prisma.KoboPersonCreateManyInput[] = (updates.changes.persons ?? []).map((_) => ({..._, metaId}))
        return res
      })
    })

    await this.prisma.koboPerson.createMany({
      data: createPersonInput,
    })
    this.debug(formId, `Update ${updates.length}...`)
    await PromisePool.withConcurrency(this.conf.db.maxConcurrency)
      .for(updates)
      .process(async ({value, changes: {persons, ...update}}, i) => {
        return this.prisma.koboMeta.updateMany({
          where: {[JOIN_COL]: value, formId: destinationFormId},
          data: update,
        })
      })
    this.info(formId, `Update ${updates.length}... COMPLETED`)
  }

  private syncInsert = async ({formId, mapper}: {formId: Kobo.FormId; mapper: MetaMapperInsert}) => {
    this.debug(formId, `Fetch Kobo answers...`)
    const koboAnswers = await this.prisma.koboAnswers
      .findMany({
        select: {
          formId: true,
          uuid: true,
          answers: true,
          date: true,
          validationStatus: true,
          lastValidatedTimestamp: true,
          submissionTime: true,
          id: true,
          tags: true,
          attachments: true,
          updatedAt: true,
        },
        where: {formId, deletedAt: null},
      })
      .then((res) => {
        return seq(res).flatMap((r) => {
          const m = [mapper(r)].flat()
          return seq(m)
            .compact()
            .map((_) => {
              return {
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
      const koboAnswersWithId = koboAnswers.map((p) => {
        const genId = genUUID()
        const persons: Prisma.KoboPersonCreateManyInput[] = (p.persons ?? []).map((_) => {
          return {
            ..._,
            metaId: genId,
          }
        })
        return {
          ...p,
          id: genId,
          persons: persons,
        }
      })
      await chunkify({
        concurrency: 1,
        size: this.conf.db.maxPreparedStatementParams,
        data: koboAnswersWithId.map(({persons, ...kobo}) => kobo),
        fn: (data) => {
          return this.prisma.koboMeta.createMany({data})
        },
      })
      await chunkify({
        concurrency: 1,
        size: this.conf.db.maxPreparedStatementParams,
        data: koboAnswersWithId.flatMap((_) => _.persons),
        fn: (data) => this.prisma.koboPerson.createMany({data}),
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

  readonly syncAll = async () => {
    const keys = [...Obj.keys(KoboMetaMapper.mappersCreate), ...Obj.keys(KoboMetaMapper.mappersUpdate)]
    for (let i = 0; i < keys.length; i++) {
      const formId = keys[i]
      await this.sync(formId)
    }
  }
}
