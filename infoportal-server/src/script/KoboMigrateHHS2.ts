import {PrismaClient} from '@prisma/client'
import {KoboSyncServer} from '../feature/kobo/KoboSyncServer'
import {KoboApiService} from '../feature/kobo/KoboApiService'
import {Protection_hhs} from '@infoportal-common'
import {app, AppLogger} from '../index'

export const KoboMigrateHHS2 = ({
    prisma,
    serverId,
    oldFormId,
    newFormId,
    service = new KoboApiService(prisma),
    syncService = new KoboSyncServer(prisma),
    log = app.logger('KoboMigrateHHS2'),
  }: {
    prisma: PrismaClient,
    serverId: string
    oldFormId: string
    newFormId: string
    service?: KoboApiService
    syncService?: KoboSyncServer
    log?: AppLogger
  }
) => {

  const mapAnswers = async () => {
    const res = await service.fetchAnswers(serverId, oldFormId)
    const unhandledQuestionName = new Set<string>()
    const unhandledOptions: Record<string, string> = {}

    const checkOptions = (questionName: string, values: string) => {
      // @ts-ignore
      const options = Protection_hhs.options[questionName]
      const value = values.split(' ')
      if (!options) return
      const possibleValues = Object.keys(options)
      value.forEach(v => {
        if (possibleValues && !possibleValues.includes(v)) {
          unhandledOptions[questionName] = v
        }
      })
    }

    const fixOptions = (values: string): string => {
      const optionsMapping = {
        wg_using_your_usual_language_have_difficulty_communicating_: 'wg_using_your_usual_language_have_difficulty_communicating',
        host_community_member: 'non_displaced',
        conflict_affected_person: 'non_displaced',
        host_communitys_local_authorities_supported_evacuation: 'government_supported_evacuation',
        _4_very_good: '_5_very_good',
        _3_good: '_4_good',
        collective_centre: 'urban_area',
        village_settlement: 'rural_area',
        private_housing: 'rural_area',
        borrowing_money_: 'borrowing_money',
        accommodations_condition_: 'accommodations_condition',
        fear_of_property_being_damaged_or_destroyed_by_armed_violence: 'fear_of_property_being_damaged_or_destroyedby_armed_violence',
        partially_damaged_: 'partially_damaged',
        accommodation_with_host_family_: 'accommodation_with_host_family',
        livelihood_support_vocational_training: 'livelihood_support vocational_training',
        collective_shelter_: 'collective_shelter',
        repaired_housing_compensation_for_destroyed_or_damaged_property: 'repaired_housing_compensation_for_destroyedor_damaged_property',
      }
      return values.split(' ').map(_ => (optionsMapping as any)[_] ?? _).join(' ')
    }

    const newData = res.data.map(row => {
      row.id = transformIdToAvoidCollision(row.id)
      const answersArr = Object.entries(row.answers).map(([questionName, value]) => [questionName/*.split('/')[1]*/, value]) as [string, any][]
      const answers = {} as Protection_hhs.T
      answersArr.forEach(([questionName, value], index) => {
        value = fixOptions(value)
        if (questionName === 'where_are_you_current_living_hromada' && value === 'UA7410003') {
          value = 'UA7410011'
        }
        if (/^where_is_your_[a-z]+$/.test(questionName) && value === 'stayed_to_keep_the_jobs') {
          value = value.replace('stayed_to_keep_the_jobs', 'remained_behind_in_the_area_of_origin')
        }
        if (questionName === 'type_of_site' && value === 'other_specify') {
          value = ''
        }
        if (protHHS_2_1Fields.find(_ => _ === questionName)) {
          // @ts-ignore
          answers[questionName] = value
        } else if (/^please_specify[a-z0-9_]{5}$/.test(questionName)) {
          const previousQuestionName = answersArr[index - 1][0]
          // @ts-ignore
          answers['please_specify' + previousQuestionName] = value
        } else if (
          /^what_type_of_incidents_took_place[a-z0-9_]{5}$/.test(questionName) ||
          /^when_did_the_incidents_occur[a-z0-9_]{5}$/.test(questionName) ||
          /^who_were_the_perpetrators_of_the_incident[a-z0-9_]{5}$/.test(questionName)
        ) {
          let relatedParent
          for (let i = index - 1; i === 0 || !relatedParent; i--) {
            relatedParent = answersArr[i][0].match(/^(has_any_.*?)[a-z0-9_]{5}$/)?.[1]
          }
          // @ts-ignore
          answers[questionName.substring(0, questionName.length - 5) + relatedParent] = value
        } else if (questionName === 'how_many_individuals_including_the_respondent_are_in_the_household') {
          answers.how_many_ind = value
        } else if (/^where_are_you_current_living_oblast/.test(questionName)) {
          answers.where_are_you_current_living_oblast = value
        } else if (/^where_are_you_current_living_raion/.test(questionName)) {
          answers.where_are_you_current_living_raion = value
        } else if (/^where_are_you_current_living_hromada/.test(questionName)) {
          answers.where_are_you_current_living_hromada = value
        } else if (/^what_is_your_area_of_origin_oblast/.test(questionName)) {
          answers.what_is_your_area_of_origin_oblast = value
        } else if (/^what_is_your_area_of_origin_raion/.test(questionName)) {
          answers.what_is_your_area_of_origin_raion = value
        } else if (/^what_is_your_area_of_origin_hromada/.test(questionName)) {
          answers.what_is_your_area_of_origin_hromada = value
        } else if (questionName === 'why_dont_they_have_stauts') {
          answers.why_dont_they_have_status = value
        } else if (questionName === 'has_any_member_of_your_household_experienced_any_protectionright_violation_incident') {
          answers.has_any_other_member_experienced_violence = value
        } else if (questionName === 'has_any_adult_female_member_of_your_household_experienced_any_protectionright_violation_incident') {
          answers.has_any_adult_female_member_experienced_violence = value
        } else if (questionName === 'has_any_adult_male_member_of_your_household_experienced_any_form_of_violence_within_the_last_6_months') {
          answers.has_any_adult_male_member_experienced_violence = value
        } else if (questionName === 'has_any_girl_member_of_your_household_experienced_any_protectionright_violation_incident') {
          answers.has_any_girl_member_experienced_violence = value
        } else if (questionName === 'how_many_household_members_lack_personal_documentation') {
          for (let i = 0; i < 12; i++) {
            if (value >= i) {
              // @ts-ignore
              answers[`does_${i}_lack_doc`] === 'other_specify'
            }
          }
        } else if (questionName.startsWith('hh_unregistered_sex_')) {
          const hhIndex = questionName.match(/hh_unregistered_sex_(\d+)/)?.[1]
          if (hhIndex && +hhIndex <= 12) {
            // @ts-ignore
            answers[`is_member_${hhIndex}_registered`] = 'no'
          }
        } else {
          unhandledQuestionName.add(questionName)
        }
      })
      if (row.id === '2416408495') {
        answers.staff_to_insert_their_DRC_office = 'lviv'
        answers.staff_code = 'LWO004'
      } else if (row.id === '2416258479') {
        answers.staff_to_insert_their_DRC_office = 'lviv'
        answers.staff_code = 'LWO002'
      }
      Object.entries(answers).forEach(([questionName, answer]) => {
        checkOptions(questionName, answer)
      })
      return {...row, answers}
    })
    console.error(unhandledOptions)
    console.warn(unhandledQuestionName)
    return newData
  }

  const transformIdToAvoidCollision = (koboId: string) => '2' + koboId

  const run = async () => {
    const allInsertedIds = await prisma.koboForm.findMany({select: {id: true}}).then(_ => new Set(_.map(x => x.id)))
    const form = await prisma.koboForm.findFirst({where: {id: oldFormId}})
    if (form) {
      log.info(`Form ${oldFormId} already created.`)
      return
    }
    await syncService.syncApiForm({serverId, formId: newFormId})
    const newKoboApiAnswers = await mapAnswers().then(_ => _.filter(x => !allInsertedIds.has(x.id)))
    if (newKoboApiAnswers.length === 0) {
      log?.info(`Data already inserted.`)
      return
    }

    await prisma.koboAnswers.createMany({
      data: newKoboApiAnswers.map(_ => ({
        id: _.id,
        uuid: _.uuid,
        formId: newFormId,
        date: _.submissionTime,
        start: _.start,
        end: _.end,
        version: _.version,
        submissionTime: _.submissionTime,
        validationStatus: _.validationStatus,
        validatedBy: _.validatedBy,
        source: `formId-${oldFormId}`,
        lastValidatedTimestamp: _.lastValidatedTimestamp,
        answers: _.answers as any,
      }))
    })
  }

  return {
    run
  }
}

