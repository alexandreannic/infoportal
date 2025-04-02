export namespace Shelter_cashForShelter {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: aQgRrYdwHuvWbj23LpywPF
  export interface T {
    start: string
    end: string
    // general_information/back_office [select_one] Select Office
    back_office: undefined | Option<'back_office'>
    // general_information/name_enum [select_one] Name of enumerator
    name_enum: undefined | Option<'name_enum'>
    // general_information/donor [select_one] Select Donor
    donor: undefined | Option<'donor'>
    // general_information/info [note] INFO: Introduction to DRC:
    info: string
    // general_information/infokdrc [note] DRC is a Danish non-governmental humanitarian organization and that currently implements a project providing shelter support to households with damaged shelters. DRC will determine whether you are eligible for this support, which is the form of cash for repairs.
    infokdrc: string
    // general_information/giu [select_one] Do you consent to participate in this program?
    giu: undefined | Option<'pay_det_tax_exempt'>
    // general_information/transport_materials_people [select_one] Are you able to purchase and transport materials to your house or have access to people who can support you?
    transport_materials_people: undefined | Option<'pay_det_tax_exempt'>
    // general_information/repair_people_support [select_one] Are you able to repair your home by yourself or have access to people who can support you?
    repair_people_support: undefined | Option<'pay_det_tax_exempt'>
    // general_information/level_damage_house [select_one] Can you tell me the level of damage to your house indicated in the Act of Survey?
    level_damage_house: undefined | Option<'level_damage_house'>
    cal_level: string
    // si/ben_det_oblast [select_one] Select oblast
    ben_det_oblast: undefined | Option<'ben_det_oblast'>
    // si/ben_det_raion [select_one] Select raion
    ben_det_raion: undefined | string
    // si/ben_det_hromada [select_one] Select hromada
    ben_det_hromada: undefined | string
    // si/ben_det_settlement [select_one_from_file] Settlement
    ben_det_settlement: string
    // si/sils [text] Street
    sils: string | undefined
    // si/siln [text] Number of building
    siln: string | undefined
    // si/sig [geopoint] GPS coordinates
    sig: string
    // si/siha [select_one] Is it a house or an apartment?
    siha: undefined | Option<'siha'>
    // si/sihan [text] Specify the apartment number
    sihan: string | undefined
    // si/sihaf [integer] Specify the apartment floor
    sihaf: number | undefined
    // si/shelter_damage [select_multiple] How was the shelter damaged?
    shelter_damage: undefined | Option<'shelter_damage'>[]
    // si/sid [select_one] Damage sustained by the property by flooding
    sid: undefined | Option<'sid'>
    // si/shelter_damage_window [integer] What is the number of broken/ damaged windows?
    shelter_damage_window: number | undefined
    // si/shelter_damage_window_area [decimal] What is the area of total broken/ damaged windows (m2)?
    shelter_damage_window_area: number | undefined
    // si/shelter_damage_doors [integer] What is the number of broken/ damaged doors?
    shelter_damage_doors: number | undefined
    // si/shelter_damage_doors_external [integer] What is the number of broken/ damaged external doors?
    shelter_damage_doors_external: number | undefined
    // si/shelter_damage_doors_internal [integer] What is the number of broken/ damaged internal doors?
    shelter_damage_doors_internal: number | undefined
    // si/shelter_damage_roof [decimal] Estimation of the area of damaged roof (m2)?
    shelter_damage_roof: number | undefined
    // si/shelter_damage_slope [decimal] What is the number of broken/ damaged slope (lm)?
    shelter_damage_slope: number | undefined
    // si/shelter_damage_walls [decimal] Estimation of the area of damaged walls (m3)?
    shelter_damage_walls: number | undefined
    // si/shelter_damage_image1 [image] Pictures of damages
    shelter_damage_image1: string
    // si/shelter_damage_image2 [image] Pictures of damages
    shelter_damage_image2: string
    // si/shelter_damage_image3 [image] Pictures of damages
    shelter_damage_image3: string
    // si/shelter_damage_image4 [image] Pictures of damages
    shelter_damage_image4: string
    // si/shelter_damage_image5 [image] Pictures of damages
    shelter_damage_image5: string
    // si/shelter_damage_image6 [image] Pictures of damages
    shelter_damage_image6: string
    // si/shelter_damage_image7 [image] Pictures of damages
    shelter_damage_image7: string
    // si/shelter_damage_image8 [image] Pictures of damages
    shelter_damage_image8: string
    // si/sis [select_one] Are you still living inside your house/apartment?
    sis: undefined | Option<'bigp'>
    // si/sisl [select_one] Where are you living?
    sisl: undefined | Option<'sisl'>
    // si/sislo [text] Other – please specify
    sislo: string | undefined
    // si/sisp [select_one] Do you plan to return to your house?
    sisp: undefined | Option<'bigp'>
    // bi/bis [text] What is your surname(as shown in personal ID)?
    bis: string | undefined
    // bi/bif [text] What is your first name (as shown in personal ID)?
    bif: string | undefined
    // bi/bip [text] What is your patronymic name(as shown in personal ID)?
    bip: string | undefined
    // bi/bin [integer] What is your phone number?
    bin: number | undefined
    // bi/hh_char_hhh [select_one] Are you the head of household AND/OR able to speak on behalf of the household?
    hh_char_hhh: undefined | Option<'pay_det_tax_exempt'>
    // bi/hh_char_res_gender [select_one] What is your gender?
    hh_char_res_gender: undefined | Option<'hh_char_hh_det_gender'>
    // bi/hh_char_res_age [integer] What is your age?
    hh_char_res_age: number | undefined
    // bi/ben_det_hh_size [integer] How many people live in this house (yourself included)?
    ben_det_hh_size: number | undefined
    // bi/hh_char_hh_det [begin_repeat] HH Members
    hh_char_hh_det:
      | {
          hh_char_hh_det_gender: undefined | Option<'hh_char_hh_det_gender'> | undefined
          hh_char_hh_det_age: number | undefined | undefined
          calc_u18: string | undefined
          calc_o60: string | undefined
          calc_ed_age: string | undefined
          calc_preg: string | undefined
          calc_female_60_i: string | undefined
          calc_male_60_i: string | undefined
        }[]
      | undefined
    // bi/hh_char_hhh_care_child [select_one] Do you take care of the child/children yourself?
    hh_char_hhh_care_child: undefined | Option<'pay_det_tax_exempt'>
    // bi/bigp [select_one] Do you give permission to contact you in the future for any additional questions?
    bigp: undefined | Option<'bigp'>
    // pay/pay_det_pass_num [text] Number of ID
    pay_det_pass_num: string | undefined
    // pay/pay_det_id_ph [image] Take a photo of the ID
    pay_det_id_ph: string
    // pay/pay_det_tax_id_yn [select_one] Do you have an individual tax number (TIN)?
    pay_det_tax_id_yn: undefined | Option<'pay_det_tax_exempt'>
    // pay/pay_det_tax_id_num [text] What is your individual tax number?
    pay_det_tax_id_num: string | undefined
    // pay/pay_det_tax_id_ph [image] Take a photo of the Tax ID
    pay_det_tax_id_ph: string
    // pay/pay_det_tax_exempt [select_one] Do you have a tax exemptions?
    pay_det_tax_exempt: undefined | Option<'pay_det_tax_exempt'>
    // pay/pay_det_tax_exempt_im [image] Take a photo of the proof of the tax of exemptions
    pay_det_tax_exempt_im: string
    // pay/pay_det_pay_meth [select_one] What is your preferred payment method?
    pay_det_pay_meth: undefined | Option<'pay_det_pay_meth'>
    // pay/pay_det_rai_meth [image] Take photo of the registration in the passport
    pay_det_rai_meth: string
    // pay/pay_det_iban [text] What is your IBAN number?
    pay_det_iban: string | undefined
    // pay/pay_det_iban_im [image] Take a picture of IBAN number if available
    pay_det_iban_im: string
    // pay/pay_det_add_im [image] Take a picture of the address page of passport
    pay_det_add_im: string
    // pay/pay_det_pay_meth_none [text] Can you highlight the main reason that none of these payment methods are suitable to you?
    pay_det_pay_meth_none: string | undefined
    // end_001 [note] Thank you for your time today, we have no further questions
    end_001: string
  }
  export const options = {
    back_office: {
      umy: `Sumy (UMY)`,
      cej: `Chernihiv (CEJ)`,
      dnk: `Dnipro (DNK)`,
      hrk: `Kharkiv (HRK)`,
      nlv: `Mykolaiv (NLV)`,
    },
    name_enum: {
      '1': `1`,
      '2': `2`,
      maksym_mordovets: `Maksym Mordovets`,
      kateryna_garnaga: `Kateryna Garnaga`,
      dmytro_petrusevych: `Dmytro Petrusevych`,
      oleksand_plyushch: `Oleksandr Plyushch`,
      igor_rebenko: `Igor Rebenko`,
      alexander_malakhov: `Alexander Malakhov`,
      andriy_khimchenko: `Andriy Khimchenko`,
      liudmyla_shubina: `Liudmyla Shubina`,
      anna_potapenko: `Anna Potapenko`,
      oleksandr_chikunov: `Oleksandr Chikunov`,
      valerii_necheporenko: `Valerii Necheporenko`,
      andrii_stovpchenko: `Andrii Stovpchenko`,
      oleksandr_honcharov: `Oleksandr Honcharov`,
      viktoriia_stepanenko: `Viktoriia Stepanenko`,
      mykola_zemliuk: `Mykola Zemliuk`,
      yaroslav_bilyk: `Yaroslav Bilyk`,
      valeriy_shapovalov: `Valeriy Shapovalov`,
      oleh_hryshchenko: `Oleh Hryshchenko`,
      ex1: `extra1`,
      ex2: `extra2`,
      ext1: `extra1`,
      ext2: `extra2`,
      klym_oleksandr: `Oleksandr Klym`,
      yevhenii_vasiukov: `Yevhenii Vasiukov`,
      anna_demianenko: `Anna Demianenko`,
      taras_dubenko: `Taras Dubenko`,
      ievgen_kylymenniy: `Ievgen Kylymenniy`,
      oleksandr_shmunk: `Oleksandr Shmunk`,
      polina_prusakova: `Polina Prusakova`,
      inna_kovalchuk: `Inna Kovalchuk`,
      oksana_shevchenko: `Oksana Shevchenko`,
      yuliia_van: `Yuliia Van-Fun-Fu`,
      serhii_yanukovych: `Serhii Yanukovych`,
      serhii_krasnoselskyi: `Serhii Krasnoselskyi`,
    },
    donor: {
      '270_pooled_funds': `Pooled Funds (UKR-000270)`,
      '298_novo_nordisk': `Novo-Nordisk (UKR-000298)`,
      '308_unhcr': `UNHCR (UKR-000308)`,
      '314_uhf4': `UHF4 (UKR-000314)`,
      '322_echo': `ECHO2 (UKR-000322)`,
      '336_uhf6': `UHF6 (UKR-000336)`,
      '345_bha': `BHA2 (UKR-000345)`,
    },
    pay_det_tax_exempt: {
      yes: `Yes`,
      no: `No`,
    },
    level_damage_house: {
      one: `I`,
      two: `II`,
      free: `III`,
      idk: `I don’t know`,
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
    siha: {
      ho: `House`,
      ap: `Apartment`,
    },
    shelter_damage: {
      flda: `Flood damage`,
      wada: `War damage`,
    },
    sid: {
      '01m': `0 to 1 meter flood`,
      '12m': `1 to 2 meter flood`,
      m2: `more than 2 meters flood`,
      uu: `Unable/unwilling to answer`,
    },
    bigp: {
      yes: `Yes`,
      no: `No`,
      uu: `Unable/unwilling to answer`,
    },
    sisl: {
      lcc: `Collective center`,
      lwf: `With friends or family`,
      lpa: `Paid accommodation (hotel, rented apartment, etc)`,
      lih: `I have nowhere to stay (state of homelessness)`,
      oth: `Other`,
    },
    hh_char_hh_det_gender: {
      male: `A = Male`,
      female: `B = Female`,
    },
    pay_det_pay_meth: {
      pr: `Remittance Raiffaisen AVAL`,
      ukrpost: `Ukrposhta`,
      bank_card: `Bank card`,
      none_pay: `None of the above fit my needs`,
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
      sihaf: _.sihaf ? +_.sihaf : undefined,
      shelter_damage: _.shelter_damage?.split(' '),
      shelter_damage_window: _.shelter_damage_window ? +_.shelter_damage_window : undefined,
      shelter_damage_doors: _.shelter_damage_doors ? +_.shelter_damage_doors : undefined,
      shelter_damage_doors_external: _.shelter_damage_doors_external ? +_.shelter_damage_doors_external : undefined,
      shelter_damage_doors_internal: _.shelter_damage_doors_internal ? +_.shelter_damage_doors_internal : undefined,
      bin: _.bin ? +_.bin : undefined,
      hh_char_res_age: _.hh_char_res_age ? +_.hh_char_res_age : undefined,
      ben_det_hh_size: _.ben_det_hh_size ? +_.ben_det_hh_size : undefined,
      hh_char_hh_det: _['hh_char_hh_det']?.map(extractQuestionName).map((_: any) => {
        _['hh_char_hh_det_age'] = _.hh_char_hh_det_age ? +_.hh_char_hh_det_age : undefined
        return _
      }),
    }) as T
}
