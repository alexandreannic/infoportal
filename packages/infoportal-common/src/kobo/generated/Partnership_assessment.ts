export namespace Partnership_assessment {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: aLD2Xc9cKSY22c5cAP5utT
  export interface T {
    start: string
    end: string
    // Id/idn [text] Name:
    idn: string | undefined
    // Id/idp [text] Position:
    idp: string | undefined
    // Id/idd [date] Date of assessment:
    idd: Date | undefined
    // rd/rdc [text] What is the name of the CSO
    rdc: string | undefined
    // rd/rdn [text] What is the name of the individual being interviewed
    rdn: string | undefined
    // rd/rdp [text] What is the position of the individual being interviewed
    rdp: string | undefined
    // rd/rdcc [integer] Contact details(cell):
    rdcc: number | undefined
    // rd/rdce [text] Contact details(e-mail):
    rdce: string | undefined
    // rd/rdwsm [text] Website, social media link
    rdwsm: string | undefined
    // rd/rdr [select_one] Respondent’s consent to be contacted:
    rdr: undefined | Option<'hcp'>
    // Current_Capacity_and_ncy_Response_Efforts/idd [date] Date of creation/registration of CSO:
    idd_001: Date | undefined
    // Current_Capacity_and_ncy_Response_Efforts/ccerho [select_multiple] Type of humanitarian activities:
    ccerho: undefined | Option<'ccerho'>[]
    // Current_Capacity_and_ncy_Response_Efforts/food_examples [text] Examples of projects with Food and Nutrition (if possible with beneficiary number):
    food_examples: string | undefined
    // Current_Capacity_and_ncy_Response_Efforts/shelter_examples [text] Examples of projects with Shelter (if possible with beneficiary number):
    shelter_examples: string | undefined
    // Current_Capacity_and_ncy_Response_Efforts/wash_examples [text] Examples of projects with water, sanitation, and hygiene (if possible with beneficiary number):
    wash_examples: string | undefined
    // Current_Capacity_and_ncy_Response_Efforts/medical_example [text] Examples of projects with medical (if possible with beneficiary number):
    medical_example: string | undefined
    // Current_Capacity_and_ncy_Response_Efforts/evacuation_examples [text] Examples of projects with Evacuation (if possible with beneficiary number):
    evacuation_examples: string | undefined
    // Current_Capacity_and_ncy_Response_Efforts/other_examples [text] Examples of projects with other interventions (if possible with beneficiary number):
    other_examples: string | undefined
    // Current_Capacity_and_ncy_Response_Efforts/ccerd [select_one] (Direct) frontline response?
    ccerd: undefined | Option<'hcp'>
    // ola/hmo [integer] How many offices do you have
    hmo: number | undefined
    // ola/oflo [begin_repeat] Office locations
    oflo:
      | {
          oblast: undefined | Option<'oblast_aop'> | undefined
          settlement: string | undefined | undefined
          gml: string | undefined | undefined
        }[]
      | undefined
    // ola/aop [integer] How many locations do you operate in?
    aop: number | undefined
    // ola/loop [begin_repeat] Locations of Operation
    loop: {oblast_aop: undefined | Option<'oblast_aop'> | undefined; com: string | undefined | undefined}[] | undefined
    // sc/scs [integer] of staff in total
    scs: number | undefined
    // sc/scf [integer] of fulltime staff
    scf: number | undefined
    // sc/scp [integer] of part time staff
    scp: number | undefined
    // sc/scv [integer] of volunteers
    scv: number | undefined
    // wa/wayn [select_one] Does the CSO have their own warehouse (belonging to the CSO)?
    wayn: undefined | Option<'hcp'>
    // wa/wa [integer] Number of warehouses
    wa_001: number | undefined
    // wa/was [select_multiple] If not, how are items stored?
    was: undefined | Option<'was'>[]
    // wa/waso [text] Other:
    waso: string | undefined
    // sas/sasd [select_one] Does the CSO have its own safety and security policies, protocols and procedures?
    sasd: undefined | Option<'hcp'>
    // se/ser [select_one] Is relevant Personal Protective Equipment (PPE) and safety equipment in place?
    ser: undefined | Option<'hcp'>
    // se/sery [select_multiple] If yes, which:
    sery: undefined | Option<'sery'>[]
    // se/other_spe [text] If other, specify
    other_spe: string | undefined
    // se/serk [select_one] Are first aid kits in place:
    serk: undefined | Option<'hcp'>
    // se/sert [select_one] Were relevant trainings conducted?
    sert: undefined | Option<'hcp'>
    // se/set [select_multiple] If yes, which:
    set: undefined | Option<'set'>[]
    // se/other_spec [text] If other, specify
    other_spec: string | undefined
    // Operational_challenges/oc [select_multiple] Operational challenges:
    oc: undefined | Option<'oc'>[]
    // Operational_challenges/oco [text] Other
    oco: string | undefined
    // nft/nftw [select_multiple] Which (technical) assistance would the CSO require to increase its efficiency in the provision of urgent humanitarian assistance?
    nftw: undefined | Option<'nftw'>[]
    // nft/nfto [text] Other
    nfto: string | undefined
    // nps/npsa [select_one] Are CSO’s staff members receiving psycho-social support (PSS)?
    npsa: undefined | Option<'hcp'>
    // nps/npsi [select_one] Is staff trained on psychological first aid (PFA)?
    npsi: undefined | Option<'hcp'>
    // nfc/nfch [select_one] Has the CSO participated in capacity-building trainings, sessions, workshops etc. after 24 February 2022?
    nfch: undefined | Option<'hcp'>
    // nfc/nfci [text] If yes, please mention what kind of training sessions and which topics were provided, when and how many CSO’s staff members participated
    nfci: string | undefined
    // nfc/nfcf [select_multiple] What kind of capacity needs to be addressed?
    nfcf: undefined | Option<'nfcf'>[]
    // nfc/nfco [text] Other
    nfco: string | undefined
    // cc/cca [select_one] Cooperation with authorities (please, specify national, regional or local level):
    cca: undefined | Option<'hcp'>
    // cc/ccy [select_multiple] If yes, which:
    ccy: undefined | Option<'ccy'>[]
    // cc/ccp [select_one] Permission to access hard-to-reach areas:
    ccp: undefined | Option<'hcp'>
    // cc/ccpy [text] If yes, from whom:
    ccpy: string | undefined
    // cc/cce [select_one] Established partnership/cooperation with other CSOs:
    cce: undefined | Option<'hcp'>
    // cc/ccey [text] If yes, please name the organizations
    ccey: string | undefined
    // cc/ccn [text] Nature of partnership/cooperation:
    ccn: string | undefined
    // cc/ccc [select_one] Cooperation with private sector bodies:
    ccc: undefined | Option<'hcp'>
    // cc/cccy [text] If yes, which
    cccy: string | undefined
    // hc/hcc [select_one] Cooperation with UN Agencies and INGOs:
    hcc: undefined | Option<'hcp'>
    // hc/hcy [select_multiple] If yes, which
    hcy: undefined | Option<'hcy'>[]
    // hc/hco [text] Other:
    hco: string | undefined
    // hc/hcp [select_one] Participation in Humanitarian Cluster System (Shelter, Protection, WASH Cluster etc.):
    hcp: undefined | Option<'hcp'>
    // hc/hcpy [text] If yes, which
    hcpy: string | undefined
    // aoi/aoo [text] Other information provided that might be valuable and helpful:
    aoo: string | undefined
    // aoi/aoc [text] Flag any other relevant information, red flags, overall comments and assessment
    aoc: string | undefined
  }
  export const options = {
    hcp: {
      yes: `Yes`,
      no: `No`,
    },
    ccerho: {
      fn: `Food and nutrition`,
      sh: `Shelter`,
      ws: `Water, sanitation and hygiene`,
      mc: `Medical care`,
      et: `Evacuation, transportation`,
      oth: `Other:`,
    },
    was: {
      js: `Joint storage with other CSO`,
      rw: `Rented warehouse`,
      urf: `Using rent-free warehouse/ storage space (from municipality etc.)`,
      oth: `Other:`,
    },
    sery: {
      bv: `Bulletproof vests`,
      ew: `Emergency water`,
      ep: `Eye protection`,
      gl: `Gloves`,
      gb: `Grab bags`,
      hs: `Hazmat suits`,
      he: `Helmets`,
      hvc: `High-visibility clothing`,
      ma: `Masks`,
      oth: `Other`,
      sp: `Satellite phones`,
      sf: `Spare fuel`,
    },
    set: {
      he: `HEAT`,
      pa: `PAST`,
      gps: `GPS training`,
      fa: `First Aid`,
      oth_tr: `Other`,
    },
    oc: {
      cor: `Coordination`,
      com: `Communication`,
      ati: `Access to Information`,
      atg: `Access (to target groups)`,
      lsc: `Logistics/Supply Chain`,
      rmm: `Risk mitigation, management`,
      oth: `Other`,
    },
    nftw: {
      eq: `Equipment`,
      fr: `Financial resources`,
      in: `Infrastructure (warehouse etc.)`,
      tr: `Trainings (capacity development)`,
      oth: `Other`,
    },
    nfcf: {
      chs: `Core Humanitarian Standards`,
      meal: `Monitoring, Evaluation, Accountability, Learning`,
      can: `Communication and Networking`,
      ad: `Advocacy`,
      fm: `Financial Management`,
      rms: `Risk Management, Safety, HEAT`,
      fpw: `Fundraising, Proposal Writing,`,
      hrm: `HR Management, Volunteers Management`,
      hl: `Humanitarian Logistics`,
      pp: `PSS, PFA`,
      pm: `Protection Mainstreaming`,
      oth: `Other:`,
    },
    ccy: {
      mo: `ministries and other central executive bodies`,
      orc: `oblast, rayon and city military administrations`,
      ss: `social services`,
      lsg: `local self-government bodies (local councils)`,
      pao: `police and other law enforcement agencies.`,
    },
    oblast_aop: {
      aroc: `Autonomous Republic of Crimea`,
      vinnytska: `Vinnytsia`,
      volynska: `Volyn`,
      dnipropetrovska: `Dnipropetrovsk`,
      donetska: `Donetsk`,
      zhytomyrska: `Zhytomyr`,
      zakarpatska: `Zakarpattia`,
      zaporizka: `Zaporizhzhia`,
      'ivano-frankivska': `Ivano-Frankivsk`,
      kyivska: `Kyiv`,
      kirovohradska: `Kirovohrad`,
      luhanska: `Luhansk`,
      lvivska: `Lviv`,
      mykolaivska: `Mykolaiv`,
      odeska: `Odesa`,
      poltavska: `Poltava`,
      rivnenska: `Rivne`,
      sumska: `Sumy`,
      ternopilska: `Ternopil`,
      kharkivska: `Kharkiv`,
      khersonska: `Kherson`,
      khmelnytska: `Khmelnytskyi`,
      cherkaska: `Cherkasy`,
      chernivetska: `Chernivtsi`,
      chernihivska: `Chernihiv`,
      citykyiv: `City Kyiv`,
      sevastopilska: `City Sevastopil`,
    },
    hcy: {
      act: `ACT Alliance / Finn Church Aid`,
      action_medeor: `Action Medeor`,
      acted: `ACTED`,
      right_to_protection: `All-Ukrainian Charitable Foundation "Right to Protection"`,
      asb: `Arbeiter-Samariter-Bund Deutschland`,
      care: `Care Germany`,
      caritas: `Caritas Ukraine`,
      drc: `Danish Refugee Council`,
      eef: `East Europe Foundation`,
      fao: `Food & Agriculture Organization of the United Nations`,
      halo: `HALO Trust`,
      hi: `Handicap International - Humanity & Inclusion`,
      helpage: `HelpAge International`,
      helvetas: `Helvetas Swiss Intercooperation`,
      imc: `iMC Worldwide`,
      impact: `IMPACT Initiatives`,
      iom: `International Organization for Migration`,
      planned_parenthood: `International Planned Parenthood Federation`,
      ird: `International Rescue Committee`,
      malteser: `Malteser International Order of Malta World Relief`,
      mdm: `Médicos do Mundo`,
      nippon: `Nippon International Cooperation for Community Development`,
      np: `Nonviolent Peaceforce`,
      nrc: `Norwegian Refugee Council`,
      peace_winds: `Peace Winds Japan`,
      pin: `People in Need`,
      plan: `Plan International`,
      schools_association: `Schools Association for Formal Education`,
      sdc: `Swiss Development Cooperation/Swiss Humanitarian Aid`,
      tdh: `Terre des Hommes International`,
      unicef: `United Nations Children's Fund`,
      undp: `United Nations Development Programme`,
      unhcr: `United Nations High Commissioner for Refugees`,
      unops: `United Nations Office for Project Services`,
      unfpa: `United Nations Population Fund`,
      wfp: `World Food Programme`,
      who: `World Health Organization`,
      oth: `Other`,
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
      idd: _.idd ? new Date(_.idd) : undefined,
      rdcc: _.rdcc ? +_.rdcc : undefined,
      idd_001: _.idd_001 ? new Date(_.idd_001) : undefined,
      ccerho: _.ccerho?.split(' '),
      hmo: _.hmo ? +_.hmo : undefined,
      oflo: _['oflo']?.map(extractQuestionName).map((_: any) => {
        return _
      }),
      aop: _.aop ? +_.aop : undefined,
      loop: _['loop']?.map(extractQuestionName).map((_: any) => {
        return _
      }),
      scs: _.scs ? +_.scs : undefined,
      scf: _.scf ? +_.scf : undefined,
      scp: _.scp ? +_.scp : undefined,
      scv: _.scv ? +_.scv : undefined,
      wa_001: _.wa_001 ? +_.wa_001 : undefined,
      was: _.was?.split(' '),
      sery: _.sery?.split(' '),
      set: _.set?.split(' '),
      oc: _.oc?.split(' '),
      nftw: _.nftw?.split(' '),
      nfcf: _.nfcf?.split(' '),
      ccy: _.ccy?.split(' '),
      hcy: _.hcy?.split(' '),
    }) as T
}
