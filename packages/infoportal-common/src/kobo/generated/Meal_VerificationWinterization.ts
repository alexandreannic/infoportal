export namespace Meal_verificationWinterization {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: aAWVLi8bSb2S8bHc5CcL8i
  export interface T {
    start: string
    end: string
    // background/back_office [select_one] 1.1 Select Office
    back_office: undefined | Option<'back_office'>
    // background/back_enum [text] 1.2 Enumerator
    back_enum: string | undefined
    // background/back_donor [select_one] 1.3 Project
    back_donor: undefined | Option<'back_donor'>
    // background/back_prog_type [select_multiple] 1.4 Programme Type
    back_prog_type: undefined | Option<'back_prog_type'>[]
    // background/reg_drc [select_one] 1.5 Where you registered by DRC for a cash transfer for livelihoods?
    reg_drc: undefined | Option<'back_consent'>
    // background/back_consent [select_one] 1.6.1 Consent
    back_consent: undefined | Option<'back_consent'>
    // background/back_consen_no_reas [text] 1.6.2 Can you please give the reason for why you do not wish to consent to the questionnaire?
    back_consen_no_reas: string | undefined
    // background/pay_det_tax_id_num [text] 1.7 What is your individual tax number?
    pay_det_tax_id_num: string | undefined
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
    // ben_det/ben_det_raion [select_one] 2.5.2 Select raion where registration is taking place
    ben_det_raion: undefined | string
    // ben_det/ben_det_hromada [select_one] 2.5.3 Select hromada where registration is taking place
    ben_det_hromada: undefined | string
    // ben_det/ben_det_settlement [select_one_from_file] 2.5.4 Select settlement where registration is taking place
    ben_det_settlement: string
    // ben_det/ben_det_res_stat [select_one] 2.5.5 Select residential status
    ben_det_res_stat: undefined | Option<'ben_det_res_stat'>
    // ben_det/ben_det_prev_oblast [select_one] 2.5.6 What is your area of origin prior to displacement? (Select Oblast)
    ben_det_prev_oblast: undefined | Option<'ben_det_prev_oblast'>
    // ben_det/ben_det_income [integer] 2.6 What was the total value in UAH of all the resources your household received in the last one month?
    ben_det_income: number | undefined
    // ben_det/ben_det_hh_size [integer] 2.7 Indicate the total number of people in your household, including the HHH
    ben_det_hh_size: number | undefined
    // casf_utilities_fuel/current_gov_assist_cff [select_one] Are you currently receiving Government financial assistance to cover your fuel/utilities payment needs?
    current_gov_assist_cff: undefined | Option<'current_gov_assist_cff'>
    // casf_utilities_fuel/utilities_fuel [select_one] This year, is your primary source of heating from mains utilities (e.g. Piped gas, electric, community heating) or solid fuel (Wood, pellets, charcoal, coal etc)
    utilities_fuel: undefined | Option<'utilities_fuel'>
    // casf_utilities_fuel/mains_utilities [select_multiple] What is your main source of heating from mains utilities?
    mains_utilities: undefined | Option<'mains_utilities'>[]
    // casf_utilities_fuel/mains_utilities_other [text] If "Other", please specify
    mains_utilities_other: string | undefined
    // casf_utilities_fuel/mains_fuel [select_multiple] What is your primary source of solid fuel heating?
    mains_fuel: undefined | Option<'mains_fuel'>[]
    // casf_utilities_fuel/mains_fuel_other [text] If "Other", please specify
    mains_fuel_other: string | undefined
    // casf_utilities_fuel/functioning_fuel_delivery [select_one] Is there a functioning fuel delivery/supplier in your area?
    functioning_fuel_delivery: undefined | Option<'functioning_fuel_delivery'>
    // fin_det/fin_det_res [text] 4.1 Other Comments from Respondent
    fin_det_res: string | undefined
    // fin_det/fin_det_enum [text] 4.2 Other Comments from Enumerator
    fin_det_enum: string | undefined
    // fin_det/fin_det_oth_doc_im [image] 4.3 Please take picture of any other relevant document
    fin_det_oth_doc_im: string
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
    undefined: {
      oleksandr_havrylov: `Oleksandr Havrylov`,
      ievgen_kylymenniy: `Ievgen Kylymenniy`,
      oleksandr_shmunk: `Oleksandr Shmunk`,
      inna_kovalchuk: `Inna Kovalchuk`,
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
      polina_prusakova: `Polina Prusakova`,
      nlv_ex1: `Extra 1`,
      nlv_ex2: `Extra 2`,
      oleh_vyshnevskyi: `Oleh Vyshevskyi`,
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
      dnk_ex1: `Extra 1`,
      dnk_ex2: `Extra 2`,
      yurii_volkov: `Yurii Volkov`,
      andrii_zagoruiev: `Andrii Zagoruiev`,
      olena_sydorenko: `Olena Sydorenko`,
      svitlana_smyrnova: `Svitlana Smyrnova`,
      tetiana_konovshii: `Tetiana Konovshii`,
      bohdan_taranushchenko: `Bohdan Taranushchenko`,
      hrk_ex1: `Extra 1`,
      hrk_ex2: `Extra 2`,
      dmytro_chernukha: `Chernukha Dmytro`,
      anastasiia_reshynska: `Anastasiia Reshynska`,
      nataliia_pushenko: `Pushenko Nataliia`,
      tetiana_gorbatiuk: `Gorbatiuk Tetiana`,
      oleksandr_lukomets: `Oleksandr Lukomets`,
      katerina_severin: `Katerina Severin`,
      maksim_sedun: `Maksim Sedun`,
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
      umy_ex1: `Extra 1`,
      umy_ex2: `Extra 2`,
      umy_ex3: `Extra 3`,
      umy_ex4: `Extra 4`,
      prot: `A = Protection`,
      legal: `B = Legal`,
      shelter: `C = Shelter`,
      yes: `Yes`,
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
      male: `A = Male`,
      female: `B = Female`,
      single: `A = Single (Never Married)`,
      dom_part: `B = Not Married but Living in Domestic Partnership`,
      married: `C = Married`,
      div_sep: `D = Divorced/Seperated`,
      widow: `E = Widowed`,
      abandoned: `F = Abandoned`,
      diff_see: `A = Have difficulty seeing, even if wearing glasses`,
      diff_hear: `B = Have difficulty hearing, even if using a hearing aid`,
      diff_walk: `C = Have difficulty walking or climbing steps`,
      diff_rem: `D = Have difficulty remembering or concentrating`,
      diff_care: `E = Have difficulty with self-care such as washing all over or dressing`,
      diff_comm: `F = Have difficulty communicating, for example understanding or being understood`,
      diff_none: `G = None of the above apply`,
      zero: `A = No, no difficulty`,
      one: `B = Yes, some difficulty`,
      two: `C = Yes, a lot of difficulty`,
      fri: `D = Cannot do at all`,
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
      other_pay: `D = Other Payment Method`,
      none_pay: `E = None of the above fit my needs`,
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
      seeds: `Seeds`,
      fertilizers: `Fertilizers`,
      irrigationp: `Irrigation pipes (drop lines)`,
      fuel: `Fuel (for agricultural machinery)`,
      agriculser: `Agricultural services (tractor service, harvesting)`,
      livestock: `Livestock (chickens, pigs, cows etc)`,
      agricultool: `Agricultural tools (shovel, rake etc)`,
      livestockf: `Livestock feed`,
      buildingm: `Building materials,`,
    },
    back_donor: {
      uhf6: `UHF-6`,
      uhf7: `UHF-7`,
    },
    back_prog_type: {
      cfu: `Cash for Utilities`,
      csf: `Cash for Fuel`,
    },
    back_consent: {
      yes: `A = Yes`,
      no: `B = No`,
    },
    mains_utilities: {
      electric: `Electric`,
      gas: `Gas`,
      cohs: `Community heating system`,
      other: `Other`,
    },
    mains_fuel: {
      wood: `Wood`,
      coal: `Coal`,
      charcoal: `Charcoal`,
      pellets: `Pellets`,
      ofmf: `Oil fed or multi fuel boiler`,
      other: `Other`,
    },
    functioning_fuel_delivery: {
      yes: `A = Yes`,
      no: `B = No`,
      dk: `C = Don’t know`,
    },
    current_gov_assist_cff: {
      yes: `Yes`,
      yes_but: `Yes but not sufficient to cover needs`,
      no: `No`,
    },
    utilities_fuel: {
      utilities: `A = Mains utilities`,
      fuel: `B = Solid Fuel`,
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
      back_prog_type: _.back_prog_type?.split(' '),
      ben_det_ph_number: _.ben_det_ph_number ? +_.ben_det_ph_number : undefined,
      ben_det_income: _.ben_det_income ? +_.ben_det_income : undefined,
      ben_det_hh_size: _.ben_det_hh_size ? +_.ben_det_hh_size : undefined,
      mains_utilities: _.mains_utilities?.split(' '),
      mains_fuel: _.mains_fuel?.split(' '),
    }) as T
}
