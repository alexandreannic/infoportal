export namespace Protection_groupSession {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]

  // Form id: a8Tn94arrSaH2FQBhUa9Zo
  export interface T {
    'start': string,
    'end': string,
    // introduction/date [date] Date
    'date': Date | undefined,
    // introduction/staff_to_insert_their_DRC_office [select_one] DRC office
    'staff_to_insert_their_DRC_office': undefined | Option<'staff_to_insert_their_DRC_office'>,
    // introduction/staff_code [select_one] Staff code (facilitator)
    'staff_code': undefined | Option<'staff_code_001'>,
    // introduction/staff_code_001 [select_one] Staff code (facilitator)
    'staff_code_001': undefined | Option<'staff_code_001'>,
    // introduction/project [select_one] Project code
    'project': undefined | Option<'project'>,
    // introduction/ben_det_oblast [select_one] Select oblast
    'ben_det_oblast': undefined | Option<'ben_det_oblast'>,
    // introduction/ben_det_raion [select_one] Select raion
    'ben_det_raion': undefined | string,
    // introduction/ben_det_hromada [select_one] Select hromada
    'ben_det_hromada': undefined | string,
    // introduction/ben_det_hromada_001 [select_one_from_file] Specify settlement/village/city neighborhood
    'ben_det_hromada_001': string,
    // introduction/location [select_one] Location
    'location': undefined | Option<'location'>,
    // introduction/location_other [text] If "Other", please specify
    'location_other': string | undefined,
    // gi/activity [select_one] Which topic was the group information session about?
    'activity': undefined | Option<'activity'>,
    // gi/activity_other [text] If "Other", please specify
    'activity_other': string | undefined,
    // gi/activity_topic [text] Precise topic
    'activity_topic': string | undefined,
    // gi/new_ben [select_one] Are they new beneficiaries?
    'new_ben': undefined | Option<'new_ben'>,
    // gi/new_ben_no [integer] If no new beneficiaries, session number
    'new_ben_no': number | undefined,
    // gi/numb_part [integer] Number of participants
    'numb_part': number | undefined,
    // gi/hh_char_hh_det [begin_repeat] Participant
    'hh_char_hh_det': {
      'hh_char_hh_det_gender': undefined | Option<'hh_char_hh_det_gender'> | undefined,
      'hh_char_hh_det_age': number | undefined | undefined,
      'hh_char_hh_det_status': undefined | Option<'hh_char_hh_det_status'> | undefined
    }[] | undefined,
    // gi/comments [text] Comments
    'comments': string | undefined,
  }

  export const options = {
    staff_to_insert_their_DRC_office: {
      'chernihiv': `Chernihiv`,
      'dnipro': `Dnipro`,
      'kharkiv': `Kharkiv`,
      'lviv': `Lviv`,
      'mykolaiv': `Mykolaiv`,
      'sumy': `Sumy`,
      'sloviansk': `Sloviansk`,
    },
    staff_code_001: {
      'CEJ001': `CEJ001`,
      'CEJ002': `CEJ002`,
      'CEJ003': `CEJ003`,
      'CEJ004': `CEJ004`,
      'CEJ005': `CEJ005`,
      'CEJ006': `CEJ006`,
      'CEJ007': `CEJ007`,
      'CEJ008': `CEJ008`,
      'CEJ009': `CEJ009`,
      'CEJ010': `CEJ010`,
      'CEJ011': `CEJ011`,
      'CEJ012': `CEJ012`,
      'CEJ013': `CEJ013`,
      'CEJ014': `CEJ014`,
      'CEJ015': `CEJ015`,
      'CEJ016': `CEJ016`,
      'CEJ017': `CEJ017`,
      'UMY001': `UMY001`,
      'UMY002': `UMY002`,
      'UMY003': `UMY003`,
      'UMY004': `UMY004`,
      'UMY005': `UMY005`,
      'UMY006': `UMY006`,
      'UMY007': `UMY007`,
      'UMY008': `UMY008`,
      'UMY009': `UMY009`,
      'UMY010': `UMY010`,
      'UMY011': `UMY011`,
      'UMY012': `UMY012`,
      'UMY013': `UMY013`,
      'UMY014': `UMY014`,
      'UMY015': `UMY015`,
      'UMY016': `UMY016`,
      'HRK001': `HRK001`,
      'HRK002': `HRK002`,
      'HRK003': `HRK003`,
      'HRK004': `HRK004`,
      'HRK005': `HRK005`,
      'HRK006': `HRK006`,
      'HRK007': `HRK007`,
      'HRK008': `HRK008`,
      'HRK009': `HRK009`,
      'HRK010': `HRK010`,
      'HRK011': `HRK011`,
      'HRK012': `HRK012`,
      'HRK013': `HRK013`,
      'HRK014': `HRK014`,
      'HRK015': `HRK015`,
      'HRK016': `HRK016`,
      'HRK017': `HRK017`,
      'HRK018': `HRK018`,
      'DNK001': `DNK001`,
      'DNK002': `DNK002`,
      'DNK003': `DNK003`,
      'DNK004': `DNK004`,
      'DNK005': `DNK005`,
      'DNK006': `DNK006`,
      'DNK007': `DNK007`,
      'DNK008': `DNK008`,
      'DNK009': `DNK009`,
      'DNK010': `DNK010`,
      'DNK011': `DNK011`,
      'DNK012': `DNK012`,
      'DNK013': `DNK013`,
      'DNK014': `DNK014`,
      'DNK015': `DNK015`,
      'DNK016': `DNK016`,
      'DNK017': `DNK017`,
      'DNK018': `DNK018`,
      'DNK019': `DNK019`,
      'DNK020': `DNK020`,
      'DNK021': `DNK021`,
      'DNK022': `DNK022`,
      'LWO001': `LWO001`,
      'LWO002': `LWO002`,
      'LWO003': `LWO003`,
      'LWO004': `LWO004`,
      'LWO005': `LWO005`,
      'LWO006': `LWO006`,
      'LWO007': `LWO007`,
      'LWO008': `LWO008`,
      'LWO009': `LWO009`,
      'LWO010': `LWO010`,
      'LWO011': `LWO011`,
      'LWO012': `LWO012`,
      'LWO013': `LWO013`,
      'LWO014': `LWO014`,
      'LWO015': `LWO015`,
      'NVL001': `NVL001`,
      'NVL002': `NVL002`,
      'NVL003': `NVL003`,
      'NVL004': `NVL004`,
      'NVL005': `NVL005`,
      'NVL006': `NVL006`,
      'NVL007': `NVL007`,
      'NVL008': `NVL008`,
      'NVL009': `NVL009`,
      'NVL010': `NVL010`,
      'NVL011': `NVL011`,
      'NVL012': `NVL012`,
      'NVL013': `NVL013`,
      'NVL014': `NVL014`,
      'NVL015': `NVL015`,
      'SLO001': `SLO001`,
      'SLO002': `SLO002`,
      'SLO003': `SLO003`,
      'SLO004': `SLO004`,
      'SLO005': `SLO005`,
      'SLO006': `SLO006`,
      'SLO007': `SLO007`,
      'SLO008': `SLO008`,
      'SLO009': `SLO009`,
      'SLO010': `SLO010`,
      'SLO011': `SLO011`,
      'SLO012': `SLO012`,
      'SLO013': `SLO013`,
      'SLO014': `SLO014`,
      'SLO015': `SLO015`,
      'SLO016': `SLO016`,
      'SLO017': `SLO017`,
      'SLO018': `SLO018`,
      'SLO019': `SLO019`,
      'SLO020': `SLO020`
    },
    project: {
      'bha': `UKR-000284 BHA`,
      'novo': `UKR-000298 Novo Nordisk`,
      'okf': `UKR-000309 OKF`,
      'uhf4': `UKR-000314 UHF IV`,
      'echo': `UKR-000322 ECHO`,
      'uhf6': `UKR-000336 UHF VI`,
      'uhf8': `UKR-000363 UHF8`,
      '372_echo': `UKR-000372 ECHO 3`
    },
    ben_det_oblast: {
      'cherkaska': `Cherkaska`,
      'chernihivska': `Chernihivska`,
      'chernivetska': `Chernivetska`,
      'dnipropetrovska': `Dnipropetrovska`,
      'donetska': `Donetska`,
      'ivano-frankivska': `Ivano-Frankivska`,
      'kharkivska': `Kharkivska`,
      'khersonska': `Khersonska`,
      'khmelnytska': `Khmelnytska`,
      'kirovohradska': `Kirovohradska`,
      'kyivska': `Kyivska`,
      'luhanska': `Luhanska`,
      'lvivska': `Lvivska`,
      'mykolaivska': `Mykolaivska`,
      'odeska': `Odeska`,
      'poltavska': `Poltavska`,
      'rivnenska': `Rivnenska`,
      'sevastopilska': `Sevastopilska`,
      'sumska': `Sumska`,
      'ternopilska': `Ternopilska`,
      'vinnytska': `Vinnytska`,
      'volynska': `Volynska`,
      'zakarpatska': `Zakarpatska`,
      'zaporizka': `Zaporizka`,
      'zhytomyrska': `Zhytomyrska`
    },
    location: {
      'logow': `Governmental collective site`,
      'lopri': `Private collective site`,
      'lohum': `Humanitarian hub`,
      'locso': `CSO/CBO premises`,
      'loloc': `Local authorities' premises`,
      'locom': `Community space`,
      'loedu': `Educational facility`,
      'lopub': `Public service building`,
      'loeres': `Resilience hubs`,
      'lodrc': `DRC WGSS`,
      'looth': `Other WGSS`,
      'other': `Other`
    },
    activity: {
      'gpt': `General protection topic`,
      'other': `Other`
    },
    new_ben: {
      'yes': `Yes`,
      'no': `No`
    },
    hh_char_hh_det_gender: {
      'male': `Male`,
      'female': `Female`,
      'other': `Other`,
      'unspecified': `Unspecified`
    },
    hh_char_hh_det_status: {
      'idp': `IDP`,
      'returnee': `Returnee`,
      'non-displaced': `Non-displaced`,
      'unspec': `Unspecified`,
      'other': `Other`
    }
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

  export const map = (_: Record<keyof T, any>): T => ({
    ..._,
    date: _.date ? new Date(_.date) : undefined,
    new_ben_no: _.new_ben_no ? +_.new_ben_no : undefined,
    numb_part: _.numb_part ? +_.numb_part : undefined,
    hh_char_hh_det: _['hh_char_hh_det']?.map(extractQuestionName).map((_: any) => {
      _['hh_char_hh_det_age'] = _.hh_char_hh_det_age ? +_.hh_char_hh_det_age : undefined
      return _
    }),
  }) as T
}