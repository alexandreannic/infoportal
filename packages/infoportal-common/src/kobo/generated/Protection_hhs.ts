export namespace Protection_hhs {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]

  // Form id: aQDZ2xhPUnNd43XzuQucVR
  export interface T {
    start: string
    end: string
    deviceid: string
    // group_introduction/staff_to_insert_their_DRC_office [select_one] 1.1. Staff to insert their DRC office
    staff_to_insert_their_DRC_office: undefined | Option<'staff_to_insert_their_DRC_office'>
    // group_introduction/staff_code [select_one] 1.2. Staff code
    staff_code: undefined | Option<'staff_code'>
    // group_introduction/type_of_site [select_one] 1.3. Type of site
    type_of_site: undefined | Option<'type_of_site'>
    // group_introduction/present_yourself [select_one] 1.4. Introduce yourself and ask to speak to whoever is best placed to answer questions on behalf of the household
    present_yourself: undefined | Option<'present_yourself'>
    // group_introduction/thanks_the_respondant [note] <span style="border-radius:8px;padding:8px 12px;display:block;background:rgb(255, 244, 229);color:rgb(102, 60, 0)">⚠️   If the respondent does not wish to participate, stop the interview and thank them for their time.</span>
    thanks_the_respondant: string
    // group_introduction/have_you_filled_out_this_form_before [select_one] 1.4.1. Have you filled out this form before?
    have_you_filled_out_this_form_before: undefined | Option<'have_you_filled_out_this_form_before'>
    // group_introduction/have_you_filled_out_this_form_before_yes [note] <span style="border-radius:8px;padding:8px 12px;display:block;background:rgb(255, 244, 229);color:rgb(102, 60, 0)">⚠️   Stop the interview, explain to the respondent that we cannot duplicate the interview and thank them for their time.</span>
    have_you_filled_out_this_form_before_yes: string
    // group_basic_bio_data/where_are_you_current_living_label [note] <span style="font-weight:bold">   2.1. Where are you currently living in?</span>
    where_are_you_current_living_label: string
    // group_basic_bio_data/where_are_you_current_living_oblast [select_one] <span style="font-size:.875em;font-weight:normal">   2.2. Oblast</span>
    where_are_you_current_living_oblast: undefined | Option<'what_is_your_area_of_origin_oblast'>
    // group_basic_bio_data/where_are_you_current_living_raion [select_one] <span style="font-size:.875em;font-weight:normal">   2.3. Raion</span>
    where_are_you_current_living_raion: undefined | Option<'what_is_your_area_of_origin_raion'>
    // group_basic_bio_data/where_are_you_current_living_hromada [select_one] <span style="font-size:.875em;font-weight:normal">   2.4. Hromada</span>
    where_are_you_current_living_hromada: undefined | Option<'what_is_your_area_of_origin_hromada'>
    // group_basic_bio_data/settlement [text] <span style="font-weight:normal">   2.5. Settlement</span>
    settlement: string | undefined
    // group_basic_bio_data/what_is_your_citizenship [select_one] 2.6. What is your citizenship?
    what_is_your_citizenship: undefined | Option<'what_is_your_citizenship'>
    // group_basic_bio_data/if_nonukrainian_what_is_your_citizenship [select_one] 2.6.1. If non-Ukrainian, what is your citizenship?
    if_nonukrainian_what_is_your_citizenship: undefined | Option<'if_nonukrainian_what_is_your_citizenship'>
    // group_basic_bio_data/please_specifyif_nonukrainian_what_is_your_citizenship [text] 2.6.1.1. Please specify
    please_specifyif_nonukrainian_what_is_your_citizenship: string | undefined
    // group_basic_bio_data/if_ukrainian_do_you_or_your_household_members_identify_as_member_of_a_minority_group [select_one] 2.6.2. Do you or your household members identify as member(s) of a minority group?
    if_ukrainian_do_you_or_your_household_members_identify_as_member_of_a_minority_group:
      | undefined
      | Option<'if_ukrainian_do_you_or_your_household_members_identify_as_member_of_a_minority_group'>
    // group_basic_bio_data/please_specifyif_ukrainian_do_you_or_your_household_members_identify_as_member_of_a_minority_group [text] 2.6.2.1. Please specify
    please_specifyif_ukrainian_do_you_or_your_household_members_identify_as_member_of_a_minority_group:
      | string
      | undefined
    // group_basic_bio_data/what_is_the_primary_language_spoken_in_your_household [select_one] 2.7. What is the primary language spoken in your household?
    what_is_the_primary_language_spoken_in_your_household:
      | undefined
      | Option<'what_is_the_primary_language_spoken_in_your_household'>
    // group_hh_composition/what_is_the_type_of_your_household [select_one] 3.1. What is the type of your household?
    what_is_the_type_of_your_household: undefined | Option<'what_is_the_type_of_your_household'>
    // group_hh_composition/what_is_the_type_of_your_household_min [calculate] undefined
    what_is_the_type_of_your_household_min: string
    // group_hh_composition/what_is_the_type_of_your_household_max [calculate] undefined
    what_is_the_type_of_your_household_max: string
    // group_hh_composition/how_many_ind [integer] 3.2. How many individuals, including the respondent, are in the household?
    how_many_ind: number | undefined
    // group_hh_composition/hh_sex_1 [select_one] <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.1. Member 1 (the respondent) registered?</span>
    hh_sex_1: undefined | Option<'hh_sex_1'>
    // group_hh_composition/hh_age_1 [integer] <span style="font-size:.875em;font-weight:normal">   3.2.2. Member 1 (the respondent) registered?</span>
    hh_age_1: number | undefined
    // group_hh_composition/hh_sex_2 [select_one] <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.3. Member 2 registered?</span>
    hh_sex_2: undefined | Option<'hh_sex_2'>
    // group_hh_composition/hh_age_2 [integer] <span style="font-size:.875em;font-weight:normal">   3.2.4. Member 2 registered?</span>
    hh_age_2: number | undefined
    // group_hh_composition/hh_sex_3 [select_one] <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.5. Member 3 registered?</span>
    hh_sex_3: undefined | Option<'hh_sex_3'>
    // group_hh_composition/hh_age_3 [integer] <span style="font-size:.875em;font-weight:normal">   3.2.6. Member 3 registered?</span>
    hh_age_3: number | undefined
    // group_hh_composition/hh_sex_4 [select_one] <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.7. Member 4 registered?</span>
    hh_sex_4: undefined | Option<'hh_sex_4'>
    // group_hh_composition/hh_age_4 [integer] <span style="font-size:.875em;font-weight:normal">   3.2.8. Member 4 registered?</span>
    hh_age_4: number | undefined
    // group_hh_composition/hh_sex_5 [select_one] <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.9. Member 5 registered?</span>
    hh_sex_5: undefined | Option<'hh_sex_5'>
    // group_hh_composition/hh_age_5 [integer] <span style="font-size:.875em;font-weight:normal">   3.2.10. Member 5 registered?</span>
    hh_age_5: number | undefined
    // group_hh_composition/hh_sex_6 [select_one] <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.11. Member 6 registered?</span>
    hh_sex_6: undefined | Option<'hh_sex_6'>
    // group_hh_composition/hh_age_6 [integer] <span style="font-size:.875em;font-weight:normal">   3.2.12. Member 6 registered?</span>
    hh_age_6: number | undefined
    // group_hh_composition/hh_sex_7 [select_one] <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.13. Member 7 registered?</span>
    hh_sex_7: undefined | Option<'hh_sex_7'>
    // group_hh_composition/hh_age_7 [integer] <span style="font-size:.875em;font-weight:normal">   3.2.14. Member 7 registered?</span>
    hh_age_7: number | undefined
    // group_hh_composition/hh_sex_8 [select_one] <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.15. Member 8 registered?</span>
    hh_sex_8: undefined | Option<'hh_sex_8'>
    // group_hh_composition/hh_age_8 [integer] <span style="font-size:.875em;font-weight:normal">   3.2.16. Member 8 registered?</span>
    hh_age_8: number | undefined
    // group_hh_composition/hh_sex_9 [select_one] <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.17. Member 9 registered?</span>
    hh_sex_9: undefined | Option<'hh_sex_9'>
    // group_hh_composition/hh_age_9 [integer] <span style="font-size:.875em;font-weight:normal">   3.2.18. Member 9 registered?</span>
    hh_age_9: number | undefined
    // group_hh_composition/hh_sex_10 [select_one] <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.19. Member 10 registered?</span>
    hh_sex_10: undefined | Option<'hh_sex_10'>
    // group_hh_composition/hh_age_10 [integer] <span style="font-size:.875em;font-weight:normal">   3.2.20. Member 10 registered?</span>
    hh_age_10: number | undefined
    // group_hh_composition/hh_sex_11 [select_one] <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.21. Member 11 registered?</span>
    hh_sex_11: undefined | Option<'hh_sex_11'>
    // group_hh_composition/hh_age_11 [integer] <span style="font-size:.875em;font-weight:normal">   3.2.22. Member 11 registered?</span>
    hh_age_11: number | undefined
    // group_hh_composition/hh_sex_12 [select_one] <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.23. Member 12 registered?</span>
    hh_sex_12: undefined | Option<'hh_sex_12'>
    // group_hh_composition/hh_age_12 [integer] <span style="font-size:.875em;font-weight:normal">   3.2.24. Member 12 registered?</span>
    hh_age_12: number | undefined
    // group_hh_composition/have6_15 [calculate] undefined
    have6_15: string
    // group_hh_composition/haveBoy [calculate] undefined
    haveBoy: string
    // group_hh_composition/haveOtherSex [calculate] undefined
    haveOtherSex: string
    // group_hh_composition/haveGirl [calculate] undefined
    haveGirl: string
    // group_hh_composition/haveAdultMale [calculate] undefined
    haveAdultMale: string
    // group_hh_composition/haveAdultFemale [calculate] undefined
    haveAdultFemale: string
    // group_hh_composition/are_you_separated_from_any_of_your_households_members [select_multiple] 3.3. Are you separated from any of your households members?
    are_you_separated_from_any_of_your_households_members:
      | undefined
      | Option<'are_you_separated_from_any_of_your_households_members'>[]
    // group_hh_composition/where_is_your_partner [select_one] 3.3.1. Where is your Partner?
    where_is_your_partner: undefined | Option<'where_is_your_partner'>
    // group_hh_composition/please_specifywhere_is_your_partner [text] 3.3.1.1. Please specify
    please_specifywhere_is_your_partner: string | undefined
    // group_hh_composition/where_is_your_partner_remain_behind_in_the_area_of_origin [select_one] 3.3.1.2. Why did the Partner remain behind in the area of origin?
    where_is_your_partner_remain_behind_in_the_area_of_origin:
      | undefined
      | Option<'where_is_your_partner_remain_behind_in_the_area_of_origin'>
    // group_hh_composition/please_specifywhere_is_your_partner_remain_behind_in_the_area_of_origin [text] 3.3.1.2.1. Please specify
    please_specifywhere_is_your_partner_remain_behind_in_the_area_of_origin: string | undefined
    // group_hh_composition/where_is_your_child_lt_18 [select_one] 3.3.2. Where is your Child < 18?
    where_is_your_child_lt_18: undefined | Option<'where_is_your_child_lt_18'>
    // group_hh_composition/please_specifywhere_is_your_child_lt_18 [text] 3.3.2.1. Please specify
    please_specifywhere_is_your_child_lt_18: string | undefined
    // group_hh_composition/where_is_your_child_lt_18_remain_behind_in_the_area_of_origin [select_one] 3.3.2.2. Why did the Child < 18 remain behind in the area of origin?
    where_is_your_child_lt_18_remain_behind_in_the_area_of_origin:
      | undefined
      | Option<'where_is_your_child_lt_18_remain_behind_in_the_area_of_origin'>
    // group_hh_composition/please_specifywhere_is_your_child_lt_18_remain_behind_in_the_area_of_origin [text] 3.3.2.2.1. Please specify
    please_specifywhere_is_your_child_lt_18_remain_behind_in_the_area_of_origin: string | undefined
    // group_hh_composition/where_is_your_child_gte_18 [select_one] 3.3.3. Where is your Child ≥ 18?
    where_is_your_child_gte_18: undefined | Option<'where_is_your_child_gte_18'>
    // group_hh_composition/please_specifywhere_is_your_child_gte_18 [text] 3.3.3.1. Please specify
    please_specifywhere_is_your_child_gte_18: string | undefined
    // group_hh_composition/where_is_your_child_gte_18_remain_behind_in_the_area_of_origin [select_one] 3.3.3.2. Why did the Child ≥ 18 remain behind in the area of origin?
    where_is_your_child_gte_18_remain_behind_in_the_area_of_origin:
      | undefined
      | Option<'where_is_your_child_gte_18_remain_behind_in_the_area_of_origin'>
    // group_hh_composition/please_specifywhere_is_your_child_gte_18_remain_behind_in_the_area_of_origin [text] 3.3.3.2.1. Please specify
    please_specifywhere_is_your_child_gte_18_remain_behind_in_the_area_of_origin: string | undefined
    // group_hh_composition/where_is_your_mother [select_one] 3.3.4. Where is your Mother?
    where_is_your_mother: undefined | Option<'where_is_your_mother'>
    // group_hh_composition/please_specifywhere_is_your_mother [text] 3.3.4.1. Please specify
    please_specifywhere_is_your_mother: string | undefined
    // group_hh_composition/where_is_your_mother_remain_behind_in_the_area_of_origin [select_one] 3.3.4.2. Why did the Mother remain behind in the area of origin?
    where_is_your_mother_remain_behind_in_the_area_of_origin:
      | undefined
      | Option<'where_is_your_mother_remain_behind_in_the_area_of_origin'>
    // group_hh_composition/please_specifywhere_is_your_mother_remain_behind_in_the_area_of_origin [text] 3.3.4.2.1. Please specify
    please_specifywhere_is_your_mother_remain_behind_in_the_area_of_origin: string | undefined
    // group_hh_composition/where_is_your_father [select_one] 3.3.5. Where is your Father?
    where_is_your_father: undefined | Option<'where_is_your_father'>
    // group_hh_composition/please_specifywhere_is_your_father [text] 3.3.5.1. Please specify
    please_specifywhere_is_your_father: string | undefined
    // group_hh_composition/where_is_your_father_remain_behind_in_the_area_of_origin [select_one] 3.3.5.2. Why did the Father remain behind in the area of origin?
    where_is_your_father_remain_behind_in_the_area_of_origin:
      | undefined
      | Option<'where_is_your_father_remain_behind_in_the_area_of_origin'>
    // group_hh_composition/please_specifywhere_is_your_father_remain_behind_in_the_area_of_origin [text] 3.3.5.2.1. Please specify
    please_specifywhere_is_your_father_remain_behind_in_the_area_of_origin: string | undefined
    // group_hh_composition/where_is_your_caregiver [select_one] 3.3.6. Where is your Caregiver?
    where_is_your_caregiver: undefined | Option<'where_is_your_caregiver'>
    // group_hh_composition/please_specifywhere_is_your_caregiver [text] 3.3.6.1. Please specify
    please_specifywhere_is_your_caregiver: string | undefined
    // group_hh_composition/where_is_your_caregiver_remain_behind_in_the_area_of_origin [select_one] 3.3.6.2. Why did the Caregiver remain behind in the area of origin?
    where_is_your_caregiver_remain_behind_in_the_area_of_origin:
      | undefined
      | Option<'where_is_your_caregiver_remain_behind_in_the_area_of_origin'>
    // group_hh_composition/please_specifywhere_is_your_caregiver_remain_behind_in_the_area_of_origin [text] 3.3.6.2.1. Please specify
    please_specifywhere_is_your_caregiver_remain_behind_in_the_area_of_origin: string | undefined
    // group_hh_composition/where_is_your_other_relative [select_one] 3.3.7. Where is your other relative?
    where_is_your_other_relative: undefined | Option<'where_is_your_other_relative'>
    // group_hh_composition/please_specifywhere_is_your_other_relative [text] 3.3.7.1. Please specify
    please_specifywhere_is_your_other_relative: string | undefined
    // group_hh_composition/where_is_your_other_relative_remain_behind_in_the_area_of_origin [select_one] 3.3.7.2. Why did the other relative remain behind in the area of origin?
    where_is_your_other_relative_remain_behind_in_the_area_of_origin:
      | undefined
      | Option<'where_is_your_other_relative_remain_behind_in_the_area_of_origin'>
    // group_hh_composition/please_specifywhere_is_your_other_relative_remain_behind_in_the_area_of_origin [text] 3.3.7.2.1. Please specify
    please_specifywhere_is_your_other_relative_remain_behind_in_the_area_of_origin: string | undefined
    // group_specific_needs/do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household [select_multiple] 4.1. Do any of these specifics needs categories apply to the head(s) of this household?
    do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household:
      | undefined
      | Option<'do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household'>[]
    // group_specific_needs/please_specifydo_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household [text] 4.1.1. Please specify
    please_specifydo_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household: string | undefined
    // group_specific_needs/do_you_have_a_household_member_that_has_a_lot_of_difficulty [select_multiple] 4.2. Do you have a household member that has a lot of difficulty (or cannot do at all) any of the following?
    do_you_have_a_household_member_that_has_a_lot_of_difficulty:
      | undefined
      | Option<'do_you_have_a_household_member_that_has_a_lot_of_difficulty'>[]
    // group_specific_needs/how_many_children_have_one_or_more_of_the_functional_limitations [integer] 4.3. How many children of your housefold have one or more of the functional limitations?
    how_many_children_have_one_or_more_of_the_functional_limitations: number | undefined
    // group_specific_needs/how_many_adults_members_have_one_or_more_of_the_functional_limitations [integer] 4.4. How many adults members of your household have one or more of the functional limitations?
    how_many_adults_members_have_one_or_more_of_the_functional_limitations: number | undefined
    // group_specific_needs/do_you_or_anyone_in_your_household_have_a_disability_status_from_the_gov [select_one] 4.2.1. Do household members with functional limitations have a disability status from the Government of Ukraine?
    do_you_or_anyone_in_your_household_have_a_disability_status_from_the_gov:
      | undefined
      | Option<'do_you_or_anyone_in_your_household_have_a_disability_status_from_the_gov'>
    // group_specific_needs/why_dont_they_have_status [select_one] 4.2.1.1. Why don't they have a disability status?
    why_dont_they_have_status: undefined | Option<'why_dont_they_have_status'>
    // group_specific_needs/please_specifywhy_dont_they_have_status [text] 4.2.1.1.1. Please specify
    please_specifywhy_dont_they_have_status: string | undefined
    // group_specific_needs/do_you_or_anyone_in_your_household_receive_state_allowance_for_disability [select_one] 4.2.1.2. Do you or anyone in your household receive State allowance for disability?
    do_you_or_anyone_in_your_household_receive_state_allowance_for_disability:
      | undefined
      | Option<'do_you_or_anyone_in_your_household_receive_state_allowance_for_disability'>
    // group_specific_needs/does_the_household_host_children_who_are_relatives [select_one] 4.5. Does the household host children who are relatives?
    does_the_household_host_children_who_are_relatives:
      | undefined
      | Option<'does_the_household_host_children_who_are_relatives'>
    // group_specific_needs/does_the_household_host_children_who_are_not_relatives [select_one] 4.6. Does the household host children who are not relatives?
    does_the_household_host_children_who_are_not_relatives:
      | undefined
      | Option<'does_the_household_host_children_who_are_not_relatives'>
    // group_displacement_status_and_info/do_you_identify_as_any_of_the_following [select_one] 5.1. Do you identify as any of the following:
    do_you_identify_as_any_of_the_following: undefined | Option<'do_you_identify_as_any_of_the_following'>
    // group_displacement_status_and_info/are_you [select_one] 5.1.1. Are you:
    are_you: undefined | Option<'are_you'>
    // group_displacement_status_and_info/what_is_your_area_of_origin_label [note] <span style="font-weight:bold">   5.1.2. What is your place of habitual residence?</span>
    what_is_your_area_of_origin_label: string
    // group_displacement_status_and_info/what_is_your_area_of_origin_oblast [select_one] <span style="font-size:.875em;font-weight:normal">   5.1.3. Oblast</span>
    what_is_your_area_of_origin_oblast: undefined | Option<'what_is_your_area_of_origin_oblast'>
    // group_displacement_status_and_info/what_is_your_area_of_origin_raion [select_one] <span style="font-size:.875em;font-weight:normal">   5.1.4. Raion</span>
    what_is_your_area_of_origin_raion: undefined | Option<'what_is_your_area_of_origin_raion'>
    // group_displacement_status_and_info/what_is_your_area_of_origin_hromada [select_one] <span style="font-size:.875em;font-weight:normal">   5.1.5. Hromada</span>
    what_is_your_area_of_origin_hromada: undefined | Option<'what_is_your_area_of_origin_hromada'>
    // group_displacement_status_and_info/why_did_you_leave_your_area_of_origin [select_multiple] 5.1.6. What main factors forced you to leave?
    why_did_you_leave_your_area_of_origin: undefined | Option<'why_did_you_leave_your_area_of_origin'>[]
    // group_displacement_status_and_info/please_specifywhy_did_you_leave_your_area_of_origin [text] 5.1.6.1. Please specify
    please_specifywhy_did_you_leave_your_area_of_origin: string | undefined
    // group_displacement_status_and_info/when_did_you_leave_your_area_of_origin [date] 5.1.7. When did you leave your place of habitual residence?
    when_did_you_leave_your_area_of_origin: Date | undefined
    // group_displacement_status_and_info/how_did_you_travel_to_your_displacement_location [select_multiple] 5.1.8. How did you travel to your displacement location?
    how_did_you_travel_to_your_displacement_location:
      | undefined
      | Option<'how_did_you_travel_to_your_displacement_location'>[]
    // group_displacement_status_and_info/please_specifyhow_did_you_travel_to_your_displacement_location [text] 5.1.8.1. Please specify
    please_specifyhow_did_you_travel_to_your_displacement_location: string | undefined
    // group_displacement_status_and_info/when_did_you_first_leave_your_area_of_origin [date] 5.1.9. When did you first leave your place of habitual residence?
    when_did_you_first_leave_your_area_of_origin: Date | undefined
    // group_displacement_status_and_info/when_did_you_return_to_your_area_of_origin [date] 5.1.10. When did you return to your place of habitual residence?
    when_did_you_return_to_your_area_of_origin: Date | undefined
    // group_displacement_status_and_info/why_did_you_decide_to_return_to_your_area_of_origin [select_multiple] 5.1.11. Why did you decide to return to your place of habitual residence?
    why_did_you_decide_to_return_to_your_area_of_origin:
      | undefined
      | Option<'why_did_you_decide_to_return_to_your_area_of_origin'>[]
    // group_displacement_status_and_info/please_specifywhy_did_you_decide_to_return_to_your_area_of_origin [text] 5.1.11.1. Please specify
    please_specifywhy_did_you_decide_to_return_to_your_area_of_origin: string | undefined
    // group_displacement_status_and_info/have_you_received_any_form_of_compensation_for_leaving_your_area_of_origin [select_one] 5.1.12. Have you received any form of compensation for leaving your place of habitual residence?
    have_you_received_any_form_of_compensation_for_leaving_your_area_of_origin:
      | undefined
      | Option<'have_you_received_any_form_of_compensation_for_leaving_your_area_of_origin'>
    // group_displacement_status_and_info/have_you_received_any_form_of_compensation_for_returnee_your_area_of_origin [select_one] 5.1.13. Have you received any form of compensation for returning to your place of habitual residence?
    have_you_received_any_form_of_compensation_for_returnee_your_area_of_origin:
      | undefined
      | Option<'have_you_received_any_form_of_compensation_for_returnee_your_area_of_origin'>
    // group_displacement_status_and_info/was_your_movement_to_return_to_your_area_of_origin_supported_or_facilitated_by_any_of_the_following [select_multiple] 5.1.14. Was your movement to return to your place of habitual residence supported or facilitated by any of the following?
    was_your_movement_to_return_to_your_area_of_origin_supported_or_facilitated_by_any_of_the_following:
      | undefined
      | Option<'was_your_movement_to_return_to_your_area_of_origin_supported_or_facilitated_by_any_of_the_following'>[]
    // group_displacement_status_and_info/please_specifywas_your_movement_to_return_to_your_area_of_origin_supported_or_facilitated_by_any_of_the_following [text] 5.1.14.1. Please specify
    please_specifywas_your_movement_to_return_to_your_area_of_origin_supported_or_facilitated_by_any_of_the_following:
      | string
      | undefined
    // group_displacement_status_and_info/did_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns [select_multiple] 5.1.15. Did you or any member of your household experience safety or security concerns on your displacement journey?
    did_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns:
      | undefined
      | Option<'did_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns'>[]
    // group_displacement_status_and_info/please_specifydid_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns [text] 5.1.15.1. Please specify
    please_specifydid_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns:
      | string
      | undefined
    // group_displacement_status_and_info/have_you_been_displaced_prior_to_your_current_displacement [select_one] 5.1.16. Have you been displaced prior to your current displacement?
    have_you_been_displaced_prior_to_your_current_displacement:
      | undefined
      | Option<'have_you_been_displaced_prior_to_your_current_displacement'>
    // group_displacement_status_and_info/get_status [calculate] undefined
    get_status: string
    // group_displacement_status_and_info/what_are_your_households_intentions_in_terms_of_place_of_residence [select_one] 5.2. What are your current household's intentions in terms of place of residence?
    what_are_your_households_intentions_in_terms_of_place_of_residence:
      | undefined
      | Option<'what_are_your_households_intentions_in_terms_of_place_of_residence'>
    // group_displacement_status_and_info/what_factors_would_be_key_to_support_your_successful_integration_into_the_local_community [select_multiple] 5.2.1. What factors would be key to support your successful integration into the local community?
    what_factors_would_be_key_to_support_your_successful_integration_into_the_local_community:
      | undefined
      | Option<'what_factors_would_be_key_to_support_your_successful_integration_into_the_local_community'>[]
    // group_displacement_status_and_info/please_specifywhat_factors_would_be_key_to_support_your_successful_integration_into_the_local_community [text] 5.2.1.1. Please specify
    please_specifywhat_factors_would_be_key_to_support_your_successful_integration_into_the_local_community:
      | string
      | undefined
    // group_displacement_status_and_info/what_would_be_the_deciding_factor_in_your_return_to_your_area_of_origin [select_multiple] 5.2.2. What would be the deciding factor in your return to your place of habitual residence??
    what_would_be_the_deciding_factor_in_your_return_to_your_area_of_origin:
      | undefined
      | Option<'what_would_be_the_deciding_factor_in_your_return_to_your_area_of_origin'>[]
    // group_displacement_status_and_info/why_are_planning_to_relocate_from_your_current_place_of_residence [select_multiple] 5.2.3. Why are you planning to relocate from your current place of residence?
    why_are_planning_to_relocate_from_your_current_place_of_residence:
      | undefined
      | Option<'why_are_planning_to_relocate_from_your_current_place_of_residence'>[]
    // group_displacement_status_and_info/please_specifywhy_are_planning_to_relocate_from_your_current_place_of_residence [text] 5.2.3.1. Please specify
    please_specifywhy_are_planning_to_relocate_from_your_current_place_of_residence: string | undefined
    // group_registration_documentation/as_nonUkrainian_do_you_have_documentation [select_multiple] 6.1. As non-Ukrainian, do you have documentation?
    as_nonUkrainian_do_you_have_documentation: undefined | Option<'as_nonUkrainian_do_you_have_documentation'>[]
    // group_registration_documentation/as_stateless_person_household_do_you_have_a_stateless_registration_certificate [select_one] 6.2. As stateless person/household, do you have a stateless registration certificate?
    as_stateless_person_household_do_you_have_a_stateless_registration_certificate:
      | undefined
      | Option<'as_stateless_person_household_do_you_have_a_stateless_registration_certificate'>
    // group_registration_documentation/are_you_and_your_hh_members_registered_as_idps [select_one] 6.3. Are you and your household members registered as IDPs?
    are_you_and_your_hh_members_registered_as_idps: undefined | Option<'are_you_and_your_hh_members_registered_as_idps'>
    // group_registration_documentation/hh_sex_1_L [calculate] undefined
    hh_sex_1_L: string
    // group_registration_documentation/is_member_1_registered [select_one] 6.3.1. Is member 1 registered?
    is_member_1_registered: undefined | Option<'is_member_1_registered'>
    // group_registration_documentation/does_1_lack_doc [select_multiple] 6.4. Does member 1 lack any of these pieces of personal documentation?
    does_1_lack_doc: undefined | Option<'does_1_lack_doc'>[]
    // group_registration_documentation/please_specifydoes_1_lack_doc [text] 6.4.1. Please specify
    please_specifydoes_1_lack_doc: string | undefined
    // group_registration_documentation/hh_sex_2_L [calculate] undefined
    hh_sex_2_L: string
    // group_registration_documentation/is_member_2_registered [select_one] 6.3.2. Is member 2 registered?
    is_member_2_registered: undefined | Option<'is_member_2_registered'>
    // group_registration_documentation/does_2_lack_doc [select_multiple] 6.5. Does member 2 lack any of these pieces of personal documentation?
    does_2_lack_doc: undefined | Option<'does_2_lack_doc'>[]
    // group_registration_documentation/please_specifydoes_2_lack_doc [text] 6.5.1. Please specify
    please_specifydoes_2_lack_doc: string | undefined
    // group_registration_documentation/hh_sex_3_L [calculate] undefined
    hh_sex_3_L: string
    // group_registration_documentation/is_member_3_registered [select_one] 6.3.3. Is member 3 registered?
    is_member_3_registered: undefined | Option<'is_member_3_registered'>
    // group_registration_documentation/does_3_lack_doc [select_multiple] 6.6. Does member 3 lack any of these pieces of personal documentation?
    does_3_lack_doc: undefined | Option<'does_3_lack_doc'>[]
    // group_registration_documentation/please_specifydoes_3_lack_doc [text] 6.6.1. Please specify
    please_specifydoes_3_lack_doc: string | undefined
    // group_registration_documentation/hh_sex_4_L [calculate] undefined
    hh_sex_4_L: string
    // group_registration_documentation/is_member_4_registered [select_one] 6.3.4. Is member 4 registered?
    is_member_4_registered: undefined | Option<'is_member_4_registered'>
    // group_registration_documentation/does_4_lack_doc [select_multiple] 6.7. Does member 4 lack any of these pieces of personal documentation?
    does_4_lack_doc: undefined | Option<'does_4_lack_doc'>[]
    // group_registration_documentation/please_specifydoes_4_lack_doc [text] 6.7.1. Please specify
    please_specifydoes_4_lack_doc: string | undefined
    // group_registration_documentation/hh_sex_5_L [calculate] undefined
    hh_sex_5_L: string
    // group_registration_documentation/is_member_5_registered [select_one] 6.3.5. Is member 5 registered?
    is_member_5_registered: undefined | Option<'is_member_5_registered'>
    // group_registration_documentation/does_5_lack_doc [select_multiple] 6.8. Does member 5 lack any of these pieces of personal documentation?
    does_5_lack_doc: undefined | Option<'does_5_lack_doc'>[]
    // group_registration_documentation/please_specifydoes_5_lack_doc [text] 6.8.1. Please specify
    please_specifydoes_5_lack_doc: string | undefined
    // group_registration_documentation/hh_sex_6_L [calculate] undefined
    hh_sex_6_L: string
    // group_registration_documentation/is_member_6_registered [select_one] 6.3.6. Is member 6 registered?
    is_member_6_registered: undefined | Option<'is_member_6_registered'>
    // group_registration_documentation/does_6_lack_doc [select_multiple] 6.9. Does member 6 lack any of these pieces of personal documentation?
    does_6_lack_doc: undefined | Option<'does_6_lack_doc'>[]
    // group_registration_documentation/please_specifydoes_6_lack_doc [text] 6.9.1. Please specify
    please_specifydoes_6_lack_doc: string | undefined
    // group_registration_documentation/hh_sex_7_L [calculate] undefined
    hh_sex_7_L: string
    // group_registration_documentation/is_member_7_registered [select_one] 6.3.7. Is member 7 registered?
    is_member_7_registered: undefined | Option<'is_member_7_registered'>
    // group_registration_documentation/does_7_lack_doc [select_multiple] 6.10. Does member 7 lack any of these pieces of personal documentation?
    does_7_lack_doc: undefined | Option<'does_7_lack_doc'>[]
    // group_registration_documentation/please_specifydoes_7_lack_doc [text] 6.10.1. Please specify
    please_specifydoes_7_lack_doc: string | undefined
    // group_registration_documentation/hh_sex_8_L [calculate] undefined
    hh_sex_8_L: string
    // group_registration_documentation/is_member_8_registered [select_one] 6.3.8. Is member 8 registered?
    is_member_8_registered: undefined | Option<'is_member_8_registered'>
    // group_registration_documentation/does_8_lack_doc [select_multiple] 6.11. Does member 8 lack any of these pieces of personal documentation?
    does_8_lack_doc: undefined | Option<'does_8_lack_doc'>[]
    // group_registration_documentation/please_specifydoes_8_lack_doc [text] 6.11.1. Please specify
    please_specifydoes_8_lack_doc: string | undefined
    // group_registration_documentation/hh_sex_9_L [calculate] undefined
    hh_sex_9_L: string
    // group_registration_documentation/is_member_9_registered [select_one] 6.3.9. Is member 9 registered?
    is_member_9_registered: undefined | Option<'is_member_9_registered'>
    // group_registration_documentation/does_9_lack_doc [select_multiple] 6.12. Does member 9 lack any of these pieces of personal documentation?
    does_9_lack_doc: undefined | Option<'does_9_lack_doc'>[]
    // group_registration_documentation/please_specifydoes_9_lack_doc [text] 6.12.1. Please specify
    please_specifydoes_9_lack_doc: string | undefined
    // group_registration_documentation/hh_sex_10_L [calculate] undefined
    hh_sex_10_L: string
    // group_registration_documentation/is_member_10_registered [select_one] 6.3.10. Is member 10 registered?
    is_member_10_registered: undefined | Option<'is_member_10_registered'>
    // group_registration_documentation/does_10_lack_doc [select_multiple] 6.13. Does member 10 lack any of these pieces of personal documentation?
    does_10_lack_doc: undefined | Option<'does_10_lack_doc'>[]
    // group_registration_documentation/please_specifydoes_10_lack_doc [text] 6.13.1. Please specify
    please_specifydoes_10_lack_doc: string | undefined
    // group_registration_documentation/hh_sex_11_L [calculate] undefined
    hh_sex_11_L: string
    // group_registration_documentation/is_member_11_registered [select_one] 6.3.11. Is member 11 registered?
    is_member_11_registered: undefined | Option<'is_member_11_registered'>
    // group_registration_documentation/does_11_lack_doc [select_multiple] 6.14. Does member 11 lack any of these pieces of personal documentation?
    does_11_lack_doc: undefined | Option<'does_11_lack_doc'>[]
    // group_registration_documentation/please_specifydoes_11_lack_doc [text] 6.14.1. Please specify
    please_specifydoes_11_lack_doc: string | undefined
    // group_registration_documentation/hh_sex_12_L [calculate] undefined
    hh_sex_12_L: string
    // group_registration_documentation/is_member_12_registered [select_one] 6.3.12. Is member 12 registered?
    is_member_12_registered: undefined | Option<'is_member_12_registered'>
    // group_registration_documentation/does_12_lack_doc [select_multiple] 6.15. Does member 12 lack any of these pieces of personal documentation?
    does_12_lack_doc: undefined | Option<'does_12_lack_doc'>[]
    // group_registration_documentation/please_specifydoes_12_lack_doc [text] 6.15.1. Please specify
    please_specifydoes_12_lack_doc: string | undefined
    // group_registration_documentation/do_you_have_any_of_the_following [select_multiple] 6.3.13. Do you have any of the following:
    do_you_have_any_of_the_following: undefined | Option<'do_you_have_any_of_the_following'>[]
    // group_registration_documentation/do_you_and_your_hh_members_receive_the_idp_allowance [select_one] 6.3.14. Do you and your HH members receive the IDP allowance?
    do_you_and_your_hh_members_receive_the_idp_allowance:
      | undefined
      | Option<'do_you_and_your_hh_members_receive_the_idp_allowance'>
    // group_registration_documentation/why_they_do_not_receive [select_one] 6.3.14.1. Why don’t you receive the IDP allowance?
    why_they_do_not_receive: undefined | Option<'why_they_do_not_receive'>
    // group_registration_documentation/please_specifywhy_they_do_not_receive [text] 6.3.14.1.1. Please specify
    please_specifywhy_they_do_not_receive: string | undefined
    // group_registration_documentation/why_are_you_not_registered [select_multiple] 6.3.15. Why are you not registered?
    why_are_you_not_registered: undefined | Option<'why_are_you_not_registered'>[]
    // group_registration_documentation/please_specifywhy_are_you_not_registered [text] 6.3.15.1. Please specify
    please_specifywhy_are_you_not_registered: string | undefined
    // group_registration_documentation/why_not_registered [select_one] 6.3.15.2. Why registration was rejected/Not entitled to register as an IDP?
    why_not_registered: undefined | Option<'why_not_registered'>
    // group_registration_documentation/please_specifywhy_not_registered [text] 6.3.15.2.1. Please specify
    please_specifywhy_not_registered: string | undefined
    // group_registration_documentation/what_housing_land_and_property_documents_do_you_lack [select_multiple] 6.16. What housing, land and property documents do you lack?
    what_housing_land_and_property_documents_do_you_lack:
      | undefined
      | Option<'what_housing_land_and_property_documents_do_you_lack'>[]
    // group_registration_documentation/please_specifywhat_housing_land_and_property_documents_do_you_lack [text] 6.16.1. Please specify
    please_specifywhat_housing_land_and_property_documents_do_you_lack: string | undefined
    // group_registration_documentation/have_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation [select_multiple] 6.17. Have you experienced any barriers in obtaining or accessing identity documentation and/or HLP documentation?
    have_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation:
      | undefined
      | Option<'have_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation'>[]
    // group_registration_documentation/please_specifyhave_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation [text] 6.17.1. Please specify
    please_specifyhave_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation:
      | string
      | undefined
    // group_safety_n_movement/please_rate_your_sense_of_safety_in_this_location [select_one] 7.1. Please rate your sense of safety in this location?
    please_rate_your_sense_of_safety_in_this_location:
      | undefined
      | Option<'please_rate_your_sense_of_safety_in_this_location'>
    // group_safety_n_movement/what_are_the_main_factors_that_make_this_location_feel_unsafe [select_multiple] 7.1.1. What are the main factors that make this location feel unsafe?
    what_are_the_main_factors_that_make_this_location_feel_unsafe:
      | undefined
      | Option<'what_are_the_main_factors_that_make_this_location_feel_unsafe'>[]
    // group_safety_n_movement/please_specifywhat_are_the_main_factors_that_make_this_location_feel_unsafe [text] 7.1.1.1. Please specify
    please_specifywhat_are_the_main_factors_that_make_this_location_feel_unsafe: string | undefined
    // group_safety_n_movement/how_would_you_describe_the_relationship_between_member_of_the_host_community [select_one] 7.2. How would you describe the relationship between members of the host community, IDPs and/or returnees in this location?
    how_would_you_describe_the_relationship_between_member_of_the_host_community:
      | undefined
      | Option<'how_would_you_describe_the_relationship_between_member_of_the_host_community'>
    // group_safety_n_movement/what_factors_are_affecting_the_relationship_between_communities_in_this_location [select_multiple] 7.2.1. What factors are affecting the relationship between communities in this location?
    what_factors_are_affecting_the_relationship_between_communities_in_this_location:
      | undefined
      | Option<'what_factors_are_affecting_the_relationship_between_communities_in_this_location'>[]
    // group_safety_n_movement/please_specifywhat_factors_are_affecting_the_relationship_between_communities_in_this_location [text] 7.2.1.1. Please specify
    please_specifywhat_factors_are_affecting_the_relationship_between_communities_in_this_location: string | undefined
    // group_safety_n_movement/have_you_or_your_household_members_experienced_incidents_with_host_community_members_idps_returnees [select_multiple] 7.2.2. Have you or your household members experienced incidents with host community members/IDPs/returnees?
    have_you_or_your_household_members_experienced_incidents_with_host_community_members_idps_returnees:
      | undefined
      | Option<'have_you_or_your_household_members_experienced_incidents_with_host_community_members_idps_returnees'>[]
    // group_safety_n_movement/please_specifyhave_you_or_your_household_members_experienced_incidents_with_host_community_members_idps_returnees [text] 7.2.2.1. Please specify
    please_specifyhave_you_or_your_household_members_experienced_incidents_with_host_community_members_idps_returnees:
      | string
      | undefined
    // group_safety_n_movement/do_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area [select_multiple] 7.3. Do you or your household members experience any barriers to movements in and around the area?
    do_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area:
      | undefined
      | Option<'do_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area'>[]
    // group_safety_n_movement/please_specifydo_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area [text] 7.3.1. Please specify
    please_specifydo_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area:
      | string
      | undefined
    // group_violence_coercion_n_deprivation/get_tag_if_is_displaced [calculate] undefined
    get_tag_if_is_displaced: string
    // group_violence_coercion_n_deprivation/has_any_adult_male_member_experienced_violence [select_one] <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12)">   8.1. Has any adult male member of your household experienced any form of violence within the last 6 months?</span>
    has_any_adult_male_member_experienced_violence: undefined | Option<'has_any_adult_male_member_experienced_violence'>
    // group_violence_coercion_n_deprivation/what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence [select_multiple] <span style="font-weight:normal">   8.1.1. What type of incidents took place?</span>
    what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence:
      | undefined
      | Option<'what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence'>[]
    // group_violence_coercion_n_deprivation/please_specifywhat_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence [text] 8.1.1.1. Please specify
    please_specifywhat_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence: string | undefined
    // group_violence_coercion_n_deprivation/when_did_the_incidents_occur_has_any_adult_male_member_experienced_violence [select_multiple] <span style="font-weight:normal">   8.1.2. When did the incident(s) occur? </span>
    when_did_the_incidents_occur_has_any_adult_male_member_experienced_violence:
      | undefined
      | Option<'when_did_the_incidents_occur_has_any_adult_male_member_experienced_violence'>[]
    // group_violence_coercion_n_deprivation/who_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence [select_multiple] <span style="font-weight:normal">   8.1.3. Who were the perpetrators of the incident(s)? </span>
    who_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence:
      | undefined
      | Option<'who_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence'>[]
    // group_violence_coercion_n_deprivation/please_specifywho_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence [text] 8.1.3.1. Please specify
    please_specifywho_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence:
      | string
      | undefined
    // group_violence_coercion_n_deprivation/has_any_adult_female_member_experienced_violence [select_one] <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12)">   8.2. Has any adult female member of your household experienced any form of violence within the last 6 months?</span>
    has_any_adult_female_member_experienced_violence:
      | undefined
      | Option<'has_any_adult_female_member_experienced_violence'>
    // group_violence_coercion_n_deprivation/what_type_of_incidents_took_place_has_any_adult_female_member_experienced_violence [select_multiple] <span style="font-weight:normal">   8.2.1. What type of incidents took place?</span>
    what_type_of_incidents_took_place_has_any_adult_female_member_experienced_violence:
      | undefined
      | Option<'what_type_of_incidents_took_place_has_any_adult_female_member_experienced_violence'>[]
    // group_violence_coercion_n_deprivation/please_specifywhat_type_of_incidents_took_place_has_any_adult_female_member_experienced_violence [text] 8.2.1.1. Please specify
    please_specifywhat_type_of_incidents_took_place_has_any_adult_female_member_experienced_violence: string | undefined
    // group_violence_coercion_n_deprivation/when_did_the_incidents_occur_has_any_adult_female_member_experienced_violence [select_multiple] <span style="font-weight:normal">   8.2.2. When did the incident(s) occur? </span>
    when_did_the_incidents_occur_has_any_adult_female_member_experienced_violence:
      | undefined
      | Option<'when_did_the_incidents_occur_has_any_adult_female_member_experienced_violence'>[]
    // group_violence_coercion_n_deprivation/who_were_the_perpetrators_of_the_incident_has_any_adult_female_member_experienced_violence [select_multiple] <span style="font-weight:normal">   8.2.3. Who were the perpetrators of the incident(s)? </span>
    who_were_the_perpetrators_of_the_incident_has_any_adult_female_member_experienced_violence:
      | undefined
      | Option<'who_were_the_perpetrators_of_the_incident_has_any_adult_female_member_experienced_violence'>[]
    // group_violence_coercion_n_deprivation/please_specifywho_were_the_perpetrators_of_the_incident_has_any_adult_female_member_experienced_violence [text] 8.2.3.1. Please specify
    please_specifywho_were_the_perpetrators_of_the_incident_has_any_adult_female_member_experienced_violence:
      | string
      | undefined
    // group_violence_coercion_n_deprivation/has_any_boy_member_experienced_violence [select_one] <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12)">   8.3. Has any boy in your household experienced any form of violence within the last 6 months?</span>
    has_any_boy_member_experienced_violence: undefined | Option<'has_any_boy_member_experienced_violence'>
    // group_violence_coercion_n_deprivation/what_type_of_incidents_took_place_has_any_boy_member_experienced_violence [select_multiple] <span style="font-weight:normal">   8.3.1. What type of incidents took place?</span>
    what_type_of_incidents_took_place_has_any_boy_member_experienced_violence:
      | undefined
      | Option<'what_type_of_incidents_took_place_has_any_boy_member_experienced_violence'>[]
    // group_violence_coercion_n_deprivation/please_specifywhat_type_of_incidents_took_place_has_any_boy_member_experienced_violence [text] 8.3.1.1. Please specify
    please_specifywhat_type_of_incidents_took_place_has_any_boy_member_experienced_violence: string | undefined
    // group_violence_coercion_n_deprivation/when_did_the_incidents_occur_has_any_boy_member_experienced_violence [select_multiple] <span style="font-weight:normal">   8.3.2. When did the incident(s) occur? </span>
    when_did_the_incidents_occur_has_any_boy_member_experienced_violence:
      | undefined
      | Option<'when_did_the_incidents_occur_has_any_boy_member_experienced_violence'>[]
    // group_violence_coercion_n_deprivation/who_were_the_perpetrators_of_the_incident_has_any_boy_member_experienced_violence [select_multiple] <span style="font-weight:normal">   8.3.3. Who were the perpetrators of the incident(s)? </span>
    who_were_the_perpetrators_of_the_incident_has_any_boy_member_experienced_violence:
      | undefined
      | Option<'who_were_the_perpetrators_of_the_incident_has_any_boy_member_experienced_violence'>[]
    // group_violence_coercion_n_deprivation/please_specifywho_were_the_perpetrators_of_the_incident_has_any_boy_member_experienced_violence [text] 8.3.3.1. Please specify
    please_specifywho_were_the_perpetrators_of_the_incident_has_any_boy_member_experienced_violence: string | undefined
    // group_violence_coercion_n_deprivation/has_any_girl_member_experienced_violence [select_one] <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12)">   8.4. Has any girl in your household experienced any form of violence within the last 6 months?</span>
    has_any_girl_member_experienced_violence: undefined | Option<'has_any_girl_member_experienced_violence'>
    // group_violence_coercion_n_deprivation/what_type_of_incidents_took_place_has_any_girl_member_experienced_violence [select_multiple] <span style="font-weight:normal">   8.4.1. What type of incidents took place?</span>
    what_type_of_incidents_took_place_has_any_girl_member_experienced_violence:
      | undefined
      | Option<'what_type_of_incidents_took_place_has_any_girl_member_experienced_violence'>[]
    // group_violence_coercion_n_deprivation/please_specifywhat_type_of_incidents_took_place_has_any_girl_member_experienced_violence [text] 8.4.1.1. Please specify
    please_specifywhat_type_of_incidents_took_place_has_any_girl_member_experienced_violence: string | undefined
    // group_violence_coercion_n_deprivation/when_did_the_incidents_occur_has_any_girl_member_experienced_violence [select_multiple] <span style="font-weight:normal">   8.4.2. When did the incident(s) occur? </span>
    when_did_the_incidents_occur_has_any_girl_member_experienced_violence:
      | undefined
      | Option<'when_did_the_incidents_occur_has_any_girl_member_experienced_violence'>[]
    // group_violence_coercion_n_deprivation/who_were_the_perpetrators_of_the_incident_has_any_girl_member_experienced_violence [select_multiple] <span style="font-weight:normal">   8.4.3. Who were the perpetrators of the incident(s)? </span>
    who_were_the_perpetrators_of_the_incident_has_any_girl_member_experienced_violence:
      | undefined
      | Option<'who_were_the_perpetrators_of_the_incident_has_any_girl_member_experienced_violence'>[]
    // group_violence_coercion_n_deprivation/please_specifywho_were_the_perpetrators_of_the_incident_has_any_girl_member_experienced_violence [text] 8.4.3.1. Please specify
    please_specifywho_were_the_perpetrators_of_the_incident_has_any_girl_member_experienced_violence: string | undefined
    // group_violence_coercion_n_deprivation/has_any_other_member_experienced_violence [select_one] <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12)">   8.5. Has any other unspecified (Age/Gender) member of your household experienced any form of violence within the last 6 months?</span>
    has_any_other_member_experienced_violence: undefined | Option<'has_any_other_member_experienced_violence'>
    // group_violence_coercion_n_deprivation/what_type_of_incidents_took_place_has_any_other_member_experienced_violence [select_multiple] <span style="font-weight:normal">   8.5.1. What type of incidents took place?</span>
    what_type_of_incidents_took_place_has_any_other_member_experienced_violence:
      | undefined
      | Option<'what_type_of_incidents_took_place_has_any_other_member_experienced_violence'>[]
    // group_violence_coercion_n_deprivation/please_specifywhat_type_of_incidents_took_place_has_any_other_member_experienced_violence [text] 8.5.1.1. Please specify
    please_specifywhat_type_of_incidents_took_place_has_any_other_member_experienced_violence: string | undefined
    // group_violence_coercion_n_deprivation/when_did_the_incidents_occur_has_any_other_member_experienced_violence [select_multiple] <span style="font-weight:normal">   8.5.2. When did the incident(s) occur? </span>
    when_did_the_incidents_occur_has_any_other_member_experienced_violence:
      | undefined
      | Option<'when_did_the_incidents_occur_has_any_other_member_experienced_violence'>[]
    // group_violence_coercion_n_deprivation/who_were_the_perpetrators_of_the_incident_has_any_other_member_experienced_violence [select_multiple] <span style="font-weight:normal">   8.5.3. Who were the perpetrators of the incident(s)? </span>
    who_were_the_perpetrators_of_the_incident_has_any_other_member_experienced_violence:
      | undefined
      | Option<'who_were_the_perpetrators_of_the_incident_has_any_other_member_experienced_violence'>[]
    // group_violence_coercion_n_deprivation/please_specifywho_were_the_perpetrators_of_the_incident_has_any_other_member_experienced_violence [text] 8.5.3.1. Please specify
    please_specifywho_were_the_perpetrators_of_the_incident_has_any_other_member_experienced_violence:
      | string
      | undefined
    // group_violence_coercion_n_deprivation/do_you_or_members_of_your_household_experience_discrimination_or_stigmatization_in_your_current_area_of_residence [select_one] 8.6. Do you or members of your household experience discrimination or stigmatization in your current area of residence?
    do_you_or_members_of_your_household_experience_discrimination_or_stigmatization_in_your_current_area_of_residence:
      | undefined
      | Option<'do_you_or_members_of_your_household_experience_discrimination_or_stigmatization_in_your_current_area_of_residence'>
    // group_violence_coercion_n_deprivation/on_what_ground [select_multiple] 8.6.1. On what ground?
    on_what_ground: undefined | Option<'on_what_ground'>[]
    // group_violence_coercion_n_deprivation/please_specifyon_what_ground [text] 8.6.1.1. Please specify
    please_specifyon_what_ground: string | undefined
    // group_violence_coercion_n_deprivation/is_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs [select_multiple] 8.7. Is/are any adult member(s) of your household displaying any of the following signs?
    is_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs:
      | undefined
      | Option<'is_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs'>[]
    // group_violence_coercion_n_deprivation/please_specifyis_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs [text] 8.7.1. Please specify
    please_specifyis_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs: string | undefined
    // group_violence_coercion_n_deprivation/is_are_any_child_member_of_your_household_displaying_any_of_the_following_signs [select_multiple] 8.8. Is/are any child member(s) of your household displaying any of the following signs?
    is_are_any_child_member_of_your_household_displaying_any_of_the_following_signs:
      | undefined
      | Option<'is_are_any_child_member_of_your_household_displaying_any_of_the_following_signs'>[]
    // group_violence_coercion_n_deprivation/please_specifyis_are_any_child_member_of_your_household_displaying_any_of_the_following_signs [text] 8.8.1. Please specify
    please_specifyis_are_any_child_member_of_your_household_displaying_any_of_the_following_signs: string | undefined
    // group_violence_coercion_n_deprivation/do_household_members_experiencing_distress_have_access_to_relevant_care_and_services [select_one] 8.7.2. Do household members experiencing distress have access to relevant care and services?
    do_household_members_experiencing_distress_have_access_to_relevant_care_and_services:
      | undefined
      | Option<'do_household_members_experiencing_distress_have_access_to_relevant_care_and_services'>
    // group_violence_coercion_n_deprivation/what_are_the_barriers_to_access_services [select_multiple] 8.7.2.1. What are the barriers to access services?
    what_are_the_barriers_to_access_services: undefined | Option<'what_are_the_barriers_to_access_services'>[]
    // group_violence_coercion_n_deprivation/please_specifywhat_are_the_barriers_to_access_services [text] 8.7.2.1.1. Please specify
    please_specifywhat_are_the_barriers_to_access_services: string | undefined
    // group_violence_coercion_n_deprivation/what_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members [select_multiple] 8.9. What do you think/feel are the major stress factors for you and your household members?
    what_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members:
      | undefined
      | Option<'what_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members'>[]
    // group_violence_coercion_n_deprivation/please_specifywhat_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members [text] 8.9.1. Please specify
    please_specifywhat_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members:
      | string
      | undefined
    // group_coping_strategies/what_are_the_main_sources_of_income_of_your_household [select_multiple] 9.1. What are the main resources coming into the household?
    what_are_the_main_sources_of_income_of_your_household:
      | undefined
      | Option<'what_are_the_main_sources_of_income_of_your_household'>[]
    // group_coping_strategies/please_specifywhat_are_the_main_sources_of_income_of_your_household [text] 9.1.1. Please specify
    please_specifywhat_are_the_main_sources_of_income_of_your_household: string | undefined
    // group_coping_strategies/what_type_of_allowances_do_you_receive [select_multiple] 9.1.2. What type of social protection do you receive?
    what_type_of_allowances_do_you_receive: undefined | Option<'what_type_of_allowances_do_you_receive'>[]
    // group_coping_strategies/please_specifywhat_type_of_allowances_do_you_receive [text] 9.1.2.1. Please specify
    please_specifywhat_type_of_allowances_do_you_receive: string | undefined
    // group_coping_strategies/what_is_the_average_month_income_per_household [select_one] 9.2. What is the average monthly income of your household?
    what_is_the_average_month_income_per_household: undefined | Option<'what_is_the_average_month_income_per_household'>
    // group_coping_strategies/including_yourself_are_there_members_of_your_household_who_are_out_of_work_and_seeking_employment [select_one] 9.3. Including yourself, are there members of your household who are out of work and seeking employment?
    including_yourself_are_there_members_of_your_household_who_are_out_of_work_and_seeking_employment:
      | undefined
      | Option<'including_yourself_are_there_members_of_your_household_who_are_out_of_work_and_seeking_employment'>
    // group_coping_strategies/what_are_the_reasons_for_being_out_of_work [select_multiple] 9.3.1. What are the reasons for being out of work?
    what_are_the_reasons_for_being_out_of_work: undefined | Option<'what_are_the_reasons_for_being_out_of_work'>[]
    // group_coping_strategies/please_specifywhat_are_the_reasons_for_being_out_of_work [text] 9.3.1.1. Please specify
    please_specifywhat_are_the_reasons_for_being_out_of_work: string | undefined
    // group_coping_strategies/are_there_gaps_in_meeting_your_basic_needs [select_one] 9.4. Are there gaps in meeting your basic needs?
    are_there_gaps_in_meeting_your_basic_needs: undefined | Option<'are_there_gaps_in_meeting_your_basic_needs'>
    // group_coping_strategies/what_are_the_strategies_that_your_household_uses_to_cope_with_these_challenges [select_multiple] 9.4.1. What are the strategies that your household uses to cope with these challenges?
    what_are_the_strategies_that_your_household_uses_to_cope_with_these_challenges:
      | undefined
      | Option<'what_are_the_strategies_that_your_household_uses_to_cope_with_these_challenges'>[]
    // group_coping_strategies/please_specifywhat_are_the_strategies_that_your_household_uses_to_cope_with_these_challenges [text] 9.4.1.1. Please specify
    please_specifywhat_are_the_strategies_that_your_household_uses_to_cope_with_these_challenges: string | undefined
    // group_access_to_education/are_schoolaged_children_in_your_household_regularly_attending_primary_or_secondary_education [select_one] 10.1. Are school-aged children (aged 6 to 15) in your household regularly attending primary or secondary education?
    are_schoolaged_children_in_your_household_regularly_attending_primary_or_secondary_education:
      | undefined
      | Option<'are_schoolaged_children_in_your_household_regularly_attending_primary_or_secondary_education'>
    // group_access_to_education/is_it [select_one] 10.1.1. Is it:
    is_it: undefined | Option<'is_it'>
    // group_access_to_education/what_are_the_reasons_preventing_children_in_your_household_from_regularly_attending_education_services [select_multiple] 10.1.2. What are the reasons preventing children in your household from regularly attending education services?
    what_are_the_reasons_preventing_children_in_your_household_from_regularly_attending_education_services:
      | undefined
      | Option<'what_are_the_reasons_preventing_children_in_your_household_from_regularly_attending_education_services'>[]
    // group_access_to_education/please_specifywhat_are_the_reasons_preventing_children_in_your_household_from_regularly_attending_education_services [text] 10.1.2.1. Please specify
    please_specifywhat_are_the_reasons_preventing_children_in_your_household_from_regularly_attending_education_services:
      | string
      | undefined
    // group_housing/what_is_your_current_housing_structure [select_one] 11.1. What is your current accommodation structure ?
    what_is_your_current_housing_structure: undefined | Option<'what_is_your_current_housing_structure'>
    // group_housing/what_is_the_tenure_status_of_your_accommodation_private [select_one] 11.1.1. Do you pay for the use of the accommodation?
    what_is_the_tenure_status_of_your_accommodation_private:
      | undefined
      | Option<'what_is_the_tenure_status_of_your_accommodation_private'>
    // group_housing/please_specifywhat_is_the_tenure_status_of_your_accommodation_private [text] 11.1.1.1. Please specify
    please_specifywhat_is_the_tenure_status_of_your_accommodation_private: string | undefined
    // group_housing/what_is_the_tenure_status_of_your_accommodation_public [select_one] 11.1.2. Do you pay for the use of the accommodation?
    what_is_the_tenure_status_of_your_accommodation_public:
      | undefined
      | Option<'what_is_the_tenure_status_of_your_accommodation_public'>
    // group_housing/please_specifywhat_is_the_tenure_status_of_your_accommodation_public [text] 11.1.2.1. Please specify
    please_specifywhat_is_the_tenure_status_of_your_accommodation_public: string | undefined
    // group_housing/do_you_have_formal_rental_documents_to_stay_in_your_accommodation [select_one] 11.1.1.2. Do you have formal rental documents to stay in your accommodation?
    do_you_have_formal_rental_documents_to_stay_in_your_accommodation:
      | undefined
      | Option<'do_you_have_formal_rental_documents_to_stay_in_your_accommodation'>
    // group_housing/what_is_the_general_condition_of_your_accommodation [select_one] 11.1.3. What is the general condition of your current accommodation?
    what_is_the_general_condition_of_your_accommodation:
      | undefined
      | Option<'what_is_the_general_condition_of_your_accommodation'>
    // group_housing/what_are_your_main_concerns_regarding_your_accommodation [select_multiple] 11.1.4. What are your main concerns regarding your current accommodation?
    what_are_your_main_concerns_regarding_your_accommodation:
      | undefined
      | Option<'what_are_your_main_concerns_regarding_your_accommodation'>[]
    // group_access_to_health/do_you_have_access_to_health_care_in_your_current_location [select_one] 12.1. Do you have access to health care in your current location?
    do_you_have_access_to_health_care_in_your_current_location:
      | undefined
      | Option<'do_you_have_access_to_health_care_in_your_current_location'>
    // group_access_to_health/what_are_the_barriers_to_accessing_health_services [select_multiple] 12.1.1. What are the barriers to accessing health services?
    what_are_the_barriers_to_accessing_health_services:
      | undefined
      | Option<'what_are_the_barriers_to_accessing_health_services'>[]
    // group_access_to_health/please_specifywhat_are_the_barriers_to_accessing_health_services [text] 12.1.1.1. Please specify
    please_specifywhat_are_the_barriers_to_accessing_health_services: string | undefined
    // group_sec_priority_needs/what_is_your_1_priority [select_one] 13.1. What is your 1st priority?
    what_is_your_1_priority: undefined | Option<'what_is_your_1_priority'>
    // group_sec_priority_needs/please_specifywhat_is_your_1_priority [text] 13.1.1. Please specify
    please_specifywhat_is_your_1_priority: string | undefined
    // group_sec_priority_needs/what_is_your_2_priority [select_one] 13.1.2. What is your 2nd priority?
    what_is_your_2_priority: undefined | Option<'what_is_your_2_priority'>
    // group_sec_priority_needs/please_specifywhat_is_your_2_priority [text] 13.1.2.1. Please specify
    please_specifywhat_is_your_2_priority: string | undefined
    // group_sec_priority_needs/what_is_your_3_priority [select_one] 13.1.2.2. What is your 3rd priority?
    what_is_your_3_priority: undefined | Option<'what_is_your_3_priority'>
    // group_sec_priority_needs/please_specifywhat_is_your_3_priority [text] 13.1.2.2.1. Please specify
    please_specifywhat_is_your_3_priority: string | undefined
    // group_sec_priority_needs/thanks [note] <span style="font-size:1.2em">   13.2. Thank you for your time !</span>
    thanks: string
    // group_sec_additional_information/additional_information_shared_by_respondent [text] 14.1. Additional information shared by respondent
    additional_information_shared_by_respondent: string | undefined
    // group_sec_additional_information/comments_observations_of_the_protection_monitor [text] 14.2. Comments/observations of the protection monitor
    comments_observations_of_the_protection_monitor: string | undefined
    // group_sec_followup/need_for_assistance [select_one] 15.1. Need for assistance?
    need_for_assistance: undefined | Option<'need_for_assistance'>
  }

  export const options = {
    staff_to_insert_their_DRC_office: {
      chernihiv: `Chernihiv`,
      dnipro: `Dnipro`,
      kharkiv: `Kharkiv`,
      lviv: `Lviv`,
      mykolaiv: `Mykolaiv`,
      sumy: `Sumy`,
    },
    staff_code: {
      CEJ001: `CEJ001`,
      CEJ002: `CEJ002`,
      CEJ003: `CEJ003`,
      CEJ004: `CEJ004`,
      CEJ005: `CEJ005`,
      CEJ006: `CEJ006`,
      CEJ007: `CEJ007`,
      CEJ008: `CEJ008`,
      CEJ009: `CEJ009`,
      CEJ010: `CEJ010`,
      CEJ011: `CEJ011`,
      CEJ012: `CEJ012`,
      CEJ013: `CEJ013`,
      CEJ014: `CEJ014`,
      CEJ015: `CEJ015`,
      UMY001: `UMY001`,
      UMY002: `UMY002`,
      UMY003: `UMY003`,
      UMY004: `UMY004`,
      UMY005: `UMY005`,
      UMY006: `UMY006`,
      UMY007: `UMY007`,
      UMY008: `UMY008`,
      UMY009: `UMY009`,
      UMY010: `UMY010`,
      UMY011: `UMY011`,
      UMY012: `UMY012`,
      UMY013: `UMY013`,
      UMY014: `UMY014`,
      UMY015: `UMY015`,
      HRK001: `HRK001`,
      HRK002: `HRK002`,
      HRK003: `HRK003`,
      HRK004: `HRK004`,
      HRK005: `HRK005`,
      HRK006: `HRK006`,
      HRK007: `HRK007`,
      HRK008: `HRK008`,
      HRK009: `HRK009`,
      HRK010: `HRK010`,
      HRK011: `HRK011`,
      HRK012: `HRK012`,
      HRK013: `HRK013`,
      HRK014: `HRK014`,
      HRK015: `HRK015`,
      DNK001: `DNK001`,
      DNK002: `DNK002`,
      DNK003: `DNK003`,
      DNK004: `DNK004`,
      DNK005: `DNK005`,
      DNK006: `DNK006`,
      DNK007: `DNK007`,
      DNK008: `DNK008`,
      DNK009: `DNK009`,
      DNK010: `DNK010`,
      DNK011: `DNK011`,
      DNK012: `DNK012`,
      DNK013: `DNK013`,
      DNK014: `DNK014`,
      DNK015: `DNK015`,
      LWO001: `LWO001`,
      LWO002: `LWO002`,
      LWO003: `LWO003`,
      LWO004: `LWO004`,
      LWO005: `LWO005`,
      LWO006: `LWO006`,
      LWO007: `LWO007`,
      LWO008: `LWO008`,
      LWO009: `LWO009`,
      LWO010: `LWO010`,
      LWO011: `LWO011`,
      LWO012: `LWO012`,
      LWO013: `LWO013`,
      LWO014: `LWO014`,
      LWO015: `LWO015`,
      NVL001: `NVL001`,
      NVL002: `NVL002`,
      NVL003: `NVL003`,
      NVL004: `NVL004`,
      NVL005: `NVL005`,
      NVL006: `NVL006`,
      NVL007: `NVL007`,
      NVL008: `NVL008`,
      NVL009: `NVL009`,
      NVL010: `NVL010`,
      NVL011: `NVL011`,
      NVL012: `NVL012`,
      NVL013: `NVL013`,
      NVL014: `NVL014`,
      NVL015: `NVL015`,
    },
    type_of_site: {
      urban_area: `Urban area`,
      rural_area: `Rural area`,
    },
    present_yourself: {
      yes: `Yes`,
      no: `No`,
    },
    have_you_filled_out_this_form_before: {
      yes: `Yes`,
      no: `No`,
    },
    what_is_your_area_of_origin_oblast: {
      UA01: `Autonomous Republic of Crimea`,
      UA71: `Cherkaska`,
      UA74: `Chernihivska`,
      UA73: `Chernivetska`,
      UA12: `Dnipropetrovska`,
      UA14: `Donetska`,
      UA26: `Ivano-Frankivska`,
      UA63: `Kharkivska`,
      UA65: `Khersonska`,
      UA68: `Khmelnytska`,
      UA35: `Kirovohradska`,
      UA80: `Kyiv`,
      UA32: `Kyivska`,
      UA44: `Luhanska`,
      UA46: `Lvivska`,
      UA48: `Mykolaivska`,
      UA51: `Odeska`,
      UA53: `Poltavska`,
      UA56: `Rivnenska`,
      UA85: `Sevastopol`,
      UA59: `Sumska`,
      UA61: `Ternopilska`,
      UA05: `Vinnytska`,
      UA07: `Volynska`,
      UA21: `Zakarpatska`,
      UA23: `Zaporizka`,
      UA18: `Zhytomyrska`,
    },
    what_is_your_area_of_origin_raion: {
      UA0102: `Bakhchysaraiskyi`,
      UA0104: `Bilohirskyi`,
      UA0106: `Dzhankoiskyi`,
      UA0118: `Feodosiiskyi`,
      UA0110: `Kerchynskyi`,
      UA0112: `Krasnohvardiiskyi`,
      UA0114: `Krasnoperekopskyi`,
      UA0116: `Simferopolskyi`,
      UA0120: `Yaltynskyi`,
      UA0108: `Yevpatoriiskyi`,
      UA7108: `Cherkaskyi`,
      UA7106: `Umanskyi`,
      UA7104: `Zolotoniskyi`,
      UA7102: `Zvenyhorodskyi`,
      UA7410: `Chernihivskyi`,
      UA7402: `Koriukivskyi`,
      UA7404: `Nizhynskyi`,
      UA7406: `Novhorod-Siverskyi`,
      UA7408: `Prylutskyi`,
      UA7306: `Chernivetskyi`,
      UA7304: `Dnistrovskyi`,
      UA7302: `Vyzhnytskyi`,
      UA1202: `Dniprovskyi`,
      UA1204: `Kamianskyi`,
      UA1206: `Kryvorizkyi`,
      UA1208: `Nikopolskyi`,
      UA1210: `Novomoskovskyi`,
      UA1212: `Pavlohradskyi`,
      UA1214: `Synelnykivskyi`,
      UA1402: `Bakhmutskyi`,
      UA1408: `Donetskyi`,
      UA1406: `Horlivskyi`,
      UA1410: `Kalmiuskyi`,
      UA1412: `Kramatorskyi`,
      UA1414: `Mariupolskyi`,
      UA1416: `Pokrovskyi`,
      UA1404: `Volnovaskyi`,
      UA2604: `Ivano-Frankivskyi`,
      UA2606: `Kaluskyi`,
      UA2608: `Kolomyiskyi`,
      UA2610: `Kosivskyi`,
      UA2612: `Nadvirnianskyi`,
      UA2602: `Verkhovynskyi`,
      UA6302: `Bohodukhivskyi`,
      UA6314: `Chuhuivskyi`,
      UA6304: `Iziumskyi`,
      UA6312: `Kharkivskyi`,
      UA6306: `Krasnohradskyi`,
      UA6308: `Kupianskyi`,
      UA6310: `Lozivskyi`,
      UA6502: `Beryslavskyi`,
      UA6504: `Henicheskyi`,
      UA6506: `Kakhovskyi`,
      UA6510: `Khersonskyi`,
      UA6508: `Skadovskyi`,
      UA6802: `Kamianets-Podilskyi`,
      UA6804: `Khmelnytskyi`,
      UA6806: `Shepetivskyi`,
      UA3502: `Holovanivskyi`,
      UA3504: `Kropyvnytskyi`,
      UA3506: `Novoukrainskyi`,
      UA3508: `Oleksandriiskyi`,
      UA8000: `Kyiv`,
      UA3202: `Bilotserkivskyi`,
      UA3204: `Boryspilskyi`,
      UA3206: `Brovarskyi`,
      UA3208: `Buchanskyi`,
      UA3200: `Chornobyl Exclusion Zone`,
      UA3214: `Fastivskyi`,
      UA3212: `Obukhivskyi`,
      UA3210: `Vyshhorodskyi`,
      UA4402: `Alchevskyi`,
      UA4404: `Dovzhanskyi`,
      UA4406: `Luhanskyi`,
      UA4408: `Rovenkivskyi`,
      UA4416: `Shchastynskyi`,
      UA4412: `Sievierodonetskyi`,
      UA4414: `Starobilskyi`,
      UA4410: `Svativskyi`,
      UA4612: `Chervonohradskyi`,
      UA4602: `Drohobytskyi`,
      UA4606: `Lvivskyi`,
      UA4608: `Sambirskyi`,
      UA4610: `Stryiskyi`,
      UA4614: `Yavorivskyi`,
      UA4604: `Zolochivskyi`,
      UA4802: `Bashtanskyi`,
      UA4806: `Mykolaivskyi`,
      UA4808: `Pervomaiskyi`,
      UA4804: `Voznesenskyi`,
      UA5102: `Berezivskyi`,
      UA5104: `Bilhorod-Dnistrovskyi`,
      UA5106: `Bolhradskyi`,
      UA5108: `Izmailskyi`,
      UA5110: `Odeskyi`,
      UA5112: `Podilskyi`,
      UA5114: `Rozdilnianskyi`,
      UA5302: `Kremenchutskyi`,
      UA5304: `Lubenskyi`,
      UA5306: `Myrhorodskyi`,
      UA5308: `Poltavskyi`,
      UA5604: `Dubenskyi`,
      UA5606: `Rivnenskyi`,
      UA5608: `Sarnenskyi`,
      UA5602: `Varaskyi`,
      UA8500: `Sevastopol`,
      UA5902: `Konotopskyi`,
      UA5904: `Okhtyrskyi`,
      UA5906: `Romenskyi`,
      UA5910: `Shostkynskyi`,
      UA5908: `Sumskyi`,
      UA6106: `Chortkivskyi`,
      UA6102: `Kremenetskyi`,
      UA6104: `Ternopilskyi`,
      UA0504: `Haisynskyi`,
      UA0512: `Khmilnytskyi`,
      UA0508: `Mohyliv-Podilskyi`,
      UA0510: `Tulchynskyi`,
      UA0502: `Vinnytskyi`,
      UA0506: `Zhmerynskyi`,
      UA0704: `Kamin-Kashyrskyi`,
      UA0706: `Kovelskyi`,
      UA0708: `Lutskyi`,
      UA0702: `Volodymyrskyi`,
      UA2102: `Berehivskyi`,
      UA2112: `Khustskyi`,
      UA2104: `Mukachivskyi`,
      UA2106: `Rakhivskyi`,
      UA2108: `Tiachivskyi`,
      UA2110: `Uzhhorodskyi`,
      UA2302: `Berdianskyi`,
      UA2308: `Melitopolskyi`,
      UA2310: `Polohivskyi`,
      UA2304: `Vasylivskyi`,
      UA2306: `Zaporizkyi`,
      UA1802: `Berdychivskyi`,
      UA1806: `Korostenskyi`,
      UA1804: `Zhytomyrskyi`,
      UA1808: `Zviahelskyi`,
    },
    what_is_your_area_of_origin_hromada: {
      UA0102003: `Aromatnenska`,
      UA0102005: `Bakhchysaraiska`,
      UA0102015: `Dolynnenska`,
      UA0102013: `Holubynska`,
      UA0102025: `Kashtanivska`,
      UA0102027: `Krasnomatska`,
      UA0102029: `Kuibyshevska`,
      UA0102033: `Pishchanivska`,
      UA0102035: `Plodivska`,
      UA0102037: `Poshtivska`,
      UA0102039: `Skalystivska`,
      UA0102041: `Tabachnenska`,
      UA0102045: `Tinystivska`,
      UA0102047: `Uhlivska`,
      UA0102009: `Verkhorichenska`,
      UA0102011: `Vilinska`,
      UA0102017: `Zaliznychnenska`,
      UA0102019: `Zelenivska`,
      UA0104001: `Aromatnivska`,
      UA0104003: `Bahativska`,
      UA0104005: `Bilohirska`,
      UA0104071: `Chkalovska`,
      UA0104073: `Chornopilska`,
      UA0104011: `Drofynska`,
      UA0104027: `Ivanivska`,
      UA0104029: `Izobilnenska`,
      UA0104031: `Kistochkivska`,
      UA0104033: `Krymskorozivska`,
      UA0104035: `Krynychnenska`,
      UA0104037: `Kurska`,
      UA0104039: `Lystvynska`,
      UA0104041: `Melnychna`,
      UA0104047: `Michurinska`,
      UA0104049: `Muromska`,
      UA0104045: `Mykhailivska`,
      UA0104043: `Mytrofanivska`,
      UA0104053: `Novohryhorivska`,
      UA0104055: `Novozhylivska`,
      UA0104051: `Nyzhnohirska`,
      UA0104059: `Okhotska`,
      UA0104057: `Omelianivska`,
      UA0104061: `Pshenychnenska`,
      UA0104063: `Rusakivska`,
      UA0104065: `Sadova`,
      UA0104069: `Tsvitochnenska`,
      UA0104067: `Uvarivska`,
      UA0104007: `Vasylivska`,
      UA0104009: `Vyshenska`,
      UA0104075: `Yakymivska`,
      UA0104017: `Zelenohirska`,
      UA0104019: `Zemlianychnenska`,
      UA0104013: `Zheliabovska`,
      UA0104015: `Zhemchuzhynska`,
      UA0104023: `Zorkinska`,
      UA0104025: `Zuiska`,
      UA0104021: `Zybynska`,
      UA0106001: `Azovska`,
      UA0106051: `Chaikynska`,
      UA0106005: `Dzhankoiska`,
      UA0106013: `Izumrudnivska`,
      UA0106015: `Kindrativska`,
      UA0106017: `Krymkivska`,
      UA0106019: `Lobanivska`,
      UA0106021: `Luhanska`,
      UA0106023: `Maiska`,
      UA0106025: `Maslivska`,
      UA0106027: `Medvedivska`,
      UA0106029: `Myrnivska`,
      UA0106031: `Novokrymska`,
      UA0106033: `Pakharivska`,
      UA0106035: `Pobiednenska`,
      UA0106037: `Prostornenska`,
      UA0106041: `Roshchynska`,
      UA0106039: `Rozkishnenska`,
      UA0106045: `Stalnenska`,
      UA0106043: `Svitlivska`,
      UA0106047: `Tabachnenska`,
      UA0106049: `Tsilynna`,
      UA0106003: `Vilnenska`,
      UA0106053: `Yarkivska`,
      UA0106055: `Yarkopolenska`,
      UA0106057: `Yasnopolianska`,
      UA0106007: `Yermakivska`,
      UA0106011: `Zarichnenska`,
      UA0106009: `Zavito-Leninska`,
      UA0118001: `Abrykosivska`,
      UA0118003: `Berehova`,
      UA0118073: `Chapaievska`,
      UA0118075: `Chornozemnenska`,
      UA0118011: `Dachnivska`,
      UA0118013: `Dmytrivska`,
      UA0118071: `Feodosiiska`,
      UA0118009: `Hrushivska`,
      UA0118021: `Illichivska`,
      UA0118023: `Kirovska`,
      UA0118025: `Koktebelska`,
      UA0118029: `Krasnoflotska`,
      UA0118027: `Krasnohvardiiska`,
      UA0118031: `Lhovska`,
      UA0118033: `Mizhrichenska`,
      UA0118035: `Morska`,
      UA0118037: `Nasypnivska`,
      UA0118039: `Nekrasovska`,
      UA0118041: `Novosvitska`,
      UA0118043: `Ordzhonikidzevska`,
      UA0118045: `Partyzanska`,
      UA0118047: `Pervomaiska`,
      UA0118053: `Prudivska`,
      UA0118051: `Prymorska`,
      UA0118049: `Pryvitnenska`,
      UA0118055: `Pushkinska`,
      UA0118077: `Shchebetovska`,
      UA0118061: `Soniachnodolynska`,
      UA0118059: `Sovietska`,
      UA0118063: `Starokrymska`,
      UA0118065: `Sudatska`,
      UA0118057: `Synytsynska`,
      UA0118067: `Tokarievska`,
      UA0118069: `Urozhainivska`,
      UA0118005: `Veselivska`,
      UA0118007: `Vladyslavivska`,
      UA0118079: `Yarkopolenska`,
      UA0118017: `Zavitnenska`,
      UA0118015: `Zhuravska`,
      UA0118019: `Zolotopolenska`,
      UA0110001: `Baherivska`,
      UA0110003: `Batalnenska`,
      UA0110005: `Bielinska`,
      UA0110051: `Cheliadinivska`,
      UA0110053: `Chystopilska`,
      UA0110011: `Hlazivska`,
      UA0110013: `Hornostaivska`,
      UA0110017: `Illichivska`,
      UA0110019: `Kalynivska`,
      UA0110021: `Kerchenska`,
      UA0110023: `Kirovska`,
      UA0110025: `Krasnohirska`,
      UA0110027: `Leninska`,
      UA0110029: `Leninska`,
      UA0110031: `Luhivska`,
      UA0110035: `Marfivska`,
      UA0110033: `Marivska`,
      UA0110037: `Mysivska`,
      UA0110039: `Novomykolaivska`,
      UA0110041: `Oktiabrska`,
      UA0110043: `Ostaninska`,
      UA0110045: `Pryozernivska`,
      UA0110047: `Semysotska`,
      UA0110055: `Shcholkinska`,
      UA0110049: `Uvarivska`,
      UA0110009: `Voikovska`,
      UA0110007: `Vynohradnenska`,
      UA0110015: `Zavitnenska`,
      UA0112001: `Abrykosivska`,
      UA0112003: `Amurska`,
      UA0112071: `Chernovska`,
      UA0112011: `Hryshynska`,
      UA0112009: `Hvardiiska`,
      UA0112015: `Kalininska`,
      UA0112017: `Kalininska`,
      UA0112019: `Klepyninska`,
      UA0112021: `Kolodiazianska`,
      UA0112023: `Kormivska`,
      UA0112025: `Kotelnykivska`,
      UA0112027: `Krasnohvardiiska`,
      UA0112029: `Krasnoznamianska`,
      UA0112031: `Krestianivska`,
      UA0112033: `Leninska`,
      UA0112035: `Marianivska`,
      UA0112037: `Naidonivska`,
      UA0112039: `Novopokrovska`,
      UA0112041: `Oktiabrska`,
      UA0112043: `Oktiabrska`,
      UA0112045: `Oleksandrivska`,
      UA0112047: `Oleksiivska`,
      UA0112049: `Ostrovska`,
      UA0112053: `Pervomaiska`,
      UA0112055: `Petrivska`,
      UA0112051: `Piatykhatska`,
      UA0112057: `Poltavska`,
      UA0112059: `Pravdivska`,
      UA0112061: `Rivnivska`,
      UA0112063: `Sarybashivska`,
      UA0112065: `Stakhanovska`,
      UA0112067: `Stepnivska`,
      UA0112069: `Susaninska`,
      UA0112005: `Voikovska`,
      UA0112007: `Voskhodnenska`,
      UA0112073: `Yantarnenska`,
      UA0112013: `Zernivska`,
      UA0114001: `Armianska`,
      UA0114003: `Berezivska`,
      UA0114005: `Botanichna`,
      UA0114007: `Bratska`,
      UA0114053: `Chernyshivska`,
      UA0114051: `Filativska`,
      UA0114015: `Illinska`,
      UA0114017: `Ishunska`,
      UA0114019: `Kovylnivska`,
      UA0114021: `Krasnoarmiiska`,
      UA0114023: `Krasnoperekopska`,
      UA0114025: `Kukushkinska`,
      UA0114027: `Mahazynska`,
      UA0114029: `Novopavlivska`,
      UA0114031: `Novoselivska`,
      UA0114033: `Orlivska`,
      UA0114035: `Pochetnenska`,
      UA0114037: `Rozdolnenska`,
      UA0114039: `Ruchivska`,
      UA0114041: `Serebrianska`,
      UA0114043: `Slavnivska`,
      UA0114045: `Slovianska`,
      UA0114047: `Sovkhoznenska`,
      UA0114049: `Suvorovska`,
      UA0114011: `Voinska`,
      UA0114009: `Vyshnivska`,
      UA0114013: `Zymynska`,
      UA0116043: `Chystenska`,
      UA0116005: `Dobrivska`,
      UA0116007: `Donska`,
      UA0116003: `Hresivska`,
      UA0116001: `Hvardiiska`,
      UA0116011: `Kolchuhynska`,
      UA0116013: `Mazanska`,
      UA0116019: `Molodizhnenska`,
      UA0116015: `Mykolaivska`,
      UA0116017: `Myrnivska`,
      UA0116021: `Novoandriivska`,
      UA0116023: `Novoselivska`,
      UA0116027: `Perovska`,
      UA0116025: `Pervomaiska`,
      UA0116029: `Pozharska`,
      UA0116031: `Rodnykivska`,
      UA0116047: `Shkilnenska`,
      UA0116045: `Shyrokivska`,
      UA0116033: `Simferopolska`,
      UA0116035: `Skvortsivska`,
      UA0116037: `Trudivska`,
      UA0116039: `Ukromnivska`,
      UA0116041: `Urozhainivska`,
      UA0116009: `Zhuravlivska`,
      UA0120001: `Alupkynska`,
      UA0120003: `Alushtynska`,
      UA0120029: `Foroska`,
      UA0120005: `Hasprynska`,
      UA0120007: `Hurzufska`,
      UA0120009: `Izobilnenska`,
      UA0120011: `Koreizka`,
      UA0120013: `Livadiiska`,
      UA0120015: `Luchystivska`,
      UA0120017: `Malomaiatska`,
      UA0120019: `Malorichenska`,
      UA0120021: `Masandrivska`,
      UA0120023: `Partenitska`,
      UA0120025: `Pryvitnenska`,
      UA0120027: `Simeizka`,
      UA0120031: `Yaltynska`,
      UA0108077: `Chornomorska`,
      UA0108011: `Dalekivska`,
      UA0108013: `Dobrushynska`,
      UA0108075: `Frunzenska`,
      UA0108009: `Heroiska`,
      UA0108021: `Ivanivska`,
      UA0108023: `Kirovska`,
      UA0108025: `Koltsovska`,
      UA0108027: `Krainenska`,
      UA0108031: `Krasnoiarska`,
      UA0108029: `Krasnopolianska`,
      UA0108033: `Krymska`,
      UA0108035: `Lisnivska`,
      UA0108037: `Medvedivska`,
      UA0108043: `Mizhvodnenska`,
      UA0108045: `Molochnenska`,
      UA0108039: `Myrnivska`,
      UA0108041: `Mytiaivska`,
      UA0108053: `Novofedorivska`,
      UA0108047: `Novoivanivska`,
      UA0108049: `Novoozernivska`,
      UA0108051: `Novosilska`,
      UA0108061: `Okhotnykivska`,
      UA0108055: `Okunivska`,
      UA0108057: `Olenivska`,
      UA0108059: `Orikhivska`,
      UA0108063: `Romashkinska`,
      UA0108065: `Sakska`,
      UA0108079: `Shtormivska`,
      UA0108069: `Stovpivska`,
      UA0108071: `Suvorovska`,
      UA0108067: `Syzivska`,
      UA0108073: `Uiutnenska`,
      UA0108001: `Veresaievska`,
      UA0108003: `Veselivska`,
      UA0108007: `Vorobiovska`,
      UA0108005: `Vynohradivska`,
      UA0108015: `Yevpatoriiska`,
      UA0108017: `Zaozernenska`,
      UA0108019: `Zernivska`,
      UA7108001: `Balakleivska`,
      UA7108003: `Berezniakivska`,
      UA7108005: `Bilozirska`,
      UA7108007: `Bobrytska`,
      UA7108009: `Budyshchenska`,
      UA7108049: `Cherkaska`,
      UA7108047: `Chervonoslobidska`,
      UA7108051: `Chyhyrynska`,
      UA7108011: `Horodyshchenska`,
      UA7108013: `Kamianska`,
      UA7108015: `Kanivska`,
      UA7108017: `Korsun-Shevchenkivska`,
      UA7108019: `Leskivska`,
      UA7108021: `Lipliavska`,
      UA7108023: `Medvedivska`,
      UA7108027: `Mliivska`,
      UA7108029: `Moshnivska`,
      UA7108025: `Mykhailivska`,
      UA7108031: `Nabutivska`,
      UA7108033: `Rotmistrivska`,
      UA7108035: `Ruskopolianska`,
      UA7108037: `Sahunivska`,
      UA7108039: `Smilianska`,
      UA7108041: `Stepanetska`,
      UA7108043: `Stepankivska`,
      UA7108045: `Ternivska`,
      UA7106001: `Babanska`,
      UA7106003: `Bashtechkivska`,
      UA7106005: `Butska`,
      UA7106007: `Dmytrushkivska`,
      UA7106011: `Ivankivska`,
      UA7106023: `Khrystynivska`,
      UA7106013: `Ladyzhynska`,
      UA7106015: `Mankivska`,
      UA7106017: `Monastyryshchenska`,
      UA7106019: `Palanska`,
      UA7106021: `Umanska`,
      UA7106009: `Zhashkivska`,
      UA7104019: `Chornobaivska`,
      UA7104007: `Drabivska`,
      UA7104005: `Helmiazivska`,
      UA7104013: `Irkliivska`,
      UA7104015: `Novodmytrivska`,
      UA7104017: `Pishchanska`,
      UA7104021: `Shramkivska`,
      UA7104001: `Velykokhutirska`,
      UA7104003: `Voznesenska`,
      UA7104009: `Zolotoniska`,
      UA7104011: `Zorivska`,
      UA7102001: `Buzhanska`,
      UA7102015: `Katerynopilska`,
      UA7102017: `Lypianska`,
      UA7102019: `Lysianska`,
      UA7102021: `Matusivska`,
      UA7102023: `Mokrokalyhirska`,
      UA7102025: `Selyshchenska`,
      UA7102031: `Shevchenkivska`,
      UA7102033: `Shpolianska`,
      UA7102027: `Steblivska`,
      UA7102029: `Talnivska`,
      UA7102003: `Vatutinska`,
      UA7102007: `Vilshanska`,
      UA7102009: `Vodianytska`,
      UA7102005: `Vynohradska`,
      UA7102011: `Yerkivska`,
      UA7102013: `Zvenyhorodska`,
      UA7410001: `Bereznianska`,
      UA7410039: `Chernihivska`,
      UA7410007: `Desnianska`,
      UA7410009: `Dobrianska`,
      UA7410003: `Honcharivska`,
      UA7410005: `Horodnianska`,
      UA7410011: `Ivanivska`,
      UA7410017: `Kiptivska`,
      UA7410019: `Kozeletska`,
      UA7410021: `Kulykivska`,
      UA7410013: `Kyinska`,
      UA7410015: `Kyselivska`,
      UA7410023: `Liubetska`,
      UA7410025: `Mykhailo-Kotsiubynska`,
      UA7410027: `Novobilouska`,
      UA7410029: `Olyshivska`,
      UA7410031: `Osterska`,
      UA7410033: `Ripkynska`,
      UA7410035: `Sednivska`,
      UA7410037: `Tupychivska`,
      UA7402009: `Kholmynska`,
      UA7402001: `Koriukivska`,
      UA7402003: `Menska`,
      UA7402005: `Snovska`,
      UA7402007: `Sosnytska`,
      UA7404003: `Bakhmatska`,
      UA7404001: `Baturynska`,
      UA7404005: `Bobrovytska`,
      UA7404007: `Borznianska`,
      UA7404013: `Dmytrivska`,
      UA7404015: `Komarivska`,
      UA7404017: `Krutivska`,
      UA7404019: `Losynivska`,
      UA7404021: `Makiivska`,
      UA7404023: `Mrynska`,
      UA7404025: `Nizhynska`,
      UA7404029: `Nosivska`,
      UA7404027: `Novobasanska`,
      UA7404031: `Plyskivska`,
      UA7404033: `Talalaivska`,
      UA7404009: `Vertiivska`,
      UA7404011: `Vysochanska`,
      UA7406001: `Koropska`,
      UA7406003: `Novhorod-Siverska`,
      UA7406005: `Ponornytska`,
      UA7406007: `Semenivska`,
      UA7408003: `Ichnianska`,
      UA7408005: `Ladanska`,
      UA7408007: `Lynovytska`,
      UA7408009: `Malodivytska`,
      UA7408011: `Parafiivska`,
      UA7408013: `Prylutska`,
      UA7408015: `Sribnianska`,
      UA7408017: `Sukhopolovianska`,
      UA7408019: `Talalaivska`,
      UA7408001: `Varvynska`,
      UA7408021: `Yablunivska`,
      UA7306001: `Boianska`,
      UA7306059: `Chahorska`,
      UA7306061: `Chernivetska`,
      UA7306063: `Chudeiska`,
      UA7306013: `Hertsaivska`,
      UA7306015: `Hlybotska`,
      UA7306017: `Horishnosherovetska`,
      UA7306021: `Kadubovetska`,
      UA7306023: `Kamianetska`,
      UA7306025: `Kamianska`,
      UA7306027: `Karapchivska`,
      UA7306029: `Kitsmanska`,
      UA7306031: `Kostryzhivska`,
      UA7306033: `Krasnoilska`,
      UA7306035: `Mahalska`,
      UA7306037: `Mamaivska`,
      UA7306039: `Nepolokovetska`,
      UA7306041: `Novoselytska`,
      UA7306043: `Ostrytska`,
      UA7306045: `Petrovetska`,
      UA7306047: `Stavchanska`,
      UA7306049: `Storozhynetska`,
      UA7306051: `Suchevenska`,
      UA7306053: `Tarashanska`,
      UA7306055: `Tereblechenska`,
      UA7306057: `Toporivska`,
      UA7306003: `Vanchykovetska`,
      UA7306005: `Velykokuchurivska`,
      UA7306007: `Verenchanska`,
      UA7306009: `Viknianska`,
      UA7306011: `Volokivska`,
      UA7306065: `Yurkovetska`,
      UA7306019: `Zastavnivska`,
      UA7304003: `Kelmenetska`,
      UA7304019: `Khotynska`,
      UA7304005: `Klishkovetska`,
      UA7304007: `Livynetska`,
      UA7304009: `Mamalyhivska`,
      UA7304011: `Nedoboivska`,
      UA7304013: `Novodnistrovska`,
      UA7304015: `Rukshynska`,
      UA7304017: `Sokyrianska`,
      UA7304001: `Vashkovetska`,
      UA7302001: `Banylivska`,
      UA7302003: `Berehometska`,
      UA7302005: `Brusnytska`,
      UA7302011: `Koniatynska`,
      UA7302013: `Putylska`,
      UA7302015: `Seliatynska`,
      UA7302017: `Ust-Putylska`,
      UA7302007: `Vashkivetska`,
      UA7302009: `Vyzhnytska`,
      UA1202033: `Chumakivska`,
      UA1202001: `Dniprovska`,
      UA1202003: `Kytaihorodska`,
      UA1202007: `Liashkivska`,
      UA1202005: `Liubymivska`,
      UA1202011: `Mohylivska`,
      UA1202009: `Mykolaivska`,
      UA1202013: `Novooleksandrivska`,
      UA1202015: `Novopokrovska`,
      UA1202017: `Obukhivska`,
      UA1202019: `Petrykivska`,
      UA1202021: `Pidhorodnenska`,
      UA1202025: `Slobozhanska`,
      UA1202027: `Solonianska`,
      UA1202029: `Sursko-Lytovska`,
      UA1202023: `Sviatovasylivska`,
      UA1202031: `Tsarychanska`,
      UA1204001: `Bozhedarivska`,
      UA1204015: `Kamianska`,
      UA1204017: `Krynychanska`,
      UA1204019: `Lykhivska`,
      UA1204021: `Piatykhatska`,
      UA1204023: `Saksahanska`,
      UA1204003: `Verkhivtsivska`,
      UA1204005: `Verkhnodniprovska`,
      UA1204009: `Vilnohirska`,
      UA1204007: `Vyshnivska`,
      UA1204013: `Zatyshnianska`,
      UA1204011: `Zhovtovodska`,
      UA1206001: `Apostolivska`,
      UA1206011: `Devladivska`,
      UA1206005: `Hleiuvatska`,
      UA1206007: `Hrechanopodivska`,
      UA1206009: `Hrushivska`,
      UA1206015: `Karpivska`,
      UA1206017: `Kryvorizka`,
      UA1206019: `Lozuvatska`,
      UA1206023: `Novolativska`,
      UA1206025: `Novopilska`,
      UA1206021: `Nyvotrudivska`,
      UA1206029: `Shyrokivska`,
      UA1206027: `Sofiivska`,
      UA1206003: `Vakulivska`,
      UA1206013: `Zelenodolska`,
      UA1208015: `Chervonohryhorivska`,
      UA1208001: `Marhanetska`,
      UA1208003: `Myrivska`,
      UA1208005: `Nikopolska`,
      UA1208007: `Pershotravnevska`,
      UA1208009: `Pokrovska`,
      UA1208011: `Pokrovska`,
      UA1208013: `Tomakivska`,
      UA1210013: `Cherkaska`,
      UA1210015: `Chernechchynska`,
      UA1210001: `Hubynyska`,
      UA1210003: `Lychkivska`,
      UA1210005: `Mahdalynivska`,
      UA1210007: `Novomoskovska`,
      UA1210009: `Pereshchepynska`,
      UA1210011: `Pishchanska`,
      UA1212001: `Bohdanivska`,
      UA1212005: `Mezhyritska`,
      UA1212007: `Pavlohradska`,
      UA1212009: `Ternivska`,
      UA1212011: `Troitska`,
      UA1212003: `Verbkivska`,
      UA1212013: `Yurivska`,
      UA1214001: `Brahynivska`,
      UA1214007: `Dubovykivska`,
      UA1214011: `Ilarionivska`,
      UA1214013: `Malomykhailivska`,
      UA1214015: `Mezhivska`,
      UA1214017: `Mykolaivska`,
      UA1214019: `Novopavlivska`,
      UA1214021: `Pershotravenska`,
      UA1214023: `Petropavlivska`,
      UA1214025: `Pokrovska`,
      UA1214027: `Raivska`,
      UA1214029: `Rozdorska`,
      UA1214033: `Slavhorodska`,
      UA1214035: `Slovianska`,
      UA1214031: `Synelnykivska`,
      UA1214037: `Ukrainska`,
      UA1214003: `Vasylkivska`,
      UA1214005: `Velykomykhailivska`,
      UA1214009: `Zaitsivska`,
      UA1402001: `Bakhmutska`,
      UA1402013: `Chasovoiarska`,
      UA1402007: `Siverska`,
      UA1402009: `Soledarska`,
      UA1402005: `Svitlodarska`,
      UA1402011: `Toretska`,
      UA1402003: `Zvanivska`,
      UA1408001: `Amvrosiivska`,
      UA1408003: `Donetska`,
      UA1408005: `Ilovaiska`,
      UA1408009: `Khartsyzka`,
      UA1408007: `Makiivska`,
      UA1408011: `Yasynuvatska`,
      UA1406015: `Chystiakivska`,
      UA1406005: `Debaltsivska`,
      UA1406003: `Horlivska`,
      UA1406013: `Khrestivska`,
      UA1406017: `Shakhtarska`,
      UA1406011: `Snizhnianska`,
      UA1406001: `Vuhlehirska`,
      UA1406007: `Yenakiievska`,
      UA1406009: `Zhdanivska`,
      UA1410001: `Boikivska`,
      UA1410003: `Dokuchaievska`,
      UA1410005: `Kalmiuska`,
      UA1410007: `Novoazovska`,
      UA1410009: `Starobeshivska`,
      UA1412001: `Andriivska`,
      UA1412023: `Cherkaska`,
      UA1412003: `Druzhkivska`,
      UA1412005: `Illinivska`,
      UA1412007: `Kostiantynivska`,
      UA1412009: `Kramatorska`,
      UA1412011: `Lymanska`,
      UA1412013: `Mykolaivska`,
      UA1412015: `Novodonetska`,
      UA1412017: `Oleksandrivska`,
      UA1412021: `Slovianska`,
      UA1412019: `Sviatohirska`,
      UA1414001: `Kalchytska`,
      UA1414003: `Manhushska`,
      UA1414005: `Mariupolska`,
      UA1414007: `Nikolska`,
      UA1414009: `Sartanska`,
      UA1416001: `Avdiivska`,
      UA1416003: `Bilozerska`,
      UA1416007: `Dobropilska`,
      UA1416005: `Hrodivska`,
      UA1416009: `Kryvorizka`,
      UA1416011: `Kurakhivska`,
      UA1416013: `Marinska`,
      UA1416015: `Myrnohradska`,
      UA1416017: `Novohrodivska`,
      UA1416019: `Ocheretynska`,
      UA1416021: `Pokrovska`,
      UA1416023: `Selydivska`,
      UA1416027: `Shakhivska`,
      UA1416025: `Udachnenska`,
      UA1404015: `Khlibodarivska`,
      UA1404007: `Komarska`,
      UA1404009: `Myrnenska`,
      UA1404011: `Olhynska`,
      UA1404013: `Staromlynivska`,
      UA1404001: `Velykonovosilkivska`,
      UA1404003: `Volnovaska`,
      UA1404005: `Vuhledarska`,
      UA2604001: `Bilshivtsivska`,
      UA2604003: `Bohorodchanska`,
      UA2604005: `Bukachivska`,
      UA2604007: `Burshtynska`,
      UA2604013: `Dubovetska`,
      UA2604011: `Dzvyniatska`,
      UA2604009: `Halytska`,
      UA2604019: `Ivano-Frankivska`,
      UA2604021: `Lysetska`,
      UA2604023: `Obertynska`,
      UA2604025: `Oleshanska`,
      UA2604027: `Rohatynska`,
      UA2604029: `Solotvynska`,
      UA2604031: `Starobohorodchanska`,
      UA2604035: `Tlumatska`,
      UA2604033: `Tysmenytska`,
      UA2604037: `Uhrynivska`,
      UA2604039: `Yamnytska`,
      UA2604015: `Yezupilska`,
      UA2604017: `Zahvizdianska`,
      UA2606001: `Bolekhivska`,
      UA2606003: `Broshniv-Osadska`,
      UA2606013: `Dolynska`,
      UA2606015: `Dubivska`,
      UA2606017: `Kaluska`,
      UA2606019: `Novytska`,
      UA2606021: `Perehinska`,
      UA2606023: `Rozhniativska`,
      UA2606025: `Spaska`,
      UA2606005: `Verkhnianska`,
      UA2606011: `Voinylivska`,
      UA2606007: `Vyhodska`,
      UA2606009: `Vytvytska`,
      UA2608025: `Chernelytska`,
      UA2608003: `Horodenkivska`,
      UA2608001: `Hvizdetska`,
      UA2608007: `Kolomyiska`,
      UA2608009: `Korshivska`,
      UA2608011: `Mateievetska`,
      UA2608013: `Nyzhnoverbizka`,
      UA2608015: `Otyniiska`,
      UA2608017: `Pechenizhynska`,
      UA2608021: `Piadytska`,
      UA2608019: `Pidhaichykivska`,
      UA2608023: `Sniatynska`,
      UA2608005: `Zabolotivska`,
      UA2610001: `Kosivska`,
      UA2610003: `Kosmatska`,
      UA2610005: `Kutska`,
      UA2610007: `Rozhnivska`,
      UA2610009: `Yablunivska`,
      UA2612003: `Deliatynska`,
      UA2612005: `Lanchynska`,
      UA2612007: `Nadvirnianska`,
      UA2612009: `Pasichnianska`,
      UA2612011: `Pererislianska`,
      UA2612013: `Polianytska`,
      UA2612001: `Vorokhtianska`,
      UA2612015: `Yaremchanska`,
      UA2602001: `Biloberizka`,
      UA2602003: `Verkhovynska`,
      UA2602005: `Zelenska`,
      UA6302001: `Bohodukhivska`,
      UA6302007: `Kolomatska`,
      UA6302009: `Krasnokutska`,
      UA6302003: `Valkivska`,
      UA6302005: `Zolochivska`,
      UA6314015: `Chkalovska`,
      UA6314017: `Chuhuivska`,
      UA6314005: `Malynivska`,
      UA6314007: `Novopokrovska`,
      UA6314009: `Pechenizka`,
      UA6314011: `Slobozhanska`,
      UA6314013: `Starosaltivska`,
      UA6314001: `Vovchanska`,
      UA6314003: `Zmiivska`,
      UA6304001: `Balakliiska`,
      UA6304003: `Barvinkivska`,
      UA6304005: `Borivska`,
      UA6304007: `Donetska`,
      UA6304009: `Iziumska`,
      UA6304011: `Kunievska`,
      UA6304013: `Oskilska`,
      UA6304015: `Savynska`,
      UA6312001: `Bezliudivska`,
      UA6312007: `Derhachivska`,
      UA6312027: `Kharkivska`,
      UA6312011: `Liubotynska`,
      UA6312009: `Lypetska`,
      UA6312013: `Malodanylivska`,
      UA6312015: `Merefianska`,
      UA6312017: `Novovodolazka`,
      UA6312021: `Pisochynska`,
      UA6312019: `Pivdennomiska`,
      UA6312023: `Rohanska`,
      UA6312025: `Solonytsivska`,
      UA6312029: `Tsyrkunivska`,
      UA6312005: `Vilkhivska`,
      UA6312003: `Vysochanska`,
      UA6306003: `Kehychivska`,
      UA6306005: `Krasnohradska`,
      UA6306007: `Natalynska`,
      UA6306009: `Sakhnovshchynska`,
      UA6306011: `Starovirivska`,
      UA6306001: `Zachepylivska`,
      UA6308005: `Dvorichanska`,
      UA6308007: `Kindrashivska`,
      UA6308009: `Kupianska`,
      UA6308011: `Kurylivska`,
      UA6308013: `Petropavlivska`,
      UA6308015: `Shevchenkivska`,
      UA6308001: `Velykoburlutska`,
      UA6308003: `Vilkhuvatska`,
      UA6310001: `Biliaivska`,
      UA6310003: `Blyzniukivska`,
      UA6310005: `Lozivska`,
      UA6310007: `Oleksiivska`,
      UA6310009: `Pervomaiska`,
      UA6502001: `Beryslavska`,
      UA6502003: `Borozenska`,
      UA6502009: `Kalynivska`,
      UA6502011: `Kochubeivska`,
      UA6502013: `Mylivska`,
      UA6502017: `Novooleksandrivska`,
      UA6502019: `Novoraiska`,
      UA6502015: `Novovorontsovska`,
      UA6502021: `Tiahynska`,
      UA6502005: `Velykooleksandrivska`,
      UA6502007: `Vysokopilska`,
      UA6504001: `Henicheska`,
      UA6504003: `Ivanivska`,
      UA6504007: `Novotroitska`,
      UA6504005: `Nyzhnosirohozka`,
      UA6506001: `Askaniia-Nova`,
      UA6506029: `Chaplynska`,
      UA6506007: `Hornostaivska`,
      UA6506011: `Kakhovska`,
      UA6506027: `Khrestivska`,
      UA6506013: `Kostiantynivska`,
      UA6506015: `Liubymivska`,
      UA6506017: `Novokakhovska`,
      UA6506019: `Prysyvaska`,
      UA6506021: `Rubanivska`,
      UA6506025: `Tavriiska`,
      UA6506023: `Tavrychanska`,
      UA6506003: `Velykolepetyska`,
      UA6506005: `Verkhnorohachytska`,
      UA6506009: `Zelenopidska`,
      UA6510001: `Bilozerska`,
      UA6510017: `Chornobaivska`,
      UA6510007: `Darivska`,
      UA6510015: `Khersonska`,
      UA6510009: `Muzykivska`,
      UA6510011: `Oleshkivska`,
      UA6510013: `Stanislavska`,
      UA6510003: `Velykokopanivska`,
      UA6510005: `Vynohradivska`,
      UA6510019: `Yuvileina`,
      UA6508001: `Bekhterska`,
      UA6508017: `Chulakivska`,
      UA6508005: `Dolmativska`,
      UA6508003: `Holoprystanska`,
      UA6508007: `Kalanchatska`,
      UA6508009: `Lazurnenska`,
      UA6508011: `Myrnenska`,
      UA6508013: `Novomykolaivska`,
      UA6508015: `Skadovska`,
      UA6802029: `Chemerovetska`,
      UA6802005: `Dunaievetska`,
      UA6802001: `Hukivska`,
      UA6802003: `Humenetska`,
      UA6802011: `Kamianets-Podilska`,
      UA6802013: `Kytaihorodska`,
      UA6802015: `Makivska`,
      UA6802017: `Novounaievetska`,
      UA6802019: `Novoushytska`,
      UA6802021: `Orynynska`,
      UA6802023: `Slobidsko-Kulchiievetska`,
      UA6802025: `Smotrytska`,
      UA6802027: `Staroushytska`,
      UA6802009: `Zakupnenska`,
      UA6802007: `Zhvanetska`,
      UA6804001: `Antoninska`,
      UA6804049: `Chornoostrivska`,
      UA6804015: `Derazhnianska`,
      UA6804013: `Horodotska`,
      UA6804011: `Hvardiiska`,
      UA6804047: `Khmelnytska`,
      UA6804021: `Krasylivska`,
      UA6804023: `Letychivska`,
      UA6804025: `Lisovohrynivetska`,
      UA6804027: `Medzhybizka`,
      UA6804029: `Myroliubnenska`,
      UA6804031: `Narkevytska`,
      UA6804033: `Rozsoshanska`,
      UA6804035: `Satanivska`,
      UA6804051: `Shchyborivska`,
      UA6804037: `Solobkovetska`,
      UA6804039: `Starokostiantynivska`,
      UA6804041: `Staroostropilska`,
      UA6804043: `Starosyniavska`,
      UA6804045: `Teofipolska`,
      UA6804003: `Viitovetska`,
      UA6804005: `Vinkovetska`,
      UA6804009: `Volochyska`,
      UA6804007: `Vovkovynetska`,
      UA6804053: `Yarmolynetska`,
      UA6804017: `Zasluchnenska`,
      UA6804019: `Zinkivska`,
      UA6806001: `Berezdivska`,
      UA6806003: `Bilohirska`,
      UA6806005: `Hannopilska`,
      UA6806007: `Hrytsivska`,
      UA6806009: `Iziaslavska`,
      UA6806011: `Krupetska`,
      UA6806013: `Lenkovetska`,
      UA6806015: `Mykhailiutska`,
      UA6806017: `Netishynska`,
      UA6806019: `Pluzhnenska`,
      UA6806021: `Polonska`,
      UA6806023: `Poninkivska`,
      UA6806025: `Sakhnovetska`,
      UA6806033: `Shepetivska`,
      UA6806027: `Slavutska`,
      UA6806029: `Sudylkivska`,
      UA6806031: `Ulashanivska`,
      UA6806035: `Yampilska`,
      UA3502001: `Blahovishchenska`,
      UA3502005: `Haivoronska`,
      UA3502007: `Holovanivska`,
      UA3502011: `Nadlatska`,
      UA3502013: `Novoarkhanhelska`,
      UA3502015: `Perehonivska`,
      UA3502017: `Pidvysotska`,
      UA3502019: `Pobuzka`,
      UA3502003: `Vilshanska`,
      UA3502009: `Zavallivska`,
      UA3504001: `Adzhamska`,
      UA3504003: `Bobrynetska`,
      UA3504009: `Dmytrivska`,
      UA3504011: `Dolynska`,
      UA3504007: `Hurivska`,
      UA3504015: `Katerynivska`,
      UA3504017: `Ketrysanivska`,
      UA3504019: `Kompaniivska`,
      UA3504021: `Kropyvnytskyi`,
      UA3504023: `Novhorodkivska`,
      UA3504025: `Oleksandrivska`,
      UA3504027: `Pervozvanivska`,
      UA3504029: `Sokolivska`,
      UA3504031: `Subottsivska`,
      UA3504033: `Ustynivska`,
      UA3504005: `Velykoseverynivska`,
      UA3504013: `Znamianska`,
      UA3506005: `Dobrovelychkivska`,
      UA3506001: `Hannivska`,
      UA3506003: `Hlodoska`,
      UA3506009: `Malovyskivska`,
      UA3506011: `Marianivska`,
      UA3506013: `Novomyrhorodska`,
      UA3506015: `Novoukrainska`,
      UA3506017: `Pishchanobridska`,
      UA3506019: `Pomichnianska`,
      UA3506021: `Rivnianska`,
      UA3506023: `Smolinska`,
      UA3506025: `Tyshkivska`,
      UA3506007: `Zlynska`,
      UA3508003: `Novoprazka`,
      UA3508005: `Oleksandriiska`,
      UA3508007: `Onufriivska`,
      UA3508009: `Pantaivska`,
      UA3508011: `Petrivska`,
      UA3508013: `Popelnastivska`,
      UA3508015: `Pryiutivska`,
      UA3508017: `Svitlovodska`,
      UA3508001: `Velykoandrusivska`,
      UA8000000: `Kyiv`,
      UA3202001: `Bilotserkivska`,
      UA3202025: `Fursivska`,
      UA3202005: `Hrebinkivska`,
      UA3202007: `Kovalivska`,
      UA3202009: `Malovilshanska`,
      UA3202011: `Medvynska`,
      UA3202013: `Rokytnianska`,
      UA3202015: `Skvyrska`,
      UA3202017: `Stavyshchenska`,
      UA3202019: `Tarashchanska`,
      UA3202021: `Tetiivska`,
      UA3202023: `Uzynska`,
      UA3202003: `Volodarska`,
      UA3204001: `Boryspilska`,
      UA3204007: `Divychkivska`,
      UA3204005: `Hirska`,
      UA3204011: `Pereiaslavcska`,
      UA3204013: `Prystolychna`,
      UA3204015: `Studenykivska`,
      UA3204017: `Tashanska`,
      UA3204019: `Tsyblivska`,
      UA3204003: `Voronkivska`,
      UA3204021: `Yahotynska`,
      UA3204009: `Zolochivska`,
      UA3206001: `Baryshivska`,
      UA3206003: `Berezanska`,
      UA3206005: `Brovarska`,
      UA3206013: `Kalynivska`,
      UA3206015: `Kalytianska`,
      UA3206007: `Velykodymerska`,
      UA3206009: `Zazymska`,
      UA3206011: `Zghurivska`,
      UA3208001: `Bilohorodska`,
      UA3208003: `Borodianska`,
      UA3208005: `Borshchahivska`,
      UA3208007: `Buchanska`,
      UA3208013: `Dmytrivska`,
      UA3208011: `Hostomelska`,
      UA3208015: `Irpinska`,
      UA3208017: `Kotsiubynska`,
      UA3208019: `Makarivska`,
      UA3208021: `Nemishaivska`,
      UA3208023: `Piskivska`,
      UA3208009: `Vyshneva`,
      UA3200000: `Chornobyl Exclusion Zone`,
      UA3214003: `Boiarska`,
      UA3214001: `Byshivska`,
      UA3214017: `Chabanivska`,
      UA3214015: `Fastivska`,
      UA3214005: `Hatnenska`,
      UA3214007: `Hlevakhivska`,
      UA3214009: `Kalynivska`,
      UA3214011: `Kozhanska`,
      UA3214013: `Tomashivska`,
      UA3212001: `Bohuslavska`,
      UA3212017: `Feodosiivska`,
      UA3212005: `Kaharlytska`,
      UA3212007: `Kozynska`,
      UA3212009: `Myronivska`,
      UA3212011: `Obukhivska`,
      UA3212013: `Rzhyshchivska`,
      UA3212015: `Ukrainska`,
      UA3212003: `Vasylkivska`,
      UA3210003: `Dymerska`,
      UA3210005: `Ivankivska`,
      UA3210007: `Petrivska`,
      UA3210009: `Pirnivska`,
      UA3210011: `Poliska`,
      UA3210013: `Slavutytska`,
      UA3210001: `Vyshhorodska`,
      UA4402001: `Alchevska`,
      UA4402005: `Kadiivska`,
      UA4402003: `Zymohirivska`,
      UA4404001: `Dovzhanska`,
      UA4404003: `Sorokynska`,
      UA4406001: `Luhanska`,
      UA4406003: `Lutuhynska`,
      UA4406005: `Molodohvardiiska`,
      UA4408001: `Antratsytivska`,
      UA4408005: `Khrustalnenska`,
      UA4408003: `Rovenkivska`,
      UA4416003: `Novoaidarska`,
      UA4416001: `Nyzhnoteplivska`,
      UA4416009: `Shchastynska`,
      UA4416007: `Shyrokivska`,
      UA4416005: `Stanychno-Luhanska`,
      UA4412001: `Hirska`,
      UA4412003: `Kreminska`,
      UA4412005: `Lysychanska`,
      UA4412007: `Popasnianska`,
      UA4412009: `Rubizhanska`,
      UA4412011: `Sievierodonetska`,
      UA4414003: `Bilolutska`,
      UA4414001: `Bilovodska`,
      UA4414013: `Chmyrivska`,
      UA4414005: `Markivska`,
      UA4414007: `Milovska`,
      UA4414009: `Novopskovska`,
      UA4414015: `Shulhynska`,
      UA4414011: `Starobilska`,
      UA4410001: `Bilokurakynska`,
      UA4410003: `Kolomyichyska`,
      UA4410005: `Krasnorichenska`,
      UA4410007: `Lozno-Oleksandrivska`,
      UA4410009: `Nyzhnoduvanska`,
      UA4410011: `Svativska`,
      UA4410013: `Troitska`,
      UA4612001: `Belzka`,
      UA4612013: `Chervonohradska`,
      UA4612005: `Dobrotvirska`,
      UA4612007: `Lopatynska`,
      UA4612009: `Radekhivska`,
      UA4612011: `Sokalska`,
      UA4612003: `Velykomostivska`,
      UA4602001: `Boryslavska`,
      UA4602003: `Drohobytska`,
      UA4602005: `Medenytska`,
      UA4602007: `Skhidnytska`,
      UA4602009: `Truskavetska`,
      UA4606001: `Bibrska`,
      UA4606009: `Davydivska`,
      UA4606011: `Dobrosynsko-Maherivska`,
      UA4606005: `Hlynianska`,
      UA4606007: `Horodotska`,
      UA4606019: `Kamianka-Buzka`,
      UA4606021: `Komarnivska`,
      UA4606023: `Kulykivska`,
      UA4606025: `Lvivska`,
      UA4606027: `Murovanska`,
      UA4606029: `Novoiarychivska`,
      UA4606031: `Obroshynska`,
      UA4606033: `Peremyshlianska`,
      UA4606035: `Pidberiztsivska`,
      UA4606037: `Pustomytivska`,
      UA4606039: `Rava-Ruska`,
      UA4606045: `Shchyretska`,
      UA4606041: `Sokilnytska`,
      UA4606043: `Solonkivska`,
      UA4606003: `Velykoliubinska`,
      UA4606013: `Zhovkivska`,
      UA4606015: `Zhovtanetska`,
      UA4606017: `Zymnovodivska`,
      UA4608001: `Biskovytska`,
      UA4608003: `Borynska`,
      UA4608005: `Dobromylska`,
      UA4608021: `Khyrivska`,
      UA4608007: `Novokalynivska`,
      UA4608009: `Ralivska`,
      UA4608011: `Rudkivska`,
      UA4608013: `Sambirska`,
      UA4608015: `Starosambirska`,
      UA4608017: `Strilkivska`,
      UA4608019: `Turkivska`,
      UA4610001: `Hnizdychivska`,
      UA4610003: `Hrabovetsko-Dulibivska`,
      UA4610027: `Khodorivska`,
      UA4610009: `Kozivska`,
      UA4610013: `Morshynska`,
      UA4610011: `Mykolaivska`,
      UA4610015: `Novorozdilska`,
      UA4610017: `Rozvadivska`,
      UA4610019: `Skolivska`,
      UA4610021: `Slavska`,
      UA4610023: `Stryiska`,
      UA4610025: `Trostianetska`,
      UA4610007: `Zhuravnenska`,
      UA4610005: `Zhydachivska`,
      UA4614001: `Ivano-Frankivska`,
      UA4614003: `Mostyska`,
      UA4614005: `Novoiavorivska`,
      UA4614009: `Shehynivska`,
      UA4614007: `Sudovovyshnianska`,
      UA4614011: `Yavorivska`,
      UA4604001: `Brodivska`,
      UA4604003: `Buska`,
      UA4604009: `Krasnenska`,
      UA4604011: `Pidkaminska`,
      UA4604013: `Pomorianska`,
      UA4604005: `Zabolottsivska`,
      UA4604007: `Zolochivska`,
      UA4802001: `Bashtanska`,
      UA4802003: `Bereznehuvatska`,
      UA4802009: `Horokhivska`,
      UA4802011: `Inhulska`,
      UA4802013: `Kazankivska`,
      UA4802015: `Novobuzka`,
      UA4802017: `Pryvilnenska`,
      UA4802023: `Shyrokivska`,
      UA4802019: `Snihurivska`,
      UA4802021: `Sofiivska`,
      UA4802005: `Vilnozaporizka`,
      UA4802007: `Volodymyrivska`,
      UA4806001: `Berezanska`,
      UA4806035: `Chornomorska`,
      UA4806007: `Halytsynivska`,
      UA4806009: `Koblivska`,
      UA4806011: `Kostiantynivska`,
      UA4806013: `Kutsurubska`,
      UA4806017: `Mishkovo-Pohorilivska`,
      UA4806015: `Mykolaivska`,
      UA4806019: `Nechaianska`,
      UA4806021: `Novoodeska`,
      UA4806025: `Ochakivska`,
      UA4806023: `Olshanska`,
      UA4806027: `Pervomaiska`,
      UA4806029: `Radsadivska`,
      UA4806037: `Shevchenkivska`,
      UA4806031: `Stepivska`,
      UA4806033: `Sukhoielanetska`,
      UA4806003: `Vesnianska`,
      UA4806005: `Voskresenska`,
      UA4808001: `Arbuzynska`,
      UA4808003: `Blahodatnenska`,
      UA4808007: `Kamianomostivska`,
      UA4808009: `Kryvoozerska`,
      UA4808011: `Myhiivska`,
      UA4808013: `Pervomaiska`,
      UA4808015: `Syniukhynobridska`,
      UA4808005: `Vradiivska`,
      UA4804001: `Bratska`,
      UA4804003: `Buzka`,
      UA4804009: `Domanivska`,
      UA4804011: `Doroshivska`,
      UA4804015: `Mostivska`,
      UA4804017: `Novomarivska`,
      UA4804019: `Oleksandrivska`,
      UA4804021: `Prybuzhanivska`,
      UA4804023: `Prybuzka`,
      UA4804005: `Veselynivska`,
      UA4804007: `Voznesenska`,
      UA4804013: `Yelanetska`,
      UA4804025: `Yuzhnoukrainska`,
      UA5102001: `Andriievo-Ivanivska`,
      UA5102003: `Berezivska`,
      UA5102029: `Chohodarivska`,
      UA5102009: `Ivanivska`,
      UA5102011: `Konoplianska`,
      UA5102013: `Kurisovska`,
      UA5102015: `Mykolaivska`,
      UA5102017: `Novokalchevska`,
      UA5102019: `Petrovirivska`,
      UA5102021: `Raukhivska`,
      UA5102023: `Rozkvitivska`,
      UA5102031: `Shyriaivska`,
      UA5102025: `Staromaiakivska`,
      UA5102027: `Striukivska`,
      UA5102005: `Velykobuialytska`,
      UA5102007: `Znamianska`,
      UA5104001: `Bilhorod-Dnistrovska`,
      UA5104003: `Dyviziiska`,
      UA5104005: `Karolino-Buhazka`,
      UA5104007: `Kulevchanska`,
      UA5104009: `Lymanska`,
      UA5104011: `Marazliivska`,
      UA5104013: `Molohivska`,
      UA5104015: `Petropavlivska`,
      UA5104017: `Plakhtiivska`,
      UA5104019: `Saratska`,
      UA5104021: `Serhiivska`,
      UA5104031: `Shabivska`,
      UA5104023: `Starokozatska`,
      UA5104025: `Tatarbunarska`,
      UA5104027: `Tuzlivska`,
      UA5104029: `Uspenivska`,
      UA5106001: `Artsyzka`,
      UA5106003: `Bolhradska`,
      UA5106005: `Borodinska`,
      UA5106009: `Horodnenska`,
      UA5106011: `Krynychnenska`,
      UA5106013: `Kubeiska`,
      UA5106015: `Pavlivska`,
      UA5106017: `Tarutynska`,
      UA5106019: `Teplytska`,
      UA5106007: `Vasylivska`,
      UA5108003: `Izmailska`,
      UA5108005: `Kiliiska`,
      UA5108007: `Reniiska`,
      UA5108009: `Safianivska`,
      UA5108011: `Suvorovska`,
      UA5108001: `Vylkivska`,
      UA5110001: `Avanhardivska`,
      UA5110003: `Biliaivska`,
      UA5110037: `Chornomorska`,
      UA5110039: `Chornomorska`,
      UA5110015: `Dachnenska`,
      UA5110013: `Dalnytska`,
      UA5110017: `Dobroslavska`,
      UA5110035: `Fontanska`,
      UA5110019: `Krasnosilska`,
      UA5110021: `Maiakivska`,
      UA5110023: `Nerubaiska`,
      UA5110027: `Odeska`,
      UA5110025: `Ovidiopolska`,
      UA5110029: `Tairovska`,
      UA5110031: `Teplodarska`,
      UA5110033: `Usativska`,
      UA5110005: `Velykodalnytska`,
      UA5110007: `Velykodolynska`,
      UA5110009: `Vyhodianska`,
      UA5110011: `Vyzyrska`,
      UA5110043: `Yaskivska`,
      UA5110041: `Yuzhnenska`,
      UA5112001: `Ananivska`,
      UA5112003: `Baltska`,
      UA5112005: `Dolynska`,
      UA5112009: `Kodymska`,
      UA5112011: `Kuialnytska`,
      UA5112013: `Liubashivska`,
      UA5112015: `Oknianska`,
      UA5112017: `Pishchanska`,
      UA5112019: `Podilska`,
      UA5112021: `Savranska`,
      UA5112023: `Slobidska`,
      UA5112007: `Zelenohirska`,
      UA5114009: `Lymanska`,
      UA5114011: `Novoborysivska`,
      UA5114013: `Rozdilnianska`,
      UA5114015: `Stepanivska`,
      UA5114017: `Tsebrykivska`,
      UA5114001: `Velykomykhailivska`,
      UA5114003: `Velykoploskivska`,
      UA5114007: `Zakharivska`,
      UA5114005: `Zatyshanska`,
      UA5302001: `Hlobynska`,
      UA5302003: `Horishnoplavnivska`,
      UA5302005: `Hradyzka`,
      UA5302007: `Kamianopotokivska`,
      UA5302009: `Kozelshchynska`,
      UA5302011: `Kremenchutska`,
      UA5302013: `Novohaleshchynska`,
      UA5302015: `Obolonska`,
      UA5302017: `Omelnytska`,
      UA5302019: `Pishchanska`,
      UA5302021: `Pryshybska`,
      UA5302023: `Semenivska`,
      UA5304013: `Chornukhynska`,
      UA5304001: `Hrebinkivska`,
      UA5304011: `Khorolska`,
      UA5304003: `Lubenska`,
      UA5304005: `Novoorzhytska`,
      UA5304007: `Orzhytska`,
      UA5304009: `Pyriatynska`,
      UA5306001: `Bilotserkivska`,
      UA5306009: `Hadiatska`,
      UA5306011: `Hoholivska`,
      UA5306015: `Komyshnianska`,
      UA5306017: `Krasnolutska`,
      UA5306021: `Liutenska`,
      UA5306019: `Lokhvytska`,
      UA5306023: `Myrhorodska`,
      UA5306025: `Petrivsko-Romenska`,
      UA5306027: `Romodanivska`,
      UA5306029: `Senchanska`,
      UA5306031: `Serhiivska`,
      UA5306033: `Shyshatska`,
      UA5306003: `Velykobahachanska`,
      UA5306005: `Velykobudyshchanska`,
      UA5306007: `Velykosorochynska`,
      UA5306013: `Zavodska`,
      UA5308001: `Bilytska`,
      UA5308045: `Chutivska`,
      UA5308007: `Drabynivska`,
      UA5308005: `Dykanska`,
      UA5308011: `Karlivska`,
      UA5308013: `Kobeliatska`,
      UA5308015: `Kolomatska`,
      UA5308017: `Kotelevska`,
      UA5308019: `Lannivska`,
      UA5308023: `Machukhivska`,
      UA5308021: `Martynivska`,
      UA5308025: `Mashivska`,
      UA5308027: `Mykhailivska`,
      UA5308029: `Nekhvoroshchanska`,
      UA5308031: `Novosanzharska`,
      UA5308033: `Novoselivska`,
      UA5308035: `Opishnianska`,
      UA5308037: `Poltavska`,
      UA5308039: `Reshetylivska`,
      UA5308047: `Shcherbanivska`,
      UA5308041: `Skorokhodivska`,
      UA5308043: `Tereshkivska`,
      UA5308003: `Velykorublivska`,
      UA5308009: `Zinkivska`,
      UA5604001: `Bokiimivska`,
      UA5604003: `Boremelska`,
      UA5604009: `Demydivska`,
      UA5604011: `Dubenska`,
      UA5604013: `Kozynska`,
      UA5604015: `Krupetska`,
      UA5604019: `Mlynivska`,
      UA5604017: `Myrohoshchanska`,
      UA5604021: `Ostrozhetska`,
      UA5604023: `Pidloztsivska`,
      UA5604025: `Povchanska`,
      UA5604027: `Pryvilnenska`,
      UA5604029: `Radyvylivska`,
      UA5604031: `Semydubska`,
      UA5604033: `Smyzka`,
      UA5604035: `Tarakanivska`,
      UA5604005: `Varkovytska`,
      UA5604007: `Verbska`,
      UA5604037: `Yaroslavytska`,
      UA5606001: `Babynska`,
      UA5606003: `Bereznivska`,
      UA5606005: `Bilokrynytska`,
      UA5606007: `Buhrynska`,
      UA5606019: `Derazhnenska`,
      UA5606021: `Diadkovytska`,
      UA5606013: `Holovynska`,
      UA5606015: `Horodotska`,
      UA5606017: `Hoshchanska`,
      UA5606029: `Klevanska`,
      UA5606031: `Koretska`,
      UA5606033: `Kornynska`,
      UA5606035: `Kostopilska`,
      UA5606039: `Maloliubashanska`,
      UA5606037: `Malynska`,
      UA5606041: `Mizotska`,
      UA5606043: `Oleksandriiska`,
      UA5606045: `Ostrozka`,
      UA5606047: `Rivnenska`,
      UA5606051: `Shpanivska`,
      UA5606049: `Sosnivska`,
      UA5606009: `Velykomezhyritska`,
      UA5606011: `Velykoomelianska`,
      UA5606025: `Zdolbunivska`,
      UA5606023: `Zdovbytska`,
      UA5606027: `Zorianska`,
      UA5608001: `Berezivska`,
      UA5608007: `Dubrovytska`,
      UA5608009: `Klesivska`,
      UA5608011: `Myliatska`,
      UA5608013: `Nemovytska`,
      UA5608015: `Rokytnivska`,
      UA5608017: `Sarnenska`,
      UA5608019: `Starosilska`,
      UA5608021: `Stepanska`,
      UA5608003: `Vyrivska`,
      UA5608005: `Vysotska`,
      UA5602001: `Antonivska`,
      UA5602009: `Kanonytska`,
      UA5602011: `Loknytska`,
      UA5602013: `Polytska`,
      UA5602015: `Rafalivska`,
      UA5602003: `Varaska`,
      UA5602005: `Volodymyretska`,
      UA5602007: `Zarichnenska`,
      UA8500000: `Sevastopol`,
      UA5902001: `Bochechkivska`,
      UA5902003: `Burynska`,
      UA5902005: `Duboviazivska`,
      UA5902007: `Konotopska`,
      UA5902009: `Krolevetska`,
      UA5902011: `Novoslobidska`,
      UA5902013: `Popivska`,
      UA5902015: `Putyvlska`,
      UA5904001: `Boromlianska`,
      UA5904015: `Chernechchynska`,
      UA5904017: `Chupakhivska`,
      UA5904005: `Hrunska`,
      UA5904009: `Komyshanska`,
      UA5904007: `Kyrykivska`,
      UA5904011: `Okhtyrska`,
      UA5904013: `Trostianetska`,
      UA5904003: `Velykopysarivska`,
      UA5906001: `Andriiashivska`,
      UA5906015: `Khmelivska`,
      UA5906005: `Korovynska`,
      UA5906007: `Lypovodolynska`,
      UA5906009: `Nedryhailivska`,
      UA5906011: `Romenska`,
      UA5906013: `Synivska`,
      UA5906003: `Vilshanska`,
      UA5910001: `Berezivska`,
      UA5910005: `Druzhbivska`,
      UA5910007: `Esmanska`,
      UA5910003: `Hlukhivska`,
      UA5910013: `Seredyno-Budska`,
      UA5910015: `Shalyhynska`,
      UA5910017: `Shostkynska`,
      UA5910011: `Sveska`,
      UA5910019: `Yampilska`,
      UA5910009: `Znob-Novhorodska`,
      UA5908001: `Bezdrytska`,
      UA5908003: `Bilopilska`,
      UA5908029: `Khotinska`,
      UA5908009: `Krasnopilska`,
      UA5908011: `Lebedynska`,
      UA5908013: `Mykolaivska`,
      UA5908015: `Mykolaivska`,
      UA5908017: `Myropilska`,
      UA5908019: `Nyzhnosyrovatska`,
      UA5908021: `Richkivska`,
      UA5908023: `Sadivska`,
      UA5908025: `Stepanivska`,
      UA5908027: `Sumska`,
      UA5908005: `Verkhnosyrovatska`,
      UA5908007: `Vorozhbianska`,
      UA5908031: `Yunakivska`,
      UA6106003: `Bilche-Zolotetska`,
      UA6106001: `Bilobozhnytska`,
      UA6106005: `Borshchivska`,
      UA6106007: `Buchatska`,
      UA6106043: `Chortkivska`,
      UA6106011: `Hrymailivska`,
      UA6106013: `Husiatynska`,
      UA6106021: `Ivane-Pustenska`,
      UA6106041: `Khorostkivska`,
      UA6106023: `Kolyndianska`,
      UA6106025: `Kopychynetska`,
      UA6106027: `Koropetska`,
      UA6106029: `Melnytse-Podilska`,
      UA6106031: `Monastyryska`,
      UA6106033: `Nahirianska`,
      UA6106035: `Skala-Podilska`,
      UA6106037: `Tovstenska`,
      UA6106039: `Trybukhivska`,
      UA6106009: `Vasylkovetska`,
      UA6106017: `Zalishchytska`,
      UA6106015: `Zavodska`,
      UA6106019: `Zolotopotitska`,
      UA6102001: `Borsukivska`,
      UA6102007: `Kremenetska`,
      UA6102009: `Lanovetska`,
      UA6102011: `Lopushnenska`,
      UA6102013: `Pochaivska`,
      UA6102015: `Shumska`,
      UA6102003: `Velykodederkalska`,
      UA6102005: `Vyshnivetska`,
      UA6104001: `Baikovetska`,
      UA6104003: `Berezhanska`,
      UA6104005: `Biletska`,
      UA6104021: `Ivanivska`,
      UA6104023: `Kozivska`,
      UA6104025: `Kozlivska`,
      UA6104027: `Kupchynetska`,
      UA6104029: `Mykulynetska`,
      UA6104031: `Naraivska`,
      UA6104033: `Ozernianska`,
      UA6104037: `Pidhaietska`,
      UA6104039: `Pidhorodnianska`,
      UA6104035: `Pidvolochyska`,
      UA6104041: `Saranchukivska`,
      UA6104043: `Skalatska`,
      UA6104045: `Skorykivska`,
      UA6104047: `Terebovlianska`,
      UA6104049: `Ternopilska`,
      UA6104007: `Velykoberezovytska`,
      UA6104009: `Velykobirkivska`,
      UA6104011: `Velykohaivska`,
      UA6104013: `Zalozetska`,
      UA6104015: `Zbarazka`,
      UA6104017: `Zborivska`,
      UA6104019: `Zolotnykivska`,
      UA0504001: `Bershadska`,
      UA0504027: `Chechelnytska`,
      UA0504005: `Dashivska`,
      UA0504007: `Dzhulynska`,
      UA0504003: `Haisynska`,
      UA0504009: `Krasnopilska`,
      UA0504011: `Kunkivska`,
      UA0504013: `Ladyzhynska`,
      UA0504015: `Obodivska`,
      UA0504017: `Olhopilska`,
      UA0504019: `Raihorodska`,
      UA0504021: `Sobolivska`,
      UA0504023: `Teplytska`,
      UA0504025: `Trostianetska`,
      UA0512001: `Hlukhovetska`,
      UA0512005: `Ivanivska`,
      UA0512007: `Kalynivska`,
      UA0512017: `Khmilnytska`,
      UA0512009: `Koziatynska`,
      UA0512011: `Makhnivska`,
      UA0512013: `Samhorodotska`,
      UA0512015: `Ulanivska`,
      UA0512003: `Zhdanivska`,
      UA0508001: `Babchynetska`,
      UA0508009: `Chernivetska`,
      UA0508005: `Mohyliv-Podilska`,
      UA0508007: `Murovanokurylovetska`,
      UA0508003: `Vendychanska`,
      UA0508011: `Yampilska`,
      UA0508013: `Yaryshivska`,
      UA0510001: `Bratslavska`,
      UA0510005: `Horodkivska`,
      UA0510007: `Kryzhopilska`,
      UA0510009: `Pishchanska`,
      UA0510017: `Shpykivska`,
      UA0510011: `Studenianska`,
      UA0510013: `Tomashpilska`,
      UA0510015: `Tulchynska`,
      UA0510003: `Vapniarska`,
      UA0502001: `Ahronomichna`,
      UA0502007: `Hnivanska`,
      UA0502009: `Illinetska`,
      UA0502013: `Litynska`,
      UA0502015: `Luka-Meleshkivska`,
      UA0502011: `Lypovetska`,
      UA0502017: `Nemyrivska`,
      UA0502019: `Orativska`,
      UA0502021: `Pohrebyshchenska`,
      UA0502023: `Stryzhavska`,
      UA0502025: `Sutyskivska`,
      UA0502029: `Turbivska`,
      UA0502027: `Tyvrivska`,
      UA0502003: `Vinnytska`,
      UA0502005: `Voronovytska`,
      UA0502031: `Yakushynetska`,
      UA0506001: `Barska`,
      UA0506003: `Dzhurynska`,
      UA0506007: `Kopaihorodska`,
      UA0506009: `Murafska`,
      UA0506011: `Severynivska`,
      UA0506015: `Sharhorodska`,
      UA0506013: `Stanislavchytska`,
      UA0506005: `Zhmerynska`,
      UA0704001: `Kamin-Kashyrska`,
      UA0704003: `Liubeshivska`,
      UA0704005: `Manevytska`,
      UA0704007: `Prylisnenska`,
      UA0704009: `Soshychnenska`,
      UA0706011: `Dubechnenska`,
      UA0706013: `Dubivska`,
      UA0706007: `Holobska`,
      UA0706009: `Holovnenska`,
      UA0706021: `Kolodiazhnenska`,
      UA0706019: `Kovelska`,
      UA0706025: `Liublynetska`,
      UA0706027: `Liubomlska`,
      UA0706023: `Lukivska`,
      UA0706029: `Povorska`,
      UA0706031: `Ratnivska`,
      UA0706033: `Rivnenska`,
      UA0706035: `Samarivska`,
      UA0706037: `Serekhovychivska`,
      UA0706045: `Shatska`,
      UA0706039: `Smidynska`,
      UA0706041: `Starovyzhivska`,
      UA0706043: `Turiiska`,
      UA0706001: `Velymchenska`,
      UA0706003: `Velytska`,
      UA0706005: `Vyshnivska`,
      UA0706015: `Zabolottivska`,
      UA0706017: `Zabrodivska`,
      UA0708001: `Berestechkivska`,
      UA0708003: `Boratynska`,
      UA0708009: `Dorosynivska`,
      UA0708005: `Horodyshchenska`,
      UA0708007: `Horokhivska`,
      UA0708011: `Kivertsivska`,
      UA0708013: `Kolkivska`,
      UA0708015: `Kopachivska`,
      UA0708017: `Lutska`,
      UA0708019: `Marianivska`,
      UA0708021: `Olytska`,
      UA0708023: `Pidhaitsivska`,
      UA0708025: `Rozhyshchenska`,
      UA0708027: `Torchynska`,
      UA0708029: `Tsumanska`,
      UA0702007: `Ivanychivska`,
      UA0702011: `Lokachynska`,
      UA0702009: `Lytovezka`,
      UA0702013: `Novovolynska`,
      UA0702015: `Ovadnivska`,
      UA0702017: `Pavlivska`,
      UA0702019: `Poromivska`,
      UA0702021: `Ustyluzka`,
      UA0702001: `Volodymyr-Volynska`,
      UA0702003: `Zaturtsivska`,
      UA0702005: `Zymnivska`,
      UA2102001: `Bativska`,
      UA2102003: `Berehivska`,
      UA2102013: `Kamianska`,
      UA2102015: `Korolivska`,
      UA2102017: `Kosonska`,
      UA2102019: `Pyiterfolvivska`,
      UA2102005: `Velykoberezka`,
      UA2102007: `Velykobyihanska`,
      UA2102009: `Vylotska`,
      UA2102011: `Vynohradivska`,
      UA2112001: `Bilkivska`,
      UA2112007: `Dovzhanska`,
      UA2112009: `Drahivska`,
      UA2112005: `Horinchivska`,
      UA2112013: `Irshavska`,
      UA2112015: `Keretskivska`,
      UA2112025: `Khustska`,
      UA2112017: `Kolochavska`,
      UA2112019: `Mizhhirska`,
      UA2112021: `Pylypetska`,
      UA2112023: `Synevyrska`,
      UA2112003: `Vyshkivska`,
      UA2112011: `Zarichanska`,
      UA2104025: `Chynadiivska`,
      UA2104007: `Horondivska`,
      UA2104011: `Ivanovetska`,
      UA2104013: `Kolchynska`,
      UA2104015: `Mukachivska`,
      UA2104017: `Nelipynska`,
      UA2104019: `Nyzhnovoritska`,
      UA2104021: `Polianska`,
      UA2104023: `Svaliavska`,
      UA2104001: `Velykoluchkivska`,
      UA2104003: `Verkhnokoropetska`,
      UA2104005: `Volovetska`,
      UA2104009: `Zhdeniivska`,
      UA2106001: `Bohdanska`,
      UA2106005: `Rakhivska`,
      UA2106003: `Velykobychkivska`,
      UA2106007: `Yasinianska`,
      UA2108001: `Bedevlianska`,
      UA2108003: `Bushtynska`,
      UA2108007: `Dubivska`,
      UA2108009: `Neresnytska`,
      UA2108011: `Solotvynska`,
      UA2108013: `Teresvianska`,
      UA2108015: `Tiachivska`,
      UA2108017: `Uhlianska`,
      UA2108019: `Ust-Chornianska`,
      UA2108005: `Vilkhovetska`,
      UA2110001: `Baranynska`,
      UA2110027: `Chopska`,
      UA2110007: `Dubrynytska-Malobereznianska`,
      UA2110025: `Kholmkivska`,
      UA2110009: `Kostrynska`,
      UA2110011: `Onokivska`,
      UA2110013: `Perechynska`,
      UA2110015: `Serednianska`,
      UA2110019: `Siurtivska`,
      UA2110017: `Stavnenska`,
      UA2110021: `Turie-Remetivska`,
      UA2110023: `Uzhhorodska`,
      UA2110003: `Velykobereznianska`,
      UA2110005: `Velykodobronska`,
      UA2302003: `Andriivska`,
      UA2302001: `Andrivska`,
      UA2302005: `Berdianska`,
      UA2302007: `Berestivska`,
      UA2302015: `Chernihivska`,
      UA2302009: `Kolarivska`,
      UA2302011: `Osypenkivska`,
      UA2302013: `Prymorska`,
      UA2308029: `Chkalovska`,
      UA2308005: `Kostiantynivska`,
      UA2308003: `Kyrylivska`,
      UA2308007: `Melitopolska`,
      UA2308009: `Myrnenska`,
      UA2308011: `Novenska`,
      UA2308013: `Novobohdanivska`,
      UA2308017: `Novouspenivska`,
      UA2308015: `Novovasylivska`,
      UA2308019: `Oleksandrivska`,
      UA2308021: `Plodorodnenska`,
      UA2308023: `Pryazovska`,
      UA2308025: `Semenivska`,
      UA2308027: `Terpinnivska`,
      UA2308001: `Veselivska`,
      UA2308031: `Yakymivska`,
      UA2310001: `Bilmatska`,
      UA2310029: `Fedorivska`,
      UA2310007: `Huliaipilska`,
      UA2310009: `Komysh-Zorianska`,
      UA2310013: `Malotokmachanska`,
      UA2310011: `Malynivska`,
      UA2310015: `Molochanska`,
      UA2310017: `Orikhivska`,
      UA2310019: `Polohivska`,
      UA2310021: `Preobrazhenska`,
      UA2310023: `Rozivska`,
      UA2310025: `Smyrnovska`,
      UA2310027: `Tokmatska`,
      UA2310005: `Voskresenska`,
      UA2310003: `Vozdvyzhivska`,
      UA2304001: `Blahovishchenska`,
      UA2304009: `Dniprorudnenska`,
      UA2304011: `Enerhodarska`,
      UA2304013: `Kamiansko-Dniprovska`,
      UA2304015: `Malobilozerska`,
      UA2304017: `Mykhailivska`,
      UA2304019: `Rozdolska`,
      UA2304021: `Stepnohirska`,
      UA2304003: `Vasylivska`,
      UA2304005: `Velykobilozerska`,
      UA2304007: `Vodianska`,
      UA2306001: `Bilenkivska`,
      UA2306005: `Dolynska`,
      UA2306009: `Komyshuvaska`,
      UA2306011: `Kushuhumska`,
      UA2306013: `Matviivska`,
      UA2306015: `Mykhailivska`,
      UA2306017: `Mykhailo-Lukashivska`,
      UA2306019: `Novomykolaivska`,
      UA2306021: `Novooleksandrivska`,
      UA2306023: `Pavlivska`,
      UA2306025: `Petro-Mykhailivska`,
      UA2306033: `Shyrokivska`,
      UA2306027: `Stepnenska`,
      UA2306029: `Tavriiska`,
      UA2306031: `Ternuvatska`,
      UA2306003: `Vilnianska`,
      UA2306007: `Zaporizka`,
      UA1802001: `Andrushivska`,
      UA1802003: `Berdychivska`,
      UA1802017: `Chervonenska`,
      UA1802007: `Hryshkovetska`,
      UA1802009: `Krasnopilska`,
      UA1802011: `Raihorodotska`,
      UA1802013: `Ruzhynska`,
      UA1802015: `Semenivska`,
      UA1802019: `Shvaikivska`,
      UA1802005: `Vchoraishenska`,
      UA1806001: `Bilokorovytska`,
      UA1806025: `Chopovytska`,
      UA1806003: `Hladkovytska`,
      UA1806005: `Horshchykivska`,
      UA1806007: `Irshanska`,
      UA1806009: `Korostenska`,
      UA1806011: `Luhynska`,
      UA1806013: `Malynska`,
      UA1806015: `Narodytska`,
      UA1806019: `Olevska`,
      UA1806017: `Ovrutska`,
      UA1806021: `Slovechanska`,
      UA1806023: `Ushomyrska`,
      UA1804001: `Andrushkivska`,
      UA1804003: `Berezivska`,
      UA1804005: `Brusylivska`,
      UA1804059: `Cherniakhivska`,
      UA1804061: `Chudniv`,
      UA1804015: `Hlybochytska`,
      UA1804017: `Horodotska`,
      UA1804055: `Kharytonivska`,
      UA1804057: `Khoroshivska`,
      UA1804023: `Kornynska`,
      UA1804025: `Korostyshivska`,
      UA1804027: `Kurnenska`,
      UA1804021: `Kvitneva`,
      UA1804029: `Liubarska`,
      UA1804031: `Myropilska`,
      UA1804033: `Novoborivska`,
      UA1804035: `Novohuivynska`,
      UA1804037: `Oliivska`,
      UA1804039: `Popilnianska`,
      UA1804041: `Potiivska`,
      UA1804043: `Pulynska`,
      UA1804045: `Radomyshlska`,
      UA1804047: `Romanivska`,
      UA1804049: `Stanyshivska`,
      UA1804051: `Starosiletska`,
      UA1804053: `Teterivska`,
      UA1804011: `Vilshanska`,
      UA1804013: `Volytska`,
      UA1804009: `Vyshevytska`,
      UA1804007: `Vysokivska`,
      UA1804019: `Zhytomyrska`,
      UA1808001: `Baranivska`,
      UA1808003: `Barashivska`,
      UA1808005: `Bronykivska`,
      UA1808021: `Chyzhivska`,
      UA1808009: `Dovbyska`,
      UA1808011: `Dubrivska`,
      UA1808007: `Horodnytska`,
      UA1808017: `Pishchivska`,
      UA1808019: `Stryivska`,
      UA1808023: `Yarunska`,
      UA1808013: `Yemilchynska`,
      UA1808015: `Zviahelska`,
    },
    what_is_your_citizenship: {
      ukrainian: `Ukrainian`,
      stateless: `Stateless`,
      non_ukrainian: `Non-Ukrainian`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    if_nonukrainian_what_is_your_citizenship: {
      russian_masculine: `Russian`,
      country_of_origin_azerbaijan: `Azerbaijani`,
      country_of_origin_moldovan: `Moldovan`,
      country_of_origin_romanian: `Romanian`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    if_ukrainian_do_you_or_your_household_members_identify_as_member_of_a_minority_group: {
      no: `No`,
      roma: `Roma`,
      hungarian: `Hungarian`,
      greek: `Greek`,
      jewish: `Jewish`,
      tatar: `Tatar`,
      belorussian: `Belorussian`,
      azerbaijan: `Azerbaijan`,
      russian: `Russian`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    what_is_the_primary_language_spoken_in_your_household: {
      ukrainian: `Ukrainian`,
      russian: `Russian`,
      mixed_ukrainian_russian: `Mixed Ukrainian/Russian`,
      other: `Other`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    what_is_the_type_of_your_household: {
      one_person_household: `One person household`,
      couple_without_children: `Couple without children`,
      couple_with_children: `Couple with children`,
      mother_with_children: `Mother with children`,
      father_with_children: `Father with children`,
      extended_family: `Extended family`,
    },
    hh_sex_1: {
      male: `Male`,
      female: `Female`,
      other: `Other`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    hh_sex_2: {
      male: `Male`,
      female: `Female`,
      other: `Other`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    hh_sex_3: {
      male: `Male`,
      female: `Female`,
      other: `Other`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    hh_sex_4: {
      male: `Male`,
      female: `Female`,
      other: `Other`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    hh_sex_5: {
      male: `Male`,
      female: `Female`,
      other: `Other`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    hh_sex_6: {
      male: `Male`,
      female: `Female`,
      other: `Other`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    hh_sex_7: {
      male: `Male`,
      female: `Female`,
      other: `Other`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    hh_sex_8: {
      male: `Male`,
      female: `Female`,
      other: `Other`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    hh_sex_9: {
      male: `Male`,
      female: `Female`,
      other: `Other`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    hh_sex_10: {
      male: `Male`,
      female: `Female`,
      other: `Other`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    hh_sex_11: {
      male: `Male`,
      female: `Female`,
      other: `Other`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    hh_sex_12: {
      male: `Male`,
      female: `Female`,
      other: `Other`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    are_you_separated_from_any_of_your_households_members: {
      no: `No`,
      partner: `Partner (inc. husband/wife)`,
      child_lt_18: `Child < 18`,
      child_gte_18: `Child ≥ 18`,
      mother: `Mother`,
      father: `Father`,
      caregiver: `Caregiver`,
      other_relative: `Other relative`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    where_is_your_partner: {
      remained_behind_in_the_area_of_origin: `Remained behind in the area of origin`,
      do_not_know_their_whereabouts: `Do not know their whereabouts`,
      serving_in_the_military: `Serving in the military`,
      displaced_to_another_location_in_ukraine: `Displaced to another location in Ukraine`,
      displaced_to_another_country_outside_ukraine: `Displaced to another country outside Ukraine`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    where_is_your_partner_remain_behind_in_the_area_of_origin: {
      unable_to_travel_as_a_result_of_age_or_physical_impairment: `Unable to travel as a result of age or physical impairment`,
      unable_to_travel_due_to_safety_and_security_concerns: `Unable to travel due to safety and security concerns`,
      unable_to_travel_due_to_lack_of_financial_resources: `Unable to travel due to lack of financial resources`,
      stayed_to_keep_the_jobs: `Stayed to keep the jobs`,
      unwilling_to_leave_due_to_fear_of_conscription: `Unwilling to leave due to fear of conscription`,
      stayed_to_take_care_of_properties: `Stayed to take care of properties`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    where_is_your_child_lt_18: {
      remained_behind_in_the_area_of_origin: `Remained behind in the area of origin`,
      do_not_know_their_whereabouts: `Do not know their whereabouts`,
      serving_in_the_military: `Serving in the military`,
      displaced_to_another_location_in_ukraine: `Displaced to another location in Ukraine`,
      displaced_to_another_country_outside_ukraine: `Displaced to another country outside Ukraine`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    where_is_your_child_lt_18_remain_behind_in_the_area_of_origin: {
      unable_to_travel_as_a_result_of_age_or_physical_impairment: `Unable to travel as a result of age or physical impairment`,
      unable_to_travel_due_to_safety_and_security_concerns: `Unable to travel due to safety and security concerns`,
      unable_to_travel_due_to_lack_of_financial_resources: `Unable to travel due to lack of financial resources`,
      stayed_to_keep_the_jobs: `Stayed to keep the jobs`,
      unwilling_to_leave_due_to_fear_of_conscription: `Unwilling to leave due to fear of conscription`,
      stayed_to_take_care_of_properties: `Stayed to take care of properties`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    where_is_your_child_gte_18: {
      remained_behind_in_the_area_of_origin: `Remained behind in the area of origin`,
      do_not_know_their_whereabouts: `Do not know their whereabouts`,
      serving_in_the_military: `Serving in the military`,
      displaced_to_another_location_in_ukraine: `Displaced to another location in Ukraine`,
      displaced_to_another_country_outside_ukraine: `Displaced to another country outside Ukraine`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    where_is_your_child_gte_18_remain_behind_in_the_area_of_origin: {
      unable_to_travel_as_a_result_of_age_or_physical_impairment: `Unable to travel as a result of age or physical impairment`,
      unable_to_travel_due_to_safety_and_security_concerns: `Unable to travel due to safety and security concerns`,
      unable_to_travel_due_to_lack_of_financial_resources: `Unable to travel due to lack of financial resources`,
      stayed_to_keep_the_jobs: `Stayed to keep the jobs`,
      unwilling_to_leave_due_to_fear_of_conscription: `Unwilling to leave due to fear of conscription`,
      stayed_to_take_care_of_properties: `Stayed to take care of properties`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    where_is_your_mother: {
      remained_behind_in_the_area_of_origin: `Remained behind in the area of origin`,
      do_not_know_their_whereabouts: `Do not know their whereabouts`,
      serving_in_the_military: `Serving in the military`,
      displaced_to_another_location_in_ukraine: `Displaced to another location in Ukraine`,
      displaced_to_another_country_outside_ukraine: `Displaced to another country outside Ukraine`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    where_is_your_mother_remain_behind_in_the_area_of_origin: {
      unable_to_travel_as_a_result_of_age_or_physical_impairment: `Unable to travel as a result of age or physical impairment`,
      unable_to_travel_due_to_safety_and_security_concerns: `Unable to travel due to safety and security concerns`,
      unable_to_travel_due_to_lack_of_financial_resources: `Unable to travel due to lack of financial resources`,
      stayed_to_keep_the_jobs: `Stayed to keep the jobs`,
      unwilling_to_leave_due_to_fear_of_conscription: `Unwilling to leave due to fear of conscription`,
      stayed_to_take_care_of_properties: `Stayed to take care of properties`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    where_is_your_father: {
      remained_behind_in_the_area_of_origin: `Remained behind in the area of origin`,
      do_not_know_their_whereabouts: `Do not know their whereabouts`,
      serving_in_the_military: `Serving in the military`,
      displaced_to_another_location_in_ukraine: `Displaced to another location in Ukraine`,
      displaced_to_another_country_outside_ukraine: `Displaced to another country outside Ukraine`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    where_is_your_father_remain_behind_in_the_area_of_origin: {
      unable_to_travel_as_a_result_of_age_or_physical_impairment: `Unable to travel as a result of age or physical impairment`,
      unable_to_travel_due_to_safety_and_security_concerns: `Unable to travel due to safety and security concerns`,
      unable_to_travel_due_to_lack_of_financial_resources: `Unable to travel due to lack of financial resources`,
      stayed_to_keep_the_jobs: `Stayed to keep the jobs`,
      unwilling_to_leave_due_to_fear_of_conscription: `Unwilling to leave due to fear of conscription`,
      stayed_to_take_care_of_properties: `Stayed to take care of properties`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    where_is_your_caregiver: {
      remained_behind_in_the_area_of_origin: `Remained behind in the area of origin`,
      do_not_know_their_whereabouts: `Do not know their whereabouts`,
      serving_in_the_military: `Serving in the military`,
      displaced_to_another_location_in_ukraine: `Displaced to another location in Ukraine`,
      displaced_to_another_country_outside_ukraine: `Displaced to another country outside Ukraine`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    where_is_your_caregiver_remain_behind_in_the_area_of_origin: {
      unable_to_travel_as_a_result_of_age_or_physical_impairment: `Unable to travel as a result of age or physical impairment`,
      unable_to_travel_due_to_safety_and_security_concerns: `Unable to travel due to safety and security concerns`,
      unable_to_travel_due_to_lack_of_financial_resources: `Unable to travel due to lack of financial resources`,
      stayed_to_keep_the_jobs: `Stayed to keep the jobs`,
      unwilling_to_leave_due_to_fear_of_conscription: `Unwilling to leave due to fear of conscription`,
      stayed_to_take_care_of_properties: `Stayed to take care of properties`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    where_is_your_other_relative: {
      remained_behind_in_the_area_of_origin: `Remained behind in the area of origin`,
      do_not_know_their_whereabouts: `Do not know their whereabouts`,
      serving_in_the_military: `Serving in the military`,
      displaced_to_another_location_in_ukraine: `Displaced to another location in Ukraine`,
      displaced_to_another_country_outside_ukraine: `Displaced to another country outside Ukraine`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    where_is_your_other_relative_remain_behind_in_the_area_of_origin: {
      unable_to_travel_as_a_result_of_age_or_physical_impairment: `Unable to travel as a result of age or physical impairment`,
      unable_to_travel_due_to_safety_and_security_concerns: `Unable to travel due to safety and security concerns`,
      unable_to_travel_due_to_lack_of_financial_resources: `Unable to travel due to lack of financial resources`,
      stayed_to_keep_the_jobs: `Stayed to keep the jobs`,
      unwilling_to_leave_due_to_fear_of_conscription: `Unwilling to leave due to fear of conscription`,
      stayed_to_take_care_of_properties: `Stayed to take care of properties`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household: {
      pregnant_and_lactating_woman: `Pregnant and Lactating person (PLW)`,
      child_headed_household: `Child (< 18) headed household`,
      elder__headed_household: `Elder (≥ 60) headed household`,
      person_with_disability_headed_household: `Person with disability headed household`,
      chronicallyill_headed_household: `Household headed by a person with serious medical condition`,
      no_specific_needs: `No specific needs`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    do_you_have_a_household_member_that_has_a_lot_of_difficulty: {
      no: `No`,
      wg_seeing_even_if_wearing_glasses: `Seeing, even if wearing glasses`,
      wg_hearing_even_if_using_a_hearing_aid: `Hearing, even if using a hearing aid`,
      wg_walking_or_climbing_steps: `Walking or climbing steps`,
      wg_remembering_or_concentrating: `Remembering or concentrating`,
      wg_selfcare_such_as_washing_all_over_or_dressing: `Self-care, such as washing all over or dressing`,
      wg_using_your_usual_language_have_difficulty_communicating: `Using your usual (customary) language, have difficulty communicating, for example understanding or being understood?`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    do_you_or_anyone_in_your_household_have_a_disability_status_from_the_gov: {
      yes_all: `Yes, all of them`,
      no_none_or_not_all: `No, none or not all of them`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    why_dont_they_have_status: {
      status_registration_rejected_not_meeting_the_criteria_as_per_ukrainian_procedure: `Status registration rejected – not meeting the criteria as per Ukrainian procedure`,
      status_registration_not_requested: `Status registration not requested – not meeting the criteria as per Ukrainian procedure`,
      status_renewal_rejected: `Status renewal rejected`,
      delays_in_registration_process: `Delays in registration process`,
      inability_to_access_registration_costly_andor_lengthy_procedure: `Inability to access registration – Costly and/or lengthy procedure`,
      inability_to_access_registration_distance_andor_lack_of_transportation: `Inability to access registration – Distance and/or lack of transportation`,
      inability_to_access_registration_safety_risks: `Inability to access registration – Safety risks`,
      unwilling_to_register: `Unwilling to register`,
      unaware_ofnot_familiar_with_the_procedure: `Unaware of/not familiar with the procedure`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    do_you_or_anyone_in_your_household_receive_state_allowance_for_disability: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    does_the_household_host_children_who_are_relatives: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    does_the_household_host_children_who_are_not_relatives: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    do_you_identify_as_any_of_the_following: {
      returnee: `Returnee`,
      non_displaced: `Non-displaced member`,
      idp: `IDP`,
      refugee: `Refugee`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    are_you: {
      idp_returnee: `IDP returnee`,
      refugee_returnee: `Refugee returnee`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    why_did_you_leave_your_area_of_origin: {
      shelling_attacks_on_civilians: `Shelling, attacks on civilians`,
      exposure_to_uxoslandmines: `Exposure to UXOs/landmines`,
      destruction_or_damage_of_housing_land_andor_property_due_to_conflict: `Destruction or damage of housing, land and/or property due to conflict`,
      occupation_of_property: `Occupation of property`,
      criminality: `Criminality`,
      lack_of_access_to_safe_and_dignified_shelter: `Lack of access to safe and dignified shelter`,
      lack_of_access_to_essential_services: `Lack of access to essential services (health, water, education, civil documentation, etc.)`,
      lack_of_access_to_livelihoods_employment_and_economic_opportunities: `Lack of access to livelihoods, employment and economic opportunities`,
      infrastructure_damagedestruction: `Infrastructure damage/destruction`,
      seeking_family_reunification: `Seeking family reunification`,
      fear_of_conscription: `Fear of conscription`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    how_did_you_travel_to_your_displacement_location: {
      volunteer_and_or_ukrainian_ngo_supported_evacuation: `Volunteer and/or Ukrainian NGO supported evacuation`,
      un_ingo_supported_evacuation: `UN/INGO supported evacuation`,
      government_supported_evacuation: `Government supported evacuation`,
      own_means: `Own means`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    why_did_you_decide_to_return_to_your_area_of_origin: {
      improved_security_in_area_of_origin: `Improved security in area of origin`,
      increased_restored_service_availability_in_area_of_origin: `Increased/restored service availability in area of origin`,
      increased_restored_access_to_livelihood_employment_and_economic_opportunities_in_area_of_origin: `Increased/restored access to livelihood, employment and economic opportunities in area of origin`,
      repaired_restored_infrastructure_in_area_of_origin: `Repaired/restored infrastructure in area of origin`,
      repaired_housing_compensation_for_destroyedor_damaged_property_in_area_of_origin: `Repaired housing/compensation for destroyed or damaged property in area of origin`,
      seeking_family_reunification_in_area_of_origin: `Seeking family reunification in area of origin`,
      insecurity_armed_conflict_in_area_of_displacement: `Insecurity/armed conflict in area of displacement`,
      social_tensions_and_conflict_with_host_community_in_area_of_displacement: `Social tensions and conflict with host community in area of displacement`,
      lack_of_access_to_essential_services_in_area_of_displacement: `Lack of access to essential services (health, education, civil documentation, etc.) in area of displacement`,
      lack_of_access_to_livelihoods_employment_and_economic_opportunities_in_area_of_displacement: `Lack of access to livelihoods, employment and economic opportunities in area of displacement`,
      eviction_eviction_threats_in_area_of_displacement: `Eviction/eviction threats in area of displacement`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    have_you_received_any_form_of_compensation_for_leaving_your_area_of_origin: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    have_you_received_any_form_of_compensation_for_returnee_your_area_of_origin: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    was_your_movement_to_return_to_your_area_of_origin_supported_or_facilitated_by_any_of_the_following: {
      volunteer_and_or_ukrainian_ngo_supported_return: `Volunteer and/or Ukrainian NGO supported return`,
      un_ingo_supported_return: `UN/INGO supported return`,
      government_supported_return: `Government supported return`,
      host_communitys_local_authorities_supported_return: `Host community's local authorities supported return`,
      own_means: `Own means`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    did_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns: {
      none: `None`,
      looting_robbery: `Looting/robbery`,
      physical_assault: `Physical assault`,
      abduction: `Abduction`,
      arbitrary_detention: `Arbitrary detention`,
      shelling_or_missile_attacks: `Shelling or missile attacks`,
      harassment_at_checkpoints: `Harassment at checkpoints`,
      movement_restrictions: `Movement restrictions`,
      gbv_incident: `GBV incident`,
      extortion: `Extortion`,
      hate_speech: `Hate speech`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    have_you_been_displaced_prior_to_your_current_displacement: {
      yes_after_2014: `Yes, after 2014`,
      yes_after_february_24_2022: `Yes, after February 24, 2022`,
      no_first_displacement: `No, first displacement`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    what_are_your_households_intentions_in_terms_of_place_of_residence: {
      stay_in_place_of_habitual_residence: `Stay in place of habitual residence`,
      return_to_the_area_of_origin: `Return to the place of habitual residence?`,
      relocate_to_another_area_in_ukraine: `Relocate to another area in Ukraine`,
      relocate_to_a_country_outside_of_ukraine: `Relocate to a country outside of Ukraine`,
      integrate_into_the_local_community_of_current_place_of_residence: `Integrate into the local community of current place of residence`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    what_factors_would_be_key_to_support_your_successful_integration_into_the_local_community: {
      access_to_livelihoods_employment_and_economic_opportunities: `Access to livelihoods, employment and economic opportunities`,
      access_to_safe_and_dignified_shelter: `Access to safe and dignified shelter`,
      access_to_essential_services: `Access to essential services (health, education, civil documentation, etc.)`,
      social_cohesion: `Social cohesion`,
      family_reunification: `Family reunification`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    what_would_be_the_deciding_factor_in_your_return_to_your_area_of_origin: {
      improved_security_situation: `Improved security situation`,
      cessation_of_hostilities: `Cessation of hostilities`,
      government_regains_territory_from_ngca: `Government regains territory from NGCA`,
      increased_restored_service_availability_in_the_area_of_origin: `Increased/restored service availability in the area of origin`,
      increased_restored_access_to_livelihood_employment_and_economic_opportunities: `Increased/restored access to livelihood, employment and economic opportunities`,
      repaired_restored_infrastructure: `Repaired/restored infrastructure`,
      repaired_housing_compensation_for_destroyedor_damaged_property: `Repaired housing/compensation for destroyed or damaged property`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    why_are_planning_to_relocate_from_your_current_place_of_residence: {
      shelling_attacks_on_civilians: `Shelling, attacks on civilians`,
      exposure_to_uxoslandmines: `Exposure to UXOs/landmines`,
      destruction_or_damage_of_housing_land_andor_property_due_to_conflict: `Destruction or damage of housing, land and/or property due to conflict`,
      criminality: `Criminality`,
      lack_of_access_to_safe_and_dignified_shelter: `Lack of access to safe and dignified shelter`,
      lack_of_access_to_essential_services: `Lack of access to essential services (health, water, education, civil documentation, etc.)`,
      lack_of_access_to_livelihoods_employment_and_economic_opportunities: `Lack of access to livelihoods, employment and economic opportunities`,
      infrastructure_damagedestruction: `Infrastructure damage/destruction`,
      seeking_family_reunification: `Seeking family reunification`,
      fear_of_conscription: `Fear of conscription`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    as_nonUkrainian_do_you_have_documentation: {
      yes_refugee_status: `Yes, refugee status`,
      yes_asylum_request_registrated: `Yes, asylum request registered`,
      yes_residence_permit: `Yes, residence permit`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    as_stateless_person_household_do_you_have_a_stateless_registration_certificate: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    are_you_and_your_hh_members_registered_as_idps: {
      yes_all: `Yes, all of them`,
      no_some: `Yes, some`,
      none: `None`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    is_member_1_registered: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    does_1_lack_doc: {
      birth_certificate: `Birth certificate`,
      tin: `TIN - personal identification/tax number`,
      pensioner_cert_social: `Pensioners certificate (social)`,
      pensioner_cert_retirement: `Pensioner certificate (retirement)`,
      passport: `National passport`,
      none: `None`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    is_member_2_registered: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    does_2_lack_doc: {
      birth_certificate: `Birth certificate`,
      tin: `TIN - personal identification/tax number`,
      pensioner_cert_social: `Pensioners certificate (social)`,
      pensioner_cert_retirement: `Pensioner certificate (retirement)`,
      passport: `National passport`,
      none: `None`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    is_member_3_registered: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    does_3_lack_doc: {
      birth_certificate: `Birth certificate`,
      tin: `TIN - personal identification/tax number`,
      pensioner_cert_social: `Pensioners certificate (social)`,
      pensioner_cert_retirement: `Pensioner certificate (retirement)`,
      passport: `National passport`,
      none: `None`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    is_member_4_registered: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    does_4_lack_doc: {
      birth_certificate: `Birth certificate`,
      tin: `TIN - personal identification/tax number`,
      pensioner_cert_social: `Pensioners certificate (social)`,
      pensioner_cert_retirement: `Pensioner certificate (retirement)`,
      passport: `National passport`,
      none: `None`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    is_member_5_registered: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    does_5_lack_doc: {
      birth_certificate: `Birth certificate`,
      tin: `TIN - personal identification/tax number`,
      pensioner_cert_social: `Pensioners certificate (social)`,
      pensioner_cert_retirement: `Pensioner certificate (retirement)`,
      passport: `National passport`,
      none: `None`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    is_member_6_registered: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    does_6_lack_doc: {
      birth_certificate: `Birth certificate`,
      tin: `TIN - personal identification/tax number`,
      pensioner_cert_social: `Pensioners certificate (social)`,
      pensioner_cert_retirement: `Pensioner certificate (retirement)`,
      passport: `National passport`,
      none: `None`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    is_member_7_registered: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    does_7_lack_doc: {
      birth_certificate: `Birth certificate`,
      tin: `TIN - personal identification/tax number`,
      pensioner_cert_social: `Pensioners certificate (social)`,
      pensioner_cert_retirement: `Pensioner certificate (retirement)`,
      passport: `National passport`,
      none: `None`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    is_member_8_registered: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    does_8_lack_doc: {
      birth_certificate: `Birth certificate`,
      tin: `TIN - personal identification/tax number`,
      pensioner_cert_social: `Pensioners certificate (social)`,
      pensioner_cert_retirement: `Pensioner certificate (retirement)`,
      passport: `National passport`,
      none: `None`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    is_member_9_registered: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    does_9_lack_doc: {
      birth_certificate: `Birth certificate`,
      tin: `TIN - personal identification/tax number`,
      pensioner_cert_social: `Pensioners certificate (social)`,
      pensioner_cert_retirement: `Pensioner certificate (retirement)`,
      passport: `National passport`,
      none: `None`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    is_member_10_registered: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    does_10_lack_doc: {
      birth_certificate: `Birth certificate`,
      tin: `TIN - personal identification/tax number`,
      pensioner_cert_social: `Pensioners certificate (social)`,
      pensioner_cert_retirement: `Pensioner certificate (retirement)`,
      passport: `National passport`,
      none: `None`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    is_member_11_registered: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    does_11_lack_doc: {
      birth_certificate: `Birth certificate`,
      tin: `TIN - personal identification/tax number`,
      pensioner_cert_social: `Pensioners certificate (social)`,
      pensioner_cert_retirement: `Pensioner certificate (retirement)`,
      passport: `National passport`,
      none: `None`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    is_member_12_registered: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    does_12_lack_doc: {
      birth_certificate: `Birth certificate`,
      tin: `TIN - personal identification/tax number`,
      pensioner_cert_social: `Pensioners certificate (social)`,
      pensioner_cert_retirement: `Pensioner certificate (retirement)`,
      passport: `National passport`,
      none: `None`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    do_you_have_any_of_the_following: {
      idp_certificate: `IDP certificate (paper-based)`,
      idp_eregistration: `IDP e-registration`,
      no_proof_of_registration: `No proof of registration`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    do_you_and_your_hh_members_receive_the_idp_allowance: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    why_they_do_not_receive: {
      delays_in_allowances_payment: `Delays in allowance's payment`,
      change_of_place_of_residence: `Change of place of residence`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    why_are_you_not_registered: {
      registration_was_rejected: `Registration was rejected`,
      delays_in_registration_process: `Delays in registration process`,
      unaware_of_not_familiar_with_the_registration_process: `Unaware of/not familiar with the registration process`,
      unable_to_access_registration_center: `Unable to access registration center (i.e. due to access barriers, including sickness or reduced mobility, economic and social barriers, lack of transportation, etc.)`,
      costly_process: `Costly process`,
      not_entitled_to_register_as_an_idp: `Not entitled to register as IDP(s) as per Ukrainian legislation`,
      fear_of_conscription: `Fear of conscription`,
      lack_of_civil_documentation_required_to_process_registration_delays_in_issuance_of_civil_documentation_required: `Lack of civil documentation required to process registration/Delays in issuance of civil documentation required`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    why_not_registered: {
      multiple_displacements: `Multiple displacements`,
      lack_of_personal_documentation: `Lack of personal documentation`,
      displacement_area_not_falling_under_governmental_criteria_for_idp_registration: `Displacement area not falling under governmental criteria for IDP registration`,
      displacement_area_too_close_from_area_of_origin: `Displacement area too close from area of origin`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    what_housing_land_and_property_documents_do_you_lack: {
      none: `None`,
      property_ownership_for_apartment_house: `Property ownership for apartment/house`,
      property_ownership_certificate_for_land: `Property ownership certificate for land`,
      lease_agreement_for_house_apartment: `Lease agreement for house/apartment`,
      bti_bureau_of_technical_inventory_certificate: `BTI (Bureau of Technical Inventory) certificate`,
      construction_stage_substituted_with_bti_certificate_following_completion_of_construction: `Construction stage; substituted with BTI certificate following completion of construction`,
      death_certificate_of_predecessor: `Death certificate of predecessor`,
      inheritance_will: `Inheritance will`,
      inheritance_certificate: `Inheritance certificate`,
      document_issues_by_police_state_emergency_service_proving_that_the_house_was_damaged_destroyedfor_ukrainian_state_control_areas: `Document issued by police/State Emergency Service proving that the house was damaged/destroyed – For Ukrainian state control areas`,
      document_issues_by_local_self_government_proving_that_the_house_was_damaged_destroyed: `Document issued by local self-government proving that the house was damaged/destroyed`,
      cost_estimation_certificate_state_commission_issued_when_personal_request_is_made: `Cost estimation certificate - state commission (issued when personal request is made)`,
      death_declaration_certificate_by_ambulance_or_police_of_predecessor: `Death declaration certificate by ambulance or police of predecessor`,
      informatsiyna_dovidka_informational_extract_on_damaged_property: `Informatsiyna dovidka / Informational extract on damaged property`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    have_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation: {
      length_of_administrative_procedures: `Length of administrative procedures`,
      cost_of_administrative_procedures: `Cost of administrative procedures`,
      lack_of_information: `Lack of information`,
      distance_or_cost_of_transportation: `Distance or cost of transportation`,
      lack_of_devices_or_internet_connectivity_to_access_online_procedure: `Lack of devices or internet connectivity to access online procedure`,
      lack_of_legal_support_to_access_the_procedure: `Lack of legal support to access the procedure`,
      inability_of_the_service_to_provide_required_documentation: `Inability of the service to provide required documentation`,
      discrimination: `Discrimination`,
      distrust_of_public_institutions_and_authorities: `Distrust of public institutions and authorities`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    please_rate_your_sense_of_safety_in_this_location: {
      _1_very_unsafe: `1 - Very unsafe`,
      _2_unsafe: `2 - Unsafe`,
      _3_safe: `3 - Safe`,
      _4_very_safe: `4 - Very safe`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    what_are_the_main_factors_that_make_this_location_feel_unsafe: {
      presence_of_armed_or_security_actors: `Presence of armed or security actors`,
      bombardment_shelling_or_threat_of_shelling: `Bombardment/shelling or threat of shelling`,
      fighting_between_armed_or_security_actors: `Fighting between armed or security actors`,
      landmines_or_uxos_contamination: `Landmines or UXOs contamination`,
      criminality: `Criminality`,
      intercommunity_tensions: `Intercommunity tensions`,
      risks_of_eviction: `Risks of eviction`,
      risks_of_arbitrary_arrest_detention: `Risks of arbitrary arrest/detention`,
      risks_of_abduction_or_enforced_disappearance: `Risks of abduction or enforced disappearance`,
      risks_of_sexual_violence_and_exploitation: `Risks of sexual violence and exploitation`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    how_would_you_describe_the_relationship_between_member_of_the_host_community: {
      _1_very_bad: `1 - Very bad`,
      _2_bad: `2 - Bad`,
      _3_acceptable: `3 - Acceptable`,
      _4_good: `4 - Good`,
      _5_very_good: `5 - Very good`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    what_factors_are_affecting_the_relationship_between_communities_in_this_location: {
      language_difference: `Language difference`,
      tension_over_access_to_humanitarian_assistance: `Tension over access to humanitarian assistance`,
      tension_over_access_to_services_and_or_employment_opportunities: `Tension over access to services and/or employment opportunities`,
      tension_over_conscription_procedures: `Tension over conscription procedures`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    have_you_or_your_household_members_experienced_incidents_with_host_community_members_idps_returnees: {
      harassment_violence_or_abuse: `Harassment, violence or abuse`,
      discrimination_over_access_to_basic_services: `Discrimination over access to basic services`,
      restrictions_on_participation_in_public_affairs_and_community_events: `Restrictions on participation in public affairs and community events`,
      dispute_over_access_to_humanitarian_assistance: `Dispute over access to humanitarian assistance`,
      dispute_or_conflict_over_land_shelter_property: `Dispute or conflict over land, shelter, property`,
      dispute_or_conflict_over_livelihood_or_other_financial_resources: `Dispute or conflict over livelihood or other financial resources`,
      dispute_or_conflict_over_ethic_political_or_social_issues: `Dispute or conflict over ethic, political or social issues`,
      no_incident_experienced: `No incident experienced`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    do_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area: {
      no: `No`,
      fear_of_conscription_including_selfrestriction_of_movement: `Fear of conscription, including self-restriction of movement`,
      lack_of_documentation: `Lack of documentation`,
      armed_conflict_including_shelling: `Armed conflict, including shelling`,
      presence_of_explosive_ordnance: `Presence of explosive ordnance`,
      risks_of_sexual_violence_and_exploitation: `Risks of sexual violence and exploitation`,
      discrimination: `Discrimination`,
      intercommunity_tensions: `Intercommunity tensions`,
      lack_of_transportationfinancial_resources_to_pay_transportation: `Lack of transportation/financial resources to pay transportation`,
      reduced_mobility_linked_with_health_issues_or_disability: `Reduced mobility linked with health issues or disability`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    has_any_adult_male_member_experienced_violence: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence: {
      killing_incl_extrajudicial_execution: `Killing (incl. extrajudicial execution)`,
      killing_injury_due_to_indiscriminate_attacks: `Killing/injury due to indiscriminate attacks`,
      abduction_kidnapping_or_enforced_disappearance: `Abduction, kidnapping or enforced disappearance`,
      arbitrary_arrest_detention: `Arbitrary arrest/detention`,
      forced_recruitment_by_armed_actors: `Forced recruitment by armed actors`,
      physical_assault: `Physical assault`,
      sexual_exploitation_and_abuse: `Sexual exploitation and abuse`,
      rape: `Rape`,
      torture_or_inhumane_cruel_and_degrading_treatment: `Torture or inhumane, cruel and degrading treatment`,
      forced_or_exploitative_labour: `Forced or exploitative labour`,
      trafficking_incl_forced_prostitution_organ_harvesting: `Trafficking (incl. forced prostitution, organ harvesting)`,
      denial_of_right_to_return: `Denial of right to return`,
      forced_internal_displacement: `Forced internal displacement`,
      forced_return_idp_only: `Forced return (IDP only)`,
      denial_of_access_to_basic_services_humanitarian_assistance: `Denial of access to basic services/humanitarian assistance`,
      forced_eviction: `Forced eviction`,
      destruction_of_property: `Destruction of property`,
      occupation_of_property: `Occupation of property`,
      extortion_of_property: `Extortion of property`,
      theft_and_robbery: `Theft and robbery`,
      lack_of_confiscation_or_denial_of_civil_documentation: `Lack of, confiscation or denial of civil documentation`,
      denial_of_travel_documents: `Denial of travel documents`,
      denial_of_idp_registration: `Denial of IDP registration`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    when_did_the_incidents_occur_has_any_adult_male_member_experienced_violence: {
      predisplacement_or_in_the_area_of_origin: `Pre-displacement or in the area of origin`,
      during_the_displacement_journey: `During the displacement journey`,
      in_displacement_location: `In displacement location`,
    },
    who_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence: {
      the_russian_armed_forces: `The Russian Armed Forces`,
      armed_forces_of_ukraine: `Armed forces of Ukraine`,
      armed_groups_militias: `Armed groups/militias`,
      criminal_groups: `Criminal groups`,
      traffickers_smugglers: `Traffickers/smugglers`,
      community_members_within_the_host_community: `Community members within the host community`,
      community_members_within_the_displaced_community: `Community members within the displaced community`,
      humanitarian_assistance_providers: `Humanitarian assistance providers`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    has_any_adult_female_member_experienced_violence: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    what_type_of_incidents_took_place_has_any_adult_female_member_experienced_violence: {
      killing_incl_extrajudicial_execution: `Killing (incl. extrajudicial execution)`,
      killing_injury_due_to_indiscriminate_attacks: `Killing/injury due to indiscriminate attacks`,
      abduction_kidnapping_or_enforced_disappearance: `Abduction, kidnapping or enforced disappearance`,
      arbitrary_arrest_detention: `Arbitrary arrest/detention`,
      forced_recruitment_by_armed_actors: `Forced recruitment by armed actors`,
      physical_assault: `Physical assault`,
      sexual_exploitation_and_abuse: `Sexual exploitation and abuse`,
      rape: `Rape`,
      torture_or_inhumane_cruel_and_degrading_treatment: `Torture or inhumane, cruel and degrading treatment`,
      forced_or_exploitative_labour: `Forced or exploitative labour`,
      trafficking_incl_forced_prostitution_organ_harvesting: `Trafficking (incl. forced prostitution, organ harvesting)`,
      denial_of_right_to_return: `Denial of right to return`,
      forced_internal_displacement: `Forced internal displacement`,
      forced_return_idp_only: `Forced return (IDP only)`,
      denial_of_access_to_basic_services_humanitarian_assistance: `Denial of access to basic services/humanitarian assistance`,
      forced_eviction: `Forced eviction`,
      destruction_of_property: `Destruction of property`,
      occupation_of_property: `Occupation of property`,
      extortion_of_property: `Extortion of property`,
      theft_and_robbery: `Theft and robbery`,
      lack_of_confiscation_or_denial_of_civil_documentation: `Lack of, confiscation or denial of civil documentation`,
      denial_of_travel_documents: `Denial of travel documents`,
      denial_of_idp_registration: `Denial of IDP registration`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    when_did_the_incidents_occur_has_any_adult_female_member_experienced_violence: {
      predisplacement_or_in_the_area_of_origin: `Pre-displacement or in the area of origin`,
      during_the_displacement_journey: `During the displacement journey`,
      in_displacement_location: `In displacement location`,
    },
    who_were_the_perpetrators_of_the_incident_has_any_adult_female_member_experienced_violence: {
      the_russian_armed_forces: `The Russian Armed Forces`,
      armed_forces_of_ukraine: `Armed forces of Ukraine`,
      armed_groups_militias: `Armed groups/militias`,
      criminal_groups: `Criminal groups`,
      traffickers_smugglers: `Traffickers/smugglers`,
      community_members_within_the_host_community: `Community members within the host community`,
      community_members_within_the_displaced_community: `Community members within the displaced community`,
      humanitarian_assistance_providers: `Humanitarian assistance providers`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    has_any_boy_member_experienced_violence: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    what_type_of_incidents_took_place_has_any_boy_member_experienced_violence: {
      killing_incl_extrajudicial_execution: `Killing (incl. extrajudicial execution)`,
      killing_injury_due_to_indiscriminate_attacks: `Killing/injury due to indiscriminate attacks`,
      abduction_kidnapping_or_enforced_disappearance: `Abduction, kidnapping or enforced disappearance`,
      arbitrary_arrest_detention: `Arbitrary arrest/detention`,
      forced_recruitment_by_armed_actors: `Forced recruitment by armed actors`,
      physical_assault: `Physical assault`,
      sexual_exploitation_and_abuse: `Sexual exploitation and abuse`,
      rape: `Rape`,
      torture_or_inhumane_cruel_and_degrading_treatment: `Torture or inhumane, cruel and degrading treatment`,
      forced_or_exploitative_labour: `Forced or exploitative labour`,
      trafficking_incl_forced_prostitution_organ_harvesting: `Trafficking (incl. forced prostitution, organ harvesting)`,
      denial_of_right_to_return: `Denial of right to return`,
      forced_internal_displacement: `Forced internal displacement`,
      forced_return_idp_only: `Forced return (IDP only)`,
      denial_of_access_to_basic_services_humanitarian_assistance: `Denial of access to basic services/humanitarian assistance`,
      forced_eviction: `Forced eviction`,
      destruction_of_property: `Destruction of property`,
      occupation_of_property: `Occupation of property`,
      extortion_of_property: `Extortion of property`,
      theft_and_robbery: `Theft and robbery`,
      lack_of_confiscation_or_denial_of_civil_documentation: `Lack of, confiscation or denial of civil documentation`,
      denial_of_travel_documents: `Denial of travel documents`,
      denial_of_idp_registration: `Denial of IDP registration`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    when_did_the_incidents_occur_has_any_boy_member_experienced_violence: {
      predisplacement_or_in_the_area_of_origin: `Pre-displacement or in the area of origin`,
      during_the_displacement_journey: `During the displacement journey`,
      in_displacement_location: `In displacement location`,
    },
    who_were_the_perpetrators_of_the_incident_has_any_boy_member_experienced_violence: {
      the_russian_armed_forces: `The Russian Armed Forces`,
      armed_forces_of_ukraine: `Armed forces of Ukraine`,
      armed_groups_militias: `Armed groups/militias`,
      criminal_groups: `Criminal groups`,
      traffickers_smugglers: `Traffickers/smugglers`,
      community_members_within_the_host_community: `Community members within the host community`,
      community_members_within_the_displaced_community: `Community members within the displaced community`,
      humanitarian_assistance_providers: `Humanitarian assistance providers`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    has_any_girl_member_experienced_violence: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    what_type_of_incidents_took_place_has_any_girl_member_experienced_violence: {
      killing_incl_extrajudicial_execution: `Killing (incl. extrajudicial execution)`,
      killing_injury_due_to_indiscriminate_attacks: `Killing/injury due to indiscriminate attacks`,
      abduction_kidnapping_or_enforced_disappearance: `Abduction, kidnapping or enforced disappearance`,
      arbitrary_arrest_detention: `Arbitrary arrest/detention`,
      forced_recruitment_by_armed_actors: `Forced recruitment by armed actors`,
      physical_assault: `Physical assault`,
      sexual_exploitation_and_abuse: `Sexual exploitation and abuse`,
      rape: `Rape`,
      torture_or_inhumane_cruel_and_degrading_treatment: `Torture or inhumane, cruel and degrading treatment`,
      forced_or_exploitative_labour: `Forced or exploitative labour`,
      trafficking_incl_forced_prostitution_organ_harvesting: `Trafficking (incl. forced prostitution, organ harvesting)`,
      denial_of_right_to_return: `Denial of right to return`,
      forced_internal_displacement: `Forced internal displacement`,
      forced_return_idp_only: `Forced return (IDP only)`,
      denial_of_access_to_basic_services_humanitarian_assistance: `Denial of access to basic services/humanitarian assistance`,
      forced_eviction: `Forced eviction`,
      destruction_of_property: `Destruction of property`,
      occupation_of_property: `Occupation of property`,
      extortion_of_property: `Extortion of property`,
      theft_and_robbery: `Theft and robbery`,
      lack_of_confiscation_or_denial_of_civil_documentation: `Lack of, confiscation or denial of civil documentation`,
      denial_of_travel_documents: `Denial of travel documents`,
      denial_of_idp_registration: `Denial of IDP registration`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    when_did_the_incidents_occur_has_any_girl_member_experienced_violence: {
      predisplacement_or_in_the_area_of_origin: `Pre-displacement or in the area of origin`,
      during_the_displacement_journey: `During the displacement journey`,
      in_displacement_location: `In displacement location`,
    },
    who_were_the_perpetrators_of_the_incident_has_any_girl_member_experienced_violence: {
      the_russian_armed_forces: `The Russian Armed Forces`,
      armed_forces_of_ukraine: `Armed forces of Ukraine`,
      armed_groups_militias: `Armed groups/militias`,
      criminal_groups: `Criminal groups`,
      traffickers_smugglers: `Traffickers/smugglers`,
      community_members_within_the_host_community: `Community members within the host community`,
      community_members_within_the_displaced_community: `Community members within the displaced community`,
      humanitarian_assistance_providers: `Humanitarian assistance providers`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    has_any_other_member_experienced_violence: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    what_type_of_incidents_took_place_has_any_other_member_experienced_violence: {
      killing_incl_extrajudicial_execution: `Killing (incl. extrajudicial execution)`,
      killing_injury_due_to_indiscriminate_attacks: `Killing/injury due to indiscriminate attacks`,
      abduction_kidnapping_or_enforced_disappearance: `Abduction, kidnapping or enforced disappearance`,
      arbitrary_arrest_detention: `Arbitrary arrest/detention`,
      forced_recruitment_by_armed_actors: `Forced recruitment by armed actors`,
      physical_assault: `Physical assault`,
      sexual_exploitation_and_abuse: `Sexual exploitation and abuse`,
      rape: `Rape`,
      torture_or_inhumane_cruel_and_degrading_treatment: `Torture or inhumane, cruel and degrading treatment`,
      forced_or_exploitative_labour: `Forced or exploitative labour`,
      trafficking_incl_forced_prostitution_organ_harvesting: `Trafficking (incl. forced prostitution, organ harvesting)`,
      denial_of_right_to_return: `Denial of right to return`,
      forced_internal_displacement: `Forced internal displacement`,
      forced_return_idp_only: `Forced return (IDP only)`,
      denial_of_access_to_basic_services_humanitarian_assistance: `Denial of access to basic services/humanitarian assistance`,
      forced_eviction: `Forced eviction`,
      destruction_of_property: `Destruction of property`,
      occupation_of_property: `Occupation of property`,
      extortion_of_property: `Extortion of property`,
      theft_and_robbery: `Theft and robbery`,
      lack_of_confiscation_or_denial_of_civil_documentation: `Lack of, confiscation or denial of civil documentation`,
      denial_of_travel_documents: `Denial of travel documents`,
      denial_of_idp_registration: `Denial of IDP registration`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    when_did_the_incidents_occur_has_any_other_member_experienced_violence: {
      predisplacement_or_in_the_area_of_origin: `Pre-displacement or in the area of origin`,
      during_the_displacement_journey: `During the displacement journey`,
      in_displacement_location: `In displacement location`,
    },
    who_were_the_perpetrators_of_the_incident_has_any_other_member_experienced_violence: {
      the_russian_armed_forces: `The Russian Armed Forces`,
      armed_forces_of_ukraine: `Armed forces of Ukraine`,
      armed_groups_militias: `Armed groups/militias`,
      criminal_groups: `Criminal groups`,
      traffickers_smugglers: `Traffickers/smugglers`,
      community_members_within_the_host_community: `Community members within the host community`,
      community_members_within_the_displaced_community: `Community members within the displaced community`,
      humanitarian_assistance_providers: `Humanitarian assistance providers`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    do_you_or_members_of_your_household_experience_discrimination_or_stigmatization_in_your_current_area_of_residence: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    on_what_ground: {
      age: `Age`,
      gender: `Gender`,
      disability: `Disability`,
      nationality: `Nationality`,
      area_of_origin: `Area of origin (within Ukraine)`,
      religion: `Religion`,
      sexual_orientation: `Sexual orientation`,
      political_opinions: `Political opinions`,
      ethnicity: `Ethnicity`,
      medical_condition: `Medical condition`,
      language: `Language`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    is_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs: {
      feeling_sad_depressed_tired: `Feeling sad/depressed/tired`,
      withdrawal_isolation: `Withdrawal/isolation`,
      anxiety: `Anxiety`,
      anger: `Anger`,
      fear: `Fear`,
      agitation_moodiness: `Agitation/Moodiness`,
      careless: `Careless`,
      feeling_hopeless: `Feeling hopeless`,
      no_sign_of_psychological_distress: `No sign of psychological distress`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    is_are_any_child_member_of_your_household_displaying_any_of_the_following_signs: {
      feeling_sad_depressed_tired: `Feeling sad/depressed/tired`,
      withdrawal_isolation: `Withdrawal/isolation`,
      anxiety: `Anxiety`,
      anger: `Anger`,
      fear: `Fear`,
      agitation_moodiness: `Agitation/Moodiness`,
      careless: `Careless`,
      feeling_hopeless: `Feeling hopeless`,
      no_sign_of_psychological_distress: `No sign of psychological distress`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    do_household_members_experiencing_distress_have_access_to_relevant_care_and_services: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    what_are_the_barriers_to_access_services: {
      lack_of_available_services: `Lack of available services`,
      lack_of_information_about_available_services: `Lack of information about available services`,
      distance_lack_of_transportation_means_to_access_services: `Distance – lack of transportation means to access services`,
      cost_associated_with_transportation_to_the_services: `Cost associated with transportation to the services`,
      cost_of_the_services_provided_medication: `Cost of the services provided/medication`,
      language_barriers: `Language barriers`,
      requirement_for_civil_documentation: `Requirement for civil documentation`,
      poor_quality_of_the_services_provided: `Poor quality of the services provided`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    what_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members: {
      displacement_related_stress: `Displacement related stress`,
      fear_of_being_killed_or_injured_by_armed_violence: `Fear of being killed or injured by armed violence`,
      fear_of_property_being_damaged_or_destroyedby_armed_violence: `Fear of property being damaged or destroyed by armed violence`,
      fear_of_being_sexually_assaulted: `Fear of being sexually assaulted`,
      fear_of_conscription: `Fear of conscription`,
      missing_family_members: `Missing family members`,
      lack_of_access_to_basic_services: `Lack of access to basic services`,
      lack_of_access_to_employment_opportunities: `Lack of access to employment opportunities`,
      lack_of_access_to_specialized_medical_services: `Lack of access to specialized medical services`,
      stigmatization_discrimination: `Stigmatization/discrimination`,
      worries_about_the_children: `Worries about the children`,
      worries_about_the_future: `Worries about the future`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    what_are_the_main_sources_of_income_of_your_household: {
      salary_formal_employment: `Salary – Formal Employment`,
      casual_labour: `Casual (Temporary) Labour`,
      remittances: `Remittances`,
      assistance_from_family_friends: `Assistance from Family/Friends`,
      debt: `Debt`,
      savings: `Savings`,
      humanitarian_assistance: `Humanitarian Assistance (Cash or In Kind)`,
      business_self_employment: `Business/Self Employment`,
      social_protection_payments: `Social protection payments (pensions, allowances, etc.)`,
      no_resources_coming_into_the_household: `No resources coming into the household`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    what_type_of_allowances_do_you_receive: {
      idp_allowance: `IDP allowance`,
      pension_for_elderly_people: `Pension for elderly people`,
      pension_for_people_with_disability: `Pension for people with disability`,
      pension_for_3_or_more_children_in_the_household: `Pension for 3 or more children in the household`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    what_is_the_average_month_income_per_household: {
      no_income: `No income`,
      up_to_3000_UAH: `Up to 3,000 UAH`,
      between_3001_6000_UAH: `Between 3,001 - 6,000 UAH`,
      between_6001_9000_UAH: `Between 6,001 - 9,000 UAH`,
      between_9001_12000_UAH: `Between 9,001 - 12,000 UAH`,
      between_12001_15000_UAH: `Between 12,001 - 15,000 UAH`,
      more_than_15000_UAH: `More than 15,000 UAH`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    including_yourself_are_there_members_of_your_household_who_are_out_of_work_and_seeking_employment: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    what_are_the_reasons_for_being_out_of_work: {
      lack_of_available_jobs: `Lack of available jobs`,
      low_or_off_season: `Low or off season (agriculture)`,
      skills_do_not_match_demand: `Skills do not match demand`,
      housework_caring_for_children: `Housework / caring for children`,
      lack_of_information_about_job_market: `Lack of information about job market`,
      lack_of_experience: `Lack of experience`,
      physical_impairment_limitations: `Physical impairment/limitations (chronic illness, disability)`,
      discrimination_based_on_age: `Discrimination based on age`,
      mine_containment: `Mine containment`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    are_there_gaps_in_meeting_your_basic_needs: {
      yes_a_lot: `Yes a lot`,
      yes_somewhat: `Yes somewhat`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    what_are_the_strategies_that_your_household_uses_to_cope_with_these_challenges: {
      spending_savings: `Spending savings`,
      selling_off_household_productive_assets: `Selling off household/productive assets`,
      selling_off_received_humanitarian_assistance: `Selling off received humanitarian assistance`,
      selling_off_housing_and_or_land: `Selling off housing and/or land`,
      borrowing_money: `Borrowing money (from a formal lender/bank)`,
      depending_on_support_from_family_external_assistance: `Depending on support from family/external assistance`,
      begging: `Begging`,
      engaging_in_dangerous_or_exploitative_work: `Engaging in dangerous or exploitative work`,
      no_coping_strategy: `No coping strategy`,
      reducing_consumption_of_food: `Reducing consumption of food (Reducing portion sizes/reducing number of meals consumed per day/replacing food with less healthy cheaper options)`,
      reducing_consumption_of_essential_medicines_or_healthcare_services: `Reducing consumption of essential medicines or healthcare services`,
      sending_children_into_employment: `Sending children into employment`,
      removing_children_from_education: `Removing children from education`,
      sending_hh_members_to_live_elsewhere: `Sending HH members to live elsewhere`,
      choosing_less_suitable_accommodation: `Choosing less suitable accommodation (cheaper/less safe/etc)`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    are_schoolaged_children_in_your_household_regularly_attending_primary_or_secondary_education: {
      yes_all_of_them: `Yes, all of them`,
      yes_some_of_them: `Yes, some of them`,
      no_none_of_them: `No, none of them`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    is_it: {
      online_education: `Online education`,
      education_in_school: `Education in school`,
      hybrid_mode: `Hybrid mode`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    what_are_the_reasons_preventing_children_in_your_household_from_regularly_attending_education_services: {
      newly_displaced: `Newly displaced (ongoing school registration)`,
      lack_of_available_school: `Lack of available school`,
      lack_of_internet_connectivity_to_attend_online_school: `Lack of internet connectivity to attend online school`,
      safety_risks_associated_with_access_to_presence_at_school: `Safety risks associated with access to/presence at school (including lack of shelter)`,
      distance_lack_of_transportation_means_to_access_the_service: `Distance - lack of transportation means to access the service`,
      cost_associated_with_transportation_to_school: `Cost associated with transportation to school`,
      cost_associated_with_online_education: `Cost associated with online education (laptop, internet, etc.)`,
      lack_of_personal_documentation: `Lack of personal documentation`,
      lack_of_recognized_certificates: `Lack of recognized certificates (including when obtained in NGCAs)`,
      discrimination_restriction_of_access: `Discrimination/restriction of access`,
      lack_of_specialized_education_services: `Lack of specialized education services (including for children with disabilities)`,
      cost_of_specialized_materials: `Cost of specialized materials (including for children with disabilities)`,
      language_barriers: `Language barriers`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    what_is_your_current_housing_structure: {
      house_apartment: `House/Apartment`,
      room_in_private_house: `Room in private house`,
      collective_shelter: `Collective shelter (public building)`,
      privatelyowned_collective_shelter: `Privately-owned collective shelter`,
      no_shelter: `No shelter (homeless)`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    what_is_the_tenure_status_of_your_accommodation_private: {
      accommodation_with_host_family: `Accommodation with host family (relatives) (no rental fees)`,
      renting_private_accommodation: `Renting private accommodation`,
      owning_private_accommodation: `Owning private accommodation (respondent owns the property)`,
      squatting_private_property_without_permission: `Squatting private property without permission`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    what_is_the_tenure_status_of_your_accommodation_public: {
      rental_fees: `Rental fees`,
      utilities_fees_only: `Utilities fees only`,
      no_rental_utilities_fees: `No rental/utilities fees`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    do_you_have_formal_rental_documents_to_stay_in_your_accommodation: {
      yes_i_have_a_written_lease_agreement: `Yes, I have a written lease agreement`,
      yes_i_have_state_assigned_shelter_with_proving_documents: `Yes, I have state assigned shelter with proving documents`,
      verbal_agreement: `Verbal agreement`,
      no_formal_documents: `No formal documents`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    what_is_the_general_condition_of_your_accommodation: {
      sound_condition: `Sound condition`,
      partially_damaged: `Partially damaged (light/medium repair needed)`,
      severely_damaged: `Severely damaged (heavy structural repair needed)`,
      destroyed: `Destroyed (no repair possible)`,
      unfinished: `Unfinished`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    what_are_your_main_concerns_regarding_your_accommodation: {
      none: `None`,
      risk_of_eviction: `Risk of eviction`,
      accommodations_condition: `Accommodation’s condition`,
      overcrowded_lack_of_privacy: `Overcrowded/Lack of privacy`,
      lack_of_functioning_utilities: `Lack of functioning utilities`,
      lack_of_connectivity: `Lack of connectivity`,
      security_and_safety_risks: `Security and safety risks`,
      lack_of_financial_compensation_or_rehabilitation_for_damage_or_destruction_of_housing: `Lack of support for damaged housing`,
      lack_or_loss_of_ownership_documentation: `Lack or loss of ownership documentation`,
      not_disability_inclusive: `Not disability inclusive`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    do_you_have_access_to_health_care_in_your_current_location: {
      yes: `Yes`,
      partial_access: `Partial access`,
      no_access: `No access`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    what_are_the_barriers_to_accessing_health_services: {
      lack_of_available_health_facility: `Lack of available health facility`,
      lack_of_specialized_health_care_services: `Lack of specialized health care services`,
      safety_risks_associated_with_access_to_presence_at_health_facility: `Safety risks associated with access to/presence at health facility`,
      distance_lack_of_transportation_means_to_access_facilities: `Distance - lack of transportation means to access facilities`,
      cost_associated_with_transportation_to_facilities: `Cost associated with transportation to facilities`,
      cost_of_the_services_provided_medication: `Cost of the services provided/medication`,
      requirement_for_civil_documentation: `Requirement for civil documentation`,
      lack_shortage_of_medication: `Lack/shortage of medication`,
      discrimination_restriction_of_access: `Discrimination/restriction of access`,
      not_accessible_for_persons_with_disabilities: `Not accessible for persons with disabilities`,
      long_waiting_time: `Long waiting time`,
      language_barriers: `Language barriers`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    what_is_your_1_priority: {
      education: `Education (primary/secondary)`,
      education_ter: `Education (tertiary)`,
      food: `Food`,
      shelter: `Shelter`,
      wash: `WASH`,
      health_1_2: `Health (primary/secondary health care)`,
      health_m: `Health (mental health care)`,
      health_srh: `Health (SRH)`,
      psychosocial_support: `Psychosocial support`,
      legal_assistance_civil_documentation: `Legal assistance/Civil documentation`,
      livelihood_support: `Livelihood support`,
      vocational_training: `Vocational training`,
      nfis: `NFIs`,
      none: `None`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    what_is_your_2_priority: {
      education: `Education (primary/secondary)`,
      education_ter: `Education (tertiary)`,
      food: `Food`,
      shelter: `Shelter`,
      wash: `WASH`,
      health_1_2: `Health (primary/secondary health care)`,
      health_m: `Health (mental health care)`,
      health_srh: `Health (SRH)`,
      psychosocial_support: `Psychosocial support`,
      legal_assistance_civil_documentation: `Legal assistance/Civil documentation`,
      livelihood_support: `Livelihood support`,
      vocational_training: `Vocational training`,
      nfis: `NFIs`,
      none: `None`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    what_is_your_3_priority: {
      education: `Education (primary/secondary)`,
      education_ter: `Education (tertiary)`,
      food: `Food`,
      shelter: `Shelter`,
      wash: `WASH`,
      health_1_2: `Health (primary/secondary health care)`,
      health_m: `Health (mental health care)`,
      health_srh: `Health (SRH)`,
      psychosocial_support: `Psychosocial support`,
      legal_assistance_civil_documentation: `Legal assistance/Civil documentation`,
      livelihood_support: `Livelihood support`,
      vocational_training: `Vocational training`,
      nfis: `NFIs`,
      none: `None`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other (specify)`,
    },
    need_for_assistance: {
      yes: `Yes`,
      no: `No`,
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
      how_many_ind: _.how_many_ind ? +_.how_many_ind : undefined,
      hh_age_1: _.hh_age_1 ? +_.hh_age_1 : undefined,
      hh_age_2: _.hh_age_2 ? +_.hh_age_2 : undefined,
      hh_age_3: _.hh_age_3 ? +_.hh_age_3 : undefined,
      hh_age_4: _.hh_age_4 ? +_.hh_age_4 : undefined,
      hh_age_5: _.hh_age_5 ? +_.hh_age_5 : undefined,
      hh_age_6: _.hh_age_6 ? +_.hh_age_6 : undefined,
      hh_age_7: _.hh_age_7 ? +_.hh_age_7 : undefined,
      hh_age_8: _.hh_age_8 ? +_.hh_age_8 : undefined,
      hh_age_9: _.hh_age_9 ? +_.hh_age_9 : undefined,
      hh_age_10: _.hh_age_10 ? +_.hh_age_10 : undefined,
      hh_age_11: _.hh_age_11 ? +_.hh_age_11 : undefined,
      hh_age_12: _.hh_age_12 ? +_.hh_age_12 : undefined,
      are_you_separated_from_any_of_your_households_members:
        _.are_you_separated_from_any_of_your_households_members?.split(' '),
      do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household:
        _.do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household?.split(' '),
      do_you_have_a_household_member_that_has_a_lot_of_difficulty:
        _.do_you_have_a_household_member_that_has_a_lot_of_difficulty?.split(' '),
      how_many_children_have_one_or_more_of_the_functional_limitations:
        _.how_many_children_have_one_or_more_of_the_functional_limitations
          ? +_.how_many_children_have_one_or_more_of_the_functional_limitations
          : undefined,
      how_many_adults_members_have_one_or_more_of_the_functional_limitations:
        _.how_many_adults_members_have_one_or_more_of_the_functional_limitations
          ? +_.how_many_adults_members_have_one_or_more_of_the_functional_limitations
          : undefined,
      why_did_you_leave_your_area_of_origin: _.why_did_you_leave_your_area_of_origin?.split(' '),
      when_did_you_leave_your_area_of_origin: _.when_did_you_leave_your_area_of_origin
        ? new Date(_.when_did_you_leave_your_area_of_origin)
        : undefined,
      how_did_you_travel_to_your_displacement_location: _.how_did_you_travel_to_your_displacement_location?.split(' '),
      when_did_you_first_leave_your_area_of_origin: _.when_did_you_first_leave_your_area_of_origin
        ? new Date(_.when_did_you_first_leave_your_area_of_origin)
        : undefined,
      when_did_you_return_to_your_area_of_origin: _.when_did_you_return_to_your_area_of_origin
        ? new Date(_.when_did_you_return_to_your_area_of_origin)
        : undefined,
      why_did_you_decide_to_return_to_your_area_of_origin:
        _.why_did_you_decide_to_return_to_your_area_of_origin?.split(' '),
      was_your_movement_to_return_to_your_area_of_origin_supported_or_facilitated_by_any_of_the_following:
        _.was_your_movement_to_return_to_your_area_of_origin_supported_or_facilitated_by_any_of_the_following?.split(
          ' ',
        ),
      did_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns:
        _.did_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns?.split(
          ' ',
        ),
      what_factors_would_be_key_to_support_your_successful_integration_into_the_local_community:
        _.what_factors_would_be_key_to_support_your_successful_integration_into_the_local_community?.split(' '),
      what_would_be_the_deciding_factor_in_your_return_to_your_area_of_origin:
        _.what_would_be_the_deciding_factor_in_your_return_to_your_area_of_origin?.split(' '),
      why_are_planning_to_relocate_from_your_current_place_of_residence:
        _.why_are_planning_to_relocate_from_your_current_place_of_residence?.split(' '),
      as_nonUkrainian_do_you_have_documentation: _.as_nonUkrainian_do_you_have_documentation?.split(' '),
      does_1_lack_doc: _.does_1_lack_doc?.split(' '),
      does_2_lack_doc: _.does_2_lack_doc?.split(' '),
      does_3_lack_doc: _.does_3_lack_doc?.split(' '),
      does_4_lack_doc: _.does_4_lack_doc?.split(' '),
      does_5_lack_doc: _.does_5_lack_doc?.split(' '),
      does_6_lack_doc: _.does_6_lack_doc?.split(' '),
      does_7_lack_doc: _.does_7_lack_doc?.split(' '),
      does_8_lack_doc: _.does_8_lack_doc?.split(' '),
      does_9_lack_doc: _.does_9_lack_doc?.split(' '),
      does_10_lack_doc: _.does_10_lack_doc?.split(' '),
      does_11_lack_doc: _.does_11_lack_doc?.split(' '),
      does_12_lack_doc: _.does_12_lack_doc?.split(' '),
      do_you_have_any_of_the_following: _.do_you_have_any_of_the_following?.split(' '),
      why_are_you_not_registered: _.why_are_you_not_registered?.split(' '),
      what_housing_land_and_property_documents_do_you_lack:
        _.what_housing_land_and_property_documents_do_you_lack?.split(' '),
      have_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation:
        _.have_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation?.split(
          ' ',
        ),
      what_are_the_main_factors_that_make_this_location_feel_unsafe:
        _.what_are_the_main_factors_that_make_this_location_feel_unsafe?.split(' '),
      what_factors_are_affecting_the_relationship_between_communities_in_this_location:
        _.what_factors_are_affecting_the_relationship_between_communities_in_this_location?.split(' '),
      have_you_or_your_household_members_experienced_incidents_with_host_community_members_idps_returnees:
        _.have_you_or_your_household_members_experienced_incidents_with_host_community_members_idps_returnees?.split(
          ' ',
        ),
      do_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area:
        _.do_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area?.split(' '),
      what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence:
        _.what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence?.split(' '),
      when_did_the_incidents_occur_has_any_adult_male_member_experienced_violence:
        _.when_did_the_incidents_occur_has_any_adult_male_member_experienced_violence?.split(' '),
      who_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence:
        _.who_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence?.split(' '),
      what_type_of_incidents_took_place_has_any_adult_female_member_experienced_violence:
        _.what_type_of_incidents_took_place_has_any_adult_female_member_experienced_violence?.split(' '),
      when_did_the_incidents_occur_has_any_adult_female_member_experienced_violence:
        _.when_did_the_incidents_occur_has_any_adult_female_member_experienced_violence?.split(' '),
      who_were_the_perpetrators_of_the_incident_has_any_adult_female_member_experienced_violence:
        _.who_were_the_perpetrators_of_the_incident_has_any_adult_female_member_experienced_violence?.split(' '),
      what_type_of_incidents_took_place_has_any_boy_member_experienced_violence:
        _.what_type_of_incidents_took_place_has_any_boy_member_experienced_violence?.split(' '),
      when_did_the_incidents_occur_has_any_boy_member_experienced_violence:
        _.when_did_the_incidents_occur_has_any_boy_member_experienced_violence?.split(' '),
      who_were_the_perpetrators_of_the_incident_has_any_boy_member_experienced_violence:
        _.who_were_the_perpetrators_of_the_incident_has_any_boy_member_experienced_violence?.split(' '),
      what_type_of_incidents_took_place_has_any_girl_member_experienced_violence:
        _.what_type_of_incidents_took_place_has_any_girl_member_experienced_violence?.split(' '),
      when_did_the_incidents_occur_has_any_girl_member_experienced_violence:
        _.when_did_the_incidents_occur_has_any_girl_member_experienced_violence?.split(' '),
      who_were_the_perpetrators_of_the_incident_has_any_girl_member_experienced_violence:
        _.who_were_the_perpetrators_of_the_incident_has_any_girl_member_experienced_violence?.split(' '),
      what_type_of_incidents_took_place_has_any_other_member_experienced_violence:
        _.what_type_of_incidents_took_place_has_any_other_member_experienced_violence?.split(' '),
      when_did_the_incidents_occur_has_any_other_member_experienced_violence:
        _.when_did_the_incidents_occur_has_any_other_member_experienced_violence?.split(' '),
      who_were_the_perpetrators_of_the_incident_has_any_other_member_experienced_violence:
        _.who_were_the_perpetrators_of_the_incident_has_any_other_member_experienced_violence?.split(' '),
      on_what_ground: _.on_what_ground?.split(' '),
      is_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs:
        _.is_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs?.split(' '),
      is_are_any_child_member_of_your_household_displaying_any_of_the_following_signs:
        _.is_are_any_child_member_of_your_household_displaying_any_of_the_following_signs?.split(' '),
      what_are_the_barriers_to_access_services: _.what_are_the_barriers_to_access_services?.split(' '),
      what_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members:
        _.what_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members?.split(' '),
      what_are_the_main_sources_of_income_of_your_household:
        _.what_are_the_main_sources_of_income_of_your_household?.split(' '),
      what_type_of_allowances_do_you_receive: _.what_type_of_allowances_do_you_receive?.split(' '),
      what_are_the_reasons_for_being_out_of_work: _.what_are_the_reasons_for_being_out_of_work?.split(' '),
      what_are_the_strategies_that_your_household_uses_to_cope_with_these_challenges:
        _.what_are_the_strategies_that_your_household_uses_to_cope_with_these_challenges?.split(' '),
      what_are_the_reasons_preventing_children_in_your_household_from_regularly_attending_education_services:
        _.what_are_the_reasons_preventing_children_in_your_household_from_regularly_attending_education_services?.split(
          ' ',
        ),
      what_are_your_main_concerns_regarding_your_accommodation:
        _.what_are_your_main_concerns_regarding_your_accommodation?.split(' '),
      what_are_the_barriers_to_accessing_health_services:
        _.what_are_the_barriers_to_accessing_health_services?.split(' '),
    }) as T
}
