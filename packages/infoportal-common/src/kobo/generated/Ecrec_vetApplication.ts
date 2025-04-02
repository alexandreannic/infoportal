export namespace Ecrec_vetApplication {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: aGGGapARnC2ek7sA6SuHmu
  export interface T {
    start: string
    end: string
    // background/not_induction [note] The Danish Refugee Council (DRC) is re-opening the application process for its grant program aimed at financing vocational training.  ####If you have already applied for the program, please do not duplicate your application, we will contact you when it is processed.  The aim of this programme is to provide skills training and/or upgrading to improve the employability of people affected by war. The grant programme is being implemented thanks to the generous support of the American people through the United States Agency for International Development (USAID) Bureau for Humanitarian Assistance. The programme is designed for residents of four regions: Zaporizhzhia, Dnipro, Mykolaiv and Kherson oblasts. However, priority will be given to applications from the cities of Zaporizhzhia, Kryvyi Rih, Pavlohrad, as well as Mykhailivska and Petro-Mykhailivska communities in Zaporizhzhia Oblast, and Apostolivska and Tomakivska communities in Dnipropetrovska Oblast.     #####Main programme details    - The grant covers a 3-month study programme of your choice, offering financial assistance of up to USD 500.    - Enrolment/participation in the training course is from May/June 2024, and the course itself must be completed by the end of August 2024.    - The course is up to you. It should best suit your career aspirations.      - Once your application is approved, you will need to sign a contract with the organisation that will deliver the course.      #####Application process   1 Take note of the timeframes outlined above. Take the opportunity to fully express your motivation. Outline your employment prospects after completing the course, provide information about your family situation and articulate why you believe you should receive this grant.   Your detailed application will allow us to better understand your aspirations and make an informed decision. We currently have a limited number of places on the programme and the registration link may be closed if the maximum number of places is reached. Please note that DRC is committed to providing assistance to the most vulnerable. Expressing your interest does not mean that you will automatically be accepted into the programme.   2 Candidates will be selected based on their individual needs and vulnerabilities, motivation, skills and prospects for securing long-term employment after completing the training. After you submit your application, the DRC team will review it and, if approved, contact you to invite you for an interview. Once selected, participants will be informed of the next steps.   3 Selected candidates will receive financial support for the study programme of their choice.   4 Programme participants are required to submit a financial report detailing the expenditure of grant funds.     #####Selection criteria   To participate in the programme, you must be registered as unemployed and demonstrate interest and motivation to study. The DRC strives to provide assistance to the most vulnerable categories of the population, therefore, preference may be given to low-income individuals, large families and other vulnerable groups.      #####Filling in the application form   Please fill in the form below if you think you meet the criteria and are interested in taking the course. The form contains questions that will help us learn about your experience and motivation to learn.      Important: Registration in this form does not mean that you will be automatically selected, as the number of places is limited. The selection process will be transparent and competitive, using eligibility criteria that focus on your level of vulnerability and motivation to participate in the programme.   We expect to receive a large number of applications. Please be patient as we process your application and let you know whether you have been shortlisted or not.    If you are not selected to participate in the current vocational training grant programme, you can apply for the following programmes. For this purpose, if you give your consent, we will store your data in our database.     #####Feedback   DRC highly values any feedback related to our programmes. If you have any questions or feedback, please contact us by email: UKR-feedback@drc.ngo; or by phone: 0 800 33 95 18 (Monday-Friday, 9:00 to 17:00)
    not_induction: string
    // background/date [date] Date
    date: Date | undefined
    // background/back_consent [select_one] Consent
    back_consent: undefined | Option<'case_selected_cover_cost'>
    // background/back_consen_no_reas [text] Can you please give the reason for why you do not wish to consent to the questionnaire?
    back_consen_no_reas: string | undefined
    // background/back_consent_no_note [note] Thank you very much for your time, we will not proceed with the questionnaire without your consent.
    back_consent_no_note: string
    // ben_det/ben_det_surname [text] 2.1 What is your surname name (as shown in personal ID)?
    ben_det_surname: string | undefined
    // ben_det/ben_det_first_name [text] 2.2 What is your first name (as shown in personal ID)?
    ben_det_first_name: string | undefined
    // ben_det/ben_det_pat_name [text] 2.3 What is your patronymic name?
    ben_det_pat_name: string | undefined
    // ben_det/ben_det_pat_gender [select_one] 2.4 Potential beneficiary’s gender
    ben_det_pat_gender: undefined | Option<'hh_char_hh_det_gender'>
    // ben_det/beneficiarys_age [integer] 2.5 Potential beneficiary’s age
    beneficiarys_age: number | undefined
    // ben_det/ben_det_oblast [select_one] 2.6.1 Select the region where you currently live
    ben_det_oblast: undefined | Option<'ben_det_prev_oblast'>
    // ben_det/ben_det_raion [select_one] 2.6.2 Select the district where you currently live
    ben_det_raion: undefined | string
    // ben_det/ben_det_hromada [select_one] 2.6.3 Select the community where you currently live
    ben_det_hromada: undefined | string
    // ben_det/ben_det_res_stat [select_one] 2.7 Please select your residential status
    ben_det_res_stat: undefined | Option<'ben_det_res_stat'>
    // ben_det/ben_det_res_stat_other [text] 2.7.1 If "Other", please specify
    ben_det_res_stat_other: string | undefined
    // ben_det/ben_det_prev_oblast [select_one] 2.7.2 What is your area of origin prior to displacement? (Select Oblast)
    ben_det_prev_oblast: undefined | Option<'ben_det_prev_oblast'>
    // ben_det/ben_det_ph_number [integer] 2.8 What is your phone number?
    ben_det_ph_number: number | undefined
    // ben_det/ben_det_email [text] 2.9 What is your email address?
    ben_det_email: string | undefined
    // ben_det/ben_det_hh_size [integer] 2.10 Indicate the total number of people in your household, including the head of household
    ben_det_hh_size: number | undefined
    // hh_char/info [note] This information is collected to collect more information about the level of vulnerability of you and your household
    info: string
    // hh_char/hh_char_hh_det [begin_repeat] 3.1 Household Members
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
          calc_adults: string | undefined
          calc_det_dis_level: string | undefined
        }[]
      | undefined
    // hh_char/calc_tot_baby [calculate] Total number of children under 3 years
    calc_tot_baby: string
    // hh_char/calc_tot_ed_age [calculate] Total number of children aged 5 to 18 years
    calc_tot_ed_age: string
    // hh_char/calc_tot_chi [calculate] Total number of children under 18 years
    calc_tot_chi: string
    // hh_char/calc_tot_adults [calculate] Total number of people aged 18 to 59 years
    calc_tot_adults: string
    // hh_char/calc_tot_eld [calculate] Total number of people over 60 years
    calc_tot_eld: string
    // hh_char/calc_dis_level [calculate] Total number of people with disabilities
    calc_dis_level: string
    // hh_char/hh_char_civ_stat [select_one] 3.2 What is the civil status of the Head of Household?
    hh_char_civ_stat: undefined | Option<'hh_char_civ_stat'>
    calc_char_civ_stat: string
    // hh_char/hh_char_preg [select_one] 3.3 Are any of the women in your household pregnant or lactating?
    hh_char_preg: undefined | Option<'case_selected_cover_cost'>
    // hh_char/numb_hh_char_preg [integer] 3.3.1 How many women in your household are pregnant or breastfeeding?
    numb_hh_char_preg: number | undefined
    // hh_char/hh_char_chh [note] This is a child headed household (high risk protection case), please refer immediately to a DRC Protection colleague and complete internal referral form.
    hh_char_chh: string
    // registration_questions/you_currently_employed [select_one] 4.1 Are you currently employed:
    you_currently_employed: undefined | Option<'case_selected_cover_cost'>
    // registration_questions/you_currently_employed_yes [select_one] 4.1.1.1 How long have you been employed for?
    you_currently_employed_yes: undefined | Option<'you_currently_employed_no'>
    // registration_questions/income_job_month [integer] 4.1.1.2 What is your net income from this job per month in UAH?
    income_job_month: number | undefined
    // registration_questions/you_currently_employed_no [select_one] 4.1.2.1 How long have you been unemployed?
    you_currently_employed_no: undefined | Option<'you_currently_employed_no'>
    // registration_questions/alternative_sources_income [select_one] 4.2 Do you have any alternative sources of income? [i.e. not from employment, but support from relatives etc]
    alternative_sources_income: undefined | Option<'case_selected_cover_cost'>
    // registration_questions/alternative_sources_income_yes [select_multiple] 4.2.1 What are these sources (multiple answers possible):
    alternative_sources_income_yes: undefined | Option<'alternative_sources_income_yes'>[]
    // registration_questions/alternative_sources_income_yes_other [text] 4.2.1.1 If "Other", please specify
    alternative_sources_income_yes_other: string | undefined
    // registration_questions/ben_det_income [integer] 4.3 What was the total value in UAH of all the resources your household received in the last one month?
    ben_det_income: number | undefined
    // registration_questions/training_activities_support [select_one] 4.4 In the last 2 years, have you engaged in any training activities to support re-training or movement into another sector of work?
    training_activities_support: undefined | Option<'case_selected_cover_cost'>
    // registration_questions/training_activities_support_yes_paid [select_one] 4.4.1 Who paid for this training?
    training_activities_support_yes_paid: undefined | Option<'training_activities_support_yes_paid'>
    // registration_questions/training_activities_support_yes_consequence [select_one] 4.4.2 Did you obtain employement as a consequence of this training?
    training_activities_support_yes_consequence: undefined | Option<'case_selected_cover_cost'>
    // registration_questions/significant_most_barriers [select_one] 4.4.3 What do you consider the most significant barriers to employment for you?
    significant_most_barriers: undefined | Option<'main_barriers_individuals'>
    // registration_questions/significant_most_barriers_other [text] 4.4.3.1 If "Other", please specify
    significant_most_barriers_other: string | undefined
    // registration_questions/main_barriers_individuals [select_multiple] 4.5 What do you consider to be the main barriers for individuals in your community to accessing employment?
    main_barriers_individuals: undefined | Option<'main_barriers_individuals'>[]
    // registration_questions/main_barriers_individuals_other [text] 4.5.1 If "Other", please specify
    main_barriers_individuals_other: string | undefined
    // registration_questions/motivation_vocational_training [text] 4.6 What is your motivation to enrol in a vocational training course? Please include an explanation on how it would help you to secure employment.
    motivation_vocational_training: string | undefined
    // registration_questions/experienced_discrimination_jobs [select_one] 4.7 Have you experienced any discrimination when applying to jobs?
    experienced_discrimination_jobs: undefined | Option<'case_selected_cover_cost'>
    // registration_questions/experienced_discrimination_jobs_yes [select_one] 4.8 How would you describe this discrimination?
    experienced_discrimination_jobs_yes: undefined | Option<'experienced_discrimination_jobs_yes'>
    // registration_questions/experienced_discrimination_jobs_yes_other [text] 4.8.1 If "Other", please specify
    experienced_discrimination_jobs_yes_other: string | undefined
    // registration_questions/eligible_training_interest [text] 4.9 If eligible to enrol in the project, what training would have your interest?
    eligible_training_interest: string | undefined
    // registration_questions/registered_training_facility [select_one] 4.10 Are you aware of a registered/official training facility that is currently operating and could provide this training?
    registered_training_facility: undefined | Option<'case_selected_cover_cost'>
    // registration_questions/registered_training_facility_yes [text] 4.10.1 If yes, input the information of the training center here:
    registered_training_facility_yes: string | undefined
    // registration_questions/know_total_cost_training [select_one] 4.11 Do you know the total cost of the training you would like enroll in?
    know_total_cost_training: undefined | Option<'case_selected_cover_cost'>
    // registration_questions/know_total_cost_training_yes [integer] 4.11.1 If yes, please indicate the total tuition fee in UAH.
    know_total_cost_training_yes: number | undefined
    // registration_questions/case_selected_cover_cost [select_one] 4.12 In case you are selected and DRC offers to cover the cost of this training, are you able to cover any other expenses required to complete the course, such as transportation, or accommodation if far away from your place of residency?
    case_selected_cover_cost: undefined | Option<'case_selected_cover_cost'>
    // registration_questions/case_selected_cover_cost_no [text] 4.12.1 Please indicate the total cost of travel and/or accommodation in UAH to participate in the training.
    case_selected_cover_cost_no: string | undefined
    // fin_det/fin_det_res [text] 5.1 Are there any other comments or information you would like to share?
    fin_det_res: string | undefined
    // fin_det/source_hear_programme [select_one] 5.2 From what source did you hear about our programme?
    source_hear_programme: undefined | Option<'source_hear_programme'>
    // fin_det/source_hear_programme_other [text] 5.2.1 If "Other", please specify
    source_hear_programme_other: string | undefined
    // fin_det/tax_id [integer] 5.3 Potential beneficiary’s tax ID
    tax_id: number | undefined
    // cal_size_hh_v1 [calculate] undefined
    cal_size_hh_v1: string
    // cal_dis_chr_v2 [calculate] undefined
    cal_dis_chr_v2: string
    // cal_single_parent_children_v3 [calculate] undefined
    cal_single_parent_children_v3: string
    // cal_elderly_people_v4 [calculate] undefined
    cal_elderly_people_v4: string
    // cal_perg_woman_v5 [calculate] undefined
    cal_perg_woman_v5: string
    // cal_income_v9 [calculate] undefined
    cal_income_v9: string
    // cal_tot_vulnerability [calculate] undefined
    cal_tot_vulnerability: string
  }
  export const options = {
    undefined: {
      lwo: `Lviv (LWO)`,
      chj: `Chernihiv (CHJ)`,
      dnk: `Dnipro (DNK)`,
      hrk: `Kharkiv (HRK)`,
      nlv: `Mykloaiv (NLV)`,
      khe: `Kherson`,
      zap: `Zaporizia`,
      umy: `Sumy(UMY)`,
      dmytro_ivanov: `Dmytro Ivanov`,
      henadii_petrychenko: `Henadii Petrychenko`,
      nadiia_yudaieva: `Nadiia Yudaieva`,
      dmytro_tsaruk: `Dmytro Tsaruk`,
      viktoria_ushan: `Viktoria Ushan`,
      kostiantyn_yefimchuk: `Kostiantyn Yefimchuk`,
      viktoriia_lytvynova: `Viktoriia Lytvynova`,
      valerii_vietrov: `Valerii Vietrov`,
      daria_kokalia: `Daria Kokalia`,
      artem_chernukha_1: `Artem Chernukha`,
      lwo_ex1: `Extra 1`,
      lwo_ex2: `Extra 2`,
      nataliia_lanina: `Nataliia Lanina`,
      nikita_zubenko: `Nikita Zubenko`,
      mykola_marchenko: `Mykola Marchenko`,
      olena_suhoniak: `Olena Suhoniak`,
      oleksii_marchenko: `Oleksii Marchenko`,
      svitlana_labunska: `Svitlana Labunska`,
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
      umy_ex1: `Extra 1`,
      umy_ex2: `Extra 2`,
      umy_ex3: `Extra 3`,
      umy_ex4: `Extra 4`,
      ukr000348_bha: `BHA (UKR-000348)`,
      ukr000355_danish_mofa: `Danish MOFA (UKR-000355)`,
      prot: `A = Protection`,
      legal: `B = Legal`,
      shelter: `C = Shelter`,
      yes: `A = Yes`,
      no_had_no_need_to_use_this_coping_strategy: `No, had no need to use this coping strategy`,
      no_have_already_exhausted_this_coping_strategy_and_cannot_use_it_again: `No, have already exhausted this coping strategy and cannot use it again`,
      not_applicable_this_coping_strategy_is_not_available_to_me: `Not applicable / This coping strategy is not available to me`,
      prefer_not_to_answer: `Prefer not to answer`,
      to_access_or_pay_for_food: `To access or pay for food`,
      to_access_or_pay_for_healthcare: `To access or pay for healthcare`,
      to_access_or_pay_for_shelter: `To access or pay for shelter`,
      to_access_or_pay_for_education: `To access or pay for education`,
      other: `Other`,
      dont_know: `Don't know`,
      hay: `Hay`,
      concentrated_feed: `Concentrated feed`,
      mineral_blocks: `Mineral blocks`,
      wheat_seeds: `Wheat seeds`,
      barley_seeds: `Barley seeds`,
      bricks: `Bricks`,
      wood: `Wood`,
      plywood: `Plywood`,
      metal_panel: `Metal panel`,
      roof_panel: `Roof Panel`,
      cement: `Cement`,
      nails: `Nails`,
      driving_cars: `Driving cars and busses (category B, C, and E)`,
      tractor_operator: `Tractor operator`,
      digital_marketing: `Digital marketing and sales`,
      cosmetology: `Cosmetology`,
      it_system_engineering: `IT/System Engineering`,
      hairdressing: `Hairdressing/barbering`,
      electrician: `Electrician (house/building wiring)`,
      plumbing: `Plumbing`,
      sewing: `Sewing/tailoring`,
      cooking: `Cooking (chef or pastry chef)`,
      plasterer: `Plasterer`,
      graphic_design: `Graphic design`,
      horticulture: `Horticulture (fruit and vegetable growing)`,
      on: `On-the job training`,
      off: `Off-site training`,
      remote_learning: `Remote learning`,
      no: `B = No`,
      maybe: `C = Maybe`,
      income_requirement: `Income requirement`,
      childcare_obligations: `Childcare obligations`,
      inability_transportation: `Inability to afford transportation to training center`,
      no_transportation: `No transportation available to training center`,
      legal_barrier: `Legal or administrative barriers`,
      recognition_qualifications: `Recognition of qualifications`,
      location_preference: `Location preference`,
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
      raiff_trans: `A = Remittance Raiffaisen AVAL`,
      ukrpost: `B = Ukrposhta`,
      bank_card: `C = Bank card`,
    },
    case_selected_cover_cost: {
      yes: `A = Yes`,
      no: `B = No`,
    },
    you_currently_employed_no: {
      '0_3_mounths': `0-3 months`,
      '3_6_mounths': `3-6 months`,
      '6_12_mounths': `6-12 months`,
      '12_more_mounths': `12+ months`,
    },
    alternative_sources_income_yes: {
      social_security: `Social security and government assistance`,
      pension: `Pension`,
      support_relatives: `Support from relatives`,
      investment: `Investment`,
      self_employment: `Self-employment`,
      remittances: `Remittances`,
      alimony_and: `Alimony and child support`,
      capital_gains: `Capital gains`,
      gifts_inheritance: `Gifts/inheritance`,
      other: `Other`,
    },
    training_activities_support_yes_paid: {
      state_service: `State Service`,
      non_international: `Non-Governmental Organisation [international]`,
      non_national: `Non-Governmental Organisation [national]`,
      private_actor: `Private Sector Actor`,
    },
    main_barriers_individuals: {
      business_close: `Business close/scale-down in my area`,
      mismatch_skills: `Mismatch between my skills and skills demanded by employers`,
      transportation_employment: `Transportation to employment`,
      pay_rate: `Pay rate`,
      working_conditions: `Working conditions/hours`,
      access_training: `Access to training or nature of training opportunities`,
      difficulties_employment: `Difficulties with employment centers`,
      household_childcare: `Household responsibilities such as childcare`,
      risk_losing_income: `Inability to risk losing income during training period`,
      discrimination: `Discrimination`,
      other: `Other`,
    },
    experienced_discrimination_jobs_yes: {
      displacement_status: `Due to displacement status`,
      gender: `Due to gender`,
      disability: `Due to disability`,
      other: `Other`,
    },
    ben_det_res_stat: {
      idp: `A = Internally Displaced Person (IDP)`,
      long_res: `B = Long - Term Resident`,
      ret: `C = Returnee`,
      ref_asy: `D = Refugee/asylum seeker`,
      other: `E = Other`,
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
    source_hear_programme: {
      drc_staff: `DRC staff`,
      local_authorities: `Local authorities`,
      employment_centre: `Employment centre`,
      other: `Other`,
    },
    ben_det_prev_oblast: {
      dnipropetrovska: `Dnipropetrovska`,
      khersonska: `Khersonska`,
      mykolaivska: `Mykolaivska`,
      zaporizka: `Zaporizka`,
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
      beneficiarys_age: _.beneficiarys_age ? +_.beneficiarys_age : undefined,
      ben_det_ph_number: _.ben_det_ph_number ? +_.ben_det_ph_number : undefined,
      ben_det_hh_size: _.ben_det_hh_size ? +_.ben_det_hh_size : undefined,
      hh_char_hh_det: _['hh_char_hh_det']?.map(extractQuestionName).map((_: any) => {
        _['hh_char_hh_det_age'] = _.hh_char_hh_det_age ? +_.hh_char_hh_det_age : undefined
        _['hh_char_hh_det_dis_select'] = _.hh_char_hh_det_dis_select?.split(' ')
        return _
      }),
      numb_hh_char_preg: _.numb_hh_char_preg ? +_.numb_hh_char_preg : undefined,
      income_job_month: _.income_job_month ? +_.income_job_month : undefined,
      alternative_sources_income_yes: _.alternative_sources_income_yes?.split(' '),
      ben_det_income: _.ben_det_income ? +_.ben_det_income : undefined,
      main_barriers_individuals: _.main_barriers_individuals?.split(' '),
      know_total_cost_training_yes: _.know_total_cost_training_yes ? +_.know_total_cost_training_yes : undefined,
      tax_id: _.tax_id ? +_.tax_id : undefined,
    }) as T
}
