export namespace Bn_OldMpcaNfiMyko {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]

  // Form id: a8WAWB9Yxu2jkgk4Ei8GTk
  export interface T {
    start: string
    end: string
    today: string
    ID: string
    // group_xp17b32/unique_id_view [note] Unique ID ${ID}
    unique_id_view: string
    // group_xp17b32/Is_this_beneficiary_a_patient_at_a_ward [acknowledge] Is this beneficiary a patient at a ward?
    Is_this_beneficiary_a_patient_at_a_ward: string
    // group_xp17b32/location_geopoint [geopoint] Record your current location
    location_geopoint: string
    // module_consent/__021 [note] In order to register your application, we'd need to ask you a few questions to understand the composition of your household and how to best transfer financial assistance to you if you are eligible. These questions will take between 10-15 minutes. If you are eligible, we’ll need to share some basic details with the bank in order to make the payment. We are also required to share Tax ID numbers of people we provide assistance to with other humanitarian agencies implementing financial assistance programs, to ensure we are not duplicating assistance. All the other information will be stored safely, in accordance with the Law on protection of personal data, and will not be shared outside of DRC and its partners.. Do you provide DRC consent to take photos or copies of your personal documentation at this time? Following DRC Data Protection Protocols and Ukraine Law on Data Protection, we will not share copies or photos of your documents with anyone outside DRC and these will only be used for the sole purpose of processing your information in order to provide you with cash assistance. You can decide to say no at this time and we will need to collect your documents at a later point in time.
    __021: string
    // module_consent/consent_mod_1 [select_one] Are you happy to proceed with the questionnaire?
    consent_mod_1: undefined | Option<'consent_mod_1'>
    // module_eligibility_screening/patron [text] What is your surname name (as shown in personal ID)?
    patron: string | undefined
    // module_eligibility_screening/name_resp [text] What is your first name (as shown in personal ID)?
    name_resp: string | undefined
    // module_eligibility_screening/last_resp [text] What is your patronymic name?
    last_resp: string | undefined
    // module_eligibility_screening/phone [integer] What is your phone number?
    phone: number | undefined
    // module_eligibility_screening/group_jy7pa23/Does_the_beneficiary_have_an_i [select_one] Does the beneficiary have an individual tax number (ITN)?
    Does_the_beneficiary_have_an_i: undefined | Option<'Does_the_beneficiary_have_an_i'>
    // module_eligibility_screening/group_jy7pa23/Other_ID_identification [select_one] Other ID identification
    Other_ID_identification: undefined | Option<'Other_ID_identification'>
    // module_eligibility_screening/group_jy7pa23/Number_of_ID [text] Number of ID
    Number_of_ID: string | undefined
    // module_eligibility_screening/group_jy7pa23/ITN [text] Individual tax number (ITN) of the HHH
    ITN: string | undefined
    // module_eligibility_screening/group_kj9wg97/Total_Family [integer] Indicate the total number of people in your household, including the HHH
    Total_Family: number | undefined
    // module_eligibility_screening/group_kj9wg97/group_in3fh72 [begin_repeat] HH members (including HHH)
    group_in3fh72:
      | {AgeHH: number | undefined | undefined; GenderHH: undefined | Option<'GenderHH'> | undefined}[]
      | undefined
    // module_eligibility_screening_001/group_un9ff13_header/Kits_to_be_provided [select_multiple] Kits to be provided
    Kits_to_be_provided: undefined | Option<'Kits_to_be_provided'>[]
    // module_eligibility_screening_001/group_un9ff13_header/HKMV_ [integer] HKMV Family hygiene kit for IDPs on the move: How many?
    HKMV_: number | undefined
    // module_eligibility_screening_001/group_un9ff13_header/HKF_ [integer] HKF Hygiene kit: How many?
    HKF_: number | undefined
    // module_eligibility_screening_001/group_un9ff13_header/BLN_ [integer] BLN High Thermal Blankets: How many?
    BLN_: number | undefined
    // module_eligibility_screening_001/group_un9ff13_header/WKB1_How_many [integer] WKB1: How many?
    WKB1_How_many: number | undefined
    // module_eligibility_screening_001/group_un9ff13_header/WKB2_How_many [integer] WKB2: How many?
    WKB2_How_many: number | undefined
    // module_eligibility_screening_001/group_un9ff13_header/WKB3_How_many [integer] WKB3: How many?
    WKB3_How_many: number | undefined
    // module_eligibility_screening_001/group_un9ff13_header/WKB4_How_many [integer] WKB4: How many?
    WKB4_How_many: number | undefined
    // module_eligibility_screening_001/group_un9ff13_header/BK1_How_many [integer] BK1: How many?
    BK1_How_many: number | undefined
    // module_eligibility_screening_001/group_un9ff13_header/BK2_How_many [integer] BK2: How many?
    BK2_How_many: number | undefined
    // module_eligibility_screening_001/group_un9ff13_header/BK3_How_many [integer] BK3: How many?
    BK3_How_many: number | undefined
    // module_eligibility_screening_001/group_un9ff13_header/BK4_How_many [integer] BK4: How many?
    BK4_How_many: number | undefined
    Total_Cost_HKMV: string
    Total_Cost_HKF: string
    Total_Cost_BLN: string
    Total_Cost_Allkits: string
    // group_5_document_collection/consent_signature_payment [image] In accordance with the Law of Ukraine "On the Protection of Personal Data" No. 2297-IV of June 1, 2010, we will need your consent for the following statement: "I give consent to the Representative Office of the Danish Refugee Council in Ukraine for the processing, use, access, distribution and transfer of my personal data to third parties that I provide about myself. The purpose of processing personal data to ensure the implementation of Assistance Programs.
    consent_signature_payment: string
    // no_consent_note [note] Thank you very much for talking to DRC today. We appreciate your time.
    no_consent_note: string
    // eligible_end_note [note] Thank you so much for agreeing to answer the questions. DRC will be reviewing the application and might contact for additional clarification and request for personal documents..
    eligible_end_note: string
  }

  export const options = {
    consent_mod_1: {
      '1': `Yes`,
      '2': `No`,
    },
    Does_the_beneficiary_have_an_i: {
      yes: `Yes`,
      no: `No`,
    },
    Other_ID_identification: {
      national_passport__book: `National Passport (book)`,
      national_passport__card: `National Passport (card)`,
      national_passport__diia_app: `National Passport (Diia app)`,
      passport__ussr_red_book: `Passport (USSR red book)`,
      passport_for_international_travel: `Passport for international travel`,
      certificate_issued_on_birth: `Certificate issued on birth`,
      birth_certificate: `Birth certificate`,
      driver_s_license: `Driver’s license`,
      pensioner_certificate: `Pensioner certificate`,
      other: `Other`,
    },
    GenderHH: {
      male: `Male`,
      female: `Female`,
      nogender: `Does not wish to identify`,
    },
    Kits_to_be_provided: {
      hkmv_____________: `HKMV Family hygiene kit for IDPs on the move`,
      hkf_______________: `HKF Hygiene kit`,
      bln_: `BLN High Thermal Blankets`,
      wkb1: `WKB1`,
      wkb2: `WKB2`,
      wkb3: `WKB3`,
      wkb4: `WKB4`,
      bk1: `BK1`,
      bk2: `BK2`,
      bk3: `BK3`,
      bk4: `BK4`,
    },
  }

  const extractQuestionName = (_: Record<string, any>) => {
    const output: any = {}
    Object.entries(_).forEach(([k, v]) => {
      const arr = k.split('/')
      const qName = arr[arr.length - 1]
      output[qName] = v
    })
    return output
  }

  export const map = (_: Record<keyof T, any>): T =>
    ({
      ..._,
      phone: _.phone ? +_.phone : undefined,
      Total_Family: _.Total_Family ? +_.Total_Family : undefined,
      group_in3fh72: _.group_in3fh72?.map(extractQuestionName).map((_: any) => {
        _['AgeHH'] = _.AgeHH ? +_.AgeHH : undefined
        return _
      }),
      Kits_to_be_provided: _.Kits_to_be_provided?.split(' '),
      HKMV_: _.HKMV_ ? +_.HKMV_ : undefined,
      HKF_: _.HKF_ ? +_.HKF_ : undefined,
      BLN_: _.BLN_ ? +_.BLN_ : undefined,
      WKB1_How_many: _.WKB1_How_many ? +_.WKB1_How_many : undefined,
      WKB2_How_many: _.WKB2_How_many ? +_.WKB2_How_many : undefined,
      WKB3_How_many: _.WKB3_How_many ? +_.WKB3_How_many : undefined,
      WKB4_How_many: _.WKB4_How_many ? +_.WKB4_How_many : undefined,
      BK1_How_many: _.BK1_How_many ? +_.BK1_How_many : undefined,
      BK2_How_many: _.BK2_How_many ? +_.BK2_How_many : undefined,
      BK3_How_many: _.BK3_How_many ? +_.BK3_How_many : undefined,
      BK4_How_many: _.BK4_How_many ? +_.BK4_How_many : undefined,
    }) as T
}
