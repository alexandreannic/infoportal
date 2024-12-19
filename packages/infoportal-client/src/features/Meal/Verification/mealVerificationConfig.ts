import {Kobo} from 'kobo-sdk'
import {KeyOf, KoboIndex, KoboSchemaHelper} from 'infoportal-common'
import {seq} from '@alexandreannic/ts-utils'
import {InferTypedAnswer, KoboFormNameMapped} from '@/core/sdk/server/kobo/KoboTypedAnswerSdk'
import {format} from 'date-fns'

export const mealVerificationConf = {
  sampleSizeRatioDefault: .2,
  numericToleranceMargin: .1,
}

export type VerifiedColumnsMapping<
  TReg extends KoboFormNameMapped = any,
  TVerif extends KoboFormNameMapped = any,
> = {
  reg: (_: InferTypedAnswer<TReg>, schema: KoboSchemaHelper.Bundle) => any,
  verif: (_: InferTypedAnswer<TVerif>, schema: KoboSchemaHelper.Bundle) => any
}

export const MEAL_VERIF_AUTO_MAPPING = 'AUTO_MAPPING'

export type MealVerificationActivity<
  TReg extends KoboFormNameMapped = any,
  TVerif extends KoboFormNameMapped = any,
> = {
  sampleSizeRatio: number,
  label: string
  id: string
  registration: {
    koboFormId: Kobo.FormId,
    fetch: TReg
    filters?: (_: InferTypedAnswer<TReg>) => boolean
    joinBy: (_: InferTypedAnswer<TReg>) => string | number
  }
  verification: {
    fetch: TVerif
    koboFormId: Kobo.FormId,
    joinBy: (_: InferTypedAnswer<TVerif>) => string | number
  },
  dataColumns?: KeyOf<InferTypedAnswer<TReg>>[]
  verifiedColumns: {
    [K in KeyOf<InferTypedAnswer<TVerif>>]?: VerifiedColumnsMapping<TReg, TVerif> | typeof MEAL_VERIF_AUTO_MAPPING;
  }
}

const registerActivity = <
  TData extends KoboFormNameMapped,
  TCheck extends KoboFormNameMapped,
>(_: MealVerificationActivity<TData, TCheck>) => {
  return _
}

