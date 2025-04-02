export namespace Ecrec_cashRegistration {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: aE5md7RfHiy4LJmddoFAQH
  export interface T {
    start: string
    end: string
    // background/back_office [select_one] 1.1 Select Office
    back_office: undefined | Option<'back_office'>
    // background/back_enum [select_one] 1.2 Enumerator
    back_enum: undefined | Option<'back_enum'>
    // background/back_donor [select_one] 1.3 Project
    back_donor: undefined | Option<'back_donor'>
    // background/back_refer [select_one] 1.4 Was this case an internal DRC referral?
    back_refer: undefined | Option<'pay_det_tax_exempt'>
    // background/back_refer_who [select_one] 1.4.1 From which Department was the referral?
    back_refer_who: undefined | Option<'back_refer_who'>
    // background/back_consent [select_one] 1.5 Consent
    back_consent: undefined | Option<'pay_det_tax_exempt'>
    // background/back_consen_no_reas [text] 1.5.1 Can you please give the reason for why you do not wish to consent to the questionnaire?
    back_consen_no_reas: string | undefined
    // background/back_consent_no_note [note] Thank you very much for your time, we will not proceed with the questionnaire without your consent.
    back_consent_no_note: string
    // ben_det/ben_det_surname [text] 2.1 What is your surname name (as shown in personal ID)?
    ben_det_surname: string | undefined
    // ben_det/ben_det_first_name [text] 2.2 What is your first name (as shown in personal ID)?
    ben_det_first_name: string | undefined
    // ben_det/ben_det_pat_name [text] 2.3 What is your patronymic name?
    ben_det_pat_name: string | undefined
    // ben_det/ben_det_ph_number [integer] 2.4 What is your phone number?
    ben_det_ph_number: number | undefined
    // ben_det/ben_det_oblast [select_one] 2.5.1 Select oblast where registration is taking place
    ben_det_oblast: undefined | Option<'hh_char_origin_oblast'>
    // ben_det/ben_det_raion [select_one] 2.5.2 Select raion where registration is taking place
    ben_det_raion: undefined | string
    // ben_det/ben_det_hromada [select_one] 2.5.3 Select hromada where registration is taking place
    ben_det_hromada: undefined | string
    // ben_det/ben_det_settlement [select_one_from_file] 2.5.4 Select settlement where registration is taking place
    ben_det_settlement: string
    // ben_det/ben_det_res_stat [select_one] Select residential status
    ben_det_res_stat: undefined | Option<'hh_char_hh_res_stat'>
    // ben_det/ben_det_prev_oblast [select_one] What is your area of origin prior to displacement? (Select Oblast)
    ben_det_prev_oblast: undefined | Option<'hh_char_origin_oblast'>
    // ben_det/ben_det_income [integer] 2.6 What was the total value in UAH of all the resources your household received in the last one month?
    ben_det_income: number | undefined
    // ben_det/ben_det_hh_size [integer] 2.7 Indicate the total number of people in your household, including the HH
    ben_det_hh_size: number | undefined
    // ben_det/ben_det_single_parent [select_one] 2.8 Are you single parent?
    ben_det_single_parent: undefined | Option<'pay_det_tax_exempt'>
    // hh_char/hh_char_hhh [select_one] Are you the head of your household?
    hh_char_hhh: undefined | Option<'pay_det_tax_exempt'>
    // hh_char/hh_char_res_gender [select_one] Select gender of respondent?
    hh_char_res_gender: undefined | Option<'hh_char_hh_det_gender'>
    // hh_char/hh_char_res_age [integer] Age of Respondent
    hh_char_res_age: number | undefined
    // hh_char/hh_char_res_dis_select [select_multiple] Please select any of the below that apply to respondent
    hh_char_res_dis_select: undefined | Option<'hh_char_dis_select'>[]
    // hh_char/hh_char_res_dis_level [select_one] What is the level of difficulty for the selected options in the previous questions?
    hh_char_res_dis_level: undefined | Option<'hh_char_dis_level'>
    // hh_char/hh_char_hhh_gender [select_one] 3.1.1 What is the gender of Head of household?
    hh_char_hhh_gender: undefined | Option<'hh_char_hh_det_gender'>
    // hh_char/hh_char_hhh_age [integer] 3.1.2 What is the age of the Head of Household?
    hh_char_hhh_age: number | undefined
    // hh_char/hh_char_civ_stat [select_one] 3.1.3 What is the civil status of the Head of Household?
    hh_char_civ_stat: undefined | Option<'hh_char_civ_stat'>
    // hh_char/hh_char_hhh_res_stat [select_one] 3.1.4 Select residential status of the Head of Household?
    hh_char_hhh_res_stat: undefined | Option<'hh_char_hh_res_stat'>
    // hh_char/hh_char_hhh_how_idp [select_one] 3.1.4.1 How long have you been an IDP?
    hh_char_hhh_how_idp: undefined | Option<'hh_char_hh_how_idp'>
    // hh_char/hh_char_origin_oblast [select_one] 3.1.4.2 What is your area of origin prior to displacement? (Select Oblast)
    hh_char_origin_oblast: undefined | Option<'hh_char_origin_oblast'>
    // hh_char/hh_char_hhh_dis_select [select_multiple] 3.1.5 Please select any of the below that apply to Head of household
    hh_char_hhh_dis_select: undefined | Option<'hh_char_dis_select'>[]
    // hh_char/hh_char_hhh_dis_level [select_one] 3.1.6 What is the level of difficulty for the selected options in the previous questions?
    hh_char_hhh_dis_level: undefined | Option<'hh_char_dis_level'>
    // hh_char/hh_char_hhh_chronic_disease [select_one] 3.1.7 Do you have a chronic disease?
    hh_char_hhh_chronic_disease: undefined | Option<'pay_det_tax_exempt'>
    calc_hhh_res_dis_level: string
    calc_char_civ_stat: string
    // hh_char/hh_char_chh [note] This is a child headed household (high risk protection case), please refer immediately to a DRC Protection colleague and complete internal referral form.
    hh_char_chh: string
    // hh_char/hh_char_hh_det [begin_repeat] 3.2 HH Members
    hh_char_hh_det:
      | {
          hh_char_hh_det_gender: undefined | Option<'hh_char_hh_det_gender'> | undefined
          hh_char_hh_det_age: number | undefined | undefined
          hh_char_hh_res_stat: undefined | Option<'hh_char_hh_res_stat'> | undefined
          hh_char_hh_how_idp: undefined | Option<'hh_char_hh_how_idp'> | undefined
          hh_char_hh_det_dis_select: undefined | Option<'hh_char_dis_select'>[] | undefined
          hh_char_hh_det_dis_level: undefined | Option<'hh_char_dis_level'> | undefined
          hh_char_hh_chronic_disease: undefined | Option<'pay_det_tax_exempt'> | undefined
          calc_u18: string | undefined
          calc_o60: string | undefined
          calc_ed_age: string | undefined
          calc_baby_age: string | undefined
          calc_preg: string | undefined
          calc_det_dis_level: string | undefined
          cal_chronic_disease: string | undefined
          cal_idp: string | undefined
          cal_idp_less_1y: string | undefined
          cal_idp_more_1y: string | undefined
          cal_long_res: string | undefined
          cal_ret: string | undefined
        }[]
      | undefined
    calc_tot_chi: string
    calc_tot_ed_age: string
    calc_tot_eld: string
    // hh_char/calc_tot_dis [calculate] Total number of people wich disability
    calc_tot_dis: string
    // hh_char/cal_tot_chronic_disease [calculate] Total number of people wich Chronic disease
    cal_tot_chronic_disease: string
    // hh_char/cal_tot_idp [calculate] Total number of Internally Displaced Person (IDP)
    cal_tot_idp: string
    // hh_char/cal_tot_idp_less_1y [calculate] Total number of Internally Displaced Person (IDP) Less 1 year
    cal_tot_idp_less_1y: string
    // hh_char/cal_tot_idp_more_1y [calculate] Total number of Internally Displaced Person (IDP) More 1 year
    cal_tot_idp_more_1y: string
    // hh_char/cal_tot_long_res [calculate] Total number of Long - Term Resident
    cal_tot_long_res: string
    // hh_char/cal_tot_ret [calculate] Total number of Returnees
    cal_tot_ret: string
    // hh_char/hh_char_preg [select_one] 3.3.1 Are any of the females in the household pregnat or lactating?
    hh_char_preg: undefined | Option<'pay_det_tax_exempt'>
    // hh_char/pregnant_count [integer] 3.3.1.1 If yes, how many females are pregnant?
    pregnant_count: number | undefined
    // hh_char/lactating_count [integer] 3.3.1.2 If yes, how many females are lactating?
    lactating_count: number | undefined
    // hh_char/disease_higher_expenditures [select_one] 3.3.2 If yes, does the presence of a person with a chronic disease in the household mean higher expenditures on things like healthcare.
    disease_higher_expenditures: undefined | Option<'pay_det_tax_exempt'>
    // hh_char/disease_does_working [select_one] 3.3.2.1 If yes, does the presense of a person with a chornic disease in the household prevent someone in the household from working as a result of taking on caregiver duties?
    disease_does_working: undefined | Option<'pay_det_tax_exempt'>
    // hh_char/household_agricultural_activities [select_one] 3.3.3 Does the household have the physical ability to engage in light agricultural activities?
    household_agricultural_activities: undefined | Option<'pay_det_tax_exempt'>
    // hh_char/financial_manage_livestock [select_one] 3.3.3.1 If no, does the household have the financial or social resources they can use to cultivate their land or manage their livestock?
    financial_manage_livestock: undefined | Option<'pay_det_tax_exempt'>
    // hh_char/hh_char_dis_note [note] The next set of questions ask about difficulties you or members of your household may have doing certain activities. These questions only relates to household members over the age of 5 years old.**
    hh_char_dis_note: string
    // hh_char/hh_char_dis_select [select_multiple] Please select any of the below that apply to you or a member of your household
    hh_char_dis_select: undefined | Option<'hh_char_dis_select'>[]
    // hh_char/hh_char_dis_level [select_one] What is the level of difficulty for the selected options in the previous questions?
    hh_char_dis_level: undefined | Option<'hh_char_dis_level'>
    calc_dis_level: string
    // cash_farmers/know_contamination_farming [select_one] Do you know of any contamination (e.g. unexploded ordnance) on the land which you are farming on?
    know_contamination_farming: undefined | Option<'know_contamination_neighbour'>
    // cash_farmers/know_contamination_neighbour [select_one] Do you know of any contamination (e.g. unexploded ordnance) on land of a neighbour or a small-scale farmer close by?
    know_contamination_neighbour: undefined | Option<'know_contamination_neighbour'>
    // cash_farmers/know_contamination_neighbour_yes [select_one] Do you know if this/these indivudual(s) still continue to farm their land?
    know_contamination_neighbour_yes: undefined | Option<'know_contamination_neighbour_yes'>
    // cash_farmers/what_primary_livelihood [select_one] What is the primary livelihood in the household:
    what_primary_livelihood: undefined | Option<'what_primary_livelihood'>
    // cash_farmers/what_primary_livelihood_other [text] If "Other", please specify
    what_primary_livelihood_other: string | undefined
    // cash_farmers/consume_majority [select_one] Do you consume a majority of the crops you produce / livestock that you manage:
    consume_majority: undefined | Option<'pay_det_tax_exempt'>
    // cash_farmers/land_own [decimal] How much land do you own:
    land_own: number | undefined
    // cash_farmers/land_cultivate [decimal] How much land do you cultivate or manage for crops and/or livestock:
    land_cultivate: number | undefined
    // cash_farmers/depend_basic_needs [select_one] Does agriculture and/or livestock management significantly contribute to the household being able to meet its basic needs?
    depend_basic_needs: undefined | Option<'pay_det_tax_exempt'>
    // cash_farmers/eligible_assistance_agricultural [select_multiple] If eligible for assistance, what agricultural inputs do you intend to purchase:
    eligible_assistance_agricultural: undefined | Option<'eligible_assistance_agricultural'>[]
    // cash_farmers/eligible_assistance_agricultural_other [text] If "Other", please specify
    eligible_assistance_agricultural_other: string | undefined
    // cash_farmers/not_many_livestock [note] ##### How many of the following livestock do you have:
    not_many_livestock: string
    // cash_farmers/many_sheep_goat [integer] Sheep/goat:
    many_sheep_goat: number | undefined
    // cash_farmers/many_milking [integer] Milking/lactating cow:
    many_milking: number | undefined
    // cash_farmers/many_cow [integer] Dry cow:
    many_cow: number | undefined
    // cash_farmers/many_cattle [integer] Cattle
    many_cattle: number | undefined
    // cash_farmers/many_pig [integer] Pig:
    many_pig: number | undefined
    // cash_farmers/many_poultry [integer] Poultry:
    many_poultry: number | undefined
    cal_cost_sheep_goat: string
    cal_cost_milking: string
    cal_cost_cow: string
    cal_cost_pig: string
    cal_cost_poultry: string
    lim_cal_cost_sheep_goat: string
    lim_cal_cost_milking: string
    lim_cal_cost_cow: string
    lim_cal_cost_pig: string
    lim_cal_cost_poultry: string
    no_cal_cost_all: string
    cal_cost_all: string
    cal_cost_450: string
    // cash_farmers/not_cost_all [note] Total amount of assistance required by the household: ${no_cal_cost_all}$
    not_cost_all: string
    // cash_farmers/not_cost_assist [note] Total amount of assistance: ${cal_cost_all}$
    not_cost_assist: string
    // cash_farmers/barriers_providing_sufficient [select_one] Do you face barriers in providing sufficient quality and quantity of feed to your livestock?
    barriers_providing_sufficient: undefined | Option<'pay_det_tax_exempt'>
    // cash_farmers/barriers_providing_sufficient_yes [text] If "Yes", please specify
    barriers_providing_sufficient_yes: string | undefined
    // cash_farmers/eligible_cash_feed [select_multiple] If eligible for cash for animal feed, what animal feed do you intend to purchase?
    eligible_cash_feed: undefined | Option<'eligible_cash_feed'>[]
    // cash_farmers/eligible_cash_feed_other [text] If "Other", please specify
    eligible_cash_feed_other: string | undefined
    // cash_farmers/animal_shelter_need [select_one] Is your animal shelter in need of rehabilitation?
    animal_shelter_need: undefined | Option<'pay_det_tax_exempt'>
    // cash_farmers/cash_animal_shelter [select_multiple] If eligible for cash for animal shelter assistance, what building materials do you intend to purchase
    cash_animal_shelter: undefined | Option<'cash_animal_shelter'>[]
    // cash_farmers/cash_animal_shelter_other [text] If "Other", please specify
    cash_animal_shelter_other: string | undefined
    // livelihoods_score/income_spent_food [integer] In the last 7 days, what proportion of the overall household income was spent on food (human consumption)?
    income_spent_food: number | undefined
    // livelihoods_score/income_spent_nonfood [integer] In the last 7 days, what proportion of the overall household income was spent on non-food items and services such as health and education related services?
    income_spent_nonfood: number | undefined
    // livelihoods_score/lcs_sell_hh_assets [select_one] In the last 30 days, did your household sell household assets/goods (furniture/household appliances (i.e. TV, radio, washing machine, etc.) smart phone/jewellery,...) due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
    lcs_sell_hh_assets: undefined | Option<'lost_breadwiner'>
    // livelihoods_score/lcs_spent_savings [select_one] In the last 30 days, did your household spend savings or сonsumed stocks "for a rainy day" due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
    lcs_spent_savings: undefined | Option<'lost_breadwiner'>
    // livelihoods_score/lcs_forrowed_food [select_one] In the last 30 days, did your household purchase food on credit or borrowed food  due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
    lcs_forrowed_food: undefined | Option<'lost_breadwiner'>
    // livelihoods_score/lcs_eat_elsewhere [select_one] In the last 30 days, did your household send household members to eat/live with another family or friends or eat at a food bank/soup kitchen/collective centre distributing food due to a lack of resources to cover to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
    lcs_eat_elsewhere: undefined | Option<'lost_breadwiner'>
    // livelihoods_score/lcs_sell_productive_assets [select_one] In the last 30 days, did your household sell productive assets or means of transport (sewing machine, bicycle, car, etc.) due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
    lcs_sell_productive_assets: undefined | Option<'lost_breadwiner'>
    // livelihoods_score/lcs_reduce_health_expenditures [select_one] In the last 30 days, did your household reduce essential health expenditures (including drugs,) due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities,  fuel for heating, drinking water, etc.)?
    lcs_reduce_health_expenditures: undefined | Option<'lost_breadwiner'>
    // livelihoods_score/lcs_decrease_fertilizer [select_one] In the last 30 days, did anyone in your household have to decrease expenditures on fertilizer, pesticide, fodder, animal feed, veterinary care, etc. due to a lack of food or money to buy it?
    lcs_decrease_fertilizer: undefined | Option<'lost_breadwiner'>
    // livelihoods_score/lcs_reduce_education_expenditures [select_one] In the last 30 days, did your household reduce essential education expenditures due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water,  etc.)?
    lcs_reduce_education_expenditures: undefined | Option<'lost_breadwiner'>
    // livelihoods_score/lcs_sell_house [select_one] In the last 30 days, did your household sell house or land due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
    lcs_sell_house: undefined | Option<'lost_breadwiner'>
    // livelihoods_score/lcs_move_elsewhere [select_one] In the last 30 days, did your HH member(-s) move elsewhere in search of work due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
    lcs_move_elsewhere: undefined | Option<'lost_breadwiner'>
    // livelihoods_score/lcs_degrading_income_source [select_one] In the last 30 days, did your household use degrading sources of income, illegal work, or high risk jobs due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
    lcs_degrading_income_source: undefined | Option<'lost_breadwiner'>
    // livelihoods_score/lcs_ask_stranger [select_one] In the last 30 days, did your household have to ask strangers for money to cover essential needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
    lcs_ask_stranger: undefined | Option<'lost_breadwiner'>
    // livelihoods_score/lcs_reason [select_multiple] What were the main reasons why your household decided to use these strategies?
    lcs_reason: undefined | Option<'lcs_reason'>[]
    // livelihoods_score/lcs_reason_other [text] If other, specify
    lcs_reason_other: string | undefined
    // livelihoods_score/lost_breadwiner [select_one] Did the household lose their breadwinner?
    lost_breadwiner: undefined | Option<'lost_breadwiner'>
    // livelihoods_score/lost_breadwiner_conflict [select_one] Did the household lose their breadwinner as a result of the conflict (since 2014)?
    lost_breadwiner_conflict: undefined | Option<'pay_det_tax_exempt'>
    // Documented_loss_Assets [select_one] Do you have documented lost of productive assets?
    Documented_loss_Assets: undefined | Option<'pay_det_tax_exempt'>
    // baseline_indicator/basic_needs_prioritize [select_one] To what extent is your household able to meet its basic needs as you define and prioritize them?
    basic_needs_prioritize: undefined | Option<'basic_needs_prioritize'>
    // baseline_indicator/basic_needs_unable_fulfil [select_multiple] Which basic needs is your household currently unable to fulfil?
    basic_needs_unable_fulfil: undefined | Option<'basic_needs_unable_fulfil'>[]
    // baseline_indicator/basic_needs_unable_fulfil_other [text] Other, specify:
    basic_needs_unable_fulfil_other: string | undefined
    // baseline_indicator/unable_fulfil_basic_food [select_one] What were the reasons for these Basic food needs being unmet?
    unable_fulfil_basic_food: undefined | Option<'unable_fulfil_other'>
    // baseline_indicator/unable_fulfil_basic_food_other [text] Other, specify:
    unable_fulfil_basic_food_other: string | undefined
    // baseline_indicator/unable_fulfil_food_children [select_one] What were the reasons for these Special food needs of your children 0–23 months being unmet?
    unable_fulfil_food_children: undefined | Option<'unable_fulfil_other'>
    // baseline_indicator/unable_fulfil_food_children_other [text] Other, specify:
    unable_fulfil_food_children_other: string | undefined
    // baseline_indicator/unable_fulfil_food_pregnant [select_one] What were the reasons for these Special food needs of pregnant and lactating women being unmet?
    unable_fulfil_food_pregnant: undefined | Option<'unable_fulfil_other'>
    // baseline_indicator/unable_fulfil_food_pregnant_other [text] Other, specify:
    unable_fulfil_food_pregnant_other: string | undefined
    // baseline_indicator/unable_fulfil_water_needs [select_one] What were the reasons for these Water needs being unmet?
    unable_fulfil_water_needs: undefined | Option<'unable_fulfil_other'>
    // baseline_indicator/unable_fulfil_water_needs_other [text] Other, specify:
    unable_fulfil_water_needs_other: string | undefined
    // baseline_indicator/unable_fulfil_hygiene_needs [select_one] What were the reasons for these Hygiene needs being unmet?
    unable_fulfil_hygiene_needs: undefined | Option<'unable_fulfil_other'>
    // baseline_indicator/unable_fulfil_hygiene_needs_other [text] Other, specify:
    unable_fulfil_hygiene_needs_other: string | undefined
    // baseline_indicator/unable_fulfil_shelter_needs [select_one] What were the reasons for these Shelter/housing needs being unmet?
    unable_fulfil_shelter_needs: undefined | Option<'unable_fulfil_other'>
    // baseline_indicator/unable_fulfil_shelter_needs_other [text] Other, specify:
    unable_fulfil_shelter_needs_other: string | undefined
    // baseline_indicator/unable_fulfil_healthcare_needs [select_one] What were the reasons for these Healthcare needs of your households being unmet?
    unable_fulfil_healthcare_needs: undefined | Option<'unable_fulfil_other'>
    // baseline_indicator/unable_fulfil_healthcare_needs_other [text] Other, specify:
    unable_fulfil_healthcare_needs_other: string | undefined
    // baseline_indicator/unable_fulfil_healthcare_children [select_one] What were the reasons for these Special healthcare needs of your children 0–23 months being unmet?
    unable_fulfil_healthcare_children: undefined | Option<'unable_fulfil_other'>
    // baseline_indicator/unable_fulfil_healthcare_children_other [text] Other, specify:
    unable_fulfil_healthcare_children_other: string | undefined
    // baseline_indicator/unable_fulfil_healthcare_pregnant [select_one] What were the reasons for these Special healthcare needs of pregnant and lactating women being unmet?
    unable_fulfil_healthcare_pregnant: undefined | Option<'unable_fulfil_other'>
    // baseline_indicator/unable_fulfil_healthcare_pregnant_other [text] Other, specify:
    unable_fulfil_healthcare_pregnant_other: string | undefined
    // baseline_indicator/unable_fulfil_transportation_needs [select_one] What were the reasons for these Transportation needs being unmet?
    unable_fulfil_transportation_needs: undefined | Option<'unable_fulfil_other'>
    // baseline_indicator/unable_fulfil_transportation_needs_other [text] Other, specify:
    unable_fulfil_transportation_needs_other: string | undefined
    // baseline_indicator/unable_fulfil_communication_needs [select_one] What were the reasons for these Communication needs being unmet?
    unable_fulfil_communication_needs: undefined | Option<'unable_fulfil_other'>
    // baseline_indicator/unable_fulfil_communication_needs_other [text] Other, specify:
    unable_fulfil_communication_needs_other: string | undefined
    // baseline_indicator/unable_fulfil_education_needs [select_one] What were the reasons for these Education needs for children being unmet?
    unable_fulfil_education_needs: undefined | Option<'unable_fulfil_other'>
    // baseline_indicator/unable_fulfil_education_needs_other [text] Other, specify:
    unable_fulfil_education_needs_other: string | undefined
    // baseline_indicator/unable_fulfil_clothing_needs [select_one] What were the reasons for these Clothing needs being unmet?
    unable_fulfil_clothing_needs: undefined | Option<'unable_fulfil_other'>
    // baseline_indicator/unable_fulfil_clothing_needs_other [text] Other, specify:
    unable_fulfil_clothing_needs_other: string | undefined
    // baseline_indicator/unable_fulfil_utilities [select_one] What were the reasons for these Utilities being unmet?
    unable_fulfil_utilities: undefined | Option<'unable_fulfil_other'>
    // baseline_indicator/unable_fulfil_utilities_other [text] Other, specify:
    unable_fulfil_utilities_other: string | undefined
    // baseline_indicator/unable_fulfil_other [select_one] What were the reasons for these Other being unmet?
    unable_fulfil_other: undefined | Option<'unable_fulfil_other'>
    // baseline_indicator/unable_fulfil_other_specify [text] Other, specify:
    unable_fulfil_other_specify: string | undefined
    // ass_inc/not_information [note] Your information has been collected and will be reviewed in line with the selection and vulnerability criteria. We will reach out to you to provide decision on eligibility
    not_information: string
    // pay_det/pay_consent [select_one] 6.0 Thank you for answering the questions above, are you willing to provide your payment details?
    pay_consent: undefined | Option<'pay_det_tax_exempt'>
    // pay_det/pay_det_s/pay_det_id_type [select_one] 6.1 What form of ID do you have?
    pay_det_id_type: undefined | Option<'pay_det_id_type'>
    // pay_det/pay_det_s/pay_det_id_type_oth [text] 6.1.1 What other form of ID do you have?
    pay_det_id_type_oth: string | undefined
    // pay_det/pay_det_s/pay_det_pass_ser [text] 6.2.1 Input Passport Series
    pay_det_pass_ser: string | undefined
    // pay_det/pay_det_s/pay_det_pass_num [text] 6.2.2 Number of ID
    pay_det_pass_num: string | undefined
    // pay_det/pay_det_s/pay_det_id_ph [image] 6.2.3 Take a photo of the ID
    pay_det_id_ph: string
    // pay_det/pay_det_s/begin_group_vdIM9ogQb/pay_det_tax_id_yn [select_one] 6.3.1 Do you have an individual tax number (TIN)?
    pay_det_tax_id_yn: undefined | Option<'pay_det_tax_exempt'>
    // pay_det/pay_det_s/begin_group_vdIM9ogQb/pay_det_tax_id_num [text] 6.3.2 What is your individual tax number?
    pay_det_tax_id_num: string | undefined
    // pay_det/pay_det_s/begin_group_vdIM9ogQb/pay_det_tax_id_ph [image] 6.3.3 Take a photo of the Tax ID
    pay_det_tax_id_ph: string
    // pay_det/pay_det_s/begin_group_vdIM9ogQb/pay_det_tax_exempt [select_one] 6.3.4 Do you have a tax exemptions?
    pay_det_tax_exempt: undefined | Option<'pay_det_tax_exempt'>
    // pay_det/pay_det_s/begin_group_vdIM9ogQb/pay_det_tax_exempt_im [image] 6.3.5 Take a photo of the proof of the tax of exemptions
    pay_det_tax_exempt_im: string
    // pay_det/pay_det_s/pay_det_pay_meth [select_one] 6.4.1 What is your preferred payment method?
    pay_det_pay_meth: undefined | Option<'pay_det_pay_meth'>
    // pay_det/pay_det_s/pay_det_iban [text] 6.4.2 What is your IBAN number?
    pay_det_iban: string | undefined
    // pay_det/pay_det_s/pay_det_iban_im [image] 6.4.3 Take a picture of IBAN number if available
    pay_det_iban_im: string
    // pay_det/pay_det_s/pay_address [text] 6.4.4 Your address
    pay_address: string | undefined
    // pay_det/pay_det_s/pay_zip [text] 6.4.5 Your ZIP code
    pay_zip: string | undefined
    // pay_det/pay_det_s/pay_det_add_im [image] 6.4.6 Take a picture of the address page of passport
    pay_det_add_im: string
    // pay_det/pay_det_s/pay_det_pay_meth_oth [text] 6.4.7 What other Payment methods do you prefer?
    pay_det_pay_meth_oth: string | undefined
    // pay_det/pay_det_s/pay_det_pay_meth_none [text] 6.4.8 Can you highlight the main reason that none of these payment methods are suitable to you?
    pay_det_pay_meth_none: string | undefined
    // fin_det/fin_det_res [text] 7.1 Other Comments from Respondent
    fin_det_res: string | undefined
    // fin_det/fin_det_enum [text] 7.2 Other Comments from Enumerator
    fin_det_enum: string | undefined
    // fin_det/fin_det_oth_doc_im [image] 7.3 Please take picture of any other relevant document
    fin_det_oth_doc_im: string
    // fin_det/additional_photo1 [image] 7.4.1 Additional photo
    additional_photo1: string
    // fin_det/additional_photo2 [image] 7.4.2 Additional photo
    additional_photo2: string
    // fin_det/additional_photo3 [image] 7.4.3 Additional photo
    additional_photo3: string
    // fin_det/additional_photo4 [image] 7.4.4 Additional photo
    additional_photo4: string
    // fin_det/additional_photo5 [image] 7.4.5 Additional photo
    additional_photo5: string
    // fin_det/additional_photo6 [image] 7.4.6 Additional photo
    additional_photo6: string
    // fin_det/additional_photo7 [image] 7.4.7 Additional photo
    additional_photo7: string
    // cal_eligibility [calculate] Eligibility
    cal_eligibility: string
    // cal_lim_income [calculate] Limited Income
    cal_lim_income: string
    // cal_spending_savings [calculate] Spending savings or consumed stocks
    cal_spending_savings: string
    // cal_selling_household [calculate] Selling household assets/goods (refrigerator, television, jewelry…)
    cal_selling_household: string
    // cal_decrease_fertilizer [calculate] Decrease expenditures on fertilizer
    cal_decrease_fertilizer: string
    // cal_purchasing_food [calculate] Purchasing food on credit or borrow food
    cal_purchasing_food: string
    // cal_selling_productive_assets [calculate] Selling productive assets or means of transport
    cal_selling_productive_assets: string
    // cal_reducing_essential_health [calculate] Reducing essential health expenditures
    cal_reducing_essential_health: string
    // cal_sending_members_eat [calculate] Sending members to eat/live with another family or friends or at food bank/soup kitchen
    cal_sending_members_eat: string
    // cal_moving_elsewhere_work [calculate] Moving elsewhere in search of work
    cal_moving_elsewhere_work: string
    // cal_strangers_money_cover [calculate] Ask strangers for money to cover essential needs
    cal_strangers_money_cover: string
    // cal_sellling_house_land [calculate] Sellling house or land
    cal_sellling_house_land: string
    // cal_reducing_essential_education [calculate] Reducing essential education expenditures
    cal_reducing_essential_education: string
    // cal_degrading_sources_income [calculate] Using degrading sources of income, illegal work, high risk jobs
    cal_degrading_sources_income: string
    // cal_size_hh_v1 [calculate] Size of household
    cal_size_hh_v1: string
    // cal_residence_status_v2_ue [calculate] Residence status
    cal_residence_status_v2_ue: string
    // cal_dis_chr_v2 [calculate] People with a disability
    cal_dis_chr_v2: string
    // cal_chr_v4_ue [calculate] People with a chronic disease
    cal_chr_v4_ue: string
    // cal_single_parent_children_v3 [calculate] Single-headed household
    cal_single_parent_children_v3: string
    // cal_elderly_people_v4 [calculate] Elderly people
    cal_elderly_people_v4: string
    // cal_perg_woman_v5 [calculate] Pregnant or lactating woman
    cal_perg_woman_v5: string
    // cal_breadwinner_conflict_v6 [calculate] Household lost their breadwinner as a result of the conflict
    cal_breadwinner_conflict_v6: string
    // cal_doc_loss [calculate] Documented loss of assets as a result of the conflict
    cal_doc_loss: string
    // cal_negative_coping_strategies_v8 [calculate] Negative Coping Strategy Indicators
    cal_negative_coping_strategies_v8: string
    // cal_income [calculate] Income
    cal_income: string
    // cal_tot_vulnerability [calculate] Total Vulnerability
    cal_tot_vulnerability: string
  }
  export const options = {
    back_office: {
      lwo: `Lviv (LWO)`,
      chj: `Chernihiv (CHJ)`,
      dnk: `Dnipro (DNK)`,
      hrk: `Kharkiv (HRK)`,
      nlv: `Mykloaiv (NLV)`,
      khe: `Kherson`,
      zap: `Zaporizia`,
      umy: `Sumy(UMY)`,
    },
    back_enum: {
      dmytro_ivanov: `Dmytro Ivanov`,
      henadii_petrychenko: `Henadii Petrychenko`,
      nadiia_yudaieva: `Nadiia Yudaieva`,
      dmytro_tsaruk: `Dmytro Tsaruk`,
      viktoria_ushan: `Viktoria Ushan`,
      kostiantyn_yefimchuk: `Kostiantyn Yefimchuk`,
      viktoriia_lytvynova: `Viktoriia Lytvynova`,
      valerii_vietrov: `Valerii Vietrov`,
      daria_kokalia: `Daria Kokalia`,
      lwo_ex1: `Extra 1`,
      lwo_ex2: `Extra 2`,
      oleksandr_havrylov: `Oleksandr Havrylov`,
      ievgen_kylymenniy: `Ievgen Kylymenniy`,
      oleksandr_shmunk: `Oleksandr Shmunk`,
      inna_kovalchuk: `Inna Kovalchuk`,
      polina_prusakova: `Polina Prusakova`,
      artem_chernukha_1: `Artem Chernukha`,
      nlv_ex1: `Extra 1`,
      nlv_ex2: `Extra 2`,
      alina_bondarenko: `Alina Bondarenko`,
      serhii_dolzhenko: `Serhii Dolzhenko`,
      viktoria_klymenko: `Viktoria Klymenko`,
      andrii_zahoruyev: `Andrii Zahoruyev`,
      oleh_Ivanov: `Oleh Ivanov`,
      karina_korzh: `Karina Korzh`,
      serhii_nevmyvaka: `Serhii Nevmyvaka`,
      olha_osmukha: `Olha Osmukha`,
      halyna_diachenko: `Halyna Diachenko`,
      mariia_kozachko: `Mariia Kozachko`,
      maksym_mykytas: `Maksym Mykytas`,
      vita_zolotarevska: `Vita Zolotarevska`,
      olha_sakharnova: `Olha Sakharnova`,
      andrii_matvieiev: `Andrii Matvieiev`,
      sofiia_berezhna: `Sofiia Berezhna`,
      illia_kutsenko: `Illia Kutsenko`,
      dnk_ex1: `Extra 1`,
      dnk_ex2: `Extra 2`,
      yurii_volkov: `Yurii Volkov`,
      andrii_zagoruiev: `Andrii Zagoruiev`,
      olena_sydorenko: `Olena Sydorenko`,
      svitlana_smyrnova: `Svitlana Smyrnova`,
      tetiana_konovshii: `Tetiana Konovshii`,
      bohdan_taranushchenko: `Bohdan Taranushchenko`,
      olena_buglo: `Olena Buglo`,
      vitalii_shapoval: `Vitalii Shapoval`,
      hrk_ex1: `Extra 1`,
      hrk_ex2: `Extra 2`,
      dmytro_chernukha: `Chernukha Dmytro`,
      anastasiia_reshynska: `Anastasiia Reshynska`,
      nataliia_pushenko: `Pushenko Nataliia`,
      tetiana_gorbatiuk: `Gorbatiuk Tetiana`,
      oleksandr_lukomets: `Oleksandr Lukomets`,
      katerina_severin: `Katerina Severin`,
      maksim_sedun: `Maksim Sedun`,
      surzhyk_oleksandr: `Surzhyk Oleksandr`,
      chj_ex1: `Extra 1`,
      chj_ex2: `Extra 2`,
      khe_ex1: `Extra 1`,
      khe_ex2: `Extra 2`,
      khe_ex3: `Extra 3`,
      khe_ex4: `Extra 4`,
      zap_ex1: `Extra 1`,
      zap_ex2: `Extra 2`,
      zap_ex3: `Extra 3`,
      zap_ex4: `Extra 4`,
      honcharov_oleksandr: `Honcharov Oleksandr`,
      vceronika_kaliuzhna: `Kaliuzhna Veronika`,
      margaryta_pustova: `Pustova Margaryta`,
      inna_mishchenko: `Inna Mishchenko`,
      umy_ex1: `Anna Artiukh`,
      umy_ex2: `Yevhenii Musiienko`,
      umy_ex3: `Vitalii Hrynenko`,
      umy_ext1: `Extra 1`,
      umy_ext2: `Extra 2`,
      umy_ext3: `Extra 3`,
      umy_ex4: `Extra 4`,
      oleh_vyshnevskyi: `Oleh Vyshevskyi`,
    },
    back_donor: {
      uhf6: `UHF-6 (UKR-000336)`,
      uhf7: `UHF-7 (UKR-000352)`,
      '363_uhf8': `UHF-8 (UKR-000363)`,
      '372_echo': `ECHO (UKR-000372)`,
    },
    pay_det_tax_exempt: {
      yes: `Yes`,
      no: `No`,
    },
    know_contamination_neighbour: {
      yes: `Yes`,
      no: `No`,
      unwilling: `Unwilling or unable to answer`,
    },
    back_refer_who: {
      prot: `A = Protection`,
      legal: `B = Legal`,
      shelter: `C = Shelter`,
    },
    hh_char_hh_how_idp: {
      less_1y: `Less 1 year`,
      more_1y: `More 1 year`,
    },
    lost_breadwiner: {
      yes: `Yes`,
      no_had_no_need_to_use_this_coping_strategy: `No, had no need to use this coping strategy`,
      no_have_already_exhausted_this_coping_strategy_and_cannot_use_it_again: `No, have already exhausted this coping strategy and cannot use it again`,
      not_applicable_this_coping_strategy_is_not_available_to_me: `Not applicable / This coping strategy is not available to me`,
      prefer_not_to_answer: `Prefer not to answer`,
    },
    lcs_reason: {
      to_access_or_pay_for_food: `To access or pay for food`,
      to_access_or_pay_for_healthcare: `To access or pay for healthcare`,
      to_access_or_pay_for_shelter: `To access or pay for shelter`,
      to_access_or_pay_for_education: `To access or pay for education`,
      other: `Other`,
      dont_know: `Don't know`,
    },
    eligible_cash_feed: {
      hay: `Hay`,
      concentrated_feed: `Concentrated feed`,
      mineral_blocks: `Mineral blocks`,
      wheat_seeds: `Wheat seeds`,
      barley_seeds: `Barley seeds`,
      other: `Other`,
    },
    cash_animal_shelter: {
      bricks: `Bricks`,
      wood: `Wood`,
      plywood: `Plywood`,
      metal_panel: `Metal panel`,
      roof_panel: `Roof Panel`,
      cement: `Cement`,
      nails: `Nails`,
      other: `Other`,
    },
    know_contamination_neighbour_yes: {
      still: `Still farm all the land`,
      partially: `Partially farm the land`,
      stopped: `Stopped farming all togehter`,
      uu: `Unable/unwilling to answer`,
    },
    basic_needs_prioritize: {
      all: `All`,
      most: `Most`,
      about_half: `About half`,
      some: `Some (less than half)`,
      none: `None`,
      dont_wish: `I don’t wish to respond`,
    },
    basic_needs_unable_fulfil: {
      basic_food: `Basic food needs`,
      food_children: `Special food needs of your children 0–23 months`,
      food_pregnant: `Special food needs of pregnant and lactating women`,
      water_needs: `Water needs`,
      hygiene_needs: `Hygiene needs`,
      shelter_needs: `Shelter/housing needs`,
      healthcare_needs: `Healthcare needs of your households`,
      healthcare_children: `Special healthcare needs of your children 0–23 months`,
      healthcare_pregnant: `Special healthcare needs of pregnant and lactating women`,
      transportation_needs: `Transportation needs`,
      communication_needs: `Communication needs`,
      education_needs: `Education needs for children`,
      clothing_needs: `Clothing needs`,
      utilities: `Utilities`,
      other: `Other`,
    },
    unable_fulfil_other: {
      financial_reasons: `Financial reasons`,
      not_available: `It is not available on the local market`,
      other: `Other`,
    },
    hh_char_origin_oblast: {
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
    hh_char_hh_res_stat: {
      idp: `A = Internally Displaced Person (IDP)`,
      long_res: `B = Long - Term Resident`,
      ret: `C = Returnee`,
      ref_asy: `D = Refugee/asylum seeker`,
    },
    hh_char_hh_det_gender: {
      male: `A = Male`,
      female: `B = Female`,
    },
    hh_char_civ_stat: {
      single: `A = Single (Never Married)`,
      dom_part: `B = Not Married but Living in Domestic Partnership`,
      married: `C = Married`,
      div_sep: `D = Divorced/Seperated`,
      widow: `E = Widowed`,
      abandoned: `F = Abandoned`,
    },
    hh_char_dis_select: {
      diff_see: `A = Have difficulty seeing, even if wearing glasses`,
      diff_hear: `B = Have difficulty hearing, even if using a hearing aid`,
      diff_walk: `C = Have difficulty walking or climbing steps`,
      diff_rem: `D = Have difficulty remembering or concentrating`,
      diff_care: `E = Have difficulty with self-care such as washing all over or dressing`,
      diff_comm: `F = Have difficulty communicating, for example understanding or being understood`,
      diff_none: `G = None of the above apply`,
    },
    hh_char_dis_level: {
      zero: `A = No, no difficulty`,
      one: `B = Yes, some difficulty`,
      two: `C = Yes, a lot of difficulty`,
      fri: `D = Cannot do at all`,
    },
    undefined: {
      no_damage: `No Structural Damage`,
      minor_damage: `Minor Damage (light or medium damages such as broken windows and doors, minor roof damage)`,
      heavy_damage: `Heavy Damage`,
      rent: `B = Find Rental Accommodation`,
      host: `B = Living with Friends/Family/Host`,
      own_prop: `C = Living in Own Property`,
      coll_cen: `D = Living in Collective Center`,
      homeless: `E = Homeless`,
      other_accom: `F = Other`,
      secure: `A = Secure for Medium/Long Term`,
      unable_pay: `B = Currently Unable to Pay Rent/Contribute to Collective Costs`,
      dan_unable_pay: `C = In Danger of Being Unable to Pay Rent/Contribute to Collective Costs`,
      unsuit_accom: `D = Accommodation Unsuitable for my needs`,
      eviction: `E = Eviction/Removal for Other Reasons`,
      remain: `A = Remain in Current Place`,
      not_sure: `C = Not Sure/Don’t Know`,
      always: `A = Always`,
      not_always: `B = Not always on but comes daily`,
      intermittent: `C = Comes on intermittent days`,
      rarely: `D = Rarely`,
      never: `E = Never`,
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
    what_primary_livelihood: {
      agricul: `Agricultural and/or livestock activities`,
      grocery: `Grocery, shop`,
      smalls: `Small shop/kiosk`,
      carpentry: `Carpentry, carving, or woodwork`,
      mechanic: `Mechanics`,
      plumber: `Plumber`,
      electrical: `Electrical work`,
      construct: `Construction work`,
      textiel: `Textile and tailoring`,
      education: `Education centre`,
      heath: `Heath centre`,
      manufacturing: `Manufacturing/factory work`,
      computer: `Computer, technology`,
      administration: `Administration,`,
      graphic: `Graphic design`,
      transport: `Transport service`,
      hairdressing: `Hairdressing/barber`,
      pscoffe: `Providing services (such as coffee/tea, small restaurant, cooking, etc.)`,
      pscleaning: `Providing services (cleaning, security)`,
      ngo: `NGOs/UN agencies`,
      government: `Government`,
      other: `Other`,
      none: `None of them`,
    },
    eligible_assistance_agricultural: {
      seeds: `Seeds`,
      fertilizers: `Fertilizers`,
      irrigationp: `Irrigation pipes (drop lines)`,
      fuel: `Fuel (for agricultural machinery)`,
      agriculser: `Agricultural services (tractor service, harvesting)`,
      livestock: `Livestock (chickens, pigs, cows etc)`,
      agricultool: `Agricultural tools (shovel, rake etc)`,
      livestockf: `Livestock feed`,
      buildingm: `Building materials,`,
      other: `Other`,
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
      ben_det_ph_number: _.ben_det_ph_number ? +_.ben_det_ph_number : undefined,
      ben_det_income: _.ben_det_income ? +_.ben_det_income : undefined,
      ben_det_hh_size: _.ben_det_hh_size ? +_.ben_det_hh_size : undefined,
      hh_char_res_age: _.hh_char_res_age ? +_.hh_char_res_age : undefined,
      hh_char_res_dis_select: _.hh_char_res_dis_select?.split(' '),
      hh_char_hhh_age: _.hh_char_hhh_age ? +_.hh_char_hhh_age : undefined,
      hh_char_hhh_dis_select: _.hh_char_hhh_dis_select?.split(' '),
      hh_char_hh_det: _['hh_char_hh_det']?.map(extractQuestionName).map((_: any) => {
        _['hh_char_hh_det_age'] = _.hh_char_hh_det_age ? +_.hh_char_hh_det_age : undefined
        _['hh_char_hh_det_dis_select'] = _.hh_char_hh_det_dis_select?.split(' ')
        return _
      }),
      pregnant_count: _.pregnant_count ? +_.pregnant_count : undefined,
      lactating_count: _.lactating_count ? +_.lactating_count : undefined,
      hh_char_dis_select: _.hh_char_dis_select?.split(' '),
      eligible_assistance_agricultural: _.eligible_assistance_agricultural?.split(' '),
      many_sheep_goat: _.many_sheep_goat ? +_.many_sheep_goat : undefined,
      many_milking: _.many_milking ? +_.many_milking : undefined,
      many_cow: _.many_cow ? +_.many_cow : undefined,
      many_cattle: _.many_cattle ? +_.many_cattle : undefined,
      many_pig: _.many_pig ? +_.many_pig : undefined,
      many_poultry: _.many_poultry ? +_.many_poultry : undefined,
      eligible_cash_feed: _.eligible_cash_feed?.split(' '),
      cash_animal_shelter: _.cash_animal_shelter?.split(' '),
      income_spent_food: _.income_spent_food ? +_.income_spent_food : undefined,
      income_spent_nonfood: _.income_spent_nonfood ? +_.income_spent_nonfood : undefined,
      lcs_reason: _.lcs_reason?.split(' '),
      basic_needs_unable_fulfil: _.basic_needs_unable_fulfil?.split(' '),
    }) as T
}
