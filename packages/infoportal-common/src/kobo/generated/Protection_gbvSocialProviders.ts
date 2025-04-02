export namespace Protection_gbvSocialProviders {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: aKrbJdapRxfdPgXb3KqzHd
  export interface T {
    start: string
    end: string
    // introduction [note] This is survey is being conducted by the Danish Refugee Council, an International NGO, working in Ukraine. The purpose of the survey is to understand the main training needs related to gender based violence, protection and psychosocial support of social service providers working in the Mykolaiv oblast. Participation in this survey is voluntary and confidential. You will not receive any benefit from participating in this discussion. However, the information that you give may be used to inform the humanitarian response. If at any time you wish to end your participation, or you wish to abstain from answering particular questions you are free to do so. The information you give will not be attributed to you, nor will DRC use your name in reporting.
    introduction: string
    // introduction/date [date] Date
    date: Date | undefined
    // introduction/position [select_one] What is your position?
    position: undefined | Option<'position'>
    // introduction/position_other [text] Other- please specify
    position_other: string | undefined
    // introduction/manage_supervise_staff [select_one] Do you line manage or supervise any staff?
    manage_supervise_staff: undefined | Option<'interested_training_families_gbv'>
    // introduction/department [select_one] What department do you work for?
    department: undefined | Option<'department'>
    // introduction/department_other [text] Other- please specify
    department_other: string | undefined
    // introduction/raion_mykolaiv_working [select_one] What raion in Mykolaiv are you working in?
    raion_mykolaiv_working: undefined | Option<'raion_mykolaiv_working'>
    // introduction/hromada_mykolaiv_working [select_multiple] What hromada are you working in?
    hromada_mykolaiv_working: undefined | Option<'hromada_mykolaiv_working'>[]
    // introduction/priority_training_needs [select_multiple] What are your priority training needs
    priority_training_needs: undefined | Option<'priority_training_needs'>[]
    // introduction/priority_training_needs_other [text] Other- please specify
    priority_training_needs_other: string | undefined
    // introduction/interested_training_families_gbv [select_one] Are you interested in a training on working with families at risk of GBV?
    interested_training_families_gbv: undefined | Option<'interested_training_families_gbv'>
    // introduction/interested_training_families_gbv_yes [select_multiple] What type of topics would be useful for this training ?
    interested_training_families_gbv_yes: undefined | Option<'interested_training_families_gbv_yes'>[]
    // introduction/interested_training_families_gbv_yes_other [text] Other- please specify
    interested_training_families_gbv_yes_other: string | undefined
    // introduction/training_model [select_one] Which training model do you prefer?
    training_model: undefined | Option<'training_model'>
    // introduction/preferred_modality_training [select_one] What is your preferred modality for training?
    preferred_modality_training: undefined | Option<'preferred_modality_training'>
    // introduction/preferred_modality_training_other [text] Other- please specify
    preferred_modality_training_other: string | undefined
    // introduction/consider_mental_health [select_one] Do you consider that is the mental health and psychosocial support is necessary among the people that you provide support to?
    consider_mental_health: undefined | Option<'consider_mental_health'>
    // introduction/part_responsibilities_psychosocial [select_one] Is part of your responsibilities is provide psychosocial support to people in need ?
    part_responsibilities_psychosocial: undefined | Option<'part_responsibilities_psychosocial'>
    // introduction/feel_overwhelmed_workload [select_one] Do you feel overwhelmed or stressed due to workload?
    feel_overwhelmed_workload: undefined | Option<'feel_overwhelmed_workload'>
  }
  export const options = {
    position: {
      social_worker_not_working_gbv: `Social Worker not directly working in GBV`,
      social_worker_working_gbv: `Social worker, who among other things, works in the field of GBV`,
      psychologist_not_working_gbv: `Psychologist not directly working with GBV`,
      psychologist_working_gbv: `Psychologist working with GBV`,
      social_service_management: `Social Service Management`,
      administrator: `Administrator`,
      other: `Other`,
    },
    interested_training_families_gbv: {
      yes: `Yes`,
      no: `No`,
      pna: `Prefer not to answer`,
    },
    department: {
      department_social_protection: `Department of Social Protection`,
      tsnap_mykolaiv: `TSNAP- Mykolaiv City Council`,
      cssfcy: `Centre of Social Services for Family, Children and Youth (CSSFCY)`,
      mobile_team: `Mobile Team at the level of oblast, raion, hromada, community, village (choose yours)`,
      department_social_protection_population: `Department of social protection of the population`,
      department_labour_social_protection: `Department of Labour and Social Protection`,
      social_policy_departmant: `Social Policy Department`,
      child_protection_services: `Child Protection Services (CPS)`,
      oblast_state_administration: `Oblast State Administration`,
      vilage_council: `The village council`,
      other: `Other`,
    },
    raion_mykolaiv_working: {
      bashtanskyi: `Bashtanskyi`,
      voznesenskyi: `Voznesenskyi`,
      mykolaivskyi: `Mykolaivskyi`,
      pervomaiskyi: `Pervomaiskyi`,
    },
    hromada_mykolaiv_working: {
      bashtanska: `Bashtanska`,
      bereznehuvatska: `Bereznehuvatska`,
      horokhivska: `Horokhivska`,
      inhulska: `Inhulska`,
      kazankivska: `Kazankivska`,
      novobuzka: `Novobuzka`,
      pryvilnenska: `Pryvilnenska`,
      shyrokivska_4: `Shyrokivska`,
      snihurivska: `Snihurivska`,
      sofiivska_2: `Sofiivska`,
      vilnozaporizka: `Vilnozaporizka`,
      volodymyrivska: `Volodymyrivska`,
      bratska_2: `Bratska`,
      buzka: `Buzka`,
      domanivska: `Domanivska`,
      doroshivska: `Doroshivska`,
      mostivska: `Mostivska`,
      novomarivska: `Novomarivska`,
      oleksandrivska_6: `Oleksandrivska`,
      prybuzhanivska: `Prybuzhanivska`,
      prybuzka: `Prybuzka`,
      veselynivska: `Veselynivska`,
      voznesenska_2: `Voznesenska`,
      yelanetska: `Yelanetska`,
      yuzhnoukrainska: `Yuzhnoukrainska`,
      berezanska_2: `Berezanska`,
      chornomorska_2: `Chornomorska`,
      halytsynivska: `Halytsynivska`,
      koblivska: `Koblivska`,
      kostiantynivska_3: `Kostiantynivska`,
      kutsurubska: `Kutsurubska`,
      'mishkovo-pohorilivska': `Mishkovo-Pohorilivska`,
      mykolaivska_6: `Mykolaivska`,
      nechaianska: `Nechaianska`,
      novoodeska: `Novoodeska`,
      ochakivska: `Ochakivska`,
      olshanska: `Olshanska`,
      pervomaiska_5: `Pervomaiska`,
      radsadivska: `Radsadivska`,
      shevchenkivska_3: `Shevchenkivska`,
      stepivska: `Stepivska`,
      sukhoielanetska: `Sukhoielanetska`,
      vesnianska: `Vesnianska`,
      voskresenska: `Voskresenska`,
      arbuzynska: `Arbuzynska`,
      blahodatnenska: `Blahodatnenska`,
      kamianomostivska: `Kamianomostivska`,
      kryvoozerska: `Kryvoozerska`,
      myhiivska: `Myhiivska`,
      pervomaiska_6: `Pervomaiska`,
      syniukhynobridska: `Syniukhynobridska`,
      vradiivska: `Vradiivska`,
    },
    priority_training_needs: {
      legal_support: `Legal support available for GBV survivors`,
      survivors_intimate_partner: `Working with people of intimate partner violence/domestic violence`,
      survivors_sexual_violence: `Working with people of sexual violence, including conflict related sexual violence`,
      legal_support_gbv: `Legal support available for GBV survivors`,
      working_adolescents_affected: `Working with adolescents affected by and at risk of GBV`,
      working_persons_disabilities: `Working with persons with persons with disabilities affected by and at risk of GBV`,
      working_older_women: `Working with older women affected by and at risk of GBV`,
      diverse_sexual_orientation: `GBV and survivors with persons with a diverse sexual orientation and gender identity`,
      working_male_survivors: `Working with male survivors of GBV`,
      supervision_skills_gbv: `Supervision skills for GBV case managers- training targeting staff in management positions`,
      protection_principles: `Protection principles`,
      working_older_people: `Working with older people at risk (including signs and symptoms of abuse and neglect of older persons and communicating with older people)`,
      facilitation: `Group facilitation skills`,
      Self_care_burn_out_prevention: `Self-care and burn-out prevention for GBV service providers`,
      psychosocial_support: `Psychosocial support and GBV survivors`,
      psychological_first_aid: `Psychological First Aid`,
      psychosocial_group_intervention: `Psychosocial group intervention to reduce distress and improve coping`,
      other: `Other`,
    },
    interested_training_families_gbv_yes: {
      ensuring_safety_women: `Ensuring the safety of women and girls in the prevention of GBV`,
      ensuring_women_safety: `Ensuring women's and children's safety when preventing GBV`,
      theory_prevent_violence_against_women: `Theory and practice on what works to prevent violence against women and girls`,
      guidance_engaging_men: `Guidance on engaging men in GBV prevention programming`,
      other: `Other`,
    },
    training_model: {
      inperson: `In-person`,
      online: `Online/remote`,
      hybrid: `Hybrid- mix of in-person and online.`,
    },
    preferred_modality_training: {
      ongoing: `Ongoing- e.g. one session every two weeks`,
      once_block: `Once off block, e.g. 5 day training`,
      other: `Other`,
    },
    consider_mental_health: {
      very_necessary: `Very necessary`,
      necessary: `Necessary`,
      not_necessary: `Not necessary`,
    },
    part_responsibilities_psychosocial: {
      yes: `Yes`,
      no: `No`,
    },
    feel_overwhelmed_workload: {
      always: `Always`,
      very_often: `Very Often`,
      sometimes: `Sometimes`,
      rarely: `Rarely`,
      never: `Never`,
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
      hromada_mykolaiv_working: _.hromada_mykolaiv_working?.split(' '),
      priority_training_needs: _.priority_training_needs?.split(' '),
      interested_training_families_gbv_yes: _.interested_training_families_gbv_yes?.split(' '),
    }) as T
}
