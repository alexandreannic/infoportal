import {ApiClient} from '@/core/sdk/server/ApiClient'
import {KoboAnswerFilter, KoboAnswerSdk} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {
  Bn_re,
  DisplacementStatus,
  Ecrec_cashRegistration,
  Ecrec_cashRegistrationBha,
  Ecrec_msmeGrantEoi,
  Ecrec_msmeGrantSelection,
  Ecrec_vetApplication,
  Ecrec_vetEvaluation,
  KoboEcrec_cashRegistration,
  KoboFormName,
  KoboIndex,
  KoboMealCfmHelper,
  KoboProtection_hhs3,
  KoboSafetyIncidentHelper,
  Meal_cashPdm,
  Meal_cfmExternal,
  Meal_cfmInternal,
  Meal_verificationEcrec,
  Meal_verificationWinterization,
  Meal_visitMonitoring,
  Partnership_partnersDatabase,
  Person,
  PersonDetails,
  Protection_coc,
  Protection_gbv,
  Protection_gbvSocialProviders,
  Protection_groupSession,
  Protection_hhs3,
  ProtectionHhsTags,
  Shelter_nta,
  Shelter_ta,
  ShelterNtaTags,
  ShelterTaTagsHelper,
} from 'infoportal-common'
import {ApiPaginate} from '@/core/sdk/server/_core/ApiSdkUtils'
import {fnSwitch, seq} from '@alexandreannic/ts-utils'
import {Meal_shelterPdm} from "infoportal-common/lib/kobo/generated/Meal_shelterPdm";

/** @deprecated should be coming from the unified database */
type Meta = {
  persons: PersonDetails[]
}

/** @deprecated should be coming from the unified database */
type WithMeta<T extends Record<string, any>> = T & {
  meta: {
    persons: PersonDetails[]
  }
}

/** @deprecated should be coming from the unified database */
export const makeMeta = <T extends Record<string, any>>(t: T, meta: Meta): WithMeta<T> => {
  (t as any).meta = meta
  return t as any
}

const make = <K extends KoboFormName, T>(key: K,
  params: (filters?: KoboAnswerFilter) => Promise<ApiPaginate<T>>): Record<K, (filters?: KoboAnswerFilter) => Promise<ApiPaginate<T>>> => {
  return {[key]: params} as any
}


export type KoboFormNameMapped = keyof KoboTypedAnswerSdk['search']

export type InferTypedAnswer<N extends KoboFormNameMapped> = Awaited<ReturnType<KoboTypedAnswerSdk['search'][N]>>['data'][number]

export class KoboTypedAnswerSdk {
  constructor(private client: ApiClient, private sdk = new KoboAnswerSdk(client)) {
  }

