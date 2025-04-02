export namespace Ecrec_cashRegistrationBha {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: aQCGR2fESUNFMYKVHMyAET
  export interface T {
    start: string
    end: string
    // background/date [date] Date
    date: Date | undefined
    // background/back_office [select_one] 1.1 Select Office
    back_office: undefined | Option<'back_office'>
    // background/back_enum [select_one] 1.2 Staff
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
    ben_det_oblast: undefined | Option<'ben_det_prev_oblast'>
    // ben_det/ben_det_raion [select_one] 2.5.2 Select Raion where registration is taking place
    ben_det_raion: undefined | string
    // ben_det/ben_det_hromada [select_one] 2.5.3 Select hromada where registration is taking place
    ben_det_hromada: undefined | string
    // ben_det/ben_det_settlement [select_one_from_file] 2.5.4 Select settlement where registration is taking place
    ben_det_settlement: string
    // ben_det/ben_det_settlement_other [text] 2.5.4.1 If other, specify
    ben_det_settlement_other: string | undefined
    // ben_det/ben_det_res_stat [select_one] 2.6 Select residential status
    ben_det_res_stat: undefined | Option<'ben_det_res_stat'>
    // ben_det/ben_det_prev_oblast [select_one] 2.6.1 What is your area of origin prior to displacement? (Select Oblast)
    ben_det_prev_oblast: undefined | Option<'ben_det_prev_oblast'>
    // ben_det/ben_det_income [integer] 2.7 What was your total household income during the last one month?
    ben_det_income: number | undefined
    // ben_det/ben_det_hh_size [integer] 2.8 Indicate the total number of people in your household, including the HHH
    ben_det_hh_size: number | undefined
    // hh_char/hh_char_civ_stat [select_one] 3.1 What is the civil status of the Head of Household?
    hh_char_civ_stat: undefined | Option<'hh_char_civ_stat'>
    calc_char_civ_stat: string
    // hh_char/hh_char_hh_det [begin_repeat] 3.1.2 HH Members
    hh_char_hh_det:
      | {
          hh_char_hh_det_gender: undefined | Option<'hh_char_hh_det_gender'> | undefined
          hh_char_hh_det_age: number | undefined | undefined
          hh_char_hh_det_dis_select: undefined | Option<'hh_char_hh_det_dis_select'>[] | undefined
          hh_char_hh_det_dis_level: undefined | Option<'hh_char_hh_det_dis_level'> | undefined
          calc_u18: string | undefined
          calc_o60: string | undefined
          calc_ed_age: string | undefined
          calc_baby_age: string | undefined
          calc_preg: string | undefined
          calc_det_dis_level: string | undefined
        }[]
      | undefined
    calc_tot_chi: string
    calc_tot_ed_age: string
    calc_tot_eld: string
    calc_dis_level: string
    // hh_char/hh_char_preg [select_one] 3.1.2.5 Are any of the females in the household pregnat or lactating?
    hh_char_preg: undefined | Option<'pay_det_tax_exempt'>
    // hh_char/hh_char_chh [note] This is a child headed household (high risk protection case), please refer immediately to a DRC Protection colleague and complete internal referral form.
    hh_char_chh: string
    // cash_farmers/what_primary_livelihood [select_one] 4.1 What is the primary source of livelihoods in the household
    what_primary_livelihood: undefined | Option<'what_primary_livelihood'>
    // cash_farmers/what_primary_livelihood_other [text] 4.1.1 If "Other", please specify
    what_primary_livelihood_other: string | undefined
    // cash_farmers/has_agriculture_exp [select_one] 4.2 Is agriculture or farming the primary source of livelihood for your household?
    has_agriculture_exp: undefined | Option<'pay_det_tax_exempt'>
    // cash_farmers/consume_majority [select_one] 4.3 Do you consume a majority of the crops you produce / livestock that you manage
    consume_majority: undefined | Option<'pay_det_tax_exempt'>
    // cash_farmers/land_own [decimal] 4.4 How much land do you own
    land_own: number | undefined
    // cash_farmers/land_cultivate [decimal] 4.5 How much land do you cultivate or manage for crops and/or livestock
    land_cultivate: number | undefined
    // cash_farmers/depend_basic_needs [select_one] 4.6 Do you depend on farming to meet your basic needs?
    depend_basic_needs: undefined | Option<'pay_det_tax_exempt'>
    // cash_farmers/household_access_water [select_one] 4.7 Does the household have access to water or other means of irrigation?
    household_access_water: undefined | Option<'pay_det_tax_exempt'>
    // cash_farmers/access_basic_farming_tools [select_one] 4.8 Does the household have access to some basic farming tools and equipment?
    access_basic_farming_tools: undefined | Option<'pay_det_tax_exempt'>
    // cash_farmers/eligible_assistance_agricultural [select_multiple] 4.9 If eligible for assistance, what agricultural inputs do you intend to purchase
    eligible_assistance_agricultural: undefined | Option<'eligible_assistance_agricultural'>[]
    // cash_farmers/eligible_assistance_agricultural_other [text] 4.10 If "Other", please specify
    eligible_assistance_agricultural_other: string | undefined
    // livelihoods_score/income_spent_food [integer] 4a.1 In the last 7 days, what proportion of the overall household income was spent on food (human consumption)?
    income_spent_food: number | undefined
    // livelihoods_score/income_spent_nonfood [integer] 4a.2 In the last 7 days, what proportion of the overall household income was spent on non-food items and services such as health and education related services?
    income_spent_nonfood: number | undefined
    // livelihoods_score/lcs_sell_hh_assets [select_one] 4a.3 In the last 30 days, did your household sell household assets/goods (furniture/household appliances (i.e. TV, radio, washing machine, etc.) smart phone/jewellery,...) due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
    lcs_sell_hh_assets: undefined | Option<'lcs_ask_stranger'>
    // livelihoods_score/lcs_spent_savings [select_one] 4a.4 In the last 30 days, did your household spend savings or сonsumed stocks "for a rainy day" due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
    lcs_spent_savings: undefined | Option<'lcs_ask_stranger'>
    // livelihoods_score/lcs_forrowed_food [select_one] 4a.5 In the last 30 days, did your household purchase food on credit or borrowed food  due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
    lcs_forrowed_food: undefined | Option<'lcs_ask_stranger'>
    // livelihoods_score/lcs_eat_elsewhere [select_one] 4a.6 In the last 30 days, did your household send household members to eat/live with another family or friends or eat at a food bank/soup kitchen/collective centre distributing food due to a lack of resources to cover to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
    lcs_eat_elsewhere: undefined | Option<'lcs_ask_stranger'>
    // livelihoods_score/lcs_sell_productive_assets [select_one] 4a.7 In the last 30 days, did your household sell productive assets or means of transport (sewing machine, bicycle, car, etc.) due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
    lcs_sell_productive_assets: undefined | Option<'lcs_ask_stranger'>
    // livelihoods_score/lcs_reduce_health_expenditures [select_one] 4a.8 In the last 30 days, did your household reduce essential health expenditures (including drugs,) due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities,  fuel for heating, drinking water, etc.)?
    lcs_reduce_health_expenditures: undefined | Option<'lcs_ask_stranger'>
    // livelihoods_score/lcs_reduce_education_expenditures [select_one] 4a.9 In the last 30 days, did your household reduce essential education expenditures due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water,  etc.)?
    lcs_reduce_education_expenditures: undefined | Option<'lcs_ask_stranger'>
    // livelihoods_score/lcs_sell_house [select_one] 4a.10 In the last 30 days, did your household sell house or land due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
    lcs_sell_house: undefined | Option<'lcs_ask_stranger'>
    // livelihoods_score/lcs_move_elsewhere [select_one] 4a.11 In the last 30 days, did your HH member(-s) move elsewhere in search of work due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
    lcs_move_elsewhere: undefined | Option<'lcs_ask_stranger'>
    // livelihoods_score/lcs_degrading_income_source [select_one] 4a.12 In the last 30 days, did your household use degrading sources of income, illegal work, or high risk jobs due to a lack of resources to cover basic needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
    lcs_degrading_income_source: undefined | Option<'lcs_ask_stranger'>
    // livelihoods_score/lcs_ask_stranger [select_one] 4a.13 In the last 30 days, did your household have to ask strangers for money to cover essential needs (such as food, shelter, health, education, utilities, fuel for heating, drinking water, etc.)?
    lcs_ask_stranger: undefined | Option<'lcs_ask_stranger'>
    // livelihoods_score/lcs_reason [select_multiple] 4a.14 What were the main reasons why your household decided to use these strategies?
    lcs_reason: undefined | Option<'lcs_reason'>[]
    // livelihoods_score/lcs_reason_other [text] 4a.14.1 If other, specify
    lcs_reason_other: string | undefined
    // contamination/known_contamination_your [select_one] 4b.1 Do you know of any contamination (e.g. unexploded ordnance) on your land which you are farming on?
    known_contamination_your: undefined | Option<'known_contamination_next'>
    // contamination/contamination_impact_your [select_one] 4b.2 Has this impacted your ability to farm this land?
    contamination_impact_your: undefined | Option<'contamination_impact_next'>
    // contamination/known_contamination_next [select_one] 4b.3 Do you know of any contamination (e.g. unexploded ordnance) on land of a neighbour or a small-scale farmer close by?
    known_contamination_next: undefined | Option<'known_contamination_next'>
    // contamination/contamination_impact_next [select_one] 4b.4 Do you know if this individual(s) still continues to farm their land?
    contamination_impact_next: undefined | Option<'contamination_impact_next'>
    // ass_inc/not_information [note] Your information has been collected and will be reviewed in line with the selection and vulnerability criteria. We will reach out to you to provide decision on eligibility
    not_information: string
    calc_gen_sc_inc: string
    // ass_inc/ass_inc_sc_inc [note] **You have met the critera for inclusion in programme. We will conduct further internal checks and revert to you with a final result.** <span style="color: red">Do not read this out to the household</span>
    ass_inc_sc_inc: string
    // ass_inc/ass_inc_sc_not_vul [note] **Unfortunately based upon our criteria, you do not qualify for program as you do not meet the threshold for vulnerability.**
    ass_inc_sc_not_vul: string
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
      nataliia_lanina: `Nataliia Lanina`,
      nikita_zubenko: `Nikita Zubenko`,
      mykola_marchenko: `Mykola Marchenko`,
      olena_suhoniak: `Olena Suhoniak`,
      oleksii_marchenko: `Oleksii Marchenko`,
      svitlana_labunska: `Svitlana Labunska`,
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
      tatiana_tsapii: `Tatiana Tsapii`,
      enumerator_1_dnk: `Enumerator 1`,
      enumerator_2_dnk: `Enumerator 2`,
      enumerator_3_dnk: `Enumerator 3`,
      enumerator_4_dnk: `Enumerator 4`,
      enumerator_5_dnk: `Enumerator 5`,
      enumerator_6_dnk: `Enumerator 6`,
      enumerator_7_dnk: `Enumerator 7`,
      enumerator_8_dnk: `Enumerator 8`,
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
      umy_ex1: `Extra 1`,
      umy_ex2: `Extra 2`,
      umy_ex3: `Extra 3`,
      umy_ex4: `Extra 4`,
    },
    back_donor: {
      ukr000348_bha: `BHA (UKR-000348)`,
    },
    pay_det_tax_exempt: {
      yes: `Yes`,
      no: `No`,
    },
    known_contamination_next: {
      yes: `Yes`,
      no: `No`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    contamination_impact_next: {
      still_farm_all_of_the_land: `Still farm all of the land`,
      partially_farm_the_land: `Partially farm the land`,
      stopped_farming_all_together: `Stopped farming all together`,
      unable_unwilling_to_answer: `Unable/unwilling to answer`,
    },
    back_refer_who: {
      prot: `A = Protection`,
      legal: `B = Legal`,
      shelter: `C = Shelter`,
    },
    lcs_ask_stranger: {
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
      none: `None of the above`,
      other: `Other`,
      dont_know: `Don't know`,
    },
    undefined: {
      hay: `Hay`,
      concentrated_feed: `Concentrated feed`,
      mineral_blocks: `Mineral blocks`,
      wheat_seeds: `Wheat seeds`,
      barley_seeds: `Barley seeds`,
      other: `Other`,
      bricks: `Bricks`,
      wood: `Wood`,
      plywood: `Plywood`,
      metal_panel: `Metal panel`,
      roof_panel: `Roof Panel`,
      cement: `Cement`,
      nails: `Nails`,
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
    ben_det_prev_oblast: {
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
    ben_det_res_stat: {
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
    hh_char_hh_det_dis_select: {
      diff_see: `A = Have difficulty seeing, even if wearing glasses`,
      diff_hear: `B = Have difficulty hearing, even if using a hearing aid`,
      diff_walk: `C = Have difficulty walking or climbing steps`,
      diff_rem: `D = Have difficulty remembering or concentrating`,
      diff_care: `E = Have difficulty with self-care such as washing all over or dressing`,
      diff_comm: `F = Have difficulty communicating, for example understanding or being understood`,
      diff_none: `G = None of the above apply`,
    },
    hh_char_hh_det_dis_level: {
      zero: `A = No, no difficulty`,
      one: `B = Yes, some difficulty`,
      two: `C = Yes, a lot of difficulty`,
      fri: `D = Cannot do at all`,
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
      date: _.date ? new Date(_.date) : undefined,
      ben_det_ph_number: _.ben_det_ph_number ? +_.ben_det_ph_number : undefined,
      ben_det_income: _.ben_det_income ? +_.ben_det_income : undefined,
      ben_det_hh_size: _.ben_det_hh_size ? +_.ben_det_hh_size : undefined,
      hh_char_hh_det: _['hh_char_hh_det']?.map(extractQuestionName).map((_: any) => {
        _['hh_char_hh_det_age'] = _.hh_char_hh_det_age ? +_.hh_char_hh_det_age : undefined
        _['hh_char_hh_det_dis_select'] = _.hh_char_hh_det_dis_select?.split(' ')
        return _
      }),
      eligible_assistance_agricultural: _.eligible_assistance_agricultural?.split(' '),
      income_spent_food: _.income_spent_food ? +_.income_spent_food : undefined,
      income_spent_nonfood: _.income_spent_nonfood ? +_.income_spent_nonfood : undefined,
      lcs_reason: _.lcs_reason?.split(' '),
    }) as T
}
