export namespace Protection_counselling {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: a2ck63vPA7hkk8aEhNTSUJ
  export interface T {
    start: string
    end: string
    // date [date] Date
    date: Date | undefined
    // general_information/staff_to_insert_their_DRC_office [select_one] DRC Office
    staff_to_insert_their_DRC_office: undefined | Option<'staff_to_insert_their_DRC_office'>
    // general_information/staff_code [select_one] Staff code
    staff_code: undefined | Option<'staff_code'>
    // general_information/project_code [select_one] Project Code
    project_code: undefined | Option<'project_code'>
    // general_information/modality [select_one] Modality
    modality: undefined | Option<'modality'>
    // general_information/consent [select_one] Consent
    consent: undefined | Option<'registered_person_disability'>
    // general_information/new_beneficiary [select_one] New Protection Counselling Beneficiary?
    new_beneficiary: undefined | Option<'registered_person_disability'>
    // general_information/not_new_beneficiary [select_one] If not a new beneficiary, is this:
    not_new_beneficiary: undefined | Option<'not_new_beneficiary'>
    // personal_data/age [integer] Age
    age: number | undefined
    // personal_data/gender [select_one] Gender
    gender: undefined | Option<'gender'>
    // personal_data/disp_status [select_one] Displacement Status
    disp_status: undefined | Option<'disp_status'>
    // personal_data/location [note] ####Location
    location: string
    // personal_data/ben_det_oblast [select_one] Oblast
    ben_det_oblast: undefined | Option<'ben_det_oblast'>
    // personal_data/ben_det_raion [select_one] Raion
    ben_det_raion: undefined | string
    // personal_data/ben_det_hromada [select_one] Hromada
    ben_det_hromada: undefined | string
    // personal_data/ben_det_hromada_001 [select_one_from_file] Settlement
    ben_det_hromada_001: string
    // personal_data/not_questions [note] The next questions ask about difficulties you may have doing certain activities because of a health problem.
    not_questions: string
    // personal_data/difficulty [select_one] Detail
    difficulty: undefined | Option<'difficulty_usual_language'>
    // personal_data/difficulty_seeing [select_one] Do you have difficulty seeing, even if wearing glasses?
    difficulty_seeing: undefined | Option<'difficulty_usual_language'>
    // personal_data/difficulty_hearing [select_one] Do you  have difficulty hearing, even if using a hearing aid?
    difficulty_hearing: undefined | Option<'difficulty_usual_language'>
    // personal_data/difficulty_walking [select_one] Do you  have difficulty walking or climbing steps?
    difficulty_walking: undefined | Option<'difficulty_usual_language'>
    // personal_data/difficulty_remembering [select_one] Do you have difficulty remembering or concentrating?
    difficulty_remembering: undefined | Option<'difficulty_usual_language'>
    // personal_data/difficulty_washing [select_one] Do you  have difficulty (with self-care such as) washing all over or dressing?
    difficulty_washing: undefined | Option<'difficulty_usual_language'>
    // personal_data/difficulty_usual_language [select_one] Using your usual (customary) language, do you have difficulty communicating, for example understanding or being understood by others?
    difficulty_usual_language: undefined | Option<'difficulty_usual_language'>
    // personal_data/disability_status [select_one] Disability Status (staff only):
    disability_status: undefined | Option<'registered_person_disability'>
    // personal_data/registered_person_disability [select_one] Are you registered as a person with disability with the Government of Ukraine?
    registered_person_disability: undefined | Option<'registered_person_disability'>
    // intake/background_needs/not_disscuss [note] ####What is it that you'd like to discuss or share with me?  Listen to the person’s situation and reasons for seeking assistance,  Make sure you facilitate the discussion by using active listening skills and healing statements.  Depending on what you are told adjust your follow-up questions.
    not_disscuss: string
    // intake/background_needs/discuss_notes [text] Notes:
    discuss_notes: string | undefined
    // intake/protection_risk/not_detail [note] Detail here if the person is at heightened risk as a result of experiencing (exposure to) a violation of their rights and/or disproportionate barriers to accessing services and support
    not_detail: string
    // intake/protection_risk/type_incident [select_multiple] Type Of Incident
    type_incident: undefined | Option<'type_incident'>[]
    // intake/protection_risk/sub_type_deprivation_life [select_one] Deprivation of life
    sub_type_deprivation_life: undefined | Option<'sub_type_deprivation_life'>
    // intake/protection_risk/sub_type_deprivation_life_comments [text] Comments
    sub_type_deprivation_life_comments: string | undefined
    // intake/protection_risk/sub_type_torture [select_one] Torture, physical and psychological violence
    sub_type_torture: undefined | Option<'sub_type_torture'>
    // intake/protection_risk/sub_type_torture_other [text] If "Other", please specify
    sub_type_torture_other: string | undefined
    // intake/protection_risk/sub_type_torture_comments [text] Comments
    sub_type_torture_comments: string | undefined
    // intake/protection_risk/sub_type_deprivation_liberty [select_one] Deprivation of Liberty
    sub_type_deprivation_liberty: undefined | Option<'sub_type_deprivation_liberty'>
    // intake/protection_risk/sub_type_deprivation_liberty_other [text] If "Other", please specify
    sub_type_deprivation_liberty_other: string | undefined
    // intake/protection_risk/sub_type_deprivation_liberty_comments [text] Comments
    sub_type_deprivation_liberty_comments: string | undefined
    // intake/protection_risk/sub_type_exploitation [select_one] Exploitation
    sub_type_exploitation: undefined | Option<'sub_type_exploitation'>
    // intake/protection_risk/sub_type_exploitation_other [text] If "Other", please specify
    sub_type_exploitation_other: string | undefined
    // intake/protection_risk/sub_type_exploitation_comments [text] Comments
    sub_type_exploitation_comments: string | undefined
    // intake/protection_risk/sub_type_unlawful_impediments [select_one] Unlawful impediments or Restrictions to Freedom of Movement and Forced Displacement
    sub_type_unlawful_impediments: undefined | Option<'sub_type_unlawful_impediments'>
    // intake/protection_risk/sub_type_unlawful_impediments_other [text] If "Other", please specify
    sub_type_unlawful_impediments_other: string | undefined
    // intake/protection_risk/sub_type_unlawful_impediments_comments [text] Comments
    sub_type_unlawful_impediments_comments: string | undefined
    // intake/protection_risk/sub_type_denial_land [select_one] Denial of Land & Property
    sub_type_denial_land: undefined | Option<'sub_type_denial_land'>
    // intake/protection_risk/sub_type_denial_land_other [text] If "Other", please specify
    sub_type_denial_land_other: string | undefined
    // intake/protection_risk/sub_type_denial_land_comments [text] Comments
    sub_type_denial_land_comments: string | undefined
    // intake/protection_risk/sub_type_impediments_access_legal [select_one] Impediments and/or restrictions to access legal identity, remedies and justice
    sub_type_impediments_access_legal: undefined | Option<'sub_type_impediments_access_legal'>
    // intake/protection_risk/sub_type_impediments_access_legal_other [text] If "Other", please specify
    sub_type_impediments_access_legal_other: string | undefined
    // intake/protection_risk/sub_type_impediments_access_legal_comments [text] Comments
    sub_type_impediments_access_legal_comments: string | undefined
    // intake/protection_risk/sub_type_discrimination_stigmatization [select_one] Discrimination and stigmatization, denial of resources, opportunities and services
    sub_type_discrimination_stigmatization: undefined | Option<'sub_type_discrimination_stigmatization'>
    // intake/protection_risk/sub_type_discrimination_stigmatization_other [text] If "Other", please specify
    sub_type_discrimination_stigmatization_other: string | undefined
    // intake/protection_risk/sub_type_discrimination_stigmatization_comments [text] Comments
    sub_type_discrimination_stigmatization_comments: string | undefined
    // intake/protection_risk/sub_type_denial_family_life [select_one] Denial of Family Life
    sub_type_denial_family_life: undefined | Option<'sub_type_denial_family_life'>
    // intake/protection_risk/sub_type_denial_family_life_other [text] If "Other", please specify
    sub_type_denial_family_life_other: string | undefined
    // intake/protection_risk/sub_type_denial_family_life_comments [text] Comments
    sub_type_denial_family_life_comments: string | undefined
    // intake/protection_risk/sub_type_other [text] If "Other", please specify
    sub_type_other: string | undefined
    // intake/protection_risk/incident_occurrence [select_one] Incident occurrence: Has/have the incident(s) already happened or is/are at risk of occurring?
    incident_occurrence: undefined | Option<'incident_occurrence'>
    // intake/protection_risk/incident_occurrence_explain [text] Explain:
    incident_occurrence_explain: string | undefined
    // intake/protection_risk/intake_notes [text] Notes:
    intake_notes: string | undefined
    // services_support/actions_taken [select_multiple] Actions Taken
    actions_taken: undefined | Option<'actions_taken'>[]
    // services_support/actions_taken_referral [select_one] Referral - using the referral form (upon informed consent)
    actions_taken_referral: undefined | Option<'actions_taken_referral'>
    // services_support/Provision_of_direct_assistance [select_one] Provision of direct assistance
    Provision_of_direct_assistance: undefined | Option<'Provision_of_direct_assistance'>
    // services_support/actions_taken_other [text] If "Other", please specify
    actions_taken_other: string | undefined
    // services_support/services_support_notes [text] Notes:
    services_support_notes: string | undefined
  }
  export const options = {
    staff_to_insert_their_DRC_office: {
      chernihiv: `Chernihiv`,
      dnipro: `Dnipro`,
      kharkiv: `Kharkiv`,
      lviv: `Lviv`,
      mykolaiv: `Mykolaiv`,
      sumy: `Sumy`,
    },
    staff_code: {
      CEJ001: `CEJ001`,
      CEJ002: `CEJ002`,
      CEJ003: `CEJ003`,
      CEJ004: `CEJ004`,
      CEJ005: `CEJ005`,
      CEJ006: `CEJ006`,
      CEJ007: `CEJ007`,
      CEJ008: `CEJ008`,
      CEJ009: `CEJ009`,
      CEJ010: `CEJ010`,
      CEJ011: `CEJ011`,
      CEJ012: `CEJ012`,
      CEJ013: `CEJ013`,
      CEJ014: `CEJ014`,
      CEJ015: `CEJ015`,
      CEJ016: `CEJ016`,
      CEJ_A: `CEJ-A`,
      CEJ_B: `CEJ-B`,
      CEJ_C: `CEJ-C`,
      CEJ_D: `CEJ-D`,
      UMY001: `UMY001`,
      UMY002: `UMY002`,
      UMY003: `UMY003`,
      UMY004: `UMY004`,
      UMY005: `UMY005`,
      UMY006: `UMY006`,
      UMY007: `UMY007`,
      UMY008: `UMY008`,
      UMY009: `UMY009`,
      UMY010: `UMY010`,
      UMY011: `UMY011`,
      UMY012: `UMY012`,
      UMY013: `UMY013`,
      UMY014: `UMY014`,
      UMY015: `UMY015`,
      HRK001: `HRK001`,
      HRK002: `HRK002`,
      HRK003: `HRK003`,
      HRK004: `HRK004`,
      HRK005: `HRK005`,
      HRK006: `HRK006`,
      HRK007: `HRK007`,
      HRK008: `HRK008`,
      HRK009: `HRK009`,
      HRK010: `HRK010`,
      HRK011: `HRK011`,
      HRK012: `HRK012`,
      HRK013: `HRK013`,
      HRK014: `HRK014`,
      HRK015: `HRK015`,
      HRK_A: `HRK-A`,
      HRK_B: `HRK-B`,
      HRK_C: `HRK-C`,
      HRK_D: `HRK-D`,
      HRK_E: `HRK-E`,
      HRK_F: `HRK-F`,
      DNK001: `DNK001`,
      DNK002: `DNK002`,
      DNK003: `DNK003`,
      DNK004: `DNK004`,
      DNK005: `DNK005`,
      DNK006: `DNK006`,
      DNK007: `DNK007`,
      DNK008: `DNK008`,
      DNK009: `DNK009`,
      DNK010: `DNK010`,
      DNK011: `DNK011`,
      DNK012: `DNK012`,
      DNK013: `DNK013`,
      DNK014: `DNK014`,
      DNK015: `DNK015`,
      DNK_A: `DNK-A`,
      DNK_B: `DNK-B`,
      DNK_C: `DNK-C`,
      DNK_D: `DNK-D`,
      LWO001: `LWO001`,
      LWO002: `LWO002`,
      LWO003: `LWO003`,
      LWO004: `LWO004`,
      LWO005: `LWO005`,
      LWO006: `LWO006`,
      LWO007: `LWO007`,
      LWO008: `LWO008`,
      LWO009: `LWO009`,
      LWO010: `LWO010`,
      LWO011: `LWO011`,
      LWO012: `LWO012`,
      LWO013: `LWO013`,
      LWO014: `LWO014`,
      LWO015: `LWO015`,
      NVL001: `NLV001`,
      NVL002: `NLV002`,
      NVL003: `NLV003`,
      NVL004: `NLV004`,
      NVL005: `NLV005`,
      NVL006: `NLV006`,
      NVL007: `NLV007`,
      NVL008: `NLV008`,
      NVL009: `NLV009`,
      NVL010: `NLV010`,
      NVL011: `NLV011`,
      NVL012: `NLV012`,
      NVL013: `NLV013`,
      NVL014: `NLV014`,
      NVL015: `NLV015`,
      NLV_A: `NLV-A`,
      NLV_B: `NLV-B`,
      NLV_C: `NLV-C`,
      NLV_D: `NLV-D`,
    },
    project_code: {
      '363_uhf8': `UKR-000363 UHF VIII`,
      na: `N/A`,
    },
    modality: {
      inperson: `In-person`,
      phone: `Via phone`,
    },
    registered_person_disability: {
      yes: `Yes`,
      no: `No`,
    },
    gender: {
      man: `Man`,
      woman: `Woman`,
      other: `Other`,
      pnd: `Prefers not to disclose`,
    },
    disp_status: {
      idp: `IDP`,
      idp_retuenee: `IDP Returnee`,
      refugee_returnee: `Refugee Returnee`,
      non_displaced: `Non-displaced`,
      refugee: `Refugee`,
      pnd: `Prefers not to disclose`,
    },
    not_new_beneficiary: {
      followup_session: `A follow-up protection counselling session`,
      different_topic: `A new session addressing a different topic`,
    },
    difficulty_usual_language: {
      no: `NO – no difficulty`,
      yes_some: `YES – some difficulty`,
      yes_lot: `YES – a lot of difficulty`,
      cannot_all: `Cannot do at all`,
    },
    type_incident: {
      deprivation_life: `Deprivation of life`,
      torture: `Torture, physical and psychological violence`,
      deprivation_liberty: `Deprivation of Liberty`,
      exploitation: `Exploitation`,
      unlawful_impediments: `Unlawful impediments or Restrictions to Freedom of Movement and Forced Displacement`,
      denial_land: `Denial of Land & Property`,
      impediments_access_legal: `Impediments and/or restrictions to access legal identity, remedies and justice`,
      discrimination_stigmatization: `Discrimination and stigmatization, denial of resources, opportunities and services`,
      denial_family_life: `Denial of Family Life`,
      other: `Other`,
      none: `None`,
    },
    sub_type_deprivation_life: {
      killing_summary_executions: `Killing / summary executions`,
    },
    sub_type_torture: {
      torture_treatment_punishment: `Torture, cruel, inhuman or degrading treatment or punishment`,
      physical_psychological_violence: `Physical and psychological violence including assault or abuse`,
      maiming: `Maiming`,
      other: `Other`,
    },
    sub_type_deprivation_liberty: {
      arbitrary_arrest: `Arbitrary arrest, detention`,
      abduction_kidnapping: `Abduction and kidnapping`,
      enforced_disappearance: `Enforced disappearance`,
      other: `Other`,
    },
    sub_type_exploitation: {
      extortion: `Extortion`,
      forced_recruitment: `Forced recruitment (adults)`,
      trafficking_persons: `Trafficking in Persons`,
      other: `Other`,
    },
    sub_type_unlawful_impediments: {
      refoulement_access_asylum: `Refoulement and Denial of access to asylum procedures`,
      arbitrary_restrictions_movement: `Arbitrary restrictions on movement`,
      forced_internal_displacement: `Forced internal displacement`,
      forced_return: `Forced return (IDP only)`,
      other: `Other`,
    },
    sub_type_denial_land: {
      forced_eviction: `Forced eviction`,
      destruction_personal_property: `Destruction of personal property`,
      theft: `Theft (unlawful deprivation of property)`,
      unlawful_occupation: `Unlawful occupation of land and/or property`,
      other: `Other`,
    },
    sub_type_impediments_access_legal: {
      denial_access_legal: `Denial of access to legal identity`,
      denial_access_remedies: `Denial of access to remedies and/or justice`,
      other: `Other`,
    },
    sub_type_discrimination_stigmatization: {
      discrimination_stigmatization: `Discrimination and/or Stigmatization`,
      denial_equal_opportunity: `Denial of equal opportunity, including resources and services`,
      other: `Other`,
    },
    sub_type_denial_family_life: {
      forced_family_separation: `Forced family separation`,
      other: `Other`,
    },
    incident_occurrence: {
      happened: `Happened`,
      risk: `At risk of`,
      both: `Both`,
    },
    actions_taken: {
      counselling: `Information Provision (Linking) - provision of individualized information on available services`,
      re_direction: `Re-direction – transfer of the person’s basic information to a service provider via phone (upon verbal informed consent)`,
      referral: `Referral - using the referral form (upon informed consent)`,
      accompaniment: `Accompaniment – extra assistance provided to ensure the individual can access the necessary service efficiently`,
      direct_assistance: `Provision of direct assistance`,
      followup_session_scheduled: `Follow-up session scheduled`,
      other: `Other`,
    },
    Provision_of_direct_assistance: {
      ipa: `IPA`,
      protection_case_management: `Protection Case Management`,
      other: `Other`,
    },
    actions_taken_referral: {
      internal_protection: `Internal referral to DRC protection`,
      internal_other: `Internal referral to DRC other sectors`,
      external_referral: `External referral`,
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
      age: _.age ? +_.age : undefined,
      type_incident: _.type_incident?.split(' '),
      actions_taken: _.actions_taken?.split(' '),
    }) as T
}