  private readonly buildSearch = (request: 'searchByAccess' | 'search') => {
    const req = this.sdk[request]
    return ({
      ...make('meal_cfmInternal', (filters?: KoboAnswerFilter) =>
        // BAD, we should revamp the way access is working for CFM. Add FP should add rule in the access table that will natively work with the standard access filters
        this.sdk.search({
          formId: KoboIndex.byName('meal_cfmInternal').id,
          fnMapKobo: Meal_cfmInternal.map,
          fnMapTags: KoboMealCfmHelper.map,
          ...filters,
        })),
      ...make('meal_cfmExternal', (filters?: KoboAnswerFilter) =>
        // BAD, we should revamp the way access is working for CFM. Add FP should add rule in the access table that will natively work with the standard access filters
        this.sdk.search({
          formId: KoboIndex.byName('meal_cfmExternal').id,
          fnMapKobo: Meal_cfmExternal.map,
          fnMapTags: KoboMealCfmHelper.map,
          ...filters,
        })),
      ...make('protection_groupSession', (filters?: KoboAnswerFilter) => req({
        formId: KoboIndex.byName('protection_groupSession').id,
        fnMapKobo: Protection_groupSession.map,
        ...filters,
      })),
      ...make('shelter_nta', (filters?: KoboAnswerFilter) => req({
        formId: KoboIndex.byName('shelter_nta').id,
        fnMapKobo: Shelter_nta.map,
        fnMapTags: _ => _ as ShelterNtaTags,
        ...filters,
      })),
      ...make('protection_gbv', (filters?: KoboAnswerFilter) => req({
        formId: KoboIndex.byName('protection_gbv').id,
        fnMapKobo: Protection_gbv.map,
        fnMapCustom: _ => {
          const persons: PersonDetails[] | undefined = (_.new_ben === 'no' || !_.hh_char_hh_det) ? [] :
            _.hh_char_hh_det
              .filter(_ => _.hh_char_hh_new_ben !== 'no')
              .map(p => {
                return {
                  gender: fnSwitch(p.hh_char_hh_det_gender!, {
                    male: Person.Gender.Male,
                    female: Person.Gender.Female,
                    other: Person.Gender.Other
                  }, () => undefined),
                  age: p.hh_char_hh_det_age,
                  displacement: fnSwitch(p.hh_char_hh_det_status!, {
                    idp: DisplacementStatus.Idp,
                    returnee: DisplacementStatus.Idp,
                    'non-displaced': DisplacementStatus.NonDisplaced,
                  }, () => undefined),
                }
              })
          return {..._, custom: {persons}}
        },
        ...filters,
      }).then(_ => ({
        ..._,
        data: seq(_.data).compact(),
      }))),
      ...make('shelter_ta', (filters?: KoboAnswerFilter) => req({
        formId: KoboIndex.byName('shelter_ta').id,
        fnMapKobo: Shelter_ta.map,
        fnMapTags: ShelterTaTagsHelper.mapTags,
        ...filters,
      })),
      ...make('ecrec_vetApplication', (filters?: KoboAnswerFilter) => req({
        formId: KoboIndex.byName('ecrec_vetApplication').id,
        fnMapKobo: Ecrec_vetApplication.map,
        ...filters,
      })),
      ...make('ecrec_vetEvaluation', (filters?: KoboAnswerFilter) => req({
        formId: KoboIndex.byName('ecrec_vetEvaluation').id,
        fnMapKobo: Ecrec_vetEvaluation.map,
        ...filters,
      })),
      ...make('meal_verificationEcrec', (filters?: KoboAnswerFilter) => req({
        formId: KoboIndex.byName('meal_verificationEcrec').id,
        fnMapKobo: Meal_verificationEcrec.map,
        ...filters,
      })),
      ...make('meal_verificationWinterization', (filters?: KoboAnswerFilter) => req({
        formId: KoboIndex.byName('meal_verificationWinterization').id,
        fnMapKobo: Meal_verificationWinterization.map,
        ...filters,
      })),
      ...make('bn_re', (filters?: KoboAnswerFilter) => req({
        formId: KoboIndex.byName('bn_re').id,
        fnMapKobo: Bn_re.map,
        ...filters,
      })),
      ...make('ecrec_msmeGrantSelection', (filters?: KoboAnswerFilter) => req({
        formId: KoboIndex.byName('ecrec_msmeGrantSelection').id,
        fnMapKobo: Ecrec_msmeGrantSelection.map,
        ...filters,
      })),
      ...make('ecrec_msmeGrantEoi', (filters?: KoboAnswerFilter) => req({
        formId: KoboIndex.byName('ecrec_msmeGrantEoi').id,
        fnMapKobo: Ecrec_msmeGrantEoi.map,
        ...filters,
      })),
      ...make('ecrec_cashRegistration', (filters?: KoboAnswerFilter) => req({
        formId: KoboIndex.byName('ecrec_cashRegistration').id,
        fnMapKobo: Ecrec_cashRegistration.map,
        fnMapTags: _ => _ as KoboEcrec_cashRegistration.Tags,
        ...filters,
      })),
      ...make('ecrec_cashRegistrationBha', (filters?: KoboAnswerFilter) => req({
        formId: KoboIndex.byName('ecrec_cashRegistrationBha').id,
        fnMapKobo: Ecrec_cashRegistrationBha.map,
        fnMapTags: _ => _ as KoboEcrec_cashRegistration.Tags,
        ...filters,
      })),
      ...make('meal_visitMonitoring', (filters?: KoboAnswerFilter) => req({
        formId: KoboIndex.byName('meal_visitMonitoring').id,
        fnMapKobo: Meal_visitMonitoring.map,
        ...filters,
      })),
      ...make('meal_cashPdm', (filters?: KoboAnswerFilter) => req({
        formId: KoboIndex.byName('meal_cashPdm').id,
        fnMapKobo: Meal_cashPdm.map,
        ...filters,
      })),
      ...make('meal_shelterPdm', (filters?: KoboAnswerFilter) => req({
        formId: KoboIndex.byName('meal_shelterPdm').id,
        fnMapKobo: Meal_shelterPdm.map,
        ...filters,
      })),
      ...make('protection_hhs3', (filters?: KoboAnswerFilter) => req({
        formId: KoboIndex.byName('protection_hhs3').id,
        fnMapKobo: Protection_hhs3.map,
        fnMapTags: _ => _ as ProtectionHhsTags,
        fnMapCustom: KoboProtection_hhs3.map,
        ...filters,
      })),
      ...make('safety_incident', (filters?: KoboAnswerFilter) => req({
        formId: KoboIndex.byName('safety_incident').id,
        fnMapKobo: KoboSafetyIncidentHelper.mapData,
        ...filters,
      })),
      ...make('partnership_partnersDatabase', (filters?: KoboAnswerFilter) => req({
        formId: KoboIndex.byName('partnership_partnersDatabase').id,
        fnMapKobo: Partnership_partnersDatabase.map,
        ...filters,
      })),
      ...make('protection_coc', (filters?: KoboAnswerFilter) => req({
        formId: KoboIndex.byName('protection_coc').id,
        fnMapKobo: Protection_coc.map,
        ...filters,
      })),
      ...make('protection_gbvSocialProviders', (filters?: KoboAnswerFilter) => req({
        formId: KoboIndex.byName('protection_gbvSocialProviders').id,
        fnMapKobo: Protection_gbvSocialProviders.map,
        ...filters,
      })),
    })
  }

  readonly searchByAccess = this.buildSearch('searchByAccess')
  readonly search = this.buildSearch('search')
}



