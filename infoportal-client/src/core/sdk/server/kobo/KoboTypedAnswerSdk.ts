import {ApiClient} from '../ApiClient'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {
  Bn_cashForRentApplication,
  Bn_OldMpcaNfi,
  Bn_RapidResponse,
  Bn_Re,
  Ecrec_cashRegistration,
  Ecrec_cashRegistrationBha,
  KoboEcrec_cashRegistration,
  KoboGeneralMapping,
  KoboIndex,
  KoboMealCfmHelper,
  KoboProtection_hhs3,
  KoboSafetyIncidentHelper,
  Meal_CfmExternal,
  Meal_CfmInternal,
  Meal_VerificationEcrec,
  Meal_VerificationWinterization,
  Meal_VisitMonitoring,
  Partnership_partnersDatabase,
  Protection_communityMonitoring,
  Protection_gbv,
  Protection_groupSession,
  Protection_hhs2,
  Protection_hhs3,
  Protection_pss,
  ProtectionCommunityMonitoringTags,
  ProtectionHhsTags,
  Shelter_cashForRepair,
  Shelter_NTA,
  Shelter_TA,
  ShelterNtaTags,
  ShelterTaTagsHelper
} from '@infoportal-common'
import {KoboAnswerFilter, KoboAnswerSdk} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {ApiPaginate} from '@/core/sdk/server/_core/ApiSdkUtils'
import {EcrecData} from '@/features/Ecrec/useEcrecData'

export type KoboUnwrapAnserType<T extends keyof KoboTypedAnswerSdk> = Promise<Awaited<ReturnType<KoboTypedAnswerSdk[T]>>['data']>


export class KoboTypedAnswerSdk {

  constructor(private client: ApiClient, private sdk = new KoboAnswerSdk(client)) {
  }


  private readonly search = this.sdk.search

  readonly searchBn_Re = (filters: KoboAnswerFilter = {}) => {
    return this.search<Bn_Re.T>({
      formId: KoboIndex.byName('bn_re').id,
      fnMapKobo: Bn_Re.map,
      ...filters,
    })
  }

  readonly searcheBn_cashForRepair = (filters: KoboAnswerFilter = {}) => {
    return this.search<Shelter_cashForRepair.T>({
      formId: KoboIndex.byName('shelter_cashForRepair').id,
      fnMapKobo: Shelter_cashForRepair.map,
      ...filters,
    })
  }

  readonly searchBn_cashForRentApplication = (filters: KoboAnswerFilter = {}) => {
    return this.search<Bn_cashForRentApplication.T>({
      formId: KoboIndex.byName('bn_cashForRentApplication').id,
      fnMapKobo: Bn_cashForRentApplication.map,
      ...filters,
    })
  }

  readonly searchBn_MpcaNfiOld = (filters: KoboAnswerFilter = {}) => {
    return this.search<Bn_OldMpcaNfi.T>({
      formId: KoboIndex.byName('bn_1_mpcaNfi').id,
      fnMapKobo: Bn_OldMpcaNfi.map,
      ...filters,
    })
  }
  readonly searchBn_RapidResponseMechanism = (filters: KoboAnswerFilter = {}) => {
    return this.search<Bn_RapidResponse.T>({
      formId: KoboIndex.byName('bn_rapidResponse').id,
      fnMapKobo: Bn_RapidResponse.map,
      ...filters,
    })
  }

  readonly searchMeal_VisitMonitoring = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('meal_visitMonitoring').id,
      fnMapKobo: Meal_VisitMonitoring.map,
      ...filters,
    })
  }

  readonly searchPartnersDatabase = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('partnership_partnersDatabase').id,
      fnMapKobo: Partnership_partnersDatabase.map,
      ...filters,
    })
  }

  readonly searchShelterTa = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('shelter_ta').id,
      fnMapKobo: Shelter_TA.map,
      fnMapTags: ShelterTaTagsHelper.mapTags,
      ...filters,
    })
  }

  readonly searchShelterNta = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('shelter_nta').id,
      fnMapKobo: Shelter_NTA.map,
      fnMapTags: _ => _ as ShelterNtaTags,
      ...filters,
    })
  }

  readonly searchMealCfmInternal = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('meal_cfmInternal').id,
      fnMapKobo: Meal_CfmInternal.map,
      fnMapTags: KoboMealCfmHelper.map,
      ...filters,
    })
  }

  readonly searchMealCfmExternal = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('meal_cfmExternal').id,
      fnMapKobo: Meal_CfmExternal.map,
      fnMapTags: KoboMealCfmHelper.map,
      ...filters,
    })
  }

  readonly searchProtection_hhs2 = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('protection_hhs2_1').id,
      fnMapKobo: Protection_hhs2.map,
      fnMapTags: _ => _ as ProtectionHhsTags,
      ...filters,
    })
  }

  readonly searchProtection_hhs3 = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('protection_hhs3').id,
      fnMapKobo: Protection_hhs3.map,
      fnMapTags: _ => _ as ProtectionHhsTags,
      fnMapCustom: KoboProtection_hhs3.map,
      ...filters,
    })
  }

  readonly searchProtection_communityMonitoring = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('protection_communityMonitoring').id,
      fnMapKobo: Protection_communityMonitoring.map,
      fnMapTags: _ => _ as ProtectionCommunityMonitoringTags,
      ...filters,
    })
  }

  readonly searchProtection_pss = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('protection_pss').id,
      fnMapKobo: Protection_pss.map,
      ...filters,
    })
  }

  readonly searchProtection_groupSession = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('protection_groupSession').id,
      fnMapKobo: Protection_groupSession.map,
      ...filters,
    })
  }

  readonly searchProtection_gbv = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('protection_gbv').id,
      fnMapKobo: Protection_gbv.map,
      ...filters,
    })
  }

  readonly searchSafetyIncident = (filters: KoboAnswerFilter = {}): Promise<ApiPaginate<KoboAnswer<KoboSafetyIncidentHelper.Type>>> => {
    return this.search({
      formId: KoboIndex.byName('safety_incident').id,
      fnMapKobo: KoboSafetyIncidentHelper.mapData,
      ...filters,
    })
  }

  readonly searchMeal_verificationEcrec = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('meal_verificationEcrec').id,
      fnMapKobo: Meal_VerificationEcrec.map,
      ...filters,
    })
  }

  readonly searchMeal_verificationWinterization = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('meal_verificationWinterization').id,
      fnMapKobo: Meal_VerificationWinterization.map,
      ...filters,
    })
  }

  readonly searchEcrec_cashRegistrationBha = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('ecrec_cashRegistrationBha').id,
      fnMapKobo: Ecrec_cashRegistrationBha.map,
      fnMapTags: _ => _ as KoboEcrec_cashRegistration.Tags,
      ...filters,
    })
  }

  readonly searchEcrec_cashRegistration = (filters: KoboAnswerFilter = {}) => {
    return this.search({
      formId: KoboIndex.byName('ecrec_cashRegistration').id,
      fnMapKobo: Ecrec_cashRegistration.map,
      fnMapTags: _ => _ as KoboEcrec_cashRegistration.Tags,
      fnMapCustom: KoboGeneralMapping.addIndividualBreakdownColumn,
      ...filters,
    })
  }
}
