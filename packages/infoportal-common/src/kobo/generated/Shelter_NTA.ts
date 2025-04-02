export namespace Shelter_nta {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: aL8oHMzJJ9soPepvK6YU9E
  export interface T {
    start: string
    end: string
    // Intro/back_office [select_one] 1.1 Select Office
    back_office: undefined | Option<'back_office'>
    // Intro/enum_name [select_one] Enumerator Name
    enum_name: undefined | Option<'enum_name'>
    // Intro/drc_intro [note] DRC is a Danish non-governmental humanitarian organization and that currently implements a project providing shelter support to households with damaged shelters. DRC is conducting an initial assessment to determine which households are eligible to be targeted by for the project.
    drc_intro: string
    // Intro/consent [select_one] Consent
    consent: undefined | Option<'pregnant_lac'>
    // Intro/thank_no_further [note] Thank you for your time today, we have no further questions
    thank_no_further: string
    // Meta_data/ben_det_oblast [select_one] Select oblast where registration is taking place
    ben_det_oblast: undefined | Option<'ben_det_oblast'>
    // Meta_data/ben_det_raion [select_one] Select raion where registration is taking place
    ben_det_raion: undefined | string
    // Meta_data/ben_det_hromada [select_one] Select hromada where registration is taking place
    ben_det_hromada: undefined | string
    // Meta_data/ben_det_res_stat [select_one] Select residential status
    ben_det_res_stat: undefined | Option<'ben_det_res_stat'>
    // Shelter_Damage/damage_hostilities [select_one] What is the Condition of the building/ Apartment:
    damage_hostilities: undefined | Option<'damage_hostilities'>
    // Shelter_Damage/damage_note [note] ℹ️ Because of limited financial resources in the project, it’s important to note that participating in this initial assessment does not guarantee that assistance will be provided.
    damage_note: string
    // Shelter_Damage/resident_available [select_one] Please confirm that the resident of the shelter is available in the next three months and grants access to DRC for the rehabilitation work
    resident_available: undefined | Option<'pregnant_lac'>
    // Shelter_Damage/uneligible [note] 🛑 **You did not reach the criteria for shelter support, thank you for your time**
    uneligible: string
    // House_Details/interviewee_name [text] What is your name?
    interviewee_name: string | undefined
    // House_Details/hh_char_hhh [select_one] Are you the head of household AND/OR able to speak on behalf of the household?
    hh_char_hhh: undefined | Option<'pregnant_lac'>
    // House_Details/hh_char_res_gender [select_one] Select gender of respondent?
    hh_char_res_gender: undefined | Option<'hh_char_hh_det_gender'>
    // House_Details/hh_char_res_age [integer] Age of Respondent
    hh_char_res_age: number | undefined
    // House_Details/hh_char_res_dis_select [select_multiple] Please select any of the below that apply to respondent
    hh_char_res_dis_select: undefined | Option<'hh_char_dis_select'>[]
    // House_Details/hh_char_res_dis_level [select_one] What is the level of difficulty for the selected options in the previous questions?
    hh_char_res_dis_level: undefined | Option<'hh_char_hh_det_dis_level'>
    // House_Details/hh_yes_pp [image] Picture of passport/ ID of the Head of Household
    hh_yes_pp: string
    // House_Details/pp_picture [image] Picture of passport/ ID of interviewee
    pp_picture: string
    // House_Details/hh_char_hhh_gender [select_one] What is the gender of head of household?
    hh_char_hhh_gender: undefined | Option<'hh_char_hh_det_gender'>
    // House_Details/hh_char_hhh_age [integer] What is the age of the Head of Household?
    hh_char_hhh_age: number | undefined
    // House_Details/hh_char_hhh_dis_select [select_multiple] Please select any of the below that apply to Head of household
    hh_char_hhh_dis_select: undefined | Option<'hh_char_dis_select'>[]
    // House_Details/hh_char_hhh_dis_level [select_one] What is the level of difficulty for the selected options in the previous questions?
    hh_char_hhh_dis_level: undefined | Option<'hh_char_hh_det_dis_level'>
    // House_Details/hh_char_civ_stat [select_one] What is the civil status of the Head of Household?
    hh_char_civ_stat: undefined | Option<'hh_char_civ_stat'>
    calc_char_civ_stat: string
    // House_Details/hh_char_chh [note] This is a child headed household (high risk protection case), please refer immediately to a DRC Protection colleague and complete internal referral form.
    hh_char_chh: string
    // House_Details/hh_yes_mobile [integer] Head of Household mobile number
    hh_yes_mobile: number | undefined
    // House_Details/additional_phone_number [integer] Additional phone number
    additional_phone_number: number | undefined
    // House_Details/hh_no [text] What is the name of the head of household?
    hh_no: string | undefined
    // House_Details/hh_phone [integer] What is the phone number of the head of household?
    hh_phone: number | undefined
    // House_Details/What_is_your_relatio_he_head_of_household [select_one] What is your relationship to the head of household?
    What_is_your_relatio_he_head_of_household: undefined | Option<'What_is_your_relatio_he_head_of_household'>
    // House_Details/dwelling_type [select_one] Is this a house or apartment?
    dwelling_type: undefined | Option<'dwelling_type'>
    // House_Details/settlement [select_one_from_file] Settlement
    settlement: string
    // House_Details/street [text] Street
    street: string | undefined
    // House_Details/building_number [text] Building Number
    building_number: string | undefined
    // House_Details/apartment_number [integer] Apartment Number
    apartment_number: number | undefined
    // House_Details/house_number [text] House Number
    house_number: string | undefined
    // House_Details/gps_coordinates [geopoint] GPS Coordinates
    gps_coordinates: string
    // House_Details/owner_tenant_type [select_one] Are you an owner or a tenant?
    owner_tenant_type: undefined | Option<'owner_tenant_type'>
    // House_Details/pd_picture1 [image] Picture of personal documents
    pd_picture1: string
    // House_Details/pd_picture2 [image] Picture of personal documents
    pd_picture2: string
    // House_Details/pd_picture3 [image] Picture of personal documents
    pd_picture3: string
    // House_Details/pd_picture4 [image] Picture of personal documents
    pd_picture4: string
    // House_Details/pd_picture5 [image] Picture of personal documents
    pd_picture5: string
    // House_Details/pd_picture6 [image] Picture of personal documents
    pd_picture6: string
    // House_Details/pd_picture7 [image] Picture of personal documents
    pd_picture7: string
    // House_Details/pd_picture8 [image] Picture of personal documents
    pd_picture8: string
    // House_Details/pd_picture9 [image] Picture of personal documents
    pd_picture9: string
    // House_Details/pd_picture10 [image] Picture of personal documents
    pd_picture10: string
    // House_Details/pay_det_tax_id_num [text] Individual tax number of the person with whom the contract will be signed ?
    pay_det_tax_id_num: string | undefined
    // House_Details/pay_det_tax_id_ph [image] Take a photo of the Tax ID
    pay_det_tax_id_ph: string
    // House_Details/ownership_verification [select_one] Does an ownership verification exist?
    ownership_verification: undefined | Option<'pregnant_lac'>
    // House_Details/document_type [select_one] Type of document verifying ownership?
    document_type: undefined | Option<'document_type'>
    // House_Details/doth [text] Other:
    doth: string | undefined
    // House_Details/doc_available [select_one] Is this document available for a picture?
    doc_available: undefined | Option<'doc_available'>
    // House_Details/doc_available_yes1 [image] Picture of ownership verification
    doc_available_yes1: string
    // House_Details/doc_available_yes2 [image] Picture of ownership verification
    doc_available_yes2: string
    // House_Details/doc_available_yes3 [image] Picture of ownership verification
    doc_available_yes3: string
    // House_Details/doc_available_yes4 [image] Picture of ownership verification
    doc_available_yes4: string
    // House_Details/doc_available_yes5 [image] Picture of ownership verification
    doc_available_yes5: string
    // House_Details/dplre [select_one] Does the place of residence (according to registration) correspond to the address of the damaged home
    dplre: undefined | Option<'pregnant_lac'>
    // House_Details/not_available [text] If the document is not available, please explain why
    not_available: string | undefined
    // House_Details/Is_the_rightful_owne_currently_in_Ukraine [select_one] Is the rightful owner of this property currently in Ukraine?
    Is_the_rightful_owne_currently_in_Ukraine: undefined | Option<'rehab_solo'>
    // House_Details/owner_name [text] What is the name of the owner of this property?
    owner_name: string | undefined
    // House_Details/owner_number [integer] What is the phone number of the owner of this property?
    owner_number: number | undefined
    // House_Details/house_apt_number [text] House/Apartment Number of the owner of this property
    house_apt_number: string | undefined
    // House_Details/building_apt_number [text] Building Number of the owner of this property
    building_apt_number: string | undefined
    // House_Details/street_name [text] Street of the owner of this property
    street_name: string | undefined
    // House_Details/settlement_name [text] Settlement of the owner of this property
    settlement_name: string | undefined
    // House_Details/written_tenancy [select_one] Is there a written tenancy agreement in place?
    written_tenancy: undefined | Option<'pregnant_lac'>
    // House_Details/written_tenancy_available [select_one] Do you have a copy of this tenancy agreement to present today?
    written_tenancy_available: undefined | Option<'pregnant_lac'>
    // House_Details/picture_agreement [image] Picture of tenancy agreement
    picture_agreement: string
    // House_Details/picture_agreement1 [image] Picture of tenancy agreement
    picture_agreement1: string
    // House_Details/picture_agreement2 [image] Picture of tenancy agreement
    picture_agreement2: string
    // House_Details/picture_agreement3 [image] Picture of tenancy agreement
    picture_agreement3: string
    // House_Details/tenancy_present_later [select_one] If no, can you present it later?
    tenancy_present_later: undefined | Option<'rehab_solo'>
    // House_Details/why_not_available [text] If the document is not available, please explain why
    why_not_available: string | undefined
    // House_Details/ben_det_hh_size [integer] Indicate the total number of people in your household/shelter, including the Household Head
    ben_det_hh_size: number | undefined
    // House_Details/hh_char_hh_det [begin_repeat] 3.1.7 HH Members
    hh_char_hh_det:
      | {
          hh_char_hh_det_gender: undefined | Option<'hh_char_hh_det_gender'> | undefined
          hh_char_hh_det_age: number | undefined | undefined
          hh_char_hh_det_dis_select: undefined | Option<'hh_char_dis_select'>[] | undefined
          hh_char_hh_det_dis_level: undefined | Option<'hh_char_hh_det_dis_level'> | undefined
          calc_u18: string | undefined
          calc_o60: string | undefined
          calc_ed_age: string | undefined
          calc_preg: string | undefined
          calc_female_60_i: string | undefined
          calc_male_60_i: string | undefined
          calc_num_diff_see: string | undefined
          calc_num_diff_hear: string | undefined
          calc_num_diff_walk: string | undefined
          calc_num_diff_rem: string | undefined
          calc_num_diff_medical: string | undefined
          calc_num_diff_mental: string | undefined
        }[]
      | undefined
    // House_Details/hh_char_hhh_care_child [select_one] Do you take care of the child/children yourself?
    hh_char_hhh_care_child: undefined | Option<'pregnant_lac'>
    // winterization_requirements/primary_heating [select_one] What is the primary of heating in the apartment/house?
    primary_heating: undefined | Option<'primary_heating'>
    // winterization_requirements/primary_heating_other [text] Other
    primary_heating_other: string | undefined
    // winterization_requirements/mold_interior_surfaces [select_one] Do you have mold on interior surfaces (walls, ceilings, and floor)?
    mold_interior_surfaces: undefined | Option<'pregnant_lac'>
    // winterization_requirements/mold_interior_surfaces_yes [select_multiple] If Yes, which of the following?
    mold_interior_surfaces_yes: undefined | Option<'mold_interior_surfaces_yes'>[]
    // winterization_requirements/main_interior_surfaces [select_multiple] What is the main cause of mold in the interior surfaces?
    main_interior_surfaces: undefined | Option<'main_interior_surfaces'>[]
    // winterization_requirements/main_interior_surfaces_other [text] Other
    main_interior_surfaces_other: string | undefined
    // winterization_requirements/visible_cracks_external_walls [select_one] Are there any visible cracks in the external walls?
    visible_cracks_external_walls: undefined | Option<'pregnant_lac'>
    // winterization_requirements/photo_cracks [image] Photos of cracks in the outer walls?
    photo_cracks: string
    // winterization_requirements/cracks_fixed_adhesive [select_one] Are the cracks too severe to be fixed with adhesive?
    cracks_fixed_adhesive: undefined | Option<'pregnant_lac'>
    // winterization_requirements/external_walls_thermal_insulation [select_one] Do the external walls have thermal insulation?”
    external_walls_thermal_insulation: undefined | Option<'pregnant_lac'>
    // winterization_requirements/attic_insulated [select_one] Does the roof have insulation?
    attic_insulated: undefined | Option<'pregnant_lac'>
    // Technical/damage_type_quality [note] Specify the type and quantity of damage
    damage_type_quality: string
    // Technical/roof_damage [select_one] Is the roof damaged?
    roof_damage: undefined | Option<'rehab_solo'>
    // Technical/window_number [integer] How many windows need to be replaced (Only external) because damaged or quality?
    window_number: number | undefined
    // Technical/glazed_number_house [integer] What is the number of damaged double-glazed or three-glazed windows
    glazed_number_house: number | undefined
    // Technical/external_brick_damage [select_one] Is there damage to the external brick walls?
    external_brick_damage: undefined | Option<'rehab_solo'>
    // Technical/damag_house_entrance [select_one] Is there damage to the household entrance door?
    damag_house_entrance: undefined | Option<'rehab_solo'>
    // Technical/number_damag_house_entrance [integer] How many external doors need to be replaced because damaged or old?
    number_damag_house_entrance: number | undefined
    // Technical/interior_door_damage [integer] How many interior doors have been damaged?
    interior_door_damage: number | undefined
    // Technical/wall_cracks [select_one] Are there any cracks on the indoor walls?
    wall_cracks: undefined | Option<'rehab_solo'>
    // Technical/electricity_damage [select_one] Is there damage to the electricity?
    electricity_damage: undefined | Option<'rehab_solo'>
    // Technical/waterpipe_damage [select_one] Is there damage to the water pipes?
    waterpipe_damage: undefined | Option<'rehab_solo'>
    // Technical/structural_damage [select_one] Is there any structural damage?
    structural_damage: undefined | Option<'rehab_solo'>
    c_roof_damage: string
    c_external_damage: string
    c_house_entrance: string
    c_cracks_indoor: string
    c_damage_electricity: string
    c_damage_water: string
    c_damage_structure: string
    total_damage: string
    // Technical/total_damage_label [note] **Outcome of Analyses**
    total_damage_label: string
    // Technical/total_damage_light [note] 🟢⚪⚪ Light damaged
    total_damage_light: string
    // Technical/total_damage_medium [note] 🟠🟠⚪ Medium damaged
    total_damage_medium: string
    // Technical/total_damage_heavy [note] 🔴🔴🔴 Heavy damaged
    total_damage_heavy: string
    // Technical/apartment_window [integer] How many windows need to be replaced (Only external) because damaged or quality?
    apartment_window: number | undefined
    // Technical/glazed_number_apartment [integer] What is the number of damaged double-glazed or three-glazed windows
    glazed_number_apartment: number | undefined
    // Technical/apartment_balcony [integer] How many balcony doors have damage?
    apartment_balcony: number | undefined
    // Technical/apartment_entrance [select_one] Is there damage to the apartment entrance door?
    apartment_entrance: undefined | Option<'rehab_solo'>
    // Technical/number_apartment_entrance [integer] How many external doors need to be replaced because damaged or old?
    number_apartment_entrance: number | undefined
    // Technical/top_floor [select_one] Do you live on the top floor of the apartment?
    top_floor: undefined | Option<'rehab_solo'>
    // Technical/roof_type [select_one] Is the roof flat or non-flat?
    roof_type: undefined | Option<'roof_type'>
    // Technical/non_flat_damage [select_one] Non flat, is there damage?
    non_flat_damage: undefined | Option<'rehab_solo'>
    // Technical/flat_roofleak [select_one] If flat, is the roof leaking?
    flat_roofleak: undefined | Option<'rehab_solo'>
    // Technical/interior_apt_door_damage [integer] How many interior doors have damage?
    interior_apt_door_damage: number | undefined
    // Technical/indoor_cracks [select_one] Are there any cracks on the indoor walls?
    indoor_cracks: undefined | Option<'rehab_solo'>
    // Technical/damage_electricity_apt [select_one] Is there damage to the electricity?
    damage_electricity_apt: undefined | Option<'rehab_solo'>
    // Technical/water_damage_apt [select_one] Is there damage to the water pipes?
    water_damage_apt: undefined | Option<'rehab_solo'>
    apt_entrance: string
    nonflat_dam: string
    flat_leak: string
    cracks_app: string
    electricity_apt_damage: string
    water_apt_damage: string
    // Technical/total_apt_damage [calculate] Total Apartment Damage Calculate
    total_apt_damage: string
    // Technical/total_apt_damage_label [note] **Outcome of Analyses**
    total_apt_damage_label: string
    // Technical/total_apt_damage_light [note] 🟢⚪ Light damaged
    total_apt_damage_light: string
    // Technical/total_apt_damage_medium [note] 🟠🟠 Medium damaged
    total_apt_damage_medium: string
    // Technical/npi [note] Complete shelter displaying the damage
    npi: string
    // Technical/pictures_apt_damage1 [image] Photo of the damage to the house
    pictures_apt_damage1: string
    // Technical/pictures_apt_damage2 [image] Photo of the damage to the house
    pictures_apt_damage2: string
    // Technical/pictures_apt_damage3 [image] Photo of the damage to the house
    pictures_apt_damage3: string
    // Technical/pictures_apt_damage4 [image] Photo of the damage to the house
    pictures_apt_damage4: string
    // Technical/pictures_apt_damage5 [image] Photo of the damage to the house
    pictures_apt_damage5: string
    // Technical/pictures_apt_damage6 [image] Photo of the damage to the house
    pictures_apt_damage6: string
    // Technical/pictures_apt_damage7 [image] Photo of the damage to the house
    pictures_apt_damage7: string
    // Technical/pictures_apt_damage8 [image] Photo of the damage to the house
    pictures_apt_damage8: string
    // Technical/pictures_apt_damage9 [image] Photo of the damage to the house
    pictures_apt_damage9: string
    // Technical/pictures_apt_damage10 [image] Photo of the damage to the house
    pictures_apt_damage10: string
    // Technical/pictures_apt_damage11 [image] Photo of the damage to the house
    pictures_apt_damage11: string
    // Technical/pictures_apt_damage12 [image] Photo of the damage to the house
    pictures_apt_damage12: string
    // Technical/pictures_apt_damage13 [image] Photo of the damage to the house
    pictures_apt_damage13: string
    // Technical/pictures_apt_damage14 [image] Photo of the damage to the house
    pictures_apt_damage14: string
    // Technical/pictures_apt_damage15 [image] Photo of the damage to the house
    pictures_apt_damage15: string
    // Technical/pictures_apt_damage16 [image] Photo of the damage to the house
    pictures_apt_damage16: string
    // Technical/pictures_apt_damage17 [image] Photo of the damage to the house
    pictures_apt_damage17: string
    // Technical/pictures_apt_damage18 [image] Photo of the damage to the house
    pictures_apt_damage18: string
    // Technical/pictures_apt_damage19 [image] Photo of the damage to the house
    pictures_apt_damage19: string
    // Technical/pictures_apt_damage20 [image] Photo of the damage to the house
    pictures_apt_damage20: string
    // Technical/rehab_solo [select_one] Do you see yourself capable and willing to rehabilitate the shelter yourswelf in case DRC only provides the required materials and tools?
    rehab_solo: undefined | Option<'rehab_solo'>
    // Technical/modality [select_one] What kind of support modality would you prefer?
    modality: undefined | Option<'modality'>
    // pay_det/agreed_amount [decimal] Please write below the agreeed amount for the payment based on the technical assessment
    agreed_amount: number | undefined
    // pay_det/payment_instatlment [select_one] How many instalments will be used to transfer this amount?
    payment_instatlment: undefined | Option<'payment_instatlment'>
    // pay_det/ben_det_surname_l [text] What is your surname name (as shown in personal ID)?
    ben_det_surname_l: string | undefined
    // pay_det/ben_det_first_name_l [text] What is your first name (as shown in personal ID)?
    ben_det_first_name_l: string | undefined
    // pay_det/ben_det_pat_name_l [text] What is your patronymic name?
    ben_det_pat_name_l: string | undefined
    // pay_det/ben_det_ph_number_l [integer] What is your phone number?
    ben_det_ph_number_l: number | undefined
    // pay_det/pay_consent [select_one] Thank you for answering the questions above, are you willing to provide your payment details?
    pay_consent: undefined | Option<'pregnant_lac'>
    // pay_det/pay_det_s/pay_det_id_type [select_one] What form of ID do you have?
    pay_det_id_type: undefined | Option<'pay_det_id_type'>
    // pay_det/pay_det_s/pay_det_id_type_oth [text] What other form of ID do you have?
    pay_det_id_type_oth: string | undefined
    // pay_det/pay_det_s/pay_det_pass_ser [text] Input Passport Series
    pay_det_pass_ser: string | undefined
    // pay_det/pay_det_s/pay_det_pass_num [text] Number of ID
    pay_det_pass_num: string | undefined
    // pay_det/pay_det_s/pay_det_id_ph [image] Take a photo of the ID
    pay_det_id_ph: string
    // pay_det/pay_det_s/begin_group_vdIM9ogQb/pay_det_tax_id_yn [select_one] Do you have an individual tax number (TIN)?
    pay_det_tax_id_yn: undefined | Option<'pregnant_lac'>
    // pay_det/pay_det_s/begin_group_vdIM9ogQb/pay_det_tax_id_num_001 [text] What is your individual tax number?
    pay_det_tax_id_num_001: string | undefined
    // pay_det/pay_det_s/begin_group_vdIM9ogQb/pay_det_tax_id_ph_001 [image] Take a photo of the Tax ID
    pay_det_tax_id_ph_001: string
    // pay_det/pay_det_s/begin_group_vdIM9ogQb/pay_det_tax_exempt [select_one] Do you have a tax exemptions?
    pay_det_tax_exempt: undefined | Option<'pregnant_lac'>
    // pay_det/pay_det_s/begin_group_vdIM9ogQb/pay_det_tax_exempt_im [image] Take a photo of the proof of the tax of exemptions
    pay_det_tax_exempt_im: string
    // pay_det/pay_det_s/pay_det_pay_meth [select_one] What is your preferred payment method?
    pay_det_pay_meth: undefined | Option<'pay_det_pay_meth'>
    // pay_det/pay_det_s/pay_det_iban [text] What is your IBAN number?
    pay_det_iban: string | undefined
    // pay_det/pay_det_s/pay_det_iban_im [image] Take a picture of IBAN number if available
    pay_det_iban_im: string
    // pay_det/pay_det_s/pay_address [text] Your address
    pay_address: string | undefined
    // pay_det/pay_det_s/pay_zip [text] Your ZIP code
    pay_zip: string | undefined
    // pay_det/pay_det_s/pay_det_add_im [image] Take a picture of the address page of passport
    pay_det_add_im: string
    // pay_det/pay_det_s/pay_det_pay_meth_oth [text] What other Payment methods do you prefer?
    pay_det_pay_meth_oth: string | undefined
    // pay_det/pay_det_s/pay_det_pay_meth_none [text] Can you highlight the main reason that none of these payment methods are suitable to you?
    pay_det_pay_meth_none: string | undefined
    // Displacement/displaced [select_one] Have you been temporarily displaced and returned to your shelter?
    displaced: undefined | Option<'pregnant_lac'>
    // Displacement/return_time [select_one] If yes, when did you return?
    return_time: undefined | Option<'return_time'>
    // Displacement/calc_recentr [calculate] Recent Returnee
    calc_recentr: string
    // Displacement/calc_ret [calculate] Returnee
    calc_ret: string
    // Displacement/calc_na [calculate] Not Applicable
    calc_na: string
    // Socio_economic_Vulnerability/hh_char_dis_select [select_multiple] Please select any of the below that apply to you or a member of your household
    hh_char_dis_select: undefined | Option<'hh_char_dis_select'>[]
    // Socio_economic_Vulnerability/see_number [integer] How many household individuals struggle with seeing
    see_number: number | undefined
    // Socio_economic_Vulnerability/hear_number [integer] How many household individuals struggle with hearing
    hear_number: number | undefined
    // Socio_economic_Vulnerability/walk_number [integer] How many household individuals struggle with walking
    walk_number: number | undefined
    // Socio_economic_Vulnerability/medical_number [integer] How many household individuals issues have  self-care issues
    medical_number: number | undefined
    // Socio_economic_Vulnerability/mental_number [integer] How many household individuals have communication problems
    mental_number: number | undefined
    calc_diff_see: string
    calc_diff_hear: string
    calc_diff_walk: string
    // Socio_economic_Vulnerability/calc_diff_medical [calculate] self-care
    calc_diff_medical: string
    // Socio_economic_Vulnerability/calc_diff_mental [calculate] communicating
    calc_diff_mental: string
    calc_dis_level: string
    calc__60: string
    // Socio_economic_Vulnerability/older_risk [note] Older Person at Risk: Outcome Analysis
    older_risk: string
    // Socio_economic_Vulnerability/calc_male_60 [calculate] Male over 60
    calc_male_60: string
    // Socio_economic_Vulnerability/calc_female_60 [calculate] Female over 60
    calc_female_60: string
    // Socio_economic_Vulnerability/calc_2_60 [calculate] Two or more individuals over 60
    calc_2_60: string
    // Socio_economic_Vulnerability/calc_total_individuals_60_18 [calculate] Total number of individuals over 60 plus children under 18
    calc_total_individuals_60_18: string
    // Socio_economic_Vulnerability/calc_single_one_male [calculate] Single father with one child (under 18)
    calc_single_one_male: string
    // Socio_economic_Vulnerability/calc_single_two_male [calculate] Single father with two children (under 18)
    calc_single_two_male: string
    // Socio_economic_Vulnerability/calc_single_three_male [calculate] Single father with three children or more (under 18)
    calc_single_three_male: string
    // Socio_economic_Vulnerability/calc_single_one_female [calculate] Single mother with one child (under 18)
    calc_single_one_female: string
    // Socio_economic_Vulnerability/calc_single_two_female [calculate] Single mother with two children (under 18)
    calc_single_two_female: string
    // Socio_economic_Vulnerability/calc_single_three_female [calculate] Single mother with three children or more (under 18)
    calc_single_three_female: string
    // Socio_economic_Vulnerability/calc_couple [calculate] Couple
    calc_couple: string
    // Socio_economic_Vulnerability/cal_couple_one_chil [calculate] Couple with 1 child < 18
    cal_couple_one_chil: string
    // Socio_economic_Vulnerability/cal_couple_two_chil [calculate] Couple with 2 children < 18
    cal_couple_two_chil: string
    // Socio_economic_Vulnerability/cal_couple_three_chil [calculate] Couple with 3 children or more < 18
    cal_couple_three_chil: string
    // Socio_economic_Vulnerability/how_u18_notrelated [integer] How many children under the age of 18 that are not related to the household members, are hosted by the household?
    how_u18_notrelated: number | undefined
    // Socio_economic_Vulnerability/pregnant_lac [select_one] Are there any pregnant or lactating women in this household?
    pregnant_lac: undefined | Option<'pregnant_lac'>
    // Socio_economic_Vulnerability/pregnant_count [integer] If yes, how many?
    pregnant_count: number | undefined
    // Socio_economic_Vulnerability/what_income [select_one] What is the total household income per month?
    what_income: undefined | Option<'what_income'>
    // Socio_economic_Vulnerability/calc_dems [calculate] Calculate: household composition
    calc_dems: string
    // Socio_economic_Vulnerability/calculate_householdincome [calculate] Calculate: household income
    calculate_householdincome: string
    // Socio_economic_Vulnerability/calculate_highdependence [calculate] Calculate: high dependence ration
    calculate_highdependence: string
    // Socio_economic_Vulnerability/calculate_householdsize [calculate] Calculate: household size
    calculate_householdsize: string
    // hh_score [calculate] Calculate: household score
    hh_score: string
    // apt_score [calculate] Calculate: apartment score
    apt_score: string
    // displ_score [calculate] Calculate: displacement score
    displ_score: string
    // socio_score [calculate] Calculate: socio-economic vulernability
    socio_score: string
    // total_score [calculate] TOTAL
    total_score: string
    // fin/fin_det_res [text] Other Comments from Respondent
    fin_det_res: string | undefined
    // fin/fin_det_enum [text] Other Comments from Enumerator
    fin_det_enum: string | undefined
    // end_survey [note] Thank you for your time today, we have no further questions
    end_survey: string
  }
  export const options = {
    ben_det_res_stat: {
      idp: `A = Internally Displaced Person (IDP)`,
      long_res: `B = Long - Term Resident`,
      ret: `C = Returnee`,
      ref_asy: `D = Refugee/asylum seeker`,
    },
    hh_char_civ_stat: {
      single: `A = Single (Never Married)`,
      dom_part: `B = Not Married but Living in Domestic Partnership`,
      married: `C = Married`,
      div_sep: `D = Divorced/Seperated`,
      widow: `E = Widowed`,
      abandoned: `F = Abandoned`,
    },
    hh_char_hh_det_gender: {
      male: `A = Male`,
      female: `B = Female`,
    },
    hh_char_dis_select: {
      diff_see: `A = Have difficulty seeing, even if wearing glasses`,
      diff_hear: `B = Have difficulty hearing, even if using a hearing aid`,
      diff_walk: `C = Have difficulty walking or climbing steps`,
      diff_rem: `D = Have difficulty remembering or concentrating`,
      diff_care: `E = Have difficulty with self-care such as washing all over or dressing`,
      diff_comm: `F = Have difficulty communicating, for example understanding or being understood`,
      diff_none: `G = None of the above apply`,
      diff_medical: `D = Have a critical medical condition`,
      diff_mental: `E = Have a mental/ chronic illness`,
    },
    hh_char_hh_det_dis_level: {
      zero: `A = No, no difficulty`,
      one: `B = Yes, some difficulty`,
      two: `C = Yes, a lot of difficulty`,
      fri: `D = Cannot do at all`,
    },
    return_time: {
      last_3_months: `Within the last 3 months`,
      '3_6_months': `Within the last 3-6 months`,
      more_6_months: `More than 6 months ago`,
    },
    roof_type: {
      flat: `Flat`,
      non_flat: `Non-flat`,
    },
    rehab_solo: {
      yes: `Yes`,
      no: `No`,
      i_dont_know: `I don't know`,
    },
    payment_instatlment: {
      _1: `1`,
      _2: `2`,
    },
    doc_available: {
      yes: `Yes`,
      provide_later: `Provide Later`,
    },
    owner_tenant_type: {
      owner: `Owner`,
      tenant: `Tenant`,
      idp_residing: `IDP residing in dwelling and hosted`,
      close_relative: `Close relative to owner and hosted`,
    },
    dwelling_type: {
      house: `House`,
      apartment: `Apartment`,
    },
    What_is_your_relatio_he_head_of_household: {
      spouse: `Spouse`,
      child: `Child`,
      sibling: `Sibling`,
      other_relative: `Other Relative`,
      uncle: `Uncle`,
      aunt: `Aunt`,
      grandparent: `Grandparent`,
    },
    document_type: {
      ownership_certificate: `Ownership Certificate`,
      contract_of_purchase: `Contract of Purchase`,
      certificate_of_inheritance: `Certificate of Inheritance`,
      document_from_local_authorities: `Document from Local Authorities`,
      oth: `Other:`,
    },
    pregnant_lac: {
      yes: `Yes`,
      no: `No`,
    },
    what_income: {
      ff: `< 5.400 per HH member`,
      ffeo: `Between 5.400 – 8.100 per HH member`,
      eope: `> 8.100 per HH member`,
    },
    back_office: {
      umy: `Sumy (UMY)`,
      cej: `Chernihiv (CEJ)`,
      dnk: `Dnipro (DNK)`,
      hrk: `Kharkiv (HRK)`,
      nlv: `Mykolaiv (NLV)`,
      slo: `Sloviansk (SLO)`,
    },
    enum_name: {
      '1': `1`,
      '2': `2`,
      igor_rebenko: `Igor Rebenko`,
      oleksandr_plyushch: `Oleksandr Plyushch`,
      dmytro_petrusevych: `Dmytro Petrusevych`,
      anna_potapenko: `Anna Potapenko`,
      olha_ihnatenko: `Olha Ihnatenko`,
      andriy_khimchenko: `Andriy Khimchenko`,
      olexander_malakhov: `Olexander Malakhov`,
      kateryna_garnaga: `Kateryna Garnaga`,
      iegor_samoilenko: `Iegor Samoilenko`,
      Omu: `Oleksandr Chikunov`,
      VN: `Valerii Necheporenko`,
      mykola_zemliuk: `Mykola Zemliuk`,
      serhii_fedirko: `Serhii Fedirko`,
      yaroslav_bilyk: `Yaroslav Bilyk`,
      olena_bychkova: `Olena Bychkova`,
      VS: `Viktoriia Stepanenko`,
      AS: `Andrii Stovpchenko`,
      VS1: `Valeriy Shapovalov`,
      OH: `Oleh Hryshchenko`,
      ex1: `extra1`,
      ex2: `extra2`,
      olena_antonenko: `Olena Antonenko`,
      liudmyla_bakhmutova: `Liudmyla Bakhmutova`,
      dmytro_pavlov: `Dmytro Pavlov`,
      svitlana_kiiko: `Svitlana Kiiko`,
      dmytro_nykonenko: `Dmytro Nykonenko`,
      serhii_tkachov: `Serhii Tkachov`,
      vasyl_proskurin: `Vasyl Proskurin`,
      serhii_tymofieiev: `Serhii Tymofieiev`,
      serhii_kashyra: `Serhii Kashyra`,
      iryna_zhyfarska: `Iryna Zhyfarska`,
      nadiia_konoval: `Nadiia Konoval`,
      oleksandr_narsieiev: `Oleksandr Narsieiev`,
      ext1: `extra1`,
      ext2: `extra2`,
      KL: `Klym Oleksandr`,
      FS: `Fedorov Serhii`,
      YV: `Yevhenii Vasiukov`,
      AD: `Anna Demianenko`,
      TD: `Taras Dubenko`,
      oksana_shevchenko: `Oksana Shevchenko`,
      yuliia_van: `Yuliia Van-Fun-Fu`,
      serhii_yanukovych: `Serhii Yanukovych`,
      serhii_krasnoselskyi: `Serhii Krasnoselskyi`,
      x1: `extra1`,
      x2: `extra2`,
      anastasiia_honcharuk: `Anastasiia Honcharuk`,
      anton_marchenko: `Anton Marchenko`,
      anton_rozhanskyi: `Anton Rozhanskyi`,
      yevhen_perepechyn: `Yevhen Perepechyn`,
      ext1_slo: `extra1`,
      ext2_slo: `extra2`,
    },
    modality: {
      contractor: `Contractor approach`,
      cash_for_repair: `Cash for repair approach`,
    },
    pay_det_id_type: {
      nat_pass_card: `A = National Passport (card)`,
      nat_pass_book: `B = National Passport (book)`,
      nat_pass_diia: `C = National Passport (Diia app)`,
      pass_ussr_red: `D = Passport (USSR red book)`,
      pass_int: `E = Passport for international travel`,
      birth_certificate: `F = Birth certificate`,
      driver_lic: `G = Driver’s license`,
      pen_cert: `H = Pensioner certificate`,
      oth_id: `I = Other Form of ID`,
      no_id: `J = No ID`,
    },
    pay_det_pay_meth: {
      raiff_trans: `A = Remittance Raiffaisen AVAL`,
      ukrpost: `B = Ukrposhta`,
      bank_card: `C = Bank card`,
      other_pay: `D = Other Payment Method`,
      none_pay: `E = None of the above fit my needs`,
    },
    primary_heating: {
      centralized_system: `Centralized system`,
      gas: `Gas heating`,
      electrical_fixed: `Electrical heating (Fixed)`,
      electrical_portable: `Electrical heating (portable)`,
      solid_fuel: `Solid fuel`,
      other: `Other`,
    },
    mold_interior_surfaces_yes: {
      external_walls: `External walls`,
      celling: `Ceiling`,
      floor: `Floor`,
    },
    main_interior_surfaces: {
      cracks_external_walls: `Big cracks in external walls`,
      roof_leaking: `Roof leaking`,
      sewage_leaking: `Sewage leaking`,
      water_pipes_leaking: `Water pipes leaking`,
      leaking_windows_doors: `Water leaking from the windows / doors`,
      other: `Other`,
    },
    undefined: {
      flat: `Flat roof`,
      stanted: `Slanted roof`,
      wooden_flooring: `Wooden flooring`,
      concrete_flooring_linoleum: `Concrete flooring covered with Linoleum`,
      concrete_flooring_tiles: `Concrete flooring covered with tiles`,
      other: `Other`,
    },
    damage_hostilities: {
      yes: `Damaged because of the ongoing hostilities.`,
      poor_condition: `Substandard/Old housing in poor condition.`,
      no: `NO damage`,
    },
    ben_det_oblast: {
      crimea: `Autonomous Republic of Crimea`,
      cherkaska: `Cherkasy`,
      chernihivska: `Chernihiv`,
      chernivetska: `Chernivtsi`,
      dnipropetrovska: `Dnipropetrovsk`,
      donetska: `Donetsk`,
      'ivano-frankivska': `Ivano-Frankivsk`,
      kharkivska: `Kharkiv`,
      khersonska: `Kherson`,
      khmelnytska: `Khmelnytskyi`,
      kirovohradska: `Kirovohrad`,
      kyivska: `Kyiv`,
      luhanska: `Luhansk`,
      lvivska: `Lviv`,
      mykolaivska: `Mykolaiv`,
      odeska: `Odesa`,
      poltavska: `Poltava`,
      rivnenska: `Rivne`,
      sumska: `Sumy`,
      ternopilska: `Ternopil`,
      vinnytska: `Vinnytsia`,
      volynska: `Volyn`,
      zakarpatska: `Zakarpattia`,
      zaporizka: `Zaporizhzhia`,
      zhytomyrska: `Zhytomyr`,
      sevastopol: `Sevastopol`,
    },
  } as const

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
      hh_char_res_age: _.hh_char_res_age ? +_.hh_char_res_age : undefined,
      hh_char_res_dis_select: _.hh_char_res_dis_select?.split(' '),
      hh_char_hhh_age: _.hh_char_hhh_age ? +_.hh_char_hhh_age : undefined,
      hh_char_hhh_dis_select: _.hh_char_hhh_dis_select?.split(' '),
      hh_yes_mobile: _.hh_yes_mobile ? +_.hh_yes_mobile : undefined,
      additional_phone_number: _.additional_phone_number ? +_.additional_phone_number : undefined,
      hh_phone: _.hh_phone ? +_.hh_phone : undefined,
      apartment_number: _.apartment_number ? +_.apartment_number : undefined,
      owner_number: _.owner_number ? +_.owner_number : undefined,
      ben_det_hh_size: _.ben_det_hh_size ? +_.ben_det_hh_size : undefined,
      hh_char_hh_det: _['hh_char_hh_det']?.map(extractQuestionName).map((_: any) => {
        _['hh_char_hh_det_age'] = _.hh_char_hh_det_age ? +_.hh_char_hh_det_age : undefined
        _['hh_char_hh_det_dis_select'] = _.hh_char_hh_det_dis_select?.split(' ')
        return _
      }),
      mold_interior_surfaces_yes: _.mold_interior_surfaces_yes?.split(' '),
      main_interior_surfaces: _.main_interior_surfaces?.split(' '),
      window_number: _.window_number ? +_.window_number : undefined,
      glazed_number_house: _.glazed_number_house ? +_.glazed_number_house : undefined,
      number_damag_house_entrance: _.number_damag_house_entrance ? +_.number_damag_house_entrance : undefined,
      interior_door_damage: _.interior_door_damage ? +_.interior_door_damage : undefined,
      apartment_window: _.apartment_window ? +_.apartment_window : undefined,
      glazed_number_apartment: _.glazed_number_apartment ? +_.glazed_number_apartment : undefined,
      apartment_balcony: _.apartment_balcony ? +_.apartment_balcony : undefined,
      number_apartment_entrance: _.number_apartment_entrance ? +_.number_apartment_entrance : undefined,
      interior_apt_door_damage: _.interior_apt_door_damage ? +_.interior_apt_door_damage : undefined,
      ben_det_ph_number_l: _.ben_det_ph_number_l ? +_.ben_det_ph_number_l : undefined,
      hh_char_dis_select: _.hh_char_dis_select?.split(' '),
      see_number: _.see_number ? +_.see_number : undefined,
      hear_number: _.hear_number ? +_.hear_number : undefined,
      walk_number: _.walk_number ? +_.walk_number : undefined,
      medical_number: _.medical_number ? +_.medical_number : undefined,
      mental_number: _.mental_number ? +_.mental_number : undefined,
      how_u18_notrelated: _.how_u18_notrelated ? +_.how_u18_notrelated : undefined,
      pregnant_count: _.pregnant_count ? +_.pregnant_count : undefined,
    }) as T
}
