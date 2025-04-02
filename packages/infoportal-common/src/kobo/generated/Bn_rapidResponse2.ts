export namespace Bn_rapidResponse2 {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: adpuqZypnqHb8LNfX49iA5
  export interface T {
    start: string
    end: string
    // date [date] Date
    date: Date | undefined
    // background/back_un_id [note] Unique ID/Case Number
    back_un_id: string
    // background/back_office [select_one] Select Office
    back_office: undefined | Option<'back_office'>
    // background/back_enum [select_one] Enumerator
    back_enum: undefined | Option<'back_enum'>
    // background/back_prog_type [select_multiple] Programme Type
    back_prog_type: undefined | Option<'back_prog_type'>[]
    // background/back_refer_who [select_one] If this case is an internal DRC referral, from which department?
    back_refer_who: undefined | Option<'back_refer_who'>
    // background/back_consent [note] Consent
    back_consent: string
    // ben_det/ben_det_surname [text] What is your surname name (as shown in personal ID)?
    ben_det_surname: string | undefined
    // ben_det/ben_det_first_name [text] What is your first name (as shown in personal ID)?
    ben_det_first_name: string | undefined
    // ben_det/ben_det_pat_name [text] What is your patronymic name?
    ben_det_pat_name: string | undefined
    // ben_det/ben_det_ph_number [integer] What is your phone number?
    ben_det_ph_number: number | undefined
    // ben_det/ben_det_oblast [select_one] Select oblast where registration is taking place
    ben_det_oblast: undefined | Option<'ben_det_oblast'>
    // ben_det/ben_det_raion [select_one] Select raion where registration is taking place
    ben_det_raion: undefined | string
    // ben_det/ben_det_hromada [select_one] Select hromada where registration is taking place
    ben_det_hromada: undefined | string
    // ben_det/ben_det_settlement [select_one_from_file] Select settlement where registration is taking place
    ben_det_settlement: string
    // ben_det/ben_det_income [integer] What was the total value in UAH of all the resources your household received in the last one month?
    ben_det_income: number | undefined
    // ben_det/ben_det_hh_size [integer] Indicate the total number of people in your household, including the HHH
    ben_det_hh_size: number | undefined
    // hh_char/hh_char_hh_det [begin_repeat] Household members
    hh_char_hh_det:
      | {
          hh_char_hh_det_gender: undefined | Option<'hh_char_hh_det_gender'> | undefined
          hh_char_hh_det_age: number | undefined | undefined
          hh_char_hh_res_stat: undefined | Option<'hh_char_hh_res_stat'> | undefined
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
    // hh_char/calc_tot_chi [calculate] Sum of -18
    calc_tot_chi: string
    // hh_char/calc_tot_ed_age [calculate] Sum of 5-18
    calc_tot_ed_age: string
    // hh_char/calc_tot_eld [calculate] Sum of +59
    calc_tot_eld: string
    // hh_char/calc_dis_level [calculate] Sum of PwDs
    calc_dis_level: string
    // hh_char/calc_sum_preg [calculate] Sum of women of childbearing age
    calc_sum_preg: string
    // hh_char/hh_char_chh [note] This is a child headed household (high risk protection case), please refer immediately to a DRC Protection colleague and complete internal referral form.
    hh_char_chh: string
    // hh_char/pregnant_count [integer] How many females in the household are pregnant or lactating?
    pregnant_count: number | undefined
    // nfi/nfi_donor [select_one] Which donor for NFI
    nfi_donor: undefined | Option<'mpca_donor'>
    // nfi/nfi_eligibility_summary [note] Based on minimum standards this house is eligible for:
    nfi_eligibility_summary: string
    // nfi/nfi_fam_hy [note] Recommended quantity Family Hygiene Kit (HKMV)
    nfi_fam_hy: string
    // nfi/nfi_fam_nfi [note] Recommended quantity Family NFI Kit (NFKF + KS)
    nfi_fam_nfi: string
    // nfi/nfi_kit_disitrbuted [select_one] Did you distribute the NFI Kits at the point of registration
    nfi_kit_disitrbuted: undefined | Option<'shelter_safe_winter'>
    // nfi/nfi_dist_hkf [integer] Family Hygiene Kits (HKF)
    nfi_dist_hkf: number | undefined
    // nfi/nfi_dist_nfkf_ks [integer] Family NFI kits distributed (NFKF + KS)
    nfi_dist_nfkf_ks: number | undefined
    // nfi/nfi_kit_cc [integer] NFI Kit for Collective Center distributed
    nfi_kit_cc: number | undefined
    // nfi/nfi_bed [integer] Folding Beds distributed
    nfi_bed: number | undefined
    // nfi/nfi_fks [integer] Family kitchen set (FKS)
    nfi_fks: number | undefined
    // nfi/donor_nfi_fks [select_one] Donor Family kitchen set (FKS)
    donor_nfi_fks: undefined | Option<'mpca_donor'>
    // esk/esk_donor [select_one] Which donor for Emergency Shelter Kit
    esk_donor: undefined | Option<'mpca_donor'>
    // esk/esk_shelter_damage [select_one] Is there damage to your current shelter?
    esk_shelter_damage: undefined | Option<'esk_shelter_damage'>
    // esk/esk_note_heavy_damage [note] If there is heavy damage to this property, please refer to the shelter team immediately
    esk_note_heavy_damage: string
    // esk/esk_estimate_sqm_damage [integer] Can you estimate the square meter or roof or window that is damaged?
    esk_estimate_sqm_damage: number | undefined
    // esk/esk_eligibility_summary_esk [note] Based upon the answers above, the household is eligible for the following:
    esk_eligibility_summary_esk: string
    // esk/esk_note_eligible [note] Number of kits the household is eligible for
    esk_note_eligible: string
    // ass_inc/mpca_donor [select_one] Which donor for MPCA
    mpca_donor: undefined | Option<'mpca_donor'>
    // ass_inc/mpca_amount [note] The provisional calculated total benefit for this household (HH Size × UAH 3,600 × 3 Months) will be UAH <span style="color: red">Do not read this out to the household</span>
    mpca_amount: string
    // ass_inc/pay_consent [note] Ensure the interviewee agrees to provide their payment details before completing the form.
    pay_consent: string
    // ass_inc/pay_det_id_type [select_one] What form of ID do you have?
    pay_det_id_type: undefined | Option<'pay_det_id_type'>
    // ass_inc/pay_det_id_type_oth [text] What other form of ID do you have?
    pay_det_id_type_oth: string | undefined
    // ass_inc/pay_det_pass_ser [text] Input Passport Series
    pay_det_pass_ser: string | undefined
    // ass_inc/pay_det_pass_num [text] Number of ID
    pay_det_pass_num: string | undefined
    // ass_inc/pay_det_id_ph [image] Take a photo of the ID
    pay_det_id_ph: string
    // ass_inc/pay_det_tax_id_yn [select_one] Do you have an individual tax number (TIN)?
    pay_det_tax_id_yn: undefined | Option<'shelter_safe_winter'>
    // ass_inc/pay_det_tax_id_num [text] What is your individual tax number?
    pay_det_tax_id_num: string | undefined
    // ass_inc/pay_det_tax_id_ph [image] Take a photo of the Tax ID
    pay_det_tax_id_ph: string
    // ass_inc/pay_det_tax_exempt [select_one] Do you have a tax exemptions?
    pay_det_tax_exempt: undefined | Option<'shelter_safe_winter'>
    // ass_inc/pay_det_tax_exempt_im [image] Take a photo of the proof of the tax of exemptions
    pay_det_tax_exempt_im: string
    // ass_inc/pay_det_pay_meth [select_one] What is your preferred payment method?
    pay_det_pay_meth: undefined | Option<'pay_det_pay_meth'>
    // ass_inc/pay_det_iban [text] What is your IBAN number?
    pay_det_iban: string | undefined
    pay_det_iban_length: string
    // ass_inc/pay_det_iban_im [image] Take a picture of IBAN number if available
    pay_det_iban_im: string
    // ass_inc/pay_address [text] Your address
    pay_address: string | undefined
    // ass_inc/pay_zip [text] Your ZIP code
    pay_zip: string | undefined
    // ass_inc/pay_det_add_im [image] Take a picture of the address page of passport
    pay_det_add_im: string
    // ass_inc/pay_det_pay_meth_oth [text] What other Payment methods do you prefer?
    pay_det_pay_meth_oth: string | undefined
    // ass_inc/pay_det_pay_meth_none [text] Can you highlight the main reason that none of these payment methods are suitable to you?
    pay_det_pay_meth_none: string | undefined
    // mpca_bha_345/extent_basic_needs_bha345 [select_one] M02. To what extent is your household able to meet the basic needs of your HH according to your priorities?
    extent_basic_needs_bha345: undefined | Option<'extent_basic_needs_bha345'>
    // mpca_bha_345/basic_needs_unable_fulfill_bha345 [select_multiple] M02.1 Which basic needs is your household currently unable to fulfill?
    basic_needs_unable_fulfill_bha345: undefined | Option<'basic_needs_unable_fulfill_bha345'>[]
    // mpca_bha_345/basic_needs_unable_fulfill_other_bha345 [text] M02.1 Which basic needs is your household currently unable to fulfill, if other
    basic_needs_unable_fulfill_other_bha345: string | undefined
    // mpca_bha_345/basic_needs_unable_fully_reason_bha345 [select_multiple] M02.2 Why are you unable to fully meet this need?
    basic_needs_unable_fully_reason_bha345: undefined | Option<'basic_needs_unable_fully_reason_bha345'>[]
    // mpca_bha_345/basic_needs_unable_fully_reason_other_bha345 [text] M02.2 Why are you unable to fully meet this need, if other?
    basic_needs_unable_fully_reason_other_bha345: string | undefined
    // mpca_bha_345/items_basicevel_comfort_bha_345 [select_one] M11. Does your household currently have enough clothing, bedding, cooking supplies, fuel, lighting, and other items needed to provide a basic level of comfort?
    items_basicevel_comfort_bha_345: undefined | Option<'shelter_safe_winter'>
    // mpca_bha_345/items_basicevel_comfort_no_bha_345 [select_multiple] M11.1 If no, what items do you still feel you need?
    items_basicevel_comfort_no_bha_345: undefined | Option<'items_basicevel_comfort_no_bha_345'>[]
    // mpca_bha_345/items_basicevel_comfort_no_other_bha_345 [text] M11.1.1 If no, what other items do you still feel you need?
    items_basicevel_comfort_no_other_bha_345: string | undefined
    // mpca_bha_345/member_access_water_bha_345 [select_one] M12. Does your home have enough safe water for everyone in your household to drink, cook and wash?
    member_access_water_bha_345: undefined | Option<'shelter_safe_winter'>
    // esk_bha_345_m04/where_staying [select_one] M04. Where are you staying?
    where_staying: undefined | Option<'where_staying'>
    // esk_bha_345_m04/where_staying_other [text] M04.1 Where are you staying, if other?
    where_staying_other: string | undefined
    // esk_bha_345_m04/sufficientiving_spaces [select_one] M04.2 Do you have sufficient living spaces in your current shelters  (3.5 square meter per person)?
    sufficientiving_spaces: undefined | Option<'sufficientiving_spaces'>
    // esk_bha_345_m04/separate_space_girls [select_one] M04.3 Do you have separate space for Adolescent girls and pregnant and lactating women (PLWs) in side your house/shelters?
    separate_space_girls: undefined | Option<'separate_space_girls'>
    // esk_bha_345_m04/shelter_safe_winter [select_one] M04.4 Is your existing shelter/house is safe from winter, wind (health risks)?
    shelter_safe_winter: undefined | Option<'shelter_safe_winter'>
    // fin_det/fin_det_res [text] Other Comments from Respondent
    fin_det_res: string | undefined
    // fin_det/fin_det_enum [text] Other Comments from Enumerator
    fin_det_enum: string | undefined
    // fin_det/fin_det_oth_doc_im [image] Please take picture of any other relevant document
    fin_det_oth_doc_im: string
    // fin_det/additionals_photo1 [image] Additionals photos
    additionals_photo1: string
    // fin_det/additionals_photo2 [image] Additionals photos
    additionals_photo2: string
  }
  export const options = {
    back_office: {
      lwo: `Lviv (LWO)`,
      chj: `Chernihiv (CHJ)`,
      dnk: `Dnipro (DNK)`,
      hrk: `Kharkiv (HRK)`,
      nlv: `Mykloaiv (NLV)`,
      umy: `Sumy (UMY)`,
    },
    back_enum: {
      anna_artiukh: `Anna Artiukh`,
      vitalii_hrynenko: `Vitalii Hrynenko`,
      yevhenii_musiienko: `Yevhenii Musiienko`,
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
      ievgen_kylymenniy: `Ievgen Kylymenniy`,
      oleksandr_shmunk: `Oleksandr Shmunk`,
      inna_kovalchuk: `Inna Kovalchuk`,
      polina_prusakova: `Polina Prusakova`,
      mykyta_pokynboroda: `Mykyta Pokynboroda`,
      anna_pastushenko: `Anna Pastushenko`,
      nlv_ex1: `Extra 1`,
      nlv_ex2: `Extra 2`,
      serhii_dolzhenko: `Serhii Dolzhenko`,
      viktoria_klymenko: `Viktoria Klymenko`,
      karina_korzh: `Karina Korzh`,
      serhii_nevmyvaka: `Serhii Nevmyvaka`,
      olha_osmukha: `Olha Osmukha`,
      halyna_diachenko: `Halyna Diachenko`,
      mariia_kozachko: `Mariia Kozachko`,
      oleksandr_narsieiev: `Oleksandr Narsieiev`,
      dnk_ex1: `Enumerator 1`,
      dnk_ex2: `Enumerator 2`,
      dnk_ex3: `Enumerator 3`,
      dnk_ex4: `Enumerator 4`,
      yurii_volkov: `Yurii Volkov`,
      andrii_zagoruiev: `Andrii Zagoruiev`,
      olena_sydorenko: `Olena Sydorenko`,
      svitlana_smyrnova: `Svitlana Smyrnova`,
      tetiana_konovshii: `Tetiana Konovshii`,
      bohdan_taranushchenko: `Bohdan Taranushchenko`,
      nataliia_yermolova: `Nataliia Yermolova`,
      ivan_prokopkin: `Ivan Prokopkin`,
      nataliia_bykova: `Nataliia Bykova`,
      oleksii_pohorielov: `Oleksii Pohorielov`,
      hrk_ex1: `Extra 1`,
      hrk_ex2: `Extra 2`,
      dmytro_chernukha: `Dmytro Chernukha`,
      anastasiia_reshynska: `Anastasiia Reshynska`,
      nataliia_pushenko: `Nataliia Pushenko`,
      tetiana_gorbatiuk: `Tetiana Gorbatiuk`,
      oleksandr_lukomets: `Oleksandr Lukomets`,
      tetiana_kolot: `Tetiana Kolot`,
      katerina_severin: `Katerina Severin`,
      maksim_sedun: `Maksim Sedun`,
      ivan_volynkin: `Ivan Volynkin`,
      surzhyk_oleksandr: `Surzhyk Oleksandr`,
      chj_ex1: `Extra 1`,
      chj_ex2: `Extra 2`,
    },
    mpca_donor: {
      ukr000322_echo2: `UKR-000322 ECHO2`,
      ukr000372_echo3: `UKR-000372 ECHO3`,
      ukr000314_uhf4: `UKR-000314 UHF4`,
      ukr000345_bha2: `UKR-000345 BHA2`,
      ukr000360_novonordisk: `UKR-000360 Novo-Nordisk`,
      ukr000270_pooledfunds: `UKR-000270 Pooled Funds`,
      ukr000342_pooledfunds: `UKR-000342 Pooled Funds`,
      ukr000330_sdc2: `UKR-000330 SDC2`,
      ukr000380_danida: `UKR-000380 DANIDA`,
    },
    back_prog_type: {
      mpca: `MPCA`,
      esk: `Emergency Shelter Kit`,
      nfi: `NFI`,
    },
    shelter_safe_winter: {
      yes: `Yes`,
      no: `No`,
    },
    back_refer_who: {
      prot: `Protection`,
      legal: `Legal`,
      shelter: `Shelter`,
      ecrec: `EcRec`,
      eore: `EORE`,
      none: `None`,
    },
    sufficientiving_spaces: {
      yes: `Yes`,
      no: `No`,
      dk: `I don't know/No idea`,
    },
    separate_space_girls: {
      yes: `Yes`,
      no: `No`,
      not_applicable: `Not applicable as we don't have such members`,
    },
    ben_det_oblast: {
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
      idp_after_evacuation: `Internally Displaced Person after evacuation`,
      idp: `Internally Displaced Person (IDP)`,
      long_res: `Long - Term Resident`,
      ret: `Returnee`,
      ref_asy: `Refugee/asylum seeker`,
    },
    hh_char_hh_det_gender: {
      male: `Male`,
      female: `Female`,
    },
    undefined: {
      single: `Single (Never Married)`,
      dom_part: `Not Married but Living in Domestic Partnership`,
      married: `Married`,
      div_sep: `Divorced/Seperated`,
      widow: `Widowed`,
      abandoned: `Abandoned`,
      rent: `Find Rental Accommodation`,
      host: `Living with Friends/Family/Host`,
      own_prop: `Living in Own Property`,
      coll_cen: `Living in Collective Center`,
      homeless: `Homeless`,
      other_accom: `Other`,
      secure: `Secure for Medium/Long Term`,
      unable_pay: `Currently Unable to Pay Rent/Contribute to Collective Costs`,
      dan_unable_pay: `In Danger of Being Unable to Pay Rent/Contribute to Collective Costs`,
      unsuit_accom: `Accommodation Unsuitable for my needs`,
      eviction: `Eviction/Removal for Other Reasons`,
      remain: `Remain in Current Place`,
      not_sure: `Not Sure/Don’t Know`,
      always: `Always`,
      not_always: `Not always on but comes daily`,
      intermittent: `Comes on intermittent days`,
      rarely: `Rarely`,
      never: `Never`,
      thermal_comfort: `Thermal comfort`,
      fresh_air: `Fresh air`,
      protection_elements: `Protection from the elements`,
      privacy: `Privacy`,
      safety_health: `Safety and health`,
      drinking: `For drinking`,
      cooking: `For cooking`,
      washing: `For washing`,
      none: `None`,
    },
    hh_char_hh_det_dis_select: {
      diff_see: `Have difficulty seeing, even if wearing glasses`,
      diff_hear: `Have difficulty hearing, even if using a hearing aid`,
      diff_walk: `Have difficulty walking or climbing steps`,
      diff_rem: `Have difficulty remembering or concentrating`,
      diff_care: `Have difficulty with self-care such as washing all over or dressing`,
      diff_comm: `Have difficulty communicating, for example understanding or being understood`,
      diff_none: `None of the above apply`,
    },
    hh_char_hh_det_dis_level: {
      zero: `No, no difficulty`,
      one: `Yes, some difficulty`,
      two: `Yes, a lot of difficulty`,
      fri: `Cannot do at all`,
    },
    esk_shelter_damage: {
      no_damage: `No Structural Damage`,
      minor_damage: `Minor Damage (light or medium damages such as broken windows and doors, minor roof damage)`,
      heavy_damage: `Heavy Damage`,
    },
    pay_det_id_type: {
      nat_pass_card: `National Passport (card)`,
      nat_pass_book: `National Passport (book)`,
      nat_pass_diia: `National Passport (Diia app)`,
      pass_ussr_red: `Passport (USSR red book)`,
      pass_int: `Passport for international travel`,
      birth_certificate: `Birth certificate`,
      driver_lic: `Driver’s license`,
      pen_cert: `Pensioner certificate`,
      oth_id: `Other Form of ID`,
      no_id: `No ID`,
    },
    pay_det_pay_meth: {
      raiff_trans: `Remittance Raiffaisen AVAL`,
      ukrpost: `Ukrposhta`,
      bank_card: `Bank card`,
      other_pay: `Other Payment Method`,
      none_pay: `None of the above fit my needs`,
    },
    extent_basic_needs_bha345: {
      all: `All`,
      most: `Most`,
      about_half: `About half`,
      some: `Some(less than half)`,
      none: `None`,
    },
    basic_needs_unable_fulfill_bha345: {
      food_drink: `Food & drink`,
      rent: `Rent`,
      utilities: `Utilities`,
      clothes: `Clothes`,
      payment_mobile_communications: `Payment for mobile communications`,
      health_care: `Health Care`,
      education: `Education`,
      transportation: `Transportation`,
      debt_repayment: `Debt Repayment`,
      investment_productive_assets: `Investment in productive assets (agricultural inputs, seed capital business….)`,
      shelter_maintenance: `Shelter maintenance (repair work)`,
      protection: `Protection (legal or administrative services [passports, birth certificates…], psychosocial support, transportation to access services, specialized medical assistance)`,
      winter_items: `Winter items (blankets, winter clothes, fuel, wood…)`,
      evacuation_costs: `Evacuation costs`,
      savings: `Savings`,
      remittances: `Remittances`,
      hygiene_items: `Hygiene items`,
      household_items: `Household items (bedding, dishes, mattress, etc.)`,
      shoes: `Shoes`,
      alcoholic_drinks: `Alcoholic drinks`,
      tobacco_products: `Tobacco products`,
      other: `Other`,
    },
    basic_needs_unable_fully_reason_bha345: {
      insufficient_cash: `Insufficient cash resources`,
      lack_services: `Lack of goods/services`,
      lack_access_safety: `Lack of physical access related to safety`,
      other: `Other (specify)`,
    },
    items_basicevel_comfort_no_bha_345: {
      clothing: `Clothing`,
      bedding: `Bedding`,
      cooking_dining_utensils: `Cooking and dining utensils`,
      lighting: `Lighting`,
      fuel_heating: `Fuel/heating`,
      shoes: `Shoes`,
      other: `Other`,
    },
    where_staying: {
      collective_center: `At a collective/transit center`,
      hosted_friends: `I'm hosted by relatives or friends`,
      hosted_people_dk: `I'm hosted by people I didn’t know before`,
      renting_apartment: `I'm renting an apartment`,
      hotel_hostel: `I'm at hotel/hostel`,
      own_house: `I'm at my own house`,
      dh_housing_dk: `I don’t have housing yet - I don't know where I'll be living`,
      dorm: `In dorm`,
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
      back_prog_type: _.back_prog_type?.split(' '),
      ben_det_ph_number: _.ben_det_ph_number ? +_.ben_det_ph_number : undefined,
      ben_det_income: _.ben_det_income ? +_.ben_det_income : undefined,
      ben_det_hh_size: _.ben_det_hh_size ? +_.ben_det_hh_size : undefined,
      hh_char_hh_det: _['hh_char_hh_det']?.map(extractQuestionName).map((_: any) => {
        _['hh_char_hh_det_age'] = _.hh_char_hh_det_age ? +_.hh_char_hh_det_age : undefined
        _['hh_char_hh_det_dis_select'] = _.hh_char_hh_det_dis_select?.split(' ')
        return _
      }),
      pregnant_count: _.pregnant_count ? +_.pregnant_count : undefined,
      nfi_dist_hkf: _.nfi_dist_hkf ? +_.nfi_dist_hkf : undefined,
      nfi_dist_nfkf_ks: _.nfi_dist_nfkf_ks ? +_.nfi_dist_nfkf_ks : undefined,
      nfi_kit_cc: _.nfi_kit_cc ? +_.nfi_kit_cc : undefined,
      nfi_bed: _.nfi_bed ? +_.nfi_bed : undefined,
      nfi_fks: _.nfi_fks ? +_.nfi_fks : undefined,
      esk_estimate_sqm_damage: _.esk_estimate_sqm_damage ? +_.esk_estimate_sqm_damage : undefined,
      basic_needs_unable_fulfill_bha345: _.basic_needs_unable_fulfill_bha345?.split(' '),
      basic_needs_unable_fully_reason_bha345: _.basic_needs_unable_fully_reason_bha345?.split(' '),
      items_basicevel_comfort_no_bha_345: _.items_basicevel_comfort_no_bha_345?.split(' '),
    }) as T
}