export const mealVerificationActivities = seq([
  registerActivity({
    sampleSizeRatio: .1,
    label: 'ECREC VET DMFA-355',
    id: 'ECREC VET DMFA-355',
    registration: {
      koboFormId: KoboIndex.byName('ecrec_vet2_dmfa').id,
      fetch: 'ecrec_vet2_dmfa',
      joinBy: _ => _.tax_id_num!,
    },
    verification: {
      koboFormId: KoboIndex.byName('meal_verificationEcrec').id,
      joinBy: _ => _.pay_det_tax_id_num!,
      fetch: 'meal_verificationEcrec',
    },
    dataColumns: [],
    verifiedColumns: {
      back_consent: {reg: _ => _.consent, verif: _ => _.back_consent,},
      ben_det_surname: {reg: _ => _.surname, verif: _ => _.ben_det_surname,},
      ben_det_first_name: {reg: _ => _.first_name, verif: _ => _.ben_det_first_name,},
      ben_det_pat_name: {reg: _ => _.pat_name, verif: _ => _.ben_det_pat_name,},
      ben_det_ph_number: {reg: _ => _.ph_number, verif: _ => _.ben_det_ph_number,},
      ben_det_oblast: {reg: _ => _.oblast, verif: _ => _.ben_det_oblast,},
      ben_det_raion: {reg: _ => _.raion, verif: _ => _.ben_det_raion,},
      ben_det_hromada: {reg: _ => _.hromada, verif: _ => _.ben_det_hromada,},
      ben_det_res_stat: {reg: _ => _.res_stat, verif: _ => _.ben_det_res_stat,},
      ben_det_income: {reg: _ => _.household_income, verif: _ => _.ben_det_income,},
      ben_det_hh_size: {reg: _ => _.number_people, verif: _ => _.ben_det_hh_size,},
      current_employment_situation: {reg: _ => _.current_employment_situation, verif: _ => _.current_employment_situation,},
      long_unemployed: {reg: _ => _.long_unemployed, verif: _ => _.long_unemployed,},
      interested_formally_employed: {reg: _ => _.interested_formally_employed, verif: _ => _.interested_formally_employed,},
      interested_formally_employed_other: {reg: _ => _.interested_formally_employed_other, verif: _ => _.interested_formally_employed_other,},
      aware_training_facility_operating: {reg: _ => _.aware_training_facility_operating, verif: _ => _.aware_training_facility_operating,},
      information_training_center: {reg: _ => _.information_training_center, verif: _ => _.information_training_center,},
      know_cost_training: {reg: _ => _.know_cost_training, verif: _ => _.know_cost_training,},
      cost_training: {reg: _ => _.cost_training, verif: _ => _.cost_training,},
      format_training: {reg: _ => _.format_training, verif: _ => _.format_training,},
      access_computer_internet: {reg: _ => _.access_computer_internet, verif: _ => _.access_computer_internet,},
      ability_regularly_attend: {reg: _ => _.ability_regularly_attend, verif: _ => _.ability_regularly_attend,},
      enrolled_other_training: {reg: _ => _.enrolled_other_training, verif: _ => _.enrolled_other_training,},
      who_paid_training: {reg: (_, schema) => _.who_paid_training, verif: (_, schema) => _.who_paid_training},
    }
  }),
  registerActivity({
    sampleSizeRatio: .1,
    label: 'ECREC VET BHA-388',
    id: 'ECREC VET BHA-388',
    registration: {
      koboFormId: KoboIndex.byName('ecrec_vet_bha388').id,
      fetch: 'ecrec_vet_bha388',
      joinBy: _ => _.tax_id_num!,
    },
    verification: {
      koboFormId: KoboIndex.byName('meal_verificationEcrec').id,
      joinBy: _ => _.pay_det_tax_id_num!,
      fetch: 'meal_verificationEcrec',
    },
    dataColumns: [],
    verifiedColumns: {
      back_consent: {reg: _ => _.consent, verif: _ => _.back_consent,},
      ben_det_surname: {reg: _ => _.surname, verif: _ => _.ben_det_surname,},
      ben_det_first_name: {reg: _ => _.first_name, verif: _ => _.ben_det_first_name,},
      ben_det_pat_name: {reg: _ => _.pat_name, verif: _ => _.ben_det_pat_name,},
      ben_det_ph_number: {reg: _ => _.ph_number, verif: _ => _.ben_det_ph_number,},
      ben_det_oblast: {reg: _ => _.oblast, verif: _ => _.ben_det_oblast,},
      ben_det_raion: {reg: _ => _.raion, verif: _ => _.ben_det_raion,},
      ben_det_hromada: {reg: _ => _.hromada, verif: _ => _.ben_det_hromada,},
      ben_det_res_stat: {reg: _ => _.res_stat, verif: _ => _.ben_det_res_stat,},
      ben_det_income: {reg: _ => _.household_income, verif: _ => _.ben_det_income,},
      ben_det_hh_size: {reg: _ => _.number_people, verif: _ => _.ben_det_hh_size,},
      current_employment_situation: {reg: _ => _.current_employment_situation, verif: _ => _.current_employment_situation,},
      long_unemployed: {reg: _ => _.long_unemployed, verif: _ => _.long_unemployed,},
      interested_formally_employed: {reg: _ => _.interested_formally_employed, verif: _ => _.interested_formally_employed,},
      interested_formally_employed_other: {reg: _ => _.interested_formally_employed_other, verif: _ => _.interested_formally_employed_other,},
      aware_training_facility_operating: {reg: _ => _.aware_training_facility_operating, verif: _ => _.aware_training_facility_operating,},
      information_training_center: {reg: _ => _.information_training_center, verif: _ => _.information_training_center,},
      know_cost_training: {reg: _ => _.know_cost_training, verif: _ => _.know_cost_training,},
      cost_training: {reg: _ => _.cost_training, verif: _ => _.cost_training,},
      format_training: {reg: _ => _.format_training, verif: _ => _.format_training,},
      access_computer_internet: {reg: _ => _.access_computer_internet, verif: _ => _.access_computer_internet,},
      ability_regularly_attend: {reg: _ => _.ability_regularly_attend, verif: _ => _.ability_regularly_attend,},
      enrolled_other_training: {reg: _ => _.enrolled_other_training, verif: _ => _.enrolled_other_training,},
      who_paid_training: {reg: (_, schema) => _.who_paid_training, verif: (_, schema) => _.who_paid_training},
    }
  }),
  registerActivity({
    sampleSizeRatio: .1,
    label: 'EC-REC Sectoral Cash for Businesses BHA',
    id: 'MSME',
    registration: {
      koboFormId: KoboIndex.byName('ecrec_msmeGrantEoi').id,
      fetch: 'ecrec_msmeGrantEoi',
      joinBy: _ => _.ben_det_tax_id_num!,
    },
    verification: {
      koboFormId: KoboIndex.byName('meal_verificationEcrec').id,
      joinBy: _ => _.pay_det_tax_id_num!,
      fetch: 'meal_verificationEcrec',
    },
    dataColumns: [],
    verifiedColumns: {
      back_consent: 'AUTO_MAPPING',
      back_consen_no_reas: 'AUTO_MAPPING',
      ben_det_surname: 'AUTO_MAPPING',
      ben_det_first_name: 'AUTO_MAPPING',
      ben_det_pat_name: 'AUTO_MAPPING',
      ben_det_ph_number: 'AUTO_MAPPING',
      ben_det_oblast: 'AUTO_MAPPING',
      ben_det_raion: 'AUTO_MAPPING',
      ben_det_hromada: 'AUTO_MAPPING',
      ben_det_res_stat: 'AUTO_MAPPING',
      ben_det_income: 'AUTO_MAPPING',
      ben_det_hh_size: 'AUTO_MAPPING',
      // 'ben_det_settlement': 'MEAL_VERIF_AUTO_MAPPING
    }
  }),
  registerActivity({
    sampleSizeRatio: .1,
    label: 'ECREC MSME BHA-388',
    id: 'ECREC MSME BHA-388',
    registration: {
      koboFormId: KoboIndex.byName('ecrec_msme_bha388').id,
      fetch: 'ecrec_msme_bha388',
      joinBy: _ => _.tax_id_num!,
    },
    verification: {
      koboFormId: KoboIndex.byName('meal_verificationEcrec').id,
      joinBy: _ => _.pay_det_tax_id_num!,
      fetch: 'meal_verificationEcrec',
    },
    dataColumns: [],
    verifiedColumns: {
      back_consent: {reg: _ => _.consent, verif: _ => _.back_consent,},
      ben_det_surname: {reg: _ => _.surname, verif: _ => _.ben_det_surname,},
      ben_det_first_name: {reg: _ => _.first_name, verif: _ => _.ben_det_first_name,},
      ben_det_pat_name: {reg: _ => _.pat_name, verif: _ => _.ben_det_pat_name,},
      ben_det_ph_number: {reg: _ => _.ph_number, verif: _ => _.ben_det_ph_number,},
      ben_det_oblast: {reg: _ => _.oblast, verif: _ => _.ben_det_oblast,},
      ben_det_raion: {reg: _ => _.raion, verif: _ => _.ben_det_raion,},
      ben_det_hromada: {reg: _ => _.hromada, verif: _ => _.ben_det_hromada,},
      ben_det_res_stat: {reg: _ => _.res_stat, verif: _ => _.ben_det_res_stat,},
      ben_det_income: {reg: _ => _.household_income, verif: _ => _.ben_det_income,},
      ben_det_hh_size: {reg: _ => _.number_people, verif: _ => _.ben_det_hh_size,},
      business_currently_operational_bha388: {reg: _ => _.business_currently_operational, verif: _ => _.business_currently_operational_bha388,},
      years_experience_business: 'AUTO_MAPPING',
      number_employees_business: 'AUTO_MAPPING',
      income_past12: 'AUTO_MAPPING',
      monthly_business_expenditure: 'AUTO_MAPPING',
      have_debt_repayment: 'AUTO_MAPPING',
      repayment_debt_loan: 'AUTO_MAPPING',
      received_previous_support: 'AUTO_MAPPING',
      who_previous_support: 'AUTO_MAPPING',
      amount_previous_support: 'AUTO_MAPPING',
      when_previous_support: {
        reg: _ => {
          if (_.when_previous_support) return format(_.when_previous_support, 'yyyy-MM-dd')
          else return ''
        },
        verif: _ => {
          if (_.when_previous_support) return format(_.when_previous_support, 'yyyy-MM-dd')
          else return ''
        }
      }
    }
  }),
  registerActivity({
    sampleSizeRatio: .1,
    label: 'VET - Training grants',
    id: 'Training grants',
    registration: {
      koboFormId: KoboIndex.byName('ecrec_vetApplication').id,
      fetch: 'ecrec_vetApplication',
      joinBy: _ => _.ben_det_ph_number!,
    },
    verification: {
      koboFormId: KoboIndex.byName('meal_verificationEcrec').id,
      fetch: 'meal_verificationEcrec',
      joinBy: _ => _.ben_det_ph_number!,
    },
    dataColumns: [],
    verifiedColumns: {
      back_consent: 'AUTO_MAPPING',
      back_consen_no_reas: 'AUTO_MAPPING',
      ben_det_surname: 'AUTO_MAPPING',
      ben_det_first_name: 'AUTO_MAPPING',
      ben_det_pat_name: 'AUTO_MAPPING',
      ben_det_ph_number: 'AUTO_MAPPING',
      ben_det_oblast: 'AUTO_MAPPING',
      ben_det_raion: 'AUTO_MAPPING',
      ben_det_hromada: 'AUTO_MAPPING',
      ben_det_res_stat: 'AUTO_MAPPING',
      ben_det_income: 'AUTO_MAPPING',
      ben_det_hh_size: 'AUTO_MAPPING',
      you_currently_employed: 'AUTO_MAPPING',
      you_currently_employed_no: 'AUTO_MAPPING',
      registered_training_facility: 'AUTO_MAPPING',
      registered_training_facility_yes: 'AUTO_MAPPING',
      training_activities_support: 'AUTO_MAPPING',
      training_activities_support_yes_paid: 'AUTO_MAPPING',
      training_activities_support_yes_consequence: 'AUTO_MAPPING',
      // 'ben_det_settlement',
    }
  }),
  registerActivity({
    sampleSizeRatio: .2,
    label: 'Cash for Fuel & Cash for Utilities',
    id: 'Cash for Fuel & Cash for Utilities',
    registration: {
      koboFormId: KoboIndex.byName('bn_re').id,
      fetch: 'bn_re',
      filters: _ => !!(_.back_prog_type && [_.back_prog_type].flat().find(_ => /^c(sf|fu)/.test(_))),
      joinBy: _ => _.pay_det_tax_id_num!,
    },
    verification: {
      koboFormId: KoboIndex.byName('meal_verificationWinterization').id,
      fetch: 'meal_verificationWinterization',
      joinBy: _ => _.pay_det_tax_id_num!,
    },
    dataColumns: [
      'back_enum',
      'back_donor',
      'back_prog_type',
    ],
    verifiedColumns: {
      back_consent: 'AUTO_MAPPING',
      back_consen_no_reas: 'AUTO_MAPPING',
      ben_det_surname: 'AUTO_MAPPING',
      ben_det_first_name: 'AUTO_MAPPING',
      ben_det_pat_name: 'AUTO_MAPPING',
      ben_det_ph_number: 'AUTO_MAPPING',
      ben_det_oblast: 'AUTO_MAPPING',
      ben_det_raion: 'AUTO_MAPPING',
      ben_det_hromada: 'AUTO_MAPPING',
      ben_det_settlement: 'AUTO_MAPPING',
      ben_det_res_stat: 'AUTO_MAPPING',
      ben_det_prev_oblast: 'AUTO_MAPPING',
      ben_det_income: 'AUTO_MAPPING',
      ben_det_hh_size: 'AUTO_MAPPING',
      current_gov_assist_cff: 'AUTO_MAPPING',
      utilities_fuel: 'AUTO_MAPPING',
      mains_utilities: 'AUTO_MAPPING',
      mains_utilities_other: 'AUTO_MAPPING',
      mains_fuel: 'AUTO_MAPPING',
      // mains_fuel: {
      //   reg: (_, sch) => handleMultiSelect(_, 'mains_fuel', sch),
      //   verif: (_, sch) => handleMultiSelect(_, 'mains_fuel', sch)
      // },
      mains_fuel_other: 'AUTO_MAPPING',
    },
  }),
  registerActivity({
    sampleSizeRatio: .2,
    label: 'ECREC Cash Registration UHF',
    id: 'ECREC Cash Registration',
    registration: {
      koboFormId: KoboIndex.byName('ecrec_cashRegistration').id,
      fetch: 'ecrec_cashRegistration',
      joinBy: _ => _.pay_det_tax_id_num!,
    },
    verification: {
      koboFormId: KoboIndex.byName('meal_verificationEcrec').id,
      fetch: 'meal_verificationEcrec',
      joinBy: _ => _.pay_det_tax_id_num!,
    },
    verifiedColumns: {
      back_consent: 'AUTO_MAPPING',
      ben_det_surname: 'AUTO_MAPPING',
      ben_det_ph_number: 'AUTO_MAPPING',
      ben_det_first_name: 'AUTO_MAPPING',
      ben_det_pat_name: 'AUTO_MAPPING',
      ben_det_oblast: 'AUTO_MAPPING',
      ben_det_raion: 'AUTO_MAPPING',
      ben_det_hromada: 'AUTO_MAPPING',
      ben_det_settlement: 'AUTO_MAPPING',
      ben_det_res_stat: 'AUTO_MAPPING',
      ben_det_income: 'AUTO_MAPPING',
      ben_det_hh_size: 'AUTO_MAPPING',
      land_own: 'AUTO_MAPPING',
      land_cultivate: 'AUTO_MAPPING',
      not_many_livestock: 'AUTO_MAPPING',
      many_sheep_goat: 'AUTO_MAPPING',
      many_milking: 'AUTO_MAPPING',
      many_cow: 'AUTO_MAPPING',
      many_pig: 'AUTO_MAPPING',
      many_poultry: 'AUTO_MAPPING',
    },
    dataColumns: [
      'back_donor',
    ]
  }),
  registerActivity({
    sampleSizeRatio: .1,
    label: 'ECREC Cash Registration BHA',
    id: 'ECREC Cash Registration BHA',
    registration: {
      koboFormId: KoboIndex.byName('ecrec_cashRegistrationBha').id,
      fetch: 'ecrec_cashRegistrationBha',
      joinBy: _ => _.pay_det_tax_id_num!,
    },
    verification: {
      koboFormId: KoboIndex.byName('meal_verificationEcrec').id,
      fetch: 'meal_verificationEcrec',
      joinBy: _ => _.pay_det_tax_id_num!,
    },
    verifiedColumns: {
      back_consent: 'AUTO_MAPPING',
      ben_det_surname: 'AUTO_MAPPING',
      ben_det_first_name: 'AUTO_MAPPING',
      ben_det_pat_name: 'AUTO_MAPPING',
      ben_det_ph_number: 'AUTO_MAPPING',
      ben_det_oblast: 'AUTO_MAPPING',
      ben_det_raion: 'AUTO_MAPPING',
      ben_det_hromada: 'AUTO_MAPPING',
      ben_det_settlement: 'AUTO_MAPPING',
      ben_det_res_stat: 'AUTO_MAPPING',
      ben_det_income: 'AUTO_MAPPING',
      ben_det_hh_size: 'AUTO_MAPPING',
      has_agriculture_exp: 'AUTO_MAPPING',
      depend_basic_needs: 'AUTO_MAPPING',
      consume_majority: 'AUTO_MAPPING',
      land_cultivate: 'AUTO_MAPPING',
    },
  }),
  registerActivity({
    sampleSizeRatio: .1,
    label: 'Partner LAMPA',
    id: 'Partner LAMPA',
    registration: {
      koboFormId: KoboIndex.byName('partner_lampa').id,
      fetch: 'partner_lampa',
      joinBy: _ => _.pay_det_tax_id_num!,
    },
    verification: {
      koboFormId: KoboIndex.byName('meal_verificationPartnerBnre').id,
      fetch: 'meal_verificationPartnerBnre',
      joinBy: _ => _.pay_det_tax_id_num!,
    },
    verifiedColumns: {
      back_consent: 'AUTO_MAPPING',
      ben_det_surname: 'AUTO_MAPPING',
      ben_det_first_name: 'AUTO_MAPPING',
      ben_det_pat_name: 'AUTO_MAPPING',
      ben_det_ph_number: 'AUTO_MAPPING',
      ben_det_oblast: 'AUTO_MAPPING',
      ben_det_raion: 'AUTO_MAPPING',
      ben_det_hromada: 'AUTO_MAPPING',
      ben_det_settlement: 'AUTO_MAPPING',
      ben_det_res_stat: {
        reg: (_, s) => _.ben_det_res_stat,
        verif: (_, s) => _.ben_det_res_stat,
      },
      ben_det_income: 'AUTO_MAPPING',
      ben_det_hh_size: 'AUTO_MAPPING',
      current_gov_assist_cff: 'AUTO_MAPPING',
      type_property_living: 'AUTO_MAPPING',
      utilities_fuel: 'AUTO_MAPPING',
      functioning_fuel_delivery: 'AUTO_MAPPING',
    },
  }),
  registerActivity({
    sampleSizeRatio: .1,
    label: 'Partner Pomagaem',
    id: 'Partner Pomagaem',
    registration: {
      koboFormId: KoboIndex.byName('partner_pomogaem').id,
      fetch: 'partner_pomogaem',
      joinBy: _ => _.pay_det_tax_id_num!,
    },
    verification: {
      koboFormId: KoboIndex.byName('meal_verificationPartnerBnre').id,
      fetch: 'meal_verificationPartnerBnre',
      joinBy: _ => _.pay_det_tax_id_num!,
    },
    verifiedColumns: {
      back_consent: 'AUTO_MAPPING',
      ben_det_surname: 'AUTO_MAPPING',
      ben_det_first_name: 'AUTO_MAPPING',
      ben_det_pat_name: 'AUTO_MAPPING',
      ben_det_ph_number: 'AUTO_MAPPING',
      ben_det_oblast: 'AUTO_MAPPING',
      ben_det_raion: 'AUTO_MAPPING',
      ben_det_hromada: 'AUTO_MAPPING',
      ben_det_settlement: {
        reg: (_) => _.ben_det_settlement,
        verif: (_) => {
          const tokens = _.ben_det_settlement?.split('_ua') || []
          return tokens[0] || ''
        },
      },
      ben_det_res_stat: 'AUTO_MAPPING',
      ben_det_income: 'AUTO_MAPPING',
      ben_det_hh_size: 'AUTO_MAPPING',
      current_gov_assist_cff: 'AUTO_MAPPING',
      type_property_living: 'AUTO_MAPPING',
      utilities_fuel: 'AUTO_MAPPING',
      functioning_fuel_delivery: 'AUTO_MAPPING',
    },
  }),
  registerActivity({
    sampleSizeRatio: .1,
    label: 'Partner Angels of Salvations',
    id: 'Partner Angels of Salvations',
    registration: {
      koboFormId: KoboIndex.byName('partner_angels').id,
      fetch: 'partner_angels',
      joinBy: _ => _.pay_det_tax_id_num!,
    },
    verification: {
      koboFormId: KoboIndex.byName('meal_verificationPartnerBnre').id,
      fetch: 'meal_verificationPartnerBnre',
      joinBy: _ => _.pay_det_tax_id_num!,
    },
    verifiedColumns: {
      back_consent: 'AUTO_MAPPING',
      ben_det_surname: 'AUTO_MAPPING',
      ben_det_first_name: 'AUTO_MAPPING',
      ben_det_pat_name: 'AUTO_MAPPING',
      ben_det_ph_number: 'AUTO_MAPPING',
      ben_det_oblast: 'AUTO_MAPPING',
      ben_det_raion: 'AUTO_MAPPING',
      ben_det_hromada: 'AUTO_MAPPING',
      ben_det_settlement: 'AUTO_MAPPING',
      ben_det_res_stat: 'AUTO_MAPPING',
      ben_det_income: 'AUTO_MAPPING',
      ben_det_hh_size: 'AUTO_MAPPING',
      current_gov_assist_cff: 'AUTO_MAPPING',
      type_property_living: 'AUTO_MAPPING',
      utilities_fuel: 'AUTO_MAPPING',
      functioning_fuel_delivery: 'AUTO_MAPPING',
    },
  }),
  registerActivity({
    sampleSizeRatio: .1,
    label: 'Partner Misto Syly',
    id: 'Partner Misto Syly',
    registration: {
      koboFormId: KoboIndex.byName('partner_misto_syly').id,
      fetch: 'partner_misto_syly',
      joinBy: _ => _.cal_head_pib!,
    },
    verification: {
      koboFormId: KoboIndex.byName('meal_verificationPartnerBnre').id,
      fetch: 'meal_verificationPartnerBnre',
      joinBy: _ => _.pay_det_tax_id_num!,
    },
    verifiedColumns: {
      back_consent: 'AUTO_MAPPING',
      ben_det_surname: {
        reg: _ => _.hh_char_hh_det?.[0].ben_det_surname, verif: _ => _.ben_det_surname,
      },
      ben_det_first_name: {
        reg: _ => _.hh_char_hh_det?.[0].ben_det_first_name, verif: _ => _.ben_det_first_name,
      },
      ben_det_pat_name: {
        reg: _ => _.hh_char_hh_det?.[0].ben_det_pat_name, verif: _ => _.ben_det_pat_name,
      },
      ben_det_ph_number: {
        reg: _ => _.hh_char_hh_det?.[0].member_ph_number, verif: _ => _.ben_det_ph_number,
      },
      ben_det_oblast: 'AUTO_MAPPING',
      ben_det_raion: 'AUTO_MAPPING',
      ben_det_hromada: 'AUTO_MAPPING',
      ben_det_settlement: 'AUTO_MAPPING',
      ben_det_res_stat: {
        reg: _ => _.hh_char_hh_det?.[0].ben_det_res_stat, verif: _ => _.ben_det_res_stat,
      },
      ben_det_income: 'AUTO_MAPPING',
      ben_det_hh_size: 'AUTO_MAPPING',
      current_gov_assist_cff: 'AUTO_MAPPING',
      type_property_living: 'AUTO_MAPPING',
      utilities_fuel: 'AUTO_MAPPING',
      functioning_fuel_delivery: 'AUTO_MAPPING',
    },
  }),
])

export const mealVerificationActivitiesIndex = mealVerificationActivities.groupByFirst(_ => _.id)
