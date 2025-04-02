export namespace Protection_gbv {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: a5Noq6Wf9a8aE2cmi74FyS
  export interface T {
    start: string
    end: string
    // introduction/date [date] Date of activity
    date: Date | undefined
    // introduction/staff_to_insert_their_DRC_office [select_one] DRC office
    staff_to_insert_their_DRC_office: undefined | Option<'staff_to_insert_their_DRC_office'>
    // introduction/staff_code [select_one] Staff code (facilitator 1)
    staff_code: undefined | Option<'extra_staff_code'>
    // introduction/staff_code_001 [select_one] Staff code (facilitator 2)
    staff_code_001: undefined | Option<'extra_staff_code'>
    // introduction/extra_staff_code [select_multiple] Additional staff codes
    extra_staff_code: undefined | Option<'extra_staff_code'>[]
    // introduction/project [select_one] Project code
    project: undefined | Option<'project'>
    // introduction/ben_det_oblast [select_one] Select oblast
    ben_det_oblast: undefined | Option<'ben_det_oblast'>
    // introduction/ben_det_raion [select_one] Select raion
    ben_det_raion: undefined | string
    // introduction/ben_det_hromada [select_one] Select hromada
    ben_det_hromada: undefined | string
    // introduction/ben_det_hromada_001 [select_one_from_file] Specify settlement/village/city neighborhood
    ben_det_hromada_001: string
    // introduction/location [select_one] Location
    location: undefined | Option<'location'>
    // introduction/location_other [text] If "Other", please specify
    location_other: string | undefined
    // gi/activity [select_multiple] Which activity have you conducted?
    activity: undefined | Option<'activity'>[]
    // gi/activity_other [text] If "Other", please specify
    activity_other: string | undefined
    // gi/basic [integer] Basic/Essential dignity kits
    basic: number | undefined
    // gi/elderly [integer] Elderly dignity kits
    elderly: number | undefined
    // gi/winter [integer] Winter dignity kits
    winter: number | undefined
    // gi/kit_other [integer] Other dignity kits
    kit_other: number | undefined
    // gi/kit_total [note] Total distributed kits
    kit_total: string
    // gi/distribute [select_one] Type of distribution
    distribute: undefined | Option<'distribute'>
    // gi/distributor [select_one] Who distributed the kits?
    distributor: undefined | Option<'distributor'>
    // gi/feedback [select_one] Any assessment/feedback done/collected on post distribution of kits?
    feedback: undefined | Option<'feedback'>
    // gi/new_ben [select_one] Are there new beneficiaries in the group activity?
    new_ben: undefined | Option<'new_ben'>
    // gi/new_ben_yes [integer] If yes there are new beneficairies, how many new beneficiaries in the session?
    new_ben_yes: number | undefined
    // gi/numb_part [integer] Number of participants
    numb_part: number | undefined
    // gi/hh_char_hh_det [begin_repeat] Participant
    hh_char_hh_det:
      | {
          hh_char_hh_new_ben: undefined | Option<'hh_char_hh_new_ben'> | undefined
          hh_char_hh_det_gender: undefined | Option<'hh_char_hh_det_gender'> | undefined
          hh_char_hh_det_age: number | undefined | undefined
          hh_char_hh_det_status: undefined | Option<'hh_char_hh_det_status'> | undefined
        }[]
      | undefined
    // gi/topic_activity [text] Topic/Type of activity
    topic_activity: string | undefined
    // gi/comments [text] Comments
    comments: string | undefined
  }
  export const options = {
    staff_to_insert_their_DRC_office: {
      chernihiv: `Chernihiv`,
      dnipro: `Dnipro`,
      kharkiv: `Kharkiv`,
      mykolaiv: `Mykolaiv`,
    },
    new_ben: {
      yes: `Yes`,
      no: `No`,
      bno: `Both new and old beneficiaries`,
    },
    extra_staff_code: {
      CEJ001: `CEJ-A`,
      CEJ002: `CEJ-B`,
      CEJ003: `CEJ-C`,
      CEJ004: `CEJ-D`,
      CEJ005: `CEJ-E`,
      CEJ006: `CEJ-F`,
      CEJ007: `CEJ-G`,
      CEJ008: `CEJ-H`,
      CEJ009: `CEJ-I`,
      CEJ010: `CEJ-J`,
      CEJ011: `CEJ-K`,
      CEJ012: `CEJ-L`,
      HRK001: `HRK-A`,
      HRK002: `HRK-B`,
      HRK003: `HRK-C`,
      HRK004: `HRK-D`,
      HRK005: `HRK-E`,
      HRK006: `HRK-F`,
      HRK007: `HRK-G`,
      HRK008: `HRK-H`,
      HRK009: `HRK-I`,
      HRK010: `HRK-J`,
      HRK011: `HRK-K`,
      HRK012: `HRK- L`,
      DNK001: `DNK-A`,
      DNK002: `DNK-B`,
      DNK003: `DNK-C`,
      DNK004: `DNK-D`,
      DNK005: `DNK-E`,
      DNK006: `DNK-F`,
      DNK007: `DNK-G`,
      DNK008: `DNK-H`,
      DNK009: `DNK-I`,
      DNK010: `DNK-J`,
      DNK011: `DNK-K`,
      DNK012: `DNK- L`,
      NVL001: `NLV-A`,
      NVL002: `NLV-B`,
      NVL003: `NLV-C`,
      NVL004: `NLV-D`,
      NVL005: `NLV-E`,
      NVL006: `NLV-F`,
      NVL007: `NLV-G`,
      NVL008: `NLV-H`,
      NVL009: `NLV-I`,
      NVL010: `NLV-J`,
      NVL011: `NLV-K`,
      NVL012: `NLV-L`,
    },
    project: {
      '284_bha': `UKR-000284 (BHA)`,
      sdc: `UKR-000330 (SDC)`,
      bha: `UKR-000345 (BHA)`,
      danida: `UKR-000347 (Danida)`,
      '355_dfma': `UKR-000355 (DFMA)`,
      uhf8: `UKR-000363 (UHF VIII)`,
      ukr000372_echo3: `UKR-000372 (ECHO)`,
      ukr000386_pooled_funds: `UKR-000386 (Pooled Funds)`,
    },
    location: {
      wgssd: `Women and Girls Safe Space (operated by DRC)`,
      wgsso: `Women and Girls Safe Space (operated by another organisation)`,
      logow: `Governmental collective site`,
      lopri: `Private collective site`,
      locso: `CSO/CBO premises`,
      lohum: `Humanitarian hub`,
      sash: `Safe shelter`,
      crro: `Crisis room`,
      dace: `Day centre`,
      locom: `Community space`,
      loedu: `Educational facility`,
      rehu: `Resilience hub`,
      gobu: `Government building/space`,
      online: `Online`,
      other: `Other`,
    },
    hh_char_hh_det_gender: {
      male: `Male`,
      female: `Female`,
      other: `Other`,
      unspecified: `Unspecified`,
    },
    activity: {
      awareness_raising: `GBV awareness raising, risk mitigation and dissemination of life-saving information on GBV services and referrals`,
      psychosocial_support: `Psychosocial support services (mobile and static) for GBV survivors and those at-risk (individual and group)- including Girl Shine`,
      education_sessions: `Recreational and livelihood skills including vocational education sessions in women and girls safe space`,
      training_actors: `Training of Humanitarian Actors on GBV Risk Prevention and Mitigation`,
      training_providers: `Training of GBV Service Providers to Meet GBViE Minimum Standards`,
      dignity_kits: `Distribution of dignity kits`,
      other: `Other`,
    },
    distribute: {
      convoy: `Via convoys`,
      static: `Through static centers`,
      mobile: `Through mobile teams or door-to-door`,
    },
    distributor: {
      report: `Employees/staff/volunteers of the reporting organization`,
      implement: `Employees/staff/volunteers of the implementing organization`,
      volunteer: `Community volunteers`,
      authority: `Local authority`,
    },
    feedback: {
      no: `No assessments planned/done`,
      planned: `An assessment is planned or ongoing`,
      drafted: `Assessment completed – report currently being drafted/finalized`,
      ready: `Assessment completed – report is ready (please share with GBV AoR team)`,
    },
    hh_char_hh_new_ben: {
      yes: `Yes`,
      no: `No`,
    },
    hh_char_hh_det_status: {
      idp: `IDP`,
      returnee: `Returnee`,
      'non-displaced': `Non-displaced`,
      unspec: `Unspecified`,
      other: `Other`,
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
      date: _.date ? new Date(_.date) : undefined,
      extra_staff_code: _.extra_staff_code?.split(' '),
      activity: _.activity?.split(' '),
      basic: _.basic ? +_.basic : undefined,
      elderly: _.elderly ? +_.elderly : undefined,
      winter: _.winter ? +_.winter : undefined,
      kit_other: _.kit_other ? +_.kit_other : undefined,
      new_ben_yes: _.new_ben_yes ? +_.new_ben_yes : undefined,
      numb_part: _.numb_part ? +_.numb_part : undefined,
      hh_char_hh_det: _['hh_char_hh_det']?.map(extractQuestionName).map((_: any) => {
        _['hh_char_hh_det_age'] = _.hh_char_hh_det_age ? +_.hh_char_hh_det_age : undefined
        return _
      }),
    }) as T
}
