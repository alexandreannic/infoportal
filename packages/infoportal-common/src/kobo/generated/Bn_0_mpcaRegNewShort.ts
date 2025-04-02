export namespace Bn_0_mpcaRegNewShort {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: a5kgQdqZLLNTLSmC8DK7Eq
  export interface T {
    start: string
    end: string
    today: string
    // module1/DRC_project [select_one] Please select DRC project and donor that this registration is for
    DRC_project: undefined | Option<'DRC_project'>
    // module1/drc_base [select_one] Select DRC base
    drc_base: undefined | Option<'drc_base'>
    // module1/staff_names [select_one] Select DRC staff name
    staff_names: undefined | Option<'staff_names'>
    // module1/BHA_area [select_one] Select BHA Consortium geographical area
    BHA_area: undefined | Option<'BHA_area'>
    // module_consent/__021 [note] In order to register your application, we'd need to ask you a few questions to understand the composition of your household and how to best transfer financial assistance to you if you are eligible. These questions will take between 10-15 minutes. If you are eligible, we’ll need to share some basic details with the bank in order to make the payment. We are also required to share Tax ID numbers of people we provide assistance to with other humanitarian agencies implementing financial assistance programs, to ensure we are not duplicating assistance. All the other information will be stored safely, in accordance with the Law on protection of personal data, and will not be shared outside of DRC and its partners.
    __021: string
    // module_consent/consent_mod_1 [select_one] Are you happy to proceed with the questionnaire?
    consent_mod_1: undefined | Option<'confirm_truth'>
    // module_eligibility_screening/oblast [select_one] Select oblast where registration is taking place
    oblast: undefined | Option<'oblast'>
    // module_eligibility_screening/raion [select_one] Select raion where registration is taking place
    raion: undefined | string
    // module_eligibility_screening/hromada [select_one] Select hromada where registration is taking place
    hromada: undefined | string
    // module_eligibility_screening/patron [text] What is your last name (as shown in personal ID)?
    patron: string | undefined
    // module_eligibility_screening/name_resp [text] What is your first name (as shown in personal ID)?
    name_resp: string | undefined
    // module_eligibility_screening/last_resp [text] What is your patronymic name?
    last_resp: string | undefined
    // module_eligibility_screening/phone [integer] What is your phone number?
    phone: number | undefined
    // module_eligibility_screening/inclusion_exclusion_group/ingo [select_one] Have you received cash from an NGO in the last 3 months?
    ingo: undefined | Option<'confirm_truth'>
    // module_eligibility_screening/inclusion_exclusion_group/household_size [integer] What is the size of your household? (we will ask you to provide more details later)
    household_size: number | undefined
    // module_eligibility_screening/inclusion_exclusion_group/income_month [integer] What was the income of your household in the last 30 days in UAH?
    income_month: number | undefined
    calculation_average_income: string
    // module_eligibility_screening/inclusion_exclusion_group/The_average_income_o_per_month_per_person [note] The average income of this household is ${calculation_average_income} per month per person
    The_average_income_o_per_month_per_person: string
    // module_eligibility_screening/inclusion_exclusion_group/exclusion_1 [select_one] This household is not eligible for cash assistance because they have received cash from another NGO in the last 3 months.
    exclusion_1: undefined | Option<'exclusion_1'>
    // module_eligibility_screening/inclusion_exclusion_group/exclusion_2 [select_one] This household is not eligible for cash assistance because they earn more than 5,400 UAH per person per month
    exclusion_2: undefined | Option<'exclusion_2'>
    // module_eligibility_screening/vul_screen [select_one] This household has passed the exclusion criteria and can be screened for inclusion and vulnerability criteria - proceed to next step
    vul_screen: undefined | Option<'vul_screen'>
    // module_eligibility_screening/group_inclusion_area/east_evacuation/recent_displacement [select_one] Has your household been displaced within in the last 3 days?
    recent_displacement: undefined | Option<'confirm_truth'>
    // module_eligibility_screening/group_inclusion_area/idp_host/safe_shelter_001 [select_one] Where are you currently staying?
    safe_shelter_001: undefined | Option<'safe_shelter_001'>
    // module_eligibility_screening/group_inclusion_area/idp_host/Has_this_location_been_damaged [select_one] Has this location been damaged or shelled by the conflict since February 2022?
    Has_this_location_been_damaged: undefined | Option<'Has_this_location_been_damaged'>
    // module_eligibility_screening/group_inclusion_area/idp_host/idp_host_shelter_damaged [select_one] Was your house damaged or destroyed since Feb. 2022?
    idp_host_shelter_damaged: undefined | Option<'idp_host_shelter_damaged'>
    // module_eligibility_screening/group_inclusion_area/idp_host/main_reason_damaged_shelter [select_one] Is this the main reason you are not currently living in your house?
    main_reason_damaged_shelter: undefined | Option<'main_reason_damaged_shelter'>
    // module_eligibility_screening/group_inclusion_area/center/occupation [select_one] Has your family lived under occupation?
    occupation: undefined | Option<'confirm_truth'>
    // module_eligibility_screening/group_inclusion_area/center/returnee [select_one] Have you been displaced due to the occupation and are now returning to your place of residency?
    returnee: undefined | Option<'confirm_truth'>
    // module_eligibility_screening/group_inclusion_area/center/safe_shelter [select_one] Was your home impacted or destroyed by the conflict?
    safe_shelter: undefined | Option<'confirm_truth'>
    ctr_vuln: string
    // module_eligibility_screening/group_inclusion_area/east_conflict_location/displaced_ngca [select_one] Has your home been damaged or destroyed by shelling?
    displaced_ngca: undefined | Option<'displaced_ngca'>
    // mpca_targeting_criteria/For_DRC_staff_only_Was_this_ [select_one] For DRC staff only - Was this household referred by DRC Protection?
    For_DRC_staff_only_Was_this_: undefined | Option<'For_DRC_staff_only_Was_this_'>
    // mpca_targeting_criteria/gender_respondent [select_one] Select gender of respondent
    gender_respondent: undefined | Option<'gender_respondent'>
    // mpca_targeting_criteria/Are_you_the_head_of_your_house [select_one] Are you the head of your household?
    Are_you_the_head_of_your_house: undefined | Option<'Are_you_the_head_of_your_house'>
    // mpca_targeting_criteria/sex [select_one] If no, what is the gender of head of household?
    sex: undefined | Option<'sex'>
    // mpca_targeting_criteria/hh_elderly_check [integer] How old is the head of household?
    hh_elderly_check: number | undefined
    // mpca_targeting_criteria/agex [integer] How old are you?
    agex: number | undefined
    // mpca_targeting_criteria/child_hhh_confirm [select_one] You have stated you are under 18 years, can you confirm you are the head of household?
    child_hhh_confirm: undefined | Option<'child_hhh_confirm'>
    // mpca_targeting_criteria/child_hhh [note] This is a child headed household (high risk protection case), please refer immediately to a DRC Protection and complete internal referral form.
    child_hhh: string
    // mpca_targeting_criteria/group_hh_composition_header/group_hh_composition_header_note [note] **Enter information about the demographics of the household**
    group_hh_composition_header_note: string
    // mpca_targeting_criteria/group_hh_composition_header/group_hh_composition_header_less_4 [note] **Under 4 years**
    group_hh_composition_header_less_4: string
    // mpca_targeting_criteria/group_hh_composition_header/group_hh_composition_header_5_to_17 [note] **5 to 17 years**
    group_hh_composition_header_5_to_17: string
    // mpca_targeting_criteria/group_hh_composition_header/group_hh_composition_header_18_to_59 [note] **18 to 59 years**
    group_hh_composition_header_18_to_59: string
    // mpca_targeting_criteria/group_hh_composition_header/group_hh_composition_header_above_60 [note] **60 and above years**
    group_hh_composition_header_above_60: string
    // mpca_targeting_criteria/group_hh_composition_row/group_hh_composition_row_note [note] ##### Female
    group_hh_composition_row_note: string
    // mpca_targeting_criteria/group_hh_composition_row/group_hh_composition_row_less_4 [integer] <span style="display:none">row-Under 4 years</span>
    group_hh_composition_row_less_4: number | undefined
    // mpca_targeting_criteria/group_hh_composition_row/group_hh_composition_row_5_to_17 [integer] <span style="display:none">row-5 to 17 years</span>
    group_hh_composition_row_5_to_17: number | undefined
    // mpca_targeting_criteria/group_hh_composition_row/group_hh_composition_row_18_to_59 [integer] <span style="display:none">row-18 to 59 years</span>
    group_hh_composition_row_18_to_59: number | undefined
    // mpca_targeting_criteria/group_hh_composition_row/group_hh_composition_row_above_60 [integer] <span style="display:none">row-60 and above years</span>
    group_hh_composition_row_above_60: number | undefined
    // mpca_targeting_criteria/group_hh_composition_row_1/group_hh_composition_row_1_note [note] ##### Male
    group_hh_composition_row_1_note: string
    // mpca_targeting_criteria/group_hh_composition_row_1/group_hh_composition_row_1_less_4 [integer] <span style="display:none">row_1-Under 4 years</span>
    group_hh_composition_row_1_less_4: number | undefined
    // mpca_targeting_criteria/group_hh_composition_row_1/group_hh_composition_row_1_5_to_17 [integer] <span style="display:none">row_1-5 to 17 years</span>
    group_hh_composition_row_1_5_to_17: number | undefined
    // mpca_targeting_criteria/group_hh_composition_row_1/group_hh_composition_row_1_18_to_59 [integer] <span style="display:none">row_1-18 to 59 years</span>
    group_hh_composition_row_1_18_to_59: number | undefined
    // mpca_targeting_criteria/group_hh_composition_row_1/group_hh_composition_row_1_above_60 [integer] <span style="display:none">row_1-60 and above years</span>
    group_hh_composition_row_1_above_60: number | undefined
    // mpca_targeting_criteria/Is_this_household_female_heade [select_one] Is this household female-headed?
    Is_this_household_female_heade: undefined | Option<'Is_this_household_female_heade'>
    // mpca_targeting_criteria/single_PWD [select_one] Is this person living alone and have a chronic illness/disease/disability/temporary impairment?
    single_PWD: undefined | Option<'single_PWD'>
    // mpca_targeting_criteria/large_hh [select_one] Does this household have 2 or more children?
    large_hh: undefined | Option<'large_hh'>
    // mpca_targeting_criteria/child_elderly [select_one] Does this household have at least 1 child (under 18 years) and 1 elderly (60+ years) person?
    child_elderly: undefined | Option<'child_elderly'>
    // mpca_targeting_criteria/child_pwd [select_one] Does this household have at least 1 child (under 18 years) and 1 member with a chronic illness/disease/disability/temporary impairment?
    child_pwd: undefined | Option<'child_pwd'>
    // mpca_targeting_criteria/plw [select_one] Is there any pregnant or lactating women in your household?
    plw: undefined | Option<'plw'>
    // mpca_targeting_criteria/displaced_30days [select_one] Has this household been displaced in the last 30 days?
    displaced_30days: undefined | Option<'displaced_30days'>
    // mpca_targeting_criteria/child_custody [select_one] Is this household caring for other children (guardianship or custody)?
    child_custody: undefined | Option<'child_custody'>
    // mpca_targeting_criteria/internal_referral [select_one] Should this household be referred to another DRC department?
    internal_referral: undefined | Option<'internal_referral'>
    // mpca_targeting_criteria/internal_referral_specific [select_multiple] Select to which DRC department
    internal_referral_specific: undefined | Option<'internal_referral_specific'>[]
    // mpca_targeting_criteria/additional_specific_needs [text] For DRC staff - Please enter any additional comments regarding specific needs of this household?
    additional_specific_needs: string | undefined
    // mpca_eligible_inclusion_area [select_one] This household is eligible for MPCA because they satisfy the inclusion criteria for the category of area
    mpca_eligible_inclusion_area: undefined | Option<'mpca_eligible_inclusion_area'>
    // protection_referral [select_one] This household is eligible for MPCA because they were referred to from DRC Protection and pass the exclusion criteria
    protection_referral: undefined | Option<'protection_referral'>
    // mpca_yes_ehh [select_one] This household is eligible for MPCA because they are elderly-headed.
    mpca_yes_ehh: undefined | Option<'mpca_yes_ehh'>
    // mpca_eligible_vul [select_one] This household is eligible for MPCA because they meet at least one of the vulnerability targeting criteria.
    mpca_eligible_vul: undefined | Option<'mpca_eligible_vul'>
    // cash_yes/You_are_eligible_for_ur_household_members [note] You are eligible for cash assistance, we will now ask you some detailed questions about yourself.
    You_are_eligible_for_ur_household_members: string
    // cash_yes/status [select_one] Select status
    status: undefined | Option<'status'>
    // cash_yes/idp_certificate [select_one] Do you have an IDP certificate?
    idp_certificate: undefined | Option<'idp_certificate'>
    // cash_yes/reason_no_idp_certificate [text] Please state main reason why you do not have an IDP certificate
    reason_no_idp_certificate: string | undefined
    // cash_yes/resident_permit [select_one] Do you have a resident permit from a conflict-affected location?
    resident_permit: undefined | Option<'resident_permit'>
    // cash_yes/For_staff_member_ONL_cabinet_of_ministers [select_one] For staff member ONLY - is this person from a recognized conflict-affected area? (within the decree of cabinet of ministers)
    For_staff_member_ONL_cabinet_of_ministers: undefined | Option<'For_staff_member_ONL_cabinet_of_ministers'>
    // cash_yes/no_resident_permit [text] If no, what is the mean reason for not having a resident permit?
    no_resident_permit: string | undefined
    // cash_yes/your_id [text] What is your Tax ID?
    your_id: string | undefined
    // cash_yes/area_of_origin [select_one] What is your area of origin prior to displacement? (Select Oblast)
    area_of_origin: undefined | Option<'area_of_origin'>
    // group_5_document_collection/consent_document [select_one] Do you provide DRC consent to take photos or copies of your personal documentation at this time? Following DRC Data Protection Protocols and Ukraine Law on Data Protection, we will not share copies or photos of your documents with anyone outside DRC and these will only be used for the sole purpose of processing your information in order to provide you with cash assistance. You can decide to say no at this time and we will need to collect your documents at a later point in time.
    consent_document: undefined | Option<'consent_document'>
    // group_5_document_collection/Does_the_respondent_have_perso [select_one] Does the respondent have personal documentation? (passport or IDP certificate)
    Does_the_respondent_have_perso: undefined | Option<'Does_the_respondent_have_perso'>
    // group_5_document_collection/no_documents_refer [note] For DRC Staff: Proceed to completing internal referral form after completion of this registration and refer to DRC Protection
    no_documents_refer: string
    // group_5_document_collection/DRC_Staff_take_phot_rt_registration_page [note] DRC Staff: take photo of IDP certificate only. If person does not have IDP certificate, take photo ONLY of passport registration page.
    DRC_Staff_take_phot_rt_registration_page: string
    // group_5_document_collection/Photo_of_IDP_Certificate [image] Photo of IDP Certificate
    Photo_of_IDP_Certificate: string
    // group_5_document_collection/photo_reg_passport [image] Photo of Registration Page in Passport
    photo_reg_passport: string
    // delivery_mechanisms/bank [select_one] Do you have access to bank branches/ ATMs?
    bank: undefined | Option<'confirm_truth'>
    // delivery_mechanisms/reason [select_multiple] If no, for what reason?
    reason: undefined | Option<'reason'>[]
    // delivery_mechanisms/If_no_do_you_have_kraine_Postha_office [select_one] If no, do you have access to a Ukraine Postha office?
    If_no_do_you_have_kraine_Postha_office: undefined | Option<'If_no_do_you_have_kraine_Postha_office'>
    // delivery_mechanisms/specify [text] If no, please specify the reason
    specify: string | undefined
    // social_protection/Are_you_currently_enrolled_in_ [select_one] Are you currently enrolled in any social protection assistance?
    Are_you_currently_enrolled_in_: undefined | Option<'Are_you_currently_enrolled_in_'>
    // social_protection/Have_you_received_yo_in_the_last_3_months [select_one] Have you received your social protection benefits in the last 3 months?
    Have_you_received_yo_in_the_last_3_months: undefined | Option<'Have_you_received_yo_in_the_last_3_months'>
    // social_protection/Are_you_able_to_provide_inform [select_one] Are you able to provide information on which social protection assistance programe you are enrolled in?
    Are_you_able_to_provide_inform: undefined | Option<'Are_you_able_to_provide_inform'>
    // social_protection/Please_select_all_th_urrently_enrolled_in [select_multiple] Please select all the social protection assistance programs you are currently enrolled in
    Please_select_all_th_urrently_enrolled_in: undefined | Option<'Please_select_all_th_urrently_enrolled_in'>[]
    // social_protection/Were_you_enrolled_to_before_February_2022 [select_one] Were you enrolled to these social assistance benefits before February 2022?
    Were_you_enrolled_to_before_February_2022: undefined | Option<'Were_you_enrolled_to_before_February_2022'>
    // multisector_questions/We_would_now_like_to_ask_you_s [select_one] We would now like to ask you some questions about shelter, NFI and protection. Do you agree to proceed with the additional questions?
    We_would_now_like_to_ask_you_s: undefined | Option<'We_would_now_like_to_ask_you_s'>
    // multisector_questions/group_shelter/rent [select_one] Are you currently paying for rent?
    rent: undefined | Option<'confirm_truth'>
    // multisector_questions/group_shelter/rent_2 [select_one] Do you anticipate that your household will need to pay rent next month?
    rent_2: undefined | Option<'confirm_truth'>
    // multisector_questions/group_shelter/repairs [select_one] Are you currently paying for any shelter repairs?
    repairs: undefined | Option<'confirm_truth'>
    // multisector_questions/group_shelter/repairs_2 [select_one] Do you anticipate that you need to pay for shelter repairs in the next month?
    repairs_2: undefined | Option<'confirm_truth'>
    // multisector_questions/group_nfi/nfi_loss [select_one] Has your family suffered from the loss of most of your belongings due to the conflict?
    nfi_loss: undefined | Option<'nfi_loss'>
    // multisector_questions/group_nfi/nfi_issues_items [select_multiple] Do you have any issues finding and/or paying for the following items?
    nfi_issues_items: undefined | Option<'nfi_issues_items'>[]
    // multisector_questions/group_nfi/nfi_other [text] If other, please specify
    nfi_other: string | undefined
    // multisector_questions/group_nfi/nfi_pickup [select_one] Would you or a family member be able to pick-up items from a designated location near your home (up to 5KM)?
    nfi_pickup: undefined | Option<'nfi_pickup'>
    // additional/pre [note] Now we would like to ask you a few questions to understand your family dynamics, so we can better monitor the effects of our assistance. This would take an extra 5 minutes. Responding these questions is optional - even though it would be great for us to have this information, bear in mind that if you say 'No', this will not have any negative repercussion in your application to our assistance
    pre: string
    // additional/pre2 [select_one] Would you like to proceed with some more questions?
    pre2: undefined | Option<'confirm_truth'>
    // additional/rcsi_group/cheap_food_group/cheap_food [select_one] a. Rely on less preferred and less expensive foods?
    cheap_food: undefined | Option<'high_kcal_food'>
    pts_cheap_food: string
    yes_cheap_food: string
    // additional/rcsi_group/expired_food/food_expired [select_one] Eat poor quality food or expired food?
    food_expired: undefined | Option<'high_kcal_food'>
    pts_food_expired: string
    yes_food_expired: string
    // additional/rcsi_group/borrow_group/borrow [select_one] b. Borrow food, or rely on help from a friend or relative?
    borrow: undefined | Option<'high_kcal_food'>
    pts_borrow: string
    yes_borrow: string
    // additional/rcsi_group/reduce_portion_group/reduce_portion [select_one] c. Limit portion size at mealtimes?
    reduce_portion: undefined | Option<'high_kcal_food'>
    pts_reduce_portion: string
    yes_reduce_portion: string
    // additional/rcsi_group/wild_food/wild_foods [select_one] Collect wild berries, herbs, mushrooms, or hunt or fish?
    wild_foods: undefined | Option<'high_kcal_food'>
    pts_wild_food: string
    yes_wild_food: string
    // additional/rcsi_group/prioritize_child_meals_group/prioritize_child_meals [select_one] d. Restrict consumption by adults in order for small children to eat?
    prioritize_child_meals: undefined | Option<'high_kcal_food'>
    pts_prioritize_child_meals: string
    yes_child_meal: string
    // additional/rcsi_group/skip_meals_group/skip_meals [select_one] e. Reduce number of meals eaten in a day?
    skip_meals: undefined | Option<'high_kcal_food'>
    pts_skip_meals: string
    yes_skip_meals: string
    // additional/rcsi_group/shelter_meal/meal_shelter [select_one] Have meals from collective shelters or volunteer groups?
    meal_shelter: undefined | Option<'high_kcal_food'>
    pts_shelter_meal: string
    yes_shelter_meal: string
    // additional/rcsi_group/calorie_dense_foods/high_kcal_food [select_one] Prioritize highly caloric foods over other food groups? (e.g., fresh fruits & vegetables)
    high_kcal_food: undefined | Option<'high_kcal_food'>
    pts_high_kcal_food: string
    yes_high_kcal_food: string
    pts_std_rcsi: string
    ipc_std_rcsi: string
    pts_context_rcsi: string
    ipc_context_rcsi: string
    // not_eligible_note [select_one] Unfortunately, due to our targeting criteria you are not eligible to receive cash assistance from DRC. However, we would like to ask you some questions about shelter, NFI and protection in order to see if you are eligible for other type of assistance. Do you agree to proceed with the additional questions?
    not_eligible_note: undefined | Option<'not_eligible_note'>
    // not_eligible_note2 [select_one] Unfortunately, due to our targeting criteria you are not eligible to receive cash assistance from DRC. However, we would like to ask you some questions about shelter, NFI and protection in order to see if you are eligible for other type of assistance. Do you agree to proceed with the additional questions?
    not_eligible_note2: undefined | Option<'not_eligible_note2'>
    // group_MS_not_eligible/group_shelter_no_mpca/cfr_no_mpca [select_one] Are you currently paying for rent?
    cfr_no_mpca: undefined | Option<'cfr_no_mpca'>
    // group_MS_not_eligible/group_shelter_no_mpca/cfr_no_mpca_2 [select_one] Do you anticipate that your household will need to pay rent next month?
    cfr_no_mpca_2: undefined | Option<'cfr_no_mpca_2'>
    // group_MS_not_eligible/group_shelter_no_mpca/Are_you_currently_pa_any_shelter_repairs [select_one] Are you currently paying any shelter repairs?
    Are_you_currently_pa_any_shelter_repairs: undefined | Option<'Are_you_currently_pa_any_shelter_repairs'>
    // group_MS_not_eligible/group_shelter_no_mpca/Do_you_anticipate_th_r_repairs_next_month [select_one] Do you anticipate that your household will need to pay for shelter repairs next month?
    Do_you_anticipate_th_r_repairs_next_month: undefined | Option<'Do_you_anticipate_th_r_repairs_next_month'>
    // group_MS_not_eligible/group_no_mpca_nfi/no_mpca_nfi [select_one] Has your family suffered from the loss of most of your belongings due to the conflict?
    no_mpca_nfi: undefined | Option<'no_mpca_nfi'>
    // group_MS_not_eligible/group_no_mpca_nfi/no_mpca_nfi_issues [select_multiple] Do you have any issues finding and/or paying for the following items?
    no_mpca_nfi_issues: undefined | Option<'no_mpca_nfi_issues'>[]
    // group_MS_not_eligible/group_no_mpca_nfi/no_mpca_nfi_other [text] If other, please specify
    no_mpca_nfi_other: string | undefined
    // group_MS_not_eligible/group_no_mpca_nfi/no_mpca_nfi_pickup [select_one] Would you or a family member be able to pick-up items from a designated location near your home (up to 5KM)?
    no_mpca_nfi_pickup: undefined | Option<'no_mpca_nfi_pickup'>
    // no_consent_note [note] Thank you very much for talking to DRC today. We appreciate your time.
    no_consent_note: string
    // confirm_truth [select_one] Do you confirm that all of the information you have provided is true and accurate?
    confirm_truth: undefined | Option<'confirm_truth'>
    // consent_to_esign [select_one] DRC staff member ONLY - Can this person provide an e-signature?
    consent_to_esign: undefined | Option<'consent_to_esign'>
    // consent_signature_payment [image] In accordance with the Law of Ukraine "On the Protection of Personal Data" No. 2297-IV of June 1, 2010, we will need your consent for the following statement: "I give consent to the Representative Office of the Danish Refugee Council in Ukraine for the processing, use, access, distribution and transfer of my personal data to third parties that I provide about myself. The purpose of processing personal data to ensure the implementation of Assistance Programs.
    consent_signature_payment: string
    // paper_consent [note] You have stated this person cannot provide an e-signature. Please have them complete a paper consent form.
    paper_consent: string
    // eligible_end_note [note] Thank you so much for agreeing to answer the questions. DRC will be reviewing the application and might contact for additional clarification and request for personal documents..
    eligible_end_note: string
  }
  export const options = {
    DRC_project: {
      bha_project: `BHA - UKR-000284`,
    },
    drc_base: {
      lwo: `Lviv (LWO)`,
      cwc: `Chernivtsi (CWC)`,
      chj: `Chernihiv (CHJ)`,
      plv: `Poltava (PLV)`,
      dnk: `Dnipro (DNK)`,
      iev: `Kyiv (IEV)`,
    },
    staff_names: {
      dmytro_ivanov: `Dmytro Ivanov`,
      henadii_petrychenko: `Henadii Petrychenko`,
      nadiia_yudaieva: `Nadiia Yudaieva`,
      dmytro_tsaruk: `Dmytro Tsaruk`,
      viktoria_ushan: `Viktoria Ushan`,
      kostiantyn_yefimchuk: `Kostiantyn Yefimchuk`,
      daria_kokalia: `Daria Kokalia`,
      oleks_havrylov: `Oleks Havrylov`,
      vlad_zhukov: `Vlad Zhukov`,
      artem_chernukha: `Artem Chernukha`,
      maryna_dullovska: `Maryna Dullovska`,
      oleh_vyshnevskyi: `Oleh Vyshevskyi`,
      alina_bondarenko: `Alina Bondarenko`,
      serhii_dolzhenko: `Serhii Dolzhenko`,
      viktoria_klymenko: `Viktoria Klymenko`,
      dmytro_chernukha: `Dmytro Chernukha`,
      anastasiia_reshynska: `Anastasiia Reshynska`,
      nataliia_pushenko: `Nataliia Pushenko`,
    },
    BHA_area: {
      bha_area_idp: `IDP Host or Other Locations - high concentration of IDPs or conflict-affected persons.`,
      bha_area_conflict: `Conflict-Affected location - within 40KM of contact line.`,
      bha_area_formally: `Formally Occupied Area - formally occupied area since Feb. 2022.`,
      bha_area_evacuee: `Evacuee Hotspot - primary location of arrival from NGCA's.`,
    },
    confirm_truth: {
      '1': `Yes`,
      '2': `No`,
    },
    oblast: {
      cherkaska: `Cherkaska`,
      chernihivska: `Chernihivska`,
      chernivetska: `Chernivetska`,
      dnipropetrovska: `Dnipropetrovska`,
      donetska: `Donetska`,
      'ivano-frankivska': `Ivano-Frankivska`,
      kharkivska: `Kharkivska`,
      khersonska: `Khersonska`,
      khmelnytska: `Khmelnytska`,
      kirovohradska: `Kirovohradska`,
      kyivska: `Kyivska`,
      luhanska: `Luhanska`,
      lvivska: `Lvivska`,
      mykolaivska: `Mykolaivska`,
      odeska: `Odeska`,
      poltavska: `Poltavska`,
      rivnenska: `Rivnenska`,
      sevastopilska: `Sevastopilska`,
      sumska: `Sumska`,
      ternopilska: `Ternopilska`,
      vinnytska: `Vinnytska`,
      volynska: `Volynska`,
      zakarpatska: `Zakarpatska`,
      zaporizka: `Zaporizka`,
      zhytomyrska: `Zhytomyrska`,
    },
    exclusion_1: {
      '1': `Proceed to next step`,
    },
    exclusion_2: {
      '1': `Proceed to next step`,
    },
    vul_screen: {
      '1': `Proceed to next step`,
    },
    safe_shelter_001: {
      '1': `At a collective/transit center`,
      '2': `I'm hosted by relatives or friends`,
      '3': `I'm hosted by people I didn’t know before`,
      '4': `I'm renting an apartment`,
      '5': `I'm at hotel/hostel`,
      '6': `I'm at my own house`,
      '7': `I don’t have housing yet - I don't know where I'll be living`,
    },
    Has_this_location_been_damaged: {
      '1': `Yes`,
      '2': `No`,
    },
    idp_host_shelter_damaged: {
      '1': `Yes`,
      '2': `No`,
    },
    main_reason_damaged_shelter: {
      '1': `Yes`,
      '2': `No`,
    },
    displaced_ngca: {
      '1': `Yes, totally or partially damaged`,
      '2': `Not damaged`,
    },
    For_DRC_staff_only_Was_this_: {
      '1': `Yes`,
      '2': `No`,
    },
    gender_respondent: {
      '1': `Female`,
      '2': `Male`,
    },
    Are_you_the_head_of_your_house: {
      '1': `Yes`,
      '2': `No`,
    },
    sex: {
      '1': `Male`,
      '2': `Female`,
    },
    child_hhh_confirm: {
      '1': `Yes`,
      '2': `No`,
    },
    Is_this_household_female_heade: {
      '1': `Yes`,
      '2': `No`,
    },
    single_PWD: {
      '1': `Yes`,
      '2': `No`,
    },
    large_hh: {
      '1': `Yes`,
      '2': `No`,
    },
    child_elderly: {
      '1': `Yes`,
      '2': `No`,
    },
    child_pwd: {
      '1': `Yes`,
      '2': `No`,
    },
    plw: {
      '1': `Yes`,
      '2': `No`,
    },
    displaced_30days: {
      '1': `Yes`,
      '2': `No`,
    },
    child_custody: {
      '1': `Yes`,
      '2': `No`,
    },
    internal_referral: {
      '1': `Yes`,
      '2': `No`,
    },
    internal_referral_specific: {
      '1': `DRC Protection`,
      '2': `DRC NFI`,
      '3': `DRC Legal`,
      '4': `DRC Shelter`,
    },
    mpca_eligible_inclusion_area: {
      '1': `Proceed to next step`,
    },
    protection_referral: {
      '1': `Proceed to next step`,
    },
    mpca_yes_ehh: {
      '1': `Proceed to next step`,
    },
    mpca_eligible_vul: {
      '1': `Proceed to next step`,
    },
    status: {
      status_idp: `Internally Displaced Person (IDP)`,
      status_conflict: `Conflict-Affected person`,
      status_returnee: `Returnee`,
      status_refugee: `Refugee`,
    },
    idp_certificate: {
      '1': `Yes`,
      '2': `No`,
    },
    resident_permit: {
      '1': `Yes`,
      '2': `No`,
    },
    For_staff_member_ONL_cabinet_of_ministers: {
      '1': `Yes`,
      '2': `No`,
    },
    area_of_origin: {
      cherkaska: `Cherkaska`,
      chernihivska: `Chernihivska`,
      chernivetska: `Chernivetska`,
      dnipropetrovska: `Dnipropetrovska`,
      donetska: `Donetska`,
      ivano_frankivska: `Ivano-Frankivska`,
      kharkivska: `Kharkivska`,
      khersonska: `Khersonska`,
      khmelnytska: `Khmelnytska`,
      kirovohradska: `Kirovohradska`,
      kyivska: `Kyivska`,
      luhanska: `Luhanska`,
      lvivska: `Lvivska`,
      mykolaivska: `Mykolaivska`,
      odeska: `Odeska`,
      poltavska: `Poltavska`,
      rivnenska: `Rivnenska`,
      sevastopilska: `Sevastopilska`,
      sumska: `Sumska`,
      ternopilska: `Ternopilska`,
      vinnytska: `Vinnytska`,
      volynska: `Volynska`,
      zakarpatska: `Zakarpatska`,
      zaporizka: `Zaporizka`,
      zhytomyrska: `Zhytomyrska`,
    },
    consent_document: {
      '1': `Yes`,
      '2': `No`,
    },
    Does_the_respondent_have_perso: {
      '1': `Yes`,
      '2': `No`,
    },
    reason: {
      '1': `No ATMs/Banks in the locality`,
      '2': `No physical ability to get to an ATM/bank branch (for health reasons)`,
      '3': `No transport possibilities to get to ATM/bank branch (no public transport)`,
      '4': `No financial possibility to reach ATM / bank branch`,
      other: `Other`,
    },
    If_no_do_you_have_kraine_Postha_office: {
      '1': `Yes`,
      '2': `No`,
    },
    Are_you_currently_enrolled_in_: {
      '1': `Yes`,
      '2': `No`,
    },
    Have_you_received_yo_in_the_last_3_months: {
      '1': `Yes`,
      '2': `No`,
    },
    Are_you_able_to_provide_inform: {
      '1': `Yes`,
      '2': `No`,
    },
    Please_select_all_th_urrently_enrolled_in: {
      sp_edopomoga: `IDP and conflict-affected people Emergency Support Programme (e-Dopomoga)`,
      sp_epidtrymka: `ePidtrymka`,
      sp_entrepreneur_idps: `Compensation to entrepreneur for the employment of idps`,
      sp_idp_shelter: `IDP Shelter support programe`,
      sp_prykhystok: `Host Shelter Subsidy and Rent support (Prykhystok)`,
      sp_unicef: `Emergency Hot Spot Payment Programe`,
      sp_returnees: `Cash Support for Returnees`,
      sp2_meb: `Guaranteed Minimum Income`,
      sp2_pensions: `Pensions`,
      sp2_hus: `The Housing and Utility Subsidy program (HUS)`,
      sp2_child_birth: `Universal Child Birth Grant`,
      sp2_child_support: `Child Support`,
      sp2_child_pwd: `Assistance for children with severe disabilities and/or other health issues`,
      sp2_child_guardian: `Assistance for children over whom guardianship or guardianship is established`,
      sp2_health: `Sickness Benefit`,
      sp2_unemployment: `Unemployment`,
      sp2_caregiver: `Caregiver's allowance (old age)`,
      sp2_social_pension: `Social Pension (old age)`,
      sp2_pwd: `Disability person`,
      sp2_funeral_grant: `Funeral Grant`,
      sp2_maternity_benefits: `Maternity benefits`,
      sp2_childcare: `Childcare Benefit (non-contributory)`,
      sp2_educational_social: `Educational social benefits`,
      sp2_survivors_pension: `Survivor's pension`,
      sp2_state_social: `State social assistance (support to the pension fund)`,
    },
    Were_you_enrolled_to_before_February_2022: {
      '1': `Yes`,
      '2': `No`,
    },
    We_would_now_like_to_ask_you_s: {
      '1': `Yes`,
      '2': `No`,
    },
    nfi_loss: {
      '1': `Yes`,
      '2': `No`,
    },
    nfi_issues_items: {
      '1': `Winter clothes`,
      '2': `Hygiene items`,
      '3': `Blankets`,
      '4': `Kitchen items`,
      '5': `Bed linen, pillow and towels`,
      other: `Other`,
    },
    nfi_pickup: {
      '1': `Yes`,
      '2': `Yes, but it would be complicated`,
      '3': `No`,
    },
    high_kcal_food: {
      '0': `0 Days`,
      '1': `1 Day`,
      '2': `2 Days`,
      '3': `3 Days`,
      '4': `4 Days`,
      '5': `5 Days`,
      '6': `6 Days`,
      '7': `7 Days`,
    },
    not_eligible_note: {
      '1': `Yes`,
      '2': `No`,
    },
    not_eligible_note2: {
      '1': `Yes`,
      no: `No`,
    },
    cfr_no_mpca: {
      '1': `Yes`,
      '2': `No`,
    },
    cfr_no_mpca_2: {
      '1': `Yes`,
      '2': `No`,
    },
    Are_you_currently_pa_any_shelter_repairs: {
      '1': `Yes`,
      '2': `No`,
    },
    Do_you_anticipate_th_r_repairs_next_month: {
      '1': `Yes`,
      '2': `No`,
    },
    no_mpca_nfi: {
      '1': `Yes`,
      '2': `No`,
    },
    no_mpca_nfi_issues: {
      '1': `Winter clothes`,
      '2': `Hygiene items`,
      '3': `Blankets`,
      '4': `Kitchen items`,
      '5': `Bed linen, pillows and towels`,
      other: `Other`,
    },
    no_mpca_nfi_pickup: {
      '1': `Yes`,
      '2': `Yes, but it would be complicated`,
      '3': `No`,
    },
    consent_to_esign: {
      '1': `Yes`,
      '2': `No`,
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
      household_size: _.household_size ? +_.household_size : undefined,
      income_month: _.income_month ? +_.income_month : undefined,
      hh_elderly_check: _.hh_elderly_check ? +_.hh_elderly_check : undefined,
      agex: _.agex ? +_.agex : undefined,
      group_hh_composition_row_less_4: _.group_hh_composition_row_less_4
        ? +_.group_hh_composition_row_less_4
        : undefined,
      group_hh_composition_row_5_to_17: _.group_hh_composition_row_5_to_17
        ? +_.group_hh_composition_row_5_to_17
        : undefined,
      group_hh_composition_row_18_to_59: _.group_hh_composition_row_18_to_59
        ? +_.group_hh_composition_row_18_to_59
        : undefined,
      group_hh_composition_row_above_60: _.group_hh_composition_row_above_60
        ? +_.group_hh_composition_row_above_60
        : undefined,
      group_hh_composition_row_1_less_4: _.group_hh_composition_row_1_less_4
        ? +_.group_hh_composition_row_1_less_4
        : undefined,
      group_hh_composition_row_1_5_to_17: _.group_hh_composition_row_1_5_to_17
        ? +_.group_hh_composition_row_1_5_to_17
        : undefined,
      group_hh_composition_row_1_18_to_59: _.group_hh_composition_row_1_18_to_59
        ? +_.group_hh_composition_row_1_18_to_59
        : undefined,
      group_hh_composition_row_1_above_60: _.group_hh_composition_row_1_above_60
        ? +_.group_hh_composition_row_1_above_60
        : undefined,
      internal_referral_specific: _.internal_referral_specific?.split(' '),
      reason: _.reason?.split(' '),
      Please_select_all_th_urrently_enrolled_in: _.Please_select_all_th_urrently_enrolled_in?.split(' '),
      nfi_issues_items: _.nfi_issues_items?.split(' '),
      no_mpca_nfi_issues: _.no_mpca_nfi_issues?.split(' '),
    }) as T
}
