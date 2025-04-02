export namespace Protection_pfa_training_test {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: a68LY3yZUXn6iTNvDCivtB
  export interface T {
    start: string
    end: string
    // date [date] Date:
    date: Date | undefined
    // unique_code [text] Unique code:
    unique_code: string | undefined
    // date_birthday [date] Your birthday date:
    date_birthday: Date | undefined
    // location [select_one] Location where the training was conducted:
    location: undefined | Option<'location'>
    // location_other [text] If "Other", please specify
    location_other: string | undefined
    // complete_training [select_one] Did you complete the training?
    complete_training: undefined | Option<'complete_training'>
    cal_pre_post: string
    // pfa/elements_define_pfa [select_multiple] What are the elements that define PFA?
    elements_define_pfa: undefined | Option<'elements_define_pfa'>[]
    // pfa/objectives_pfa [select_multiple] 1. What are the objectives of  PFA?
    objectives_pfa: undefined | Option<'objectives_pfa'>[]
    // pfa/everyone_stressful_situatuon [select_one] 2. Everyone that experience a stressful situatuon will need PFA.
    everyone_stressful_situatuon: undefined | Option<'pfa_counselling_psychotherapy'>
    // pfa/automatic_reactions_situation [select_multiple] 3. Which are some of the automatic reactions to extremely stressful situation?
    automatic_reactions_situation: undefined | Option<'automatic_reactions_situation'>[]
    // pfa/pfa_counselling_psychotherapy [select_one] 4. PFA is a form of counselling or psychotherapy.
    pfa_counselling_psychotherapy: undefined | Option<'pfa_counselling_psychotherapy'>
    // pfa/technique_active_listening [select_multiple] 5. What are some of the techniques within active listening?
    technique_active_listening: undefined | Option<'technique_active_listening'>[]
    // pfa/key_elements_pfa [select_one] 6. What are the three key elements of PFA?
    key_elements_pfa: undefined | Option<'key_elements_pfa'>
    // pfa/more_help_better [select_one] 7. In PFA, the more we help, the better.
    more_help_better: undefined | Option<'more_help_better'>
    // pfa/prevent_further_harm [select_multiple] 8. In order to prevent further harm we need to avoid:
    prevent_further_harm: undefined | Option<'prevent_further_harm'>[]
    // pfa/pfa_question [select_one] Question
    pfa_question: undefined | Option<'relevant_skills_pfa'>
    // pfa/practised_providing_pfa [select_one] 9. I have practised providing PFA to someone in distress
    practised_providing_pfa: undefined | Option<'relevant_skills_pfa'>
    // pfa/feel_confident_pfa [select_one] 10. I feel confident to provide PFA
    feel_confident_pfa: undefined | Option<'relevant_skills_pfa'>
    // pfa/relevant_skills_pfa [select_one] 11. I am aware of the relevant social skills that are fundamental to provide PFA
    relevant_skills_pfa: undefined | Option<'relevant_skills_pfa'>
    // feedback/overall_satisfied [select_one] Overall, how satisfied are you with the training materials today?
    overall_satisfied: undefined | Option<'overall_satisfied'>
    // feedback/useful_training [select_one] How useful was the training in helping you improve your knowledge and skills in the topic?
    useful_training: undefined | Option<'useful_training'>
    // feedback/rate_facilitator [select_one] How do you rate the performance of facilitator?
    rate_facilitator: undefined | Option<'rate_facilitator'>
    // feedback/give_complaint_feedback [select_one] Were you told about how you can give your complaint/feedback or questions about the assistance?
    give_complaint_feedback: undefined | Option<'give_complaint_feedback'>
    // feedback/comments [text] Use this space to provide any recommendations to improve the training and/or specify any areas that should have been explored in more detail, if applicable:
    comments: string | undefined
  }
  export const options = {
    location: {
      chernihivska: `Chernihivska`,
      sumska: `Sumska`,
      kharkivska: `Kharkivska`,
      donetska: `Donetska`,
      dnipropetrovska: `Dnipropetrovska`,
      zaporizka: `Zaporizka`,
      mykolaivska: `Mykolaivska`,
      khersonska: `Khersonska`,
      other: `Other`,
    },
    undefined: {
      hum_imp_neu_ind: `Humanity, Impartiality, Neutrality, Independence`,
      uni_inc_tra_pro: `Universality, Inclusion, Transparency, Protection`,
      imp_res_hon_tra: `Impartiality, Respect, Honesty, Transparency`,
      delivering: `Delivering food, non-food and shelter assistance to affected populations in line with international standards`,
      informing: `Informing affected people about their rights and how to exercise them`,
      incorporating: `Incorporating protection principles and promoting meaningful access, safety and dignity in humanitarian aid`,
      prioritise_safety: `Prioritise safety and dignity and avoid causing harm; Meaningful access; Accountability; Participation and empowerment`,
      accountability_transparency: `Accountability; Transparency and honesty; Diverse engagement of all actors; Humanitarian localisation`,
      dignified_efficient: `Dignified and efficient interventions; Promote capacity building of grass-roots actors; Inclusion and diversity; Immediate action`,
      do_no_harm: `Do No Harm`,
      integrity: `Integrity`,
      sensitivity: `Sensitivity`,
      confidentiality: `Confidentiality`,
      credibility: `Credibility`,
      impartiality_objectivity: `Impartiality/Objectivity`,
      informed_consent: `Informed consent`,
      need_know: `Need to know`,
      data_protection: `Data Protection`,
      all: `All of the above`,
      none: `None of the above`,
      pri_ref_ser_map: `Prioritization, Referring, Service Mapping`,
      ref_ser_map_pri: `Referring, Service Mapping, Prioritization`,
      ser_map_pri_ref: `Service Mapping, Prioritization, Referring`,
      detailed: `De as detailed as possible`,
      basic_personal_data: `Contain basic personal data, including name, date of birth, contacts, address etc.`,
      anonymized: `Be anonymized unless absolutely essential to have access to personal data`,
      technique_used: `A technique used for marketing products and services.`,
      fundraising_strategy: `A fundraising strategy for non-profit organizations.`,
      means_change: `A means of seeking change in governance, attitudes, power, social relations and institutional functions`,
      process_community: `A process of building community support and raising awareness about key issues.`,
      identify_visualize: `To identify and visualize the root causes and consequences of an issue.`,
      track_progress: `To track the progress of advocacy efforts over time.`,
      map_community: `To map out community resources and assets.`,
      organize_community: `To organize community events and activities.`,
      big_change: `An advocacy goal is the big change that we want to make. Advocacy objectives are the small steps that we need to take to achieve the goal.`,
      written_community: `An advocacy goal is written by the community. Advocacy objectives are written by stakeholders`,
      written_advocacy: `An advocacy goal is written before doing advocacy. Advocacy objectives are written after doing advocacy`,
      public_advocacy: `An advocacy goal is public advocacy. Advocacy objectives are private advocacy.`,
      create_maps: `To create detailed maps of community resources and services.`,
      identify_key: `To identify key stakeholders and their influence on an issue.`,
      develop_awareness: `To develop awareness materials for advocacy campaigns`,
      face_to_face: `Face-to-face meetings`,
      advocacy: `Advocacy briefs and reports`,
      media: `Media`,
      developing_partnerships: `Developing partnerships/coalitions/alliances`,
      conferences: `Conferences/events`,
    },
    complete_training: {
      yes: `Yes`,
      no: `No`,
    },
    pfa_counselling_psychotherapy: {
      true: `True`,
      false: `False`,
    },
    overall_satisfied: {
      very_satisfied: `Very satisfied`,
      satisfied: `Satisfied`,
      not_satisfied: `Not satisfied`,
    },
    useful_training: {
      very_useful: `Very useful`,
      useful: `Useful`,
      somewhat_useful: `Somewhat useful`,
      not_useful: `Not useful`,
    },
    rate_facilitator: {
      excellent: `Excellent`,
      good: `Good`,
      adequate: `Adequate`,
      poor: `Poor`,
    },
    give_complaint_feedback: {
      yes: `Yes`,
      no: `No`,
      pns: `Prefer not to say`,
    },
    elements_define_pfa: {
      human_response: `Human response to someone in distress`,
      helping_person: `Helping the person to feel calm and supported`,
      identify_immidiate: `Identify immidiate and urgent  needs`,
      all: `All above`,
    },
    automatic_reactions_situation: {
      talking_solve: `Talking and trying to solve the problem`,
      fight_flight: `Fight, Flight, Freeze, Faint`,
      asking_help: `Asking for help`,
      all: `All above`,
    },
    technique_active_listening: {
      noding: `Noding`,
      body_language: `Open body language`,
      paraphrasing: `Paraphrasing`,
      asking_questions: `Asking questions`,
      interrupting: `Interrupting`,
      all: `All above`,
    },
    key_elements_pfa: {
      linking_listening_normalization: `Linking, Active listening, Normalization`,
      safety_help_person: `Safety, Help the person to feel calm, Help the person to cope`,
      look_listen_link: `Look, Listen, Link`,
    },
    more_help_better: {
      yes: `Yes it is important to help as much as we can and solve the problems of the persons.`,
      no: `No, it is important to provide support, but not to take away the person’s strength and sense of ability to care for themselves.`,
    },
    prevent_further_harm: {
      giving_advices: `Giving advices`,
      minimizing_feeling: `Minimizing other person’s feeling`,
      judging_reactions: `Judging any reactions`,
      asking_details: `Asking for details`,
      share_perspectives: `Share our own perspectives`,
      all: `All above`,
    },
    relevant_skills_pfa: {
      strongly_disagree: `Strongly disagree`,
      disagree: `Disagree`,
      agree: `Agree`,
      strongly_agree: `Strongly agree`,
    },
    objectives_pfa: {
      build_connection: `Build a sense of connection with other people?`,
      helping_person: `Helping the person to feel calm and supported`,
      identify_immidiate: `Identify immidiate and urgent  needs`,
      all: `All above`,
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
      date_birthday: _.date_birthday ? new Date(_.date_birthday) : undefined,
      elements_define_pfa: _.elements_define_pfa?.split(' '),
      objectives_pfa: _.objectives_pfa?.split(' '),
      automatic_reactions_situation: _.automatic_reactions_situation?.split(' '),
      technique_active_listening: _.technique_active_listening?.split(' '),
      prevent_further_harm: _.prevent_further_harm?.split(' '),
    }) as T
}
