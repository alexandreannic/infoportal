export namespace Bn_0_mpcaRegESign {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: a8JXohrBDqTdCc86Ysz26r
  export interface T {
    start: string
    end: string
    today: string
    // module1/GPS1 [geopoint] Please enter location
    GPS1: string
    // module1/drc_base [select_one] Select DRC base
    drc_base: undefined | Option<'drc_base'>
    // module1/staff_names [select_one] Select DRC staff name
    staff_names: undefined | Option<'staff_names'>
    // module1/DRC_project [select_one] Please select DRC project and donor that this registration is for
    DRC_project: undefined | Option<'DRC_project'>
    // module1/BHA_area [select_one] Select BHA geographical area
    BHA_area: undefined | Option<'BHA_area'>
    // module_consent/__021 [note] In order to register your application, we'd need to ask you a few questions to understand the composition of your household and how to best transfer financial assistance to you if you are eligible. These questions will take between 10-15 minutes. If you are eligible, we’ll need to share some basic details with the bank in order to make the payment. We are also required to share Tax ID numbers of people we provide assistance to with other humanitarian agencies implementing financial assistance programs, to ensure we are not duplicating assistance. All the other information will be stored safely, in accordance with the Law on protection of personal data, and will not be shared outside of DRC and its partners.
    __021: string
    // module_consent/consent_mod_1 [select_one] Are you happy to proceed with the questionnaire?
    consent_mod_1: undefined | Option<'confirm_truth'>
    // module_eligibility_screening/oblast [select_one] Select oblast
    oblast: undefined | Option<'oblast'>
    // module_eligibility_screening/raion [select_one] Select raion
    raion: undefined | string
    // module_eligibility_screening/hromada [select_one] Select hromada
    hromada: undefined | string
    // module_eligibility_screening/patron [text] What is your last name (as shown in personal ID)?
    patron: string | undefined
    // module_eligibility_screening/name_resp [text] What is your first name (as shown in personal ID)?
    name_resp: string | undefined
    // module_eligibility_screening/last_resp [text] What is your patronymic name?
    last_resp: string | undefined
    // module_eligibility_screening/phone [integer] What is your phone number?
    phone: number | undefined
    // module_eligibility_screening/inclusion_exclusion_group/protection_referral [select_one] For interviewee only - Has this household been referred to by protection?
    protection_referral: undefined | Option<'protection_referral'>
    // module_eligibility_screening/inclusion_exclusion_group/ingo [select_one] Have you received cash from an NGO in the last 3 months?
    ingo: undefined | Option<'confirm_truth'>
    // module_eligibility_screening/inclusion_exclusion_group/household_size [integer] What is the size of your household? (we will ask you to provide more details later)
    household_size: number | undefined
    // module_eligibility_screening/inclusion_exclusion_group/income_month [integer] What was the income of your household in the last 30 days in UAH?
    income_month: number | undefined
    calculation_average_income: string
    // module_eligibility_screening/inclusion_exclusion_group/The_average_income_o_per_month_per_person [note] The average income of this household is ${calculation_average_income} per month per person
    The_average_income_o_per_month_per_person: string
    // module_eligibility_screening/inclusion_exclusion_group/group_inclusion_area/east_evacuation/recent_displacement [select_one] Has your household been displaced within in the last 3 days?
    recent_displacement: undefined | Option<'confirm_truth'>
    // module_eligibility_screening/inclusion_exclusion_group/group_inclusion_area/idp_host/west_shelter [select_one] Where are you currently staying?
    west_shelter: undefined | Option<'west_shelter'>
    // module_eligibility_screening/inclusion_exclusion_group/group_inclusion_area/idp_host/ccs [text] Enter name of collective center
    ccs: string | undefined
    // module_eligibility_screening/inclusion_exclusion_group/group_inclusion_area/center/occupation [select_one] Has your family lived under occupation?
    occupation: undefined | Option<'confirm_truth'>
    // module_eligibility_screening/inclusion_exclusion_group/group_inclusion_area/center/returnee [select_one] Have you been displaced due to the occupation and are now returning to your place of residency?
    returnee: undefined | Option<'confirm_truth'>
    // module_eligibility_screening/inclusion_exclusion_group/group_inclusion_area/center/safe_shelter [select_one] Was your home impacted or destroyed by the conflict?
    safe_shelter: undefined | Option<'confirm_truth'>
    ctr_vuln: string
    // module_eligibility_screening/inclusion_exclusion_group/group_inclusion_area/east_conflict_location/displaced_ngca [select_one] Has your home been damaged or destroyed by shelling?
    displaced_ngca: undefined | Option<'displaced_ngca'>
    // module_eligibility_screening/vul_screen [select_one] This household can be screened for vulnerability targeting criteria - proceed to next step
    vul_screen: undefined | Option<'vul_screen'>
    // module_eligibility_screening/exclusion_1 [select_one] This household is not eligible for cash assistance because they have received cash from another NGO in the last 3 months.
    exclusion_1: undefined | Option<'exclusion_1'>
    // module_eligibility_screening/exclusion_2 [select_one] This household is not eligible for cash assistance because they earn more than 5,400 UAH per person per month
    exclusion_2: undefined | Option<'exclusion_2'>
    // targeting_criteria/Are_you_the_head_of_your_house [select_one] Are you the head of your household?
    Are_you_the_head_of_your_house: undefined | Option<'Are_you_the_head_of_your_house'>
    // targeting_criteria/Select_gender [select_one] Select gender
    Select_gender: undefined | Option<'Select_gender'>
    // targeting_criteria/sex [select_one] What is the gender of head of household?
    sex: undefined | Option<'sex'>
    // targeting_criteria/hh_elderly_check [integer] How old is the head of household?
    hh_elderly_check: number | undefined
    // targeting_criteria/agex [integer] How old are you?
    agex: number | undefined
    // targeting_criteria/child_hhh_confirm [select_one] You have stated you are under 18 years, can you confirm you are the head of household?
    child_hhh_confirm: undefined | Option<'child_hhh_confirm'>
    // targeting_criteria/child_hhh [note] This is a child headed household (high risk protection case), please refer immediately to a Child Protection Actor.
    child_hhh: string
    // targeting_criteria/displacement_30days [select_one] Has your household been displaced in the last 30 days?
    displacement_30days: undefined | Option<'displacement_30days'>
    // targeting_criteria/alone [select_one] Are you traveling or living alone?
    alone: undefined | Option<'confirm_truth'>
    // targeting_criteria/single_pwd [select_one] You are traveling alone, do you have any disability (physical, mental, chronic illness or temporary injury)?
    single_pwd: undefined | Option<'single_pwd'>
    // targeting_criteria/hh_children [select_one] Are you currently travelling or living with children? (any person under the age of 18)?
    hh_children: undefined | Option<'hh_children'>
    // targeting_criteria/children_number [integer] How many children (under 18) are in your care/in your household?
    children_number: number | undefined
    // targeting_criteria/plw [select_one] Are you or anyone in your household pregnant or lactating?
    plw: undefined | Option<'confirm_truth'>
    // targeting_criteria/elderly [select_one] Is anyone in your household 60 years old or older?
    elderly: undefined | Option<'confirm_truth'>
    // targeting_criteria/plwd [select_one] Is anyone in your household (including children) have a chronic illness or disability (including temporary or permanent impairment caused by war injury)?
    plwd: undefined | Option<'confirm_truth'>
    // targeting_criteria/other_children [select_one] You mentioned you have children in your care, does this include children who are not yours (i.e. you are caring for someone else's children)?
    other_children: undefined | Option<'confirm_truth'>
    // group_ju14z64/mpca_yes_ehh [select_one] This household is eligible for MPCA because they are an elderly-headed household.
    mpca_yes_ehh: undefined | Option<'mpca_yes_ehh'>
    // group_ju14z64/mpca_yes_fhh [select_one] This household is eligible for MPCA because they are a female-headed household.
    mpca_yes_fhh: undefined | Option<'mpca_yes_fhh'>
    // group_ju14z64/mpca_yes_morechildren [select_one] This household is eligible for MPCA because they have more than 2 children.
    mpca_yes_morechildren: undefined | Option<'mpca_yes_morechildren'>
    // group_ju14z64/mpca_yes_plw [select_one] This household is eligible for MPCA because they have a pregnant/lactating woman.
    mpca_yes_plw: undefined | Option<'mpca_yes_plw'>
    // group_ju14z64/mpca_yes_1child_1elderly [select_one] This household is eligible for MPCA because they have at least 1 child and 1 elderly person in their household.
    mpca_yes_1child_1elderly: undefined | Option<'mpca_yes_1child_1elderly'>
    // group_ju14z64/mpca_eligible_1child_1pwd [select_one] This household is eligible for MPCA because they have at least 1 child and 1 member with disability/chronic illness or war injury..
    mpca_eligible_1child_1pwd: undefined | Option<'mpca_eligible_1child_1pwd'>
    // group_ju14z64/mpca_eligible_singlepwd [select_one] This household is eligible for MPCA because they are a single individual living with disabilities
    mpca_eligible_singlepwd: undefined | Option<'mpca_eligible_singlepwd'>
    // group_ju14z64/mpca_eligible_inclusion [select_one] This household is eligible for MPCA because they have meet at least 1 inclusion criteria.
    mpca_eligible_inclusion: undefined | Option<'mpca_eligible_inclusion'>
    // group_ju14z64/mpca_eligible_displaced [select_one] This household is eligible for MPCA because they have been displaced in less than 30 days
    mpca_eligible_displaced: undefined | Option<'mpca_eligible_displaced'>
    // group_ju14z64/mpca_eligible_careotherchildre [select_one] This household is eligible for MPCA because they are caring for other children (guardianship or custody)
    mpca_eligible_careotherchildre: undefined | Option<'mpca_eligible_careotherchildre'>
    calculation_eligible: string
    // cash_yes/You_are_eligible_for_ur_household_members [note] You are eligible for cash assistance, we will now ask you some detailed questions about yourself and your household members.
    You_are_eligible_for_ur_household_members: string
    // cash_yes/group_ns16l72/status [select_one] Select status
    status: undefined | Option<'status'>
    // cash_yes/group_ns16l72/idp_certificate [select_one] Do you have an IDP certificate?
    idp_certificate: undefined | Option<'idp_certificate'>
    // cash_yes/group_ns16l72/reason_no_idp_certificate [text] Please state main reason why you do not have an IDP certificate
    reason_no_idp_certificate: string | undefined
    // cash_yes/group_ns16l72/resident_permit [select_one] Do you have a resident permit from a conflict-affected location?
    resident_permit: undefined | Option<'resident_permit'>
    // cash_yes/group_ns16l72/For_staff_member_ONL_cabinet_of_ministers [select_one] For staff member ONLY - is this person from a recognized conflict-affected area? (within the decree of cabinet of ministers)
    For_staff_member_ONL_cabinet_of_ministers: undefined | Option<'For_staff_member_ONL_cabinet_of_ministers'>
    // cash_yes/group_ns16l72/no_resident_permit [text] If no, what is the mean reason for not having a resident permit?
    no_resident_permit: string | undefined
    // cash_yes/group_ns16l72/your_id [text] What is your Tax ID?
    your_id: string | undefined
    // cash_yes/hh_composition_grp/group_household_dem_header/group_household_dem_header_note [note] **Please include information on household demographics in the table below**
    group_household_dem_header_note: string
    // cash_yes/hh_composition_grp/group_household_dem_header/group_household_dem_header_female [note] **Female**
    group_household_dem_header_female: string
    // cash_yes/hh_composition_grp/group_household_dem_header/group_household_dem_header_male [note] **Male**
    group_household_dem_header_male: string
    // cash_yes/hh_composition_grp/group_household_dem_under4_1/group_household_dem_under4_1_note [note] ##### Under 4 years
    group_household_dem_under4_1_note: string
    // cash_yes/hh_composition_grp/group_household_dem_under4_1/group_household_dem_under4_1_female [integer] <span style="display:none">under4_1-Female</span>
    group_household_dem_under4_1_female: number | undefined
    // cash_yes/hh_composition_grp/group_household_dem_under4_1/group_household_dem_under4_1_male [integer] <span style="display:none">under4_1-Male</span>
    group_household_dem_under4_1_male: number | undefined
    // cash_yes/hh_composition_grp/group_household_dem_5to17_1/group_household_dem_5to17_1_note [note] ##### 5 to 17 years
    group_household_dem_5to17_1_note: string
    // cash_yes/hh_composition_grp/group_household_dem_5to17_1/group_household_dem_5to17_1_female [integer] <span style="display:none">5to17_1-Female</span>
    group_household_dem_5to17_1_female: number | undefined
    // cash_yes/hh_composition_grp/group_household_dem_5to17_1/group_household_dem_5to17_1_male [integer] <span style="display:none">5to17_1-Male</span>
    group_household_dem_5to17_1_male: number | undefined
    // cash_yes/hh_composition_grp/group_household_dem_18to59_1/group_household_dem_18to59_1_note [note] ##### 18 to 59 years
    group_household_dem_18to59_1_note: string
    // cash_yes/hh_composition_grp/group_household_dem_18to59_1/group_household_dem_18to59_1_female [integer] <span style="display:none">18to59_1-Female</span>
    group_household_dem_18to59_1_female: number | undefined
    // cash_yes/hh_composition_grp/group_household_dem_18to59_1/group_household_dem_18to59_1_male [integer] <span style="display:none">18to59_1-Male</span>
    group_household_dem_18to59_1_male: number | undefined
    // cash_yes/hh_composition_grp/group_household_dem_above60_1/group_household_dem_above60_1_note [note] ##### Above 60 years
    group_household_dem_above60_1_note: string
    // cash_yes/hh_composition_grp/group_household_dem_above60_1/group_household_dem_above60_1_female [integer] <span style="display:none">above60_1-Female</span>
    group_household_dem_above60_1_female: number | undefined
    // cash_yes/hh_composition_grp/group_household_dem_above60_1/group_household_dem_above60_1_male [integer] <span style="display:none">above60_1-Male</span>
    group_household_dem_above60_1_male: number | undefined
    // cash_yes/hh_composition_grp/adult_1 [text] What is the Tax ID of each additional adult that are part of your household?
    adult_1: string | undefined
    // cash_yes/hh_composition_grp/overall_check_no [note] Note for staff member: tell the respondent that we may be contacting them to verify the actual number of people in their household.
    overall_check_no: string
    // group_5_document_collection/consent_document [select_one] Do you provide DRC consent to take photos or copies of your personal documentation at this time? Following DRC Data Protection Protocols and Ukraine Law on Data Protection, we will not share copies or photos of your documents with anyone outside DRC and these will only be used for the sole purpose of processing your information in order to provide you with cash assistance. You can decide to say no at this time and we will need to collect your documents at a later point in time.
    consent_document: undefined | Option<'consent_document'>
    // group_5_document_collection/document_passport_idcard [select_one] Do you have passport or ID card?
    document_passport_idcard: undefined | Option<'document_passport_idcard'>
    // group_5_document_collection/Photo_of_ID_card [image] Photo of ID card
    Photo_of_ID_card: string
    // group_5_document_collection/passport_photos/Passport_page_1 [image] Passport page 1
    Passport_page_1: string
    // group_5_document_collection/passport_photos/Passport_page_2_3 [image] Passport page 2-3
    Passport_page_2_3: string
    // group_5_document_collection/passport_photos/Passport_page_4_5 [image] Passport page 4-5
    Passport_page_4_5: string
    // group_5_document_collection/passport_photos/Passport_page_6_7 [image] Passport page 6-7
    Passport_page_6_7: string
    // group_5_document_collection/passport_photos/Passport_Registration_page [image] Passport Registration page
    Passport_Registration_page: string
    // group_5_document_collection/passport_photos/Passport_page_after_registration [image] Passport page after registration
    Passport_page_after_registration: string
    // group_5_document_collection/Do_you_have_certification_of_y [select_one] Do you have certification of your Individual Tax Code?
    Do_you_have_certification_of_y: undefined | Option<'Do_you_have_certification_of_y'>
    // group_5_document_collection/Photo_of_Individual_Tax_Code [image] Photo of Individual Tax Code
    Photo_of_Individual_Tax_Code: string
    // group_5_document_collection/Photo_of_IDP_Certificate [image] Photo of IDP Certificate
    Photo_of_IDP_Certificate: string
    // delivery_mechanisms/bank [select_one] 4.1 Do you have access to bank branches/ ATMs?
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
    // not_eligible_note [select_one] Unfortunately, due to our targeting criteria you are not eligible to receive cash assistance from DRC. However, we would like to ask you some questions about shelter, NFI and protection in order to see if you are eligible for other type of assistance. Do you agree to proceed with the additional questions?
    not_eligible_note: undefined | Option<'not_eligible_note_001'>
    // not_eligible_note_001 [select_one] Unfortunately, due to our targeting criteria you are not eligible to receive cash assistance from DRC. However, we would like to ask you some questions about shelter, NFI and protection in order to see if you are eligible for other type of assistance. Do you agree to proceed with the additional questions?
    not_eligible_note_001: undefined | Option<'not_eligible_note_001'>
    // not_eligible_3 [select_one] Unfortunately, due to our targeting criteria you are not eligible to receive cash assistance from DRC. However, we would like to ask you some questions about shelter, NFI and protection in order to see if you are eligible for other type of assistance. Do you agree to proceed with the additional questions?
    not_eligible_3: undefined | Option<'not_eligible_3'>
    // not_eligible_4 [select_one] Unfortunately, due to our targeting criteria you are not eligible to receive cash assistance from DRC. However, we would like to ask you some questions about shelter, NFI and protection in order to see if you are eligible for other type of assistance. Do you agree to proceed with the additional questions?
    not_eligible_4: undefined | Option<'not_eligible_4'>
    // not_eligible_5 [select_one] Unfortunately, due to our targeting criteria you are not eligible to receive cash assistance from DRC. However, we would like to ask you some questions about shelter, NFI and protection in order to see if you are eligible for other type of assistance. Do you agree to proceed with the additional questions?
    not_eligible_5: undefined | Option<'not_eligible_5'>
    // not_eligible_6 [select_one] Unfortunately, due to our targeting criteria you are not eligible to receive cash assistance from DRC. However, we would like to ask you some questions about shelter, NFI and protection in order to see if you are eligible for other type of assistance. Do you agree to proceed with the additional questions?
    not_eligible_6: undefined | Option<'not_eligible_6'>
    // group_shelter_no_mpca/cfr_no_mpca [select_one] Are you currently paying for rent?
    cfr_no_mpca: undefined | Option<'cfr_no_mpca'>
    // group_shelter_no_mpca/cfr_no_mpca_2 [select_one] Do you anticipate that your household will need to pay rent next month?
    cfr_no_mpca_2: undefined | Option<'cfr_no_mpca_2'>
    // group_shelter_no_mpca/Are_you_currently_pa_any_shelter_repairs [select_one] Are you currently paying any shelter repairs?
    Are_you_currently_pa_any_shelter_repairs: undefined | Option<'Are_you_currently_pa_any_shelter_repairs'>
    // group_shelter_no_mpca/Do_you_anticipate_th_r_repairs_next_month [select_one] Do you anticipate that your household will need to pay for shelter repairs next month?
    Do_you_anticipate_th_r_repairs_next_month: undefined | Option<'Do_you_anticipate_th_r_repairs_next_month'>
    // additional/pre [note] Now we would like to ask you a few questions to understand your family dynamics, so we can better monitor the effects of our assistance. This would take an extra 5 minutes. Responding these questions is optional - even though it would be great for us to have this information, bear in mind that if you say 'No', this will not have any negative repercussion in your application to our assistance
    pre: string
    // additional/pre2 [select_one] Would you like to proceed with some more questions?
    pre2: undefined | Option<'confirm_truth'>
    // additional/baseline/rcsi_group/cheap_food_group/cheap_food [select_one] a. Rely on less preferred and less expensive foods?
    cheap_food: undefined | Option<'high_kcal_food'>
    pts_cheap_food: string
    yes_cheap_food: string
    // additional/baseline/rcsi_group/expired_food/food_expired [select_one] Eat poor quality food or expired food?
    food_expired: undefined | Option<'high_kcal_food'>
    pts_food_expired: string
    yes_food_expired: string
    // additional/baseline/rcsi_group/borrow_group/borrow [select_one] b. Borrow food, or rely on help from a friend or relative?
    borrow: undefined | Option<'high_kcal_food'>
    pts_borrow: string
    yes_borrow: string
    // additional/baseline/rcsi_group/reduce_portion_group/reduce_portion [select_one] c. Limit portion size at mealtimes?
    reduce_portion: undefined | Option<'high_kcal_food'>
    pts_reduce_portion: string
    yes_reduce_portion: string
    // additional/baseline/rcsi_group/wild_food/wild_foods [select_one] Collect wild berries, herbs, mushrooms, or hunt or fish?
    wild_foods: undefined | Option<'high_kcal_food'>
    pts_wild_food: string
    yes_wild_food: string
    // additional/baseline/rcsi_group/prioritize_child_meals_group/prioritize_child_meals [select_one] d. Restrict consumption by adults in order for small children to eat?
    prioritize_child_meals: undefined | Option<'high_kcal_food'>
    pts_prioritize_child_meals: string
    yes_child_meal: string
    // additional/baseline/rcsi_group/skip_meals_group/skip_meals [select_one] e. Reduce number of meals eaten in a day?
    skip_meals: undefined | Option<'high_kcal_food'>
    pts_skip_meals: string
    yes_skip_meals: string
    // additional/baseline/rcsi_group/shelter_meal/meal_shelter [select_one] Have meals from collective shelters or volunteer groups?
    meal_shelter: undefined | Option<'high_kcal_food'>
    pts_shelter_meal: string
    yes_shelter_meal: string
    // additional/baseline/rcsi_group/calorie_dense_foods/high_kcal_food [select_one] Prioritize highly caloric foods over other food groups? (e.g., fresh fruits & vegetables)
    high_kcal_food: undefined | Option<'high_kcal_food'>
    pts_high_kcal_food: string
    yes_high_kcal_food: string
    pts_std_rcsi: string
    ipc_std_rcsi: string
    pts_context_rcsi: string
    ipc_context_rcsi: string
    // additional/baseline/addi/needs [select_one] B5.1 Is your household currently able to meet all, most, some, or none of its basic needs as you define them?
    needs: undefined | Option<'needs'>
    // additional/baseline/addi/shelter [select_one] B5.2 Does your current living space allow you to conduct essential household activities with dignity, security, and provide protection from physical and environmental harm?
    shelter: undefined | Option<'confirm_truth'>
    // additional/baseline/addi/nfis [select_one] B5.3 Does your household currently have enough clothing, bedding, cooking supplies, fuel, lighting, and other items needed to provide a basic level of comfort?
    nfis: undefined | Option<'confirm_truth'>
    // additional/baseline/addi/wash [select_one] B5.4 During the past two weeks, did your household purchase more, fewer, or the usual amount of items to meet your basic water, sanitation, and hygiene needs?
    wash: undefined | Option<'wash'>
    // no_consent_note [note] Thank you very much for talking to DRC today. We appreciate your time.
    no_consent_note: string
    // confirm_truth [select_one] Do you confirm that all of the information you have provided is true and accurate?
    confirm_truth: undefined | Option<'confirm_truth'>
    // consent_signature_payment [image] In accordance with the Law of Ukraine "On the Protection of Personal Data" No. 2297-IV of June 1, 2010, we will need your consent for the following statement: "I give consent to the Representative Office of the Danish Refugee Council in Ukraine for the processing, use, access, distribution and transfer of my personal data to third parties that I provide about myself. The purpose of processing personal data to ensure the implementation of Assistance Programs.
    consent_signature_payment: string
    // eligible_end_note [note] Thank you so much for agreeing to answer the questions. DRC will be reviewing the application and might contact for additional clarification and request for personal documents..
    eligible_end_note: string
  }
  export const options = {
    drc_base: {
      lwo: `Lviv (LWO)`,
      cwc: `Chernivtsi (CWC)`,
      chj: `Chernahiv (CHJ)`,
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
      maryna_dullovska: `Maryna Duilovska`,
      oleh_vyshnevskyi: `Oleh Vyshnevskyi`,
      alina_bondarenko: `Alina Bondarenko`,
      serhii_dolzhenko: `Serhii Dolzhenko`,
      viktoria_klymenko: `Viktoria Klymenko`,
      dmytro_chernukha: `Dmytro Chernukha`,
      natalia_pushenko: `Natalia Pushenko`,
      tetiana_gorbatiuk: `Tetiana Gorbatiuk`,
      anastasia_reshinska: `Anastasia Reshinska`,
      oleksandr_lukomets: `Oleksandr Lukomets`,
      tetiana_kolot: `Tetiana Kolot`,
      katerina_severin: `Katerina Severin`,
      maksim_sedun: `Maksim Sedun`,
      ivan_volynkin: `Ivan Volynkin`,
    },
    DRC_project: {
      bha: `BHA/XXX`,
    },
    BHA_area: {
      bha_area_idp: `IDP Host Location - high concentration of IDPs hosted`,
      bha_area_conflict: `Conflict-Affected location - within 40KM of contact line`,
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
    protection_referral: {
      '1': `Yes`,
      '2': `No`,
    },
    west_shelter: {
      '1': `At a collective/transit center`,
      '2': `I'm hosted by relatives or friends`,
      '3': `I'm hosted by people I didn’t know before`,
      '4': `I'm renting an apartment`,
      '5': `I'm at hotel/hostel`,
      '6': `I'm at my own house`,
      '7': `I don’t have housing yet - I don't know where I'll be living`,
    },
    displaced_ngca: {
      '1': `Yes, totally or partially damaged`,
      '2': `Not damaged`,
    },
    vul_screen: {
      '1': `Proceed to next step`,
    },
    exclusion_1: {
      '1': `Proceed to next step`,
    },
    exclusion_2: {
      '1': `Proceed to next step`,
    },
    Are_you_the_head_of_your_house: {
      '1': `Yes`,
      '2': `No`,
    },
    Select_gender: {
      '1': `Male`,
      '2': `Female`,
    },
    sex: {
      '1': `Male`,
      '2': `Female`,
    },
    child_hhh_confirm: {
      '1': `Yes`,
      '2': `No`,
    },
    displacement_30days: {
      '1': `Yes`,
      '2': `No`,
    },
    single_pwd: {
      '1': `Yes`,
      '2': `No`,
    },
    hh_children: {
      '1': `Yes`,
      '2': `No`,
    },
    mpca_yes_ehh: {
      '1': `Proceed to next step`,
    },
    mpca_yes_fhh: {
      '1': `Proceed to next step`,
    },
    mpca_yes_morechildren: {
      '1': `Proceed to next step`,
    },
    mpca_yes_plw: {
      '1': `Proceed to next step`,
    },
    mpca_yes_1child_1elderly: {
      '1': `Proceed to next step`,
    },
    mpca_eligible_1child_1pwd: {
      '1': `Proceed to next step`,
    },
    mpca_eligible_singlepwd: {
      '1': `Proceed to next step`,
    },
    mpca_eligible_inclusion: {
      '1': `Proceed to next step`,
    },
    mpca_eligible_displaced: {
      '1': `Proceed to next step`,
    },
    mpca_eligible_careotherchildre: {
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
    consent_document: {
      '1': `Yes`,
      '2': `No`,
    },
    document_passport_idcard: {
      document_passport: `Passport`,
      document_id_card: `ID card`,
    },
    Do_you_have_certification_of_y: {
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
    not_eligible_note_001: {
      '1': `Yes`,
      '2': `No`,
    },
    not_eligible_3: {
      '1': `Yes`,
      '2': `No`,
    },
    not_eligible_4: {
      '1': `Yes`,
      '2': `No`,
    },
    not_eligible_5: {
      '1': `Yes`,
      '2': `No`,
    },
    not_eligible_6: {
      '1': `Yes`,
      '2': `No`,
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
    needs: {
      '0': `None`,
      '1': `Some`,
      '2': `Most`,
      '3': `All`,
    },
    wash: {
      '1': `More`,
      '2': `Fewer`,
      '3': `No change`,
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
      children_number: _.children_number ? +_.children_number : undefined,
      group_household_dem_under4_1_female: _.group_household_dem_under4_1_female
        ? +_.group_household_dem_under4_1_female
        : undefined,
      group_household_dem_under4_1_male: _.group_household_dem_under4_1_male
        ? +_.group_household_dem_under4_1_male
        : undefined,
      group_household_dem_5to17_1_female: _.group_household_dem_5to17_1_female
        ? +_.group_household_dem_5to17_1_female
        : undefined,
      group_household_dem_5to17_1_male: _.group_household_dem_5to17_1_male
        ? +_.group_household_dem_5to17_1_male
        : undefined,
      group_household_dem_18to59_1_female: _.group_household_dem_18to59_1_female
        ? +_.group_household_dem_18to59_1_female
        : undefined,
      group_household_dem_18to59_1_male: _.group_household_dem_18to59_1_male
        ? +_.group_household_dem_18to59_1_male
        : undefined,
      group_household_dem_above60_1_female: _.group_household_dem_above60_1_female
        ? +_.group_household_dem_above60_1_female
        : undefined,
      group_household_dem_above60_1_male: _.group_household_dem_above60_1_male
        ? +_.group_household_dem_above60_1_male
        : undefined,
      reason: _.reason?.split(' '),
      Please_select_all_th_urrently_enrolled_in: _.Please_select_all_th_urrently_enrolled_in?.split(' '),
    }) as T
}
