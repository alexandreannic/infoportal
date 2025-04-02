import {DbKoboAnswer, KoboAnswerFilter, KoboService} from './KoboService.js'
import {PrismaClient} from '@prisma/client'
import {
  ApiPaginate,
  Bn_0_mpcaReg,
  Bn_0_mpcaRegESign,
  Bn_0_mpcaRegNewShort,
  Bn_0_mpcaRegNoSig,
  Bn_OldMpcaNfi,
  Bn_rapidResponse,
  Bn_re,
  Ecrec_cashRegistration,
  KoboSubmissionFlat,
  KoboIndex,
  Protection_hhs,
  ProtectionHhsTags,
  Shelter_cashForRepair,
  Shelter_north,
  Shelter_nta,
  Shelter_ta,
} from 'infoportal-common'
import {map} from '@axanc/ts-utils'
import {ShelterNtaTags, ShelterTaTags} from './tags/ShelterTags.js'
import {Kobo} from 'kobo-sdk'

export class KoboMappedAnswersService {
  constructor(
    private prisma: PrismaClient,
    private kobo: KoboService = new KoboService(prisma),
  ) {}

  static readonly map =
    <T extends Record<string, any> = Record<string, any>, TTag extends Record<string, any> = any>(
      fnMap: (_: Record<string, any>) => T,
      fnTag?: (_: Record<string, any>) => TTag,
    ) =>
    (data: ApiPaginate<DbKoboAnswer>): ApiPaginate<KoboSubmissionFlat<T, TTag>> => {
      return {
        total: data.total,
        data: data.data.map((_) => ({
          ..._,
          ...fnMap(_.answers),
          tags: map(_.tags, fnTag, (tag, fn) => fn(tag)) ?? _.tags,
        })),
      }
    }

  private readonly buildMappedSearch =
    <T extends Record<string, any>, TTag extends Record<string, any>>(
      formId: Kobo.FormId,
      fn: (_: any) => T,
      fnTag?: (_: any) => TTag,
    ) =>
    (filters: KoboAnswerFilter = {}) => {
      return this.kobo
        .searchAnswers({
          formId,
          // includeMeta: true,
          ...filters,
        })
        .then(KoboMappedAnswersService.map(fn, fnTag))
    }

  readonly searchProtectionHss = this.buildMappedSearch(
    KoboIndex.byName('protection_hhs2_1').id,
    Protection_hhs.map,
    (_) => _ as ProtectionHhsTags,
  )
  readonly searchShelter_Ta = this.buildMappedSearch(
    KoboIndex.byName('shelter_ta').id,
    Shelter_ta.map,
    (_) => _ as ShelterTaTags,
  )
  readonly searchShelter_Nta = this.buildMappedSearch(
    KoboIndex.byName('shelter_nta').id,
    Shelter_nta.map,
    (_) => _ as ShelterNtaTags,
  )
  readonly searchShelter_north = this.buildMappedSearch(
    KoboIndex.byName('shelter_north').id,
    Shelter_north.map,
    (_) => _ as ShelterNtaTags & ShelterTaTags,
  )
  readonly searchShelter_cashForRepair = this.buildMappedSearch(
    KoboIndex.byName('shelter_cashForRepair').id,
    Shelter_cashForRepair.map,
  )
  readonly searchBn_re = this.buildMappedSearch(KoboIndex.byName('bn_re').id, Bn_re.map)
  readonly searchBn_RapidResponseMechanism = this.buildMappedSearch(
    KoboIndex.byName('bn_rapidResponse').id,
    Bn_rapidResponse.map,
  )
  readonly searchBn_1_mpcaNfi = this.buildMappedSearch(KoboIndex.byName('bn_1_mpcaNfi').id, Bn_OldMpcaNfi.map)
  readonly searchBn_0_mpcaRegNewShort = this.buildMappedSearch(
    KoboIndex.byName('bn_0_mpcaRegNewShort').id,
    Bn_0_mpcaRegNewShort.map,
  )
  readonly searchBn_0_mpcaReg = this.buildMappedSearch(KoboIndex.byName('bn_0_mpcaReg').id, Bn_0_mpcaReg.map)
  readonly searchBn_0_mpcaRegNoSig = this.buildMappedSearch(
    KoboIndex.byName('bn_0_mpcaRegNoSig').id,
    Bn_0_mpcaRegNoSig.map,
  )
  readonly searchBn_0_mpcaRegESign = this.buildMappedSearch(
    KoboIndex.byName('bn_0_mpcaRegESign').id,
    Bn_0_mpcaRegESign.map,
  )
  readonly searchBn_ecrecCashRegistration = this.buildMappedSearch(
    KoboIndex.byName('ecrec_cashRegistration').id,
    Ecrec_cashRegistration.map,
  )
  readonly searchBn_ecrecCashRent = this.buildMappedSearch(
    KoboIndex.byName('ecrec_cashRegistration').id,
    Ecrec_cashRegistration.map,
  )
}
