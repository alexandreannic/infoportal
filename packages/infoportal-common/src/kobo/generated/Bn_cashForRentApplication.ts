export namespace Bn_cashForRentApplication {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: aBupWbhtUmA7so3532tYLa
  export interface T {
    start: string
    end: string
    // disclaimer [note] Disclaimer:  With support from the European Union, Danish Refugee Council (DRC) will provide financial assistance to internally displaced people to rent safe and adequate housing. This programme is being implemented in the following regions:  Dnipropetrivska oblast: Zhovty Vody, Kryvyi Rih, Kamyanske, Pavlograd, and Novomoskovsk   Lvivska oblast: Lviv, Stryi and Drohobuch raions. Due to high level of interest, the deadline for applications from Lvivska oblast: Lviv, Stryi and Drohobych raions is 31 August 2023.  Applications received after this date will not be considered.  Other locations will not be considered at this time.  Financial assistance is provided for a period of 6 months and will be paid in two installments: the first installment (for the first three months) within one to two weeks after the application is approved (upon presenting a signed lease agreement), and the second installment (for the next three months) three months after the payment of the first installment. The approval of the second installment will be subject to the applicant meeting the following program criteria:  • DRC employees will be granted access to the leased accommodation.  • The applicant will be able to provide proof of rent payment (bank statement, payment receipt indicating the purpose of the payment, etc.).  Amount of financial support, per month: HH Size  1 - 3 - UAH 6,500                                 4 - UAH 7,000   5+ - UAH 8,500  Example of assistance calculation: A family of four can receive financial assistance for rent in the amount of 7,000 UAH x 3 months = 21,000 UAH (first payment), and 21,000 UAH (second payment).  The following groups are the primary target for cash for rent programme:  • Households which have been displaced from the settlements indicated according to Order of the Ministry of Reintegration of Temporary Occupied Territories of Ukraine dated December 22, 2022 No. 309, or from areas which are regularly under attack and located within 30km of the confrontation lines or border areas with Russia or Belarus. • Households whose home has been significantly damaged (i.e., the level of destruction does not allow living in the house) or destroyed by shelling or other disasters such as flood, wildfire etc., since February 24, 2022. • Newly displaced HH (less than 60 days)  In addition, the household selected must meet at least one of the income criteria outlined below:  • The Household is already renting an apartment but is struggling to meet their other basic needs due to low income, rising rent costs, or other vulnerability factors which may lead to eviction or resorting to negative coping strategies; • The Household has at least one source of income within the household, allowing to cover its basic household needs  • The Household is referred by the Protection team and assistance should be provided even if no known source of income, while referral and follow up is done by the Protection team to identify sustainable solutions  Filling out this application does not guarantee participation in the program. Each application will be considered individually, and a decision will be made on the further participation of the application in the program. The decision is final, and the Danish Refugee Council (DRC) reserves the right to reject any application.  All data collected on this form is for DRC's internal use and programmatic purposes and will be kept confidential. Please note that all questions marked with "*" are mandatory. All other questions are additional and may be omitted, at your discretion, if for any reason you do not wish to answer them.  Please note information shared via this form will be accessible to staff from the Danish Refugee Council, but will not be shared further.
    disclaimer: string
    // disclaimer_consent [select_one] Do you reach the criteria for this support?
    disclaimer_consent: undefined | Option<'mou6_ren_sup'>
    // ben_consent [select_one] Do you consent to the processing of your personal data?
    ben_consent: undefined | Option<'mou6_ren_sup'>
    // gi/ben_first_name [text] First name
    ben_first_name: string | undefined
    // gi/ben_first_patr [text] Patronymic name
    ben_first_patr: string | undefined
    // gi/ben_last_name [text] Last name
    ben_last_name: string | undefined
    // gi/ben_age [integer] Age
    ben_age: number | undefined
    // gi/ben_sex [select_one] Sex
    ben_sex: undefined | Option<'hh_char_hh_det_gender'>
    // gi/ben_head_household [select_one] Are you the head of the household?
    ben_head_household: undefined | Option<'mou6_ren_sup'>
    // gi/ben_number [integer] Your contact phone number
    ben_number: number | undefined
    // gi/ben_det_oblastgov [select_one] Specify the Oblast of residence
    ben_det_oblastgov: undefined | Option<'ben_det_oblastgov'>
    // gi/ben_det_raiongov [select_one] Specify the Rayon of residence
    ben_det_raiongov: undefined | Option<'ben_det_raiongov'>
    // gi/ben_det_hromadagov [select_one] Specify the Hromada of residence
    ben_det_hromadagov: undefined | Option<'ben_det_hromadagov'>
    // gi/ben_det_settlementgov [text] Specify the settlement of residence
    ben_det_settlementgov: string | undefined
    // gi/ben_det_type [select_one] Specify the type of housing in which you currently live
    ben_det_type: undefined | Option<'ben_det_type'>
    // gi/ben_det_type_oth [text] Other (please specify)
    ben_det_type_oth: string | undefined
    // gi/ben_det_displaced [select_one] Are you an internally displaced person?
    ben_det_displaced: undefined | Option<'mou6_ren_sup'>
    // gi/ben_det_oblast [select_one] Specify the Oblast from where you moved
    ben_det_oblast: undefined | Option<'ben_det_oblast'>
    // gi/ben_det_raion [select_one] Specify the Rayon from where you moved
    ben_det_raion: undefined | string
    // gi/ben_det_hromada [select_one] Specify the Hromada from where you moved
    ben_det_hromada: undefined | string
    // gi/ben_det_settlement [text] Specify the settlement from where you moved
    ben_det_settlement: string | undefined
    // gi/ben_when_moved [date] Enter the month and year when you moved
    ben_when_moved: Date | undefined
    // gi/ben_des_con [select_one] Was your house destroyed/damaged during the conflict
    ben_des_con: undefined | Option<'mou6_ren_sup'>
    // gi/ben_rent_apartment [select_one] Are you seeking to rent an apartment?
    ben_rent_apartment: undefined | Option<'mou6_ren_sup'>
    // gi/ben_rent_inden_poten [select_one] Have you already identified a potential apartment?
    ben_rent_inden_poten: undefined | Option<'mou6_ren_sup'>
    // gi/ben_renting_apartment [select_one] If you are renting an apartment or house, do you have an agreement with the landlord?
    ben_renting_apartment: undefined | Option<'mou6_ren_sup'>
    // gi/ben_renting_apartment_no [select_one] Are you able to sign an agreement?
    ben_renting_apartment_no: undefined | Option<'mou6_ren_sup'>
    // gi/ben_det_hh_size [integer] Indicate the total number of people in your household, including the HHH
    ben_det_hh_size: number | undefined
    // gi/hh_char_hh_det [begin_repeat] HH Members
    hh_char_hh_det:
      | {
          hh_char_hh_det_gender: undefined | Option<'hh_char_hh_det_gender'> | undefined
          hh_char_hh_det_age: number | undefined | undefined
        }[]
      | undefined
    // gi/ben_ren_sup [select_multiple] Describe why you are applying for rental support
    ben_ren_sup: undefined | Option<'ben_ren_sup'>[]
    // gi/ben_ren_sup_rsca [text] If selected, please provide more details
    ben_ren_sup_rsca: string | undefined
    // gi/ben_ren_sup_oth [text] Other (please specify)
    ben_ren_sup_oth: string | undefined
    // gi/ben_familys_income [select_multiple] Source of your family’s income
    ben_familys_income: undefined | Option<'ben_familys_income'>[]
    // gi/ben_ren_sup_oth [text] Other (please specify)
    ben_ren_sup_oth_001: string | undefined
    // gi/ben_total_income [integer] Your family's total monthly income
    ben_total_income: number | undefined
    // gi/indicate_any_family [select_one] Please indicate if any family members that you live with fall under any of these categories:
    indicate_any_family: undefined | Option<'indicate_any_family'>
    // gi/proof_payments [select_one] If provided with rental support, would you be able to provide monthly proof of payments?
    proof_payments: undefined | Option<'mou6_ren_sup'>
    // gi/proof_payments_no [text] Please explain
    proof_payments_no: string | undefined
    // gi/ren_sup_consent [select_one] If provided with rental support, a DRC staff member would request to visit prior to the second transfer. Do you consent?
    ren_sup_consent: undefined | Option<'mou6_ren_sup'>
    // gi/mou6_ren_sup [select_one] If provided with 6-months of rental support, do you anticipate being able to continue rental payments independently after the end of the program?
    mou6_ren_sup: undefined | Option<'mou6_ren_sup'>
    // gi/mou6_ren_sup_yes [text] Please provide more information
    mou6_ren_sup_yes: string | undefined
    // gi/comments [text] Please use the box below to share any further information about your application for shelter support
    comments: string | undefined
    // thanks [note] Thank you for your answers
    thanks: string
  }
  export const options = {
    mou6_ren_sup: {
      yes: `Yes`,
      no: `No`,
    },
    hh_char_hh_det_gender: {
      male: `Male`,
      female: `Female`,
      other: `Other`,
    },
    ben_det_type: {
      collective_center: `Collective center`,
      rented_apartment: `Rented apartment`,
      'rented_stand-alone_house': `Rented stand-alone house`,
      dormitory: `Dormitory`,
      'hotel/hostel': `Hotel/hostel`,
      other: `Other`,
    },
    ben_ren_sup: {
      rse: `I recently evacuated (60 days or less)`,
      rsca: `My current accommodation is not safe or appropriate`,
      rcri: `My rent is increasing`,
      rsrl: `Recent loss of job`,
      rsbn: `I am not able to cover my family’s basic needs`,
      rsid: `My basic expenses are increasing due to a disability or illness`,
      other: `Other`,
    },
    ben_familys_income: {
      salary: `Salary`,
      self_employed: `Self employed`,
      pension: `Pension`,
      state_allowances: `State allowances`,
      IDPsp: `IDP support payments`,
      other: `Other`,
    },
    indicate_any_family: {
      cpwd: `Person with disability`,
      ccdi: `Chronic disease`,
      cplw: `Pregnant or Lactating Woman`,
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
    ben_det_oblastgov: {
      dnipropetrovskag: `Dnipropetrovska`,
      lvivskag: `Lvivska`,
    },
    ben_det_raiongov: {
      kamianskyig: `Kamianskyi`,
      kryvorizkyig: `Kryvorizkyi`,
      novomoskovskyig: `Novomoskovskyi`,
      pavlohradskyig: `Pavlohradskyi`,
      drohobytskyig: `Drohobytskyi`,
      zolochivskyig: `Zolochivskyi`,
      lvivskyig: `Lvivskyi`,
      sambirskyig: `Sambirskyi`,
      stryiskyig: `Stryiskyi`,
      chervonohradskyig: `Chervonohradskyi`,
      yavorivskyig: `Yavorivskyi`,
    },
    ben_det_hromadagov: {
      apostolivskag: `Apostolivska`,
      belzkag: `Belzka`,
      bibrskag: `Bibrska`,
      biskovytskag: `Biskovytska`,
      bohdanivskag: `Bohdanivska`,
      borynskag: `Borynska`,
      boryslavskag: `Boryslavska`,
      bozhedarivskag: `Bozhedarivska`,
      brodivskag: `Brodivska`,
      buskag: `Buska`,
      cherkaska_2g: `Cherkaska`,
      chernechchynskag: `Chernechchynska`,
      chervonohradskag: `Chervonohradska`,
      davydivskag: `Davydivska`,
      devladivskag: `Devladivska`,
      dobromylskag: `Dobromylska`,
      'dobrosynsko-maherivskag': `Dobrosynsko-Maherivska`,
      dobrotvirskag: `Dobrotvirska`,
      drohobytskag: `Drohobytska`,
      hleiuvatskag: `Hleiuvatska`,
      hlynianskag: `Hlynianska`,
      hnizdychivskag: `Hnizdychivska`,
      horodotska_2g: `Horodotska`,
      'hrabovetsko-dulibivskag': `Hrabovetsko-Dulibivska`,
      hrechanopodivskag: `Hrechanopodivska`,
      hrushivska_2g: `Hrushivska`,
      hubynyskag: `Hubynyska`,
      'ivano-frankivska_3g': `Ivano-Frankivska`,
      'kamianka-buzkag': `Kamianka-Buzka`,
      kamianska_3g: `Kamianska`,
      karpivskag: `Karpivska`,
      khodorivskag: `Khodorivska`,
      khyrivskag: `Khyrivska`,
      komarnivskag: `Komarnivska`,
      kozivskag: `Kozivska`,
      krasnenskag: `Krasnenska`,
      krynychanskag: `Krynychanska`,
      kryvorizkag: `Kryvorizka`,
      kulykivska_2g: `Kulykivska`,
      lopatynskag: `Lopatynska`,
      lozuvatskag: `Lozuvatska`,
      lvivska_2g: `Lvivska`,
      lychkivskag: `Lychkivska`,
      lykhivskag: `Lykhivska`,
      mahdalynivskag: `Mahdalynivska`,
      medenytskag: `Medenytska`,
      mezhyritskag: `Mezhyritska`,
      morshynskag: `Morshynska`,
      mostyskag: `Mostyska`,
      murovanskag: `Murovanska`,
      mykolaivska_5g: `Mykolaivska`,
      novoiarychivskag: `Novoiarychivska`,
      novoiavorivskag: `Novoiavorivska`,
      novokalynivskag: `Novokalynivska`,
      novolativskag: `Novolativska`,
      novomoskovskag: `Novomoskovska`,
      novopilskag: `Novopilska`,
      novorozdilskag: `Novorozdilska`,
      nyvotrudivskag: `Nyvotrudivska`,
      obroshynskag: `Obroshynska`,
      pavlohradskag: `Pavlohradska`,
      peremyshlianskag: `Peremyshlianska`,
      pereshchepynskag: `Pereshchepynska`,
      piatykhatska_2g: `Piatykhatska`,
      pidberiztsivskag: `Pidberiztsivska`,
      pidkaminskag: `Pidkaminska`,
      pishchanska_2g: `Pishchanska`,
      pomorianskag: `Pomorianska`,
      pustomytivskag: `Pustomytivska`,
      radekhivskag: `Radekhivska`,
      ralivskag: `Ralivska`,
      'rava-ruskag': `Rava-Ruska`,
      rozvadivskag: `Rozvadivska`,
      rudkivskag: `Rudkivska`,
      saksahanskag: `Saksahanska`,
      sambirskag: `Sambirska`,
      shchyretskag: `Shchyretska`,
      shehynivskag: `Shehynivska`,
      shyrokivska_2g: `Shyrokivska`,
      skhidnytskag: `Skhidnytska`,
      skolivskag: `Skolivska`,
      slavskag: `Slavska`,
      sofiivskag: `Sofiivska`,
      sokalskag: `Sokalska`,
      sokilnytskag: `Sokilnytska`,
      solonkivskag: `Solonkivska`,
      starosambirskag: `Starosambirska`,
      strilkivskag: `Strilkivska`,
      stryiskag: `Stryiska`,
      sudovovyshnianskag: `Sudovovyshnianska`,
      ternivska_2g: `Ternivska`,
      troitskag: `Troitska`,
      trostianetskag: `Trostianetska`,
      truskavetskag: `Truskavetska`,
      turkivskag: `Turkivska`,
      vakulivskag: `Vakulivska`,
      velykoliubinskag: `Velykoliubinska`,
      velykomostivskag: `Velykomostivska`,
      verbkivskag: `Verbkivska`,
      verkhivtsivskag: `Verkhivtsivska`,
      verkhnodniprovskag: `Verkhnodniprovska`,
      vilnohirskag: `Vilnohirska`,
      vyshnivska_2g: `Vyshnivska`,
      yavorivskag: `Yavorivska`,
      yurivskag: `Yurivska`,
      zabolottsivskag: `Zabolottsivska`,
      zatyshnianskag: `Zatyshnianska`,
      zelenodolskag: `Zelenodolska`,
      zhovkivskag: `Zhovkivska`,
      zhovtanetskag: `Zhovtanetska`,
      zhovtovodskag: `Zhovtovodska`,
      zhuravnenskag: `Zhuravnenska`,
      zhydachivskag: `Zhydachivska`,
      zolochivska_3g: `Zolochivska`,
      zymnovodivskag: `Zymnovodivska`,
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
      ben_age: _.ben_age ? +_.ben_age : undefined,
      ben_number: _.ben_number ? +_.ben_number : undefined,
      ben_when_moved: _.ben_when_moved ? new Date(_.ben_when_moved) : undefined,
      ben_det_hh_size: _.ben_det_hh_size ? +_.ben_det_hh_size : undefined,
      hh_char_hh_det: _['hh_char_hh_det']?.map(extractQuestionName).map((_: any) => {
        _['hh_char_hh_det_age'] = _.hh_char_hh_det_age ? +_.hh_char_hh_det_age : undefined
        return _
      }),
      ben_ren_sup: _.ben_ren_sup?.split(' '),
      ben_familys_income: _.ben_familys_income?.split(' '),
      ben_total_income: _.ben_total_income ? +_.ben_total_income : undefined,
    }) as T
}
