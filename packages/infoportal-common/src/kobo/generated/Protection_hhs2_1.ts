export namespace Protection_hhs2_1 {
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
    where_are_you_current_living_raion: undefined | string
    // group_basic_bio_data/where_are_you_current_living_hromada [select_one] <span style="font-size:.875em;font-weight:normal">   2.4. Hromada</span>
    where_are_you_current_living_hromada: undefined | string
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
    what_is_your_area_of_origin_raion: undefined | string
    // group_displacement_status_and_info/what_is_your_area_of_origin_hromada [select_one] <span style="font-size:.875em;font-weight:normal">   5.1.5. Hromada</span>
    what_is_your_area_of_origin_hromada: undefined | string
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
    },
    where_is_your_partner_remain_behind_in_the_area_of_origin: {
      unable_to_travel_as_a_result_of_age_or_physical_impairment: `Unable to travel as a result of age or physical impairment`,
      unable_to_travel_due_to_safety_and_security_concerns: `Unable to travel due to safety and security concerns`,
      unable_to_travel_due_to_lack_of_financial_resources: `Unable to travel due to lack of financial resources`,
      stayed_to_keep_the_jobs: `Stayed to keep the jobs`,
      unwilling_to_leave_due_to_fear_of_conscription: `Unwilling to leave due to fear of conscription`,
      stayed_to_take_care_of_properties: `Stayed to take care of properties`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other`,
    },
    where_is_your_child_lt_18: {
      remained_behind_in_the_area_of_origin: `Remained behind in the area of origin`,
      do_not_know_their_whereabouts: `Do not know their whereabouts`,
      serving_in_the_military: `Serving in the military`,
      displaced_to_another_location_in_ukraine: `Displaced to another location in Ukraine`,
      displaced_to_another_country_outside_ukraine: `Displaced to another country outside Ukraine`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other`,
    },
    where_is_your_child_lt_18_remain_behind_in_the_area_of_origin: {
      unable_to_travel_as_a_result_of_age_or_physical_impairment: `Unable to travel as a result of age or physical impairment`,
      unable_to_travel_due_to_safety_and_security_concerns: `Unable to travel due to safety and security concerns`,
      unable_to_travel_due_to_lack_of_financial_resources: `Unable to travel due to lack of financial resources`,
      stayed_to_keep_the_jobs: `Stayed to keep the jobs`,
      unwilling_to_leave_due_to_fear_of_conscription: `Unwilling to leave due to fear of conscription`,
      stayed_to_take_care_of_properties: `Stayed to take care of properties`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other`,
    },
    where_is_your_child_gte_18: {
      remained_behind_in_the_area_of_origin: `Remained behind in the area of origin`,
      do_not_know_their_whereabouts: `Do not know their whereabouts`,
      serving_in_the_military: `Serving in the military`,
      displaced_to_another_location_in_ukraine: `Displaced to another location in Ukraine`,
      displaced_to_another_country_outside_ukraine: `Displaced to another country outside Ukraine`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other`,
    },
    where_is_your_child_gte_18_remain_behind_in_the_area_of_origin: {
      unable_to_travel_as_a_result_of_age_or_physical_impairment: `Unable to travel as a result of age or physical impairment`,
      unable_to_travel_due_to_safety_and_security_concerns: `Unable to travel due to safety and security concerns`,
      unable_to_travel_due_to_lack_of_financial_resources: `Unable to travel due to lack of financial resources`,
      stayed_to_keep_the_jobs: `Stayed to keep the jobs`,
      unwilling_to_leave_due_to_fear_of_conscription: `Unwilling to leave due to fear of conscription`,
      stayed_to_take_care_of_properties: `Stayed to take care of properties`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other`,
    },
    where_is_your_mother: {
      remained_behind_in_the_area_of_origin: `Remained behind in the area of origin`,
      do_not_know_their_whereabouts: `Do not know their whereabouts`,
      serving_in_the_military: `Serving in the military`,
      displaced_to_another_location_in_ukraine: `Displaced to another location in Ukraine`,
      displaced_to_another_country_outside_ukraine: `Displaced to another country outside Ukraine`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other`,
    },
    where_is_your_mother_remain_behind_in_the_area_of_origin: {
      unable_to_travel_as_a_result_of_age_or_physical_impairment: `Unable to travel as a result of age or physical impairment`,
      unable_to_travel_due_to_safety_and_security_concerns: `Unable to travel due to safety and security concerns`,
      unable_to_travel_due_to_lack_of_financial_resources: `Unable to travel due to lack of financial resources`,
      stayed_to_keep_the_jobs: `Stayed to keep the jobs`,
      unwilling_to_leave_due_to_fear_of_conscription: `Unwilling to leave due to fear of conscription`,
      stayed_to_take_care_of_properties: `Stayed to take care of properties`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other`,
    },
    where_is_your_father: {
      remained_behind_in_the_area_of_origin: `Remained behind in the area of origin`,
      do_not_know_their_whereabouts: `Do not know their whereabouts`,
      serving_in_the_military: `Serving in the military`,
      displaced_to_another_location_in_ukraine: `Displaced to another location in Ukraine`,
      displaced_to_another_country_outside_ukraine: `Displaced to another country outside Ukraine`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other`,
    },
    where_is_your_father_remain_behind_in_the_area_of_origin: {
      unable_to_travel_as_a_result_of_age_or_physical_impairment: `Unable to travel as a result of age or physical impairment`,
      unable_to_travel_due_to_safety_and_security_concerns: `Unable to travel due to safety and security concerns`,
      unable_to_travel_due_to_lack_of_financial_resources: `Unable to travel due to lack of financial resources`,
      stayed_to_keep_the_jobs: `Stayed to keep the jobs`,
      unwilling_to_leave_due_to_fear_of_conscription: `Unwilling to leave due to fear of conscription`,
      stayed_to_take_care_of_properties: `Stayed to take care of properties`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other`,
    },
    where_is_your_caregiver: {
      remained_behind_in_the_area_of_origin: `Remained behind in the area of origin`,
      do_not_know_their_whereabouts: `Do not know their whereabouts`,
      serving_in_the_military: `Serving in the military`,
      displaced_to_another_location_in_ukraine: `Displaced to another location in Ukraine`,
      displaced_to_another_country_outside_ukraine: `Displaced to another country outside Ukraine`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other`,
    },
    where_is_your_caregiver_remain_behind_in_the_area_of_origin: {
      unable_to_travel_as_a_result_of_age_or_physical_impairment: `Unable to travel as a result of age or physical impairment`,
      unable_to_travel_due_to_safety_and_security_concerns: `Unable to travel due to safety and security concerns`,
      unable_to_travel_due_to_lack_of_financial_resources: `Unable to travel due to lack of financial resources`,
      stayed_to_keep_the_jobs: `Stayed to keep the jobs`,
      unwilling_to_leave_due_to_fear_of_conscription: `Unwilling to leave due to fear of conscription`,
      stayed_to_take_care_of_properties: `Stayed to take care of properties`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other`,
    },
    where_is_your_other_relative: {
      remained_behind_in_the_area_of_origin: `Remained behind in the area of origin`,
      do_not_know_their_whereabouts: `Do not know their whereabouts`,
      serving_in_the_military: `Serving in the military`,
      displaced_to_another_location_in_ukraine: `Displaced to another location in Ukraine`,
      displaced_to_another_country_outside_ukraine: `Displaced to another country outside Ukraine`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other`,
    },
    where_is_your_other_relative_remain_behind_in_the_area_of_origin: {
      unable_to_travel_as_a_result_of_age_or_physical_impairment: `Unable to travel as a result of age or physical impairment`,
      unable_to_travel_due_to_safety_and_security_concerns: `Unable to travel due to safety and security concerns`,
      unable_to_travel_due_to_lack_of_financial_resources: `Unable to travel due to lack of financial resources`,
      stayed_to_keep_the_jobs: `Stayed to keep the jobs`,
      unwilling_to_leave_due_to_fear_of_conscription: `Unwilling to leave due to fear of conscription`,
      stayed_to_take_care_of_properties: `Stayed to take care of properties`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other`,
    },
    do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household: {
      pregnant_and_lactating_woman: `Pregnant and Lactating person (PLW)`,
      child_headed_household: `Child (< 18) headed household`,
      elder__headed_household: `Elder (≥ 60) headed household`,
      person_with_disability_headed_household: `Person with disability headed household`,
      chronicallyill_headed_household: `Household headed by a person with serious medical condition`,
      no_specific_needs: `No specific needs`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
    },
    how_did_you_travel_to_your_displacement_location: {
      volunteer_and_or_ukrainian_ngo_supported_evacuation: `Volunteer and/or Ukrainian NGO supported evacuation`,
      un_ingo_supported_evacuation: `UN/INGO supported evacuation`,
      government_supported_evacuation: `Government supported evacuation`,
      own_means: `Own means`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
    },
    why_not_registered: {
      multiple_displacements: `Multiple displacements`,
      lack_of_personal_documentation: `Lack of personal documentation`,
      displacement_area_not_falling_under_governmental_criteria_for_idp_registration: `Displacement area not falling under governmental criteria for IDP registration`,
      displacement_area_too_close_from_area_of_origin: `Displacement area too close from area of origin`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
    },
    what_type_of_allowances_do_you_receive: {
      idp_allowance: `IDP allowance`,
      pension_for_elderly_people: `Pension for elderly people`,
      pension_for_people_with_disability: `Pension for people with disability`,
      pension_for_3_or_more_children_in_the_household: `Pension for 3 or more children in the household`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
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
      other_specify: `Other`,
    },
    what_is_the_tenure_status_of_your_accommodation_public: {
      rental_fees: `Rental fees`,
      utilities_fees_only: `Utilities fees only`,
      no_rental_utilities_fees: `No rental/utilities fees`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other`,
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
      other_specify: `Other`,
    },
    what_is_your_1_priority: {
      education: `Education (primary/secondary)`,
      education_ter: `Education (tertiary)`,
      food: `Food`,
      shelter: `Shelter`,
      wash: `WASH`,
      health_1_2: `Health`,
      health_m: `Health (mental health care)`,
      health_srh: `Health (SRH)`,
      psychosocial_support: `Psychosocial support`,
      legal_assistance_civil_documentation: `Legal assistance/Civil documentation`,
      livelihood_support: `Livelihood support`,
      vocational_training: `Vocational training`,
      nfis: `NFIs`,
      none: `None`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other`,
    },
    what_is_your_2_priority: {
      education: `Education (primary/secondary)`,
      education_ter: `Education (tertiary)`,
      food: `Food`,
      shelter: `Shelter`,
      wash: `WASH`,
      health_1_2: `Health`,
      health_m: `Health (mental health care)`,
      health_srh: `Health (SRH)`,
      psychosocial_support: `Psychosocial support`,
      legal_assistance_civil_documentation: `Legal assistance/Civil documentation`,
      livelihood_support: `Livelihood support`,
      vocational_training: `Vocational training`,
      nfis: `NFIs`,
      none: `None`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other`,
    },
    what_is_your_3_priority: {
      education: `Education (primary/secondary)`,
      education_ter: `Education (tertiary)`,
      food: `Food`,
      shelter: `Shelter`,
      wash: `WASH`,
      health_1_2: `Health`,
      health_m: `Health (mental health care)`,
      health_srh: `Health (SRH)`,
      psychosocial_support: `Psychosocial support`,
      legal_assistance_civil_documentation: `Legal assistance/Civil documentation`,
      livelihood_support: `Livelihood support`,
      vocational_training: `Vocational training`,
      nfis: `NFIs`,
      none: `None`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
      other_specify: `Other`,
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