export const protHHS_2_1Fields = [
  'start',
  'end',
  'deviceid',
  'staff_to_insert_their_DRC_office',
  'staff_code',
  'type_of_site',
  'present_yourself',
  'have_you_filled_out_this_form_before',
  'where_are_you_current_living_oblast',
  'where_are_you_current_living_raion',
  'where_are_you_current_living_hromada',
  'settlement',
  'what_is_your_citizenship',
  'if_nonukrainian_what_is_your_citizenship',
  'please_specifyif_nonukrainian_what_is_your_citizenship',
  'if_ukrainian_do_you_or_your_household_members_identify_as_member_of_a_minority_group',
  'please_specifyif_ukrainian_do_you_or_your_household_members_identify_as_member_of_a_minority_group',
  'what_is_the_primary_language_spoken_in_your_household',
  'what_is_the_type_of_your_household',
  'how_many_ind',
  'hh_sex_1',
  'hh_age_1',
  'hh_sex_2',
  'hh_age_2',
  'hh_sex_3',
  'hh_age_3',
  'hh_sex_4',
  'hh_age_4',
  'hh_sex_5',
  'hh_age_5',
  'hh_sex_6',
  'hh_age_6',
  'hh_sex_7',
  'hh_age_7',
  'hh_sex_8',
  'hh_age_8',
  'hh_sex_9',
  'hh_age_9',
  'hh_sex_10',
  'hh_age_10',
  'hh_sex_11',
  'hh_age_11',
  'hh_sex_12',
  'hh_age_12',
  'are_you_separated_from_any_of_your_households_members',
  'where_is_your_partner',
  'please_specifywhere_is_your_partner',
  'where_is_your_partner_remain_behind_in_the_area_of_origin',
  'please_specifywhere_is_your_partner_remain_behind_in_the_area_of_origin',
  'where_is_your_child_lt_18',
  'please_specifywhere_is_your_child_lt_18',
  'where_is_your_child_lt_18_remain_behind_in_the_area_of_origin',
  'please_specifywhere_is_your_child_lt_18_remain_behind_in_the_area_of_origin',
  'where_is_your_child_gte_18',
  'please_specifywhere_is_your_child_gte_18',
  'where_is_your_child_gte_18_remain_behind_in_the_area_of_origin',
  'please_specifywhere_is_your_child_gte_18_remain_behind_in_the_area_of_origin',
  'where_is_your_mother',
  'please_specifywhere_is_your_mother',
  'where_is_your_mother_remain_behind_in_the_area_of_origin',
  'please_specifywhere_is_your_mother_remain_behind_in_the_area_of_origin',
  'where_is_your_father',
  'please_specifywhere_is_your_father',
  'where_is_your_father_remain_behind_in_the_area_of_origin',
  'please_specifywhere_is_your_father_remain_behind_in_the_area_of_origin',
  'where_is_your_caregiver',
  'please_specifywhere_is_your_caregiver',
  'where_is_your_caregiver_remain_behind_in_the_area_of_origin',
  'please_specifywhere_is_your_caregiver_remain_behind_in_the_area_of_origin',
  'where_is_your_other_relative',
  'please_specifywhere_is_your_other_relative',
  'where_is_your_other_relative_remain_behind_in_the_area_of_origin',
  'please_specifywhere_is_your_other_relative_remain_behind_in_the_area_of_origin',
  'do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household',
  'please_specifydo_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household',
  'do_you_have_a_household_member_that_has_a_lot_of_difficulty',
  'how_many_children_have_one_or_more_of_the_functional_limitations',
  'how_many_adults_members_have_one_or_more_of_the_functional_limitations',
  'do_you_or_anyone_in_your_household_have_a_disability_status_from_the_gov',
  'why_dont_they_have_status',
  'please_specifywhy_dont_they_have_status',
  'do_you_or_anyone_in_your_household_receive_state_allowance_for_disability',
  'does_the_household_host_children_who_are_relatives',
  'does_the_household_host_children_who_are_not_relatives',
  'do_you_identify_as_any_of_the_following',
  'are_you',
  'what_is_your_area_of_origin_oblast',
  'what_is_your_area_of_origin_raion',
  'what_is_your_area_of_origin_hromada',
  'why_did_you_leave_your_area_of_origin',
  'please_specifywhy_did_you_leave_your_area_of_origin',
  'when_did_you_leave_your_area_of_origin',
  'how_did_you_travel_to_your_displacement_location',
  'please_specifyhow_did_you_travel_to_your_displacement_location',
  'when_did_you_first_leave_your_area_of_origin',
  'when_did_you_return_to_your_area_of_origin',
  'why_did_you_decide_to_return_to_your_area_of_origin',
  'please_specifywhy_did_you_decide_to_return_to_your_area_of_origin',
  'have_you_received_any_form_of_compensation_for_leaving_your_area_of_origin',
  'have_you_received_any_form_of_compensation_for_returnee_your_area_of_origin',
  'was_your_movement_to_return_to_your_area_of_origin_supported_or_facilitated_by_any_of_the_following',
  'please_specifywas_your_movement_to_return_to_your_area_of_origin_supported_or_facilitated_by_any_of_the_following',
  'did_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns',
  'please_specifydid_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns',
  'have_you_been_displaced_prior_to_your_current_displacement',
  'what_are_your_households_intentions_in_terms_of_place_of_residence',
  'what_factors_would_be_key_to_support_your_successful_integration_into_the_local_community',
  'please_specifywhat_factors_would_be_key_to_support_your_successful_integration_into_the_local_community',
  'what_would_be_the_deciding_factor_in_your_return_to_your_area_of_origin',
  'why_are_planning_to_relocate_from_your_current_place_of_residence',
  'please_specifywhy_are_planning_to_relocate_from_your_current_place_of_residence',
  'as_nonUkrainian_do_you_have_documentation',
  'as_stateless_person_household_do_you_have_a_stateless_registration_certificate',
  'are_you_and_your_hh_members_registered_as_idps',
  'is_member_1_registered',
  'does_1_lack_doc',
  'please_specifydoes_1_lack_doc',
  'is_member_2_registered',
  'does_2_lack_doc',
  'please_specifydoes_2_lack_doc',
  'is_member_3_registered',
  'does_3_lack_doc',
  'please_specifydoes_3_lack_doc',
  'is_member_4_registered',
  'does_4_lack_doc',
  'please_specifydoes_4_lack_doc',
  'is_member_5_registered',
  'does_5_lack_doc',
  'please_specifydoes_5_lack_doc',
  'is_member_6_registered',
  'does_6_lack_doc',
  'please_specifydoes_6_lack_doc',
  'is_member_7_registered',
  'does_7_lack_doc',
  'please_specifydoes_7_lack_doc',
  'is_member_8_registered',
  'does_8_lack_doc',
  'please_specifydoes_8_lack_doc',
  'is_member_9_registered',
  'does_9_lack_doc',
  'please_specifydoes_9_lack_doc',
  'is_member_10_registered',
  'does_10_lack_doc',
  'please_specifydoes_10_lack_doc',
  'is_member_11_registered',
  'does_11_lack_doc',
  'please_specifydoes_11_lack_doc',
  'is_member_12_registered',
  'does_12_lack_doc',
  'please_specifydoes_12_lack_doc',
  'do_you_have_any_of_the_following',
  'do_you_and_your_hh_members_receive_the_idp_allowance',
  'why_they_do_not_receive',
  'please_specifywhy_they_do_not_receive',
  'why_are_you_not_registered',
  'please_specifywhy_are_you_not_registered',
  'why_not_registered',
  'please_specifywhy_not_registered',
  'what_housing_land_and_property_documents_do_you_lack',
  'please_specifywhat_housing_land_and_property_documents_do_you_lack',
  'have_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation',
  'please_specifyhave_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation',
  'please_rate_your_sense_of_safety_in_this_location',
  'what_are_the_main_factors_that_make_this_location_feel_unsafe',
  'please_specifywhat_are_the_main_factors_that_make_this_location_feel_unsafe',
  'how_would_you_describe_the_relationship_between_member_of_the_host_community',
  'what_factors_are_affecting_the_relationship_between_communities_in_this_location',
  'please_specifywhat_factors_are_affecting_the_relationship_between_communities_in_this_location',
  'have_you_or_your_household_members_experienced_incidents_with_host_community_members_idps_returnees',
  'please_specifyhave_you_or_your_household_members_experienced_incidents_with_host_community_members_idps_returnees',
  'do_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area',
  'please_specifydo_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area',
  'has_any_adult_male_member_experienced_violence',
  'what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence',
  'please_specifywhat_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence',
  'when_did_the_incidents_occur_has_any_adult_male_member_experienced_violence',
  'who_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence',
  'please_specifywho_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence',
  'has_any_adult_female_member_experienced_violence',
  'what_type_of_incidents_took_place_has_any_adult_female_member_experienced_violence',
  'please_specifywhat_type_of_incidents_took_place_has_any_adult_female_member_experienced_violence',
  'when_did_the_incidents_occur_has_any_adult_female_member_experienced_violence',
  'who_were_the_perpetrators_of_the_incident_has_any_adult_female_member_experienced_violence',
  'please_specifywho_were_the_perpetrators_of_the_incident_has_any_adult_female_member_experienced_violence',
  'has_any_boy_member_experienced_violence',
  'what_type_of_incidents_took_place_has_any_boy_member_experienced_violence',
  'please_specifywhat_type_of_incidents_took_place_has_any_boy_member_experienced_violence',
  'when_did_the_incidents_occur_has_any_boy_member_experienced_violence',
  'who_were_the_perpetrators_of_the_incident_has_any_boy_member_experienced_violence',
  'please_specifywho_were_the_perpetrators_of_the_incident_has_any_boy_member_experienced_violence',
  'has_any_girl_member_experienced_violence',
  'what_type_of_incidents_took_place_has_any_girl_member_experienced_violence',
  'please_specifywhat_type_of_incidents_took_place_has_any_girl_member_experienced_violence',
  'when_did_the_incidents_occur_has_any_girl_member_experienced_violence',
  'who_were_the_perpetrators_of_the_incident_has_any_girl_member_experienced_violence',
  'please_specifywho_were_the_perpetrators_of_the_incident_has_any_girl_member_experienced_violence',
  'has_any_other_member_experienced_violence',
  'what_type_of_incidents_took_place_has_any_other_member_experienced_violence',
  'please_specifywhat_type_of_incidents_took_place_has_any_other_member_experienced_violence',
  'when_did_the_incidents_occur_has_any_other_member_experienced_violence',
  'who_were_the_perpetrators_of_the_incident_has_any_other_member_experienced_violence',
  'please_specifywho_were_the_perpetrators_of_the_incident_has_any_other_member_experienced_violence',
  'do_you_or_members_of_your_household_experience_discrimination_or_stigmatization_in_your_current_area_of_residence',
  'on_what_ground',
  'please_specifyon_what_ground',
  'is_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs',
  'please_specifyis_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs',
  'is_are_any_child_member_of_your_household_displaying_any_of_the_following_signs',
  'please_specifyis_are_any_child_member_of_your_household_displaying_any_of_the_following_signs',
  'do_household_members_experiencing_distress_have_access_to_relevant_care_and_services',
  'what_are_the_barriers_to_access_services',
  'please_specifywhat_are_the_barriers_to_access_services',
  'what_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members',
  'please_specifywhat_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members',
  'what_are_the_main_sources_of_income_of_your_household',
  'please_specifywhat_are_the_main_sources_of_income_of_your_household',
  'what_type_of_allowances_do_you_receive',
  'please_specifywhat_type_of_allowances_do_you_receive',
  'what_is_the_average_month_income_per_household',
  'including_yourself_are_there_members_of_your_household_who_are_out_of_work_and_seeking_employment',
  'what_are_the_reasons_for_being_out_of_work',
  'please_specifywhat_are_the_reasons_for_being_out_of_work',
  'are_there_gaps_in_meeting_your_basic_needs',
  'what_are_the_strategies_that_your_household_uses_to_cope_with_these_challenges',
  'please_specifywhat_are_the_strategies_that_your_household_uses_to_cope_with_these_challenges',
  'are_schoolaged_children_in_your_household_regularly_attending_primary_or_secondary_education',
  'is_it',
  'what_are_the_reasons_preventing_children_in_your_household_from_regularly_attending_education_services',
  'please_specifywhat_are_the_reasons_preventing_children_in_your_household_from_regularly_attending_education_services',
  'what_is_your_current_housing_structure',
  'what_is_the_tenure_status_of_your_accommodation_private',
  'please_specifywhat_is_the_tenure_status_of_your_accommodation_private',
  'what_is_the_tenure_status_of_your_accommodation_public',
  'please_specifywhat_is_the_tenure_status_of_your_accommodation_public',
  'do_you_have_formal_rental_documents_to_stay_in_your_accommodation',
  'what_is_the_general_condition_of_your_accommodation',
  'what_are_your_main_concerns_regarding_your_accommodation',
  'do_you_have_access_to_health_care_in_your_current_location',
  'what_are_the_barriers_to_accessing_health_services',
  'please_specifywhat_are_the_barriers_to_accessing_health_services',
  'what_is_your_1_priority',
  'please_specifywhat_is_your_1_priority',
  'what_is_your_2_priority',
  'please_specifywhat_is_your_2_priority',
  'what_is_your_3_priority',
  'please_specifywhat_is_your_3_priority',
  'additional_information_shared_by_respondent',
  'comments_observations_of_the_protection_monitor',
  'need_for_assistance',
]