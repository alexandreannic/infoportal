export namespace Partnership_initialQuestionnaire {
  export type Option<T extends keyof typeof options> = keyof (typeof options)[T]
  // Form id: a6u7CBysEz746Hdx6pVLzp
  export interface T {
    start: string
    end: string
    // rd/rdc [text] Name of the organization
    rdc: string | undefined
    // rd/rdn [text] Name of the respondent
    rdn: string | undefined
    // rd/rdp [text] Title, role at the organization
    rdp: string | undefined
    // rd/rdcc [integer] Contact details(cell):
    rdcc: number | undefined
    // rd/rdce [text] Contact details(e-mail):
    rdce: string | undefined
    // rd/rdr [select_one] Respondent’s consent to be contacted:
    rdr: undefined | Option<'hcc'>
    // cce/idd [date] Date of creation/registration of CSO:
    idd: Date | undefined
    // cce/ccerho [select_multiple] Type of humanitarian activities:
    ccerho: undefined | Option<'ccerho'>[]
    // cce/other_examples [text] Examples of projects with other interventions (if possible with beneficiary number):
    other_examples: string | undefined
    // ola/hmo [integer] How many offices do you have
    hmo: number | undefined
    // ola/oflo [begin_repeat] Office locations
    oflo:
      | {oblast: undefined | Option<'oblast_aop'> | undefined; settlement: string | undefined | undefined}[]
      | undefined
    // ola/aop [integer] How many locations do you operate in?
    aop: number | undefined
    // ola/loop [begin_repeat] Locations of Operation
    loop:
      | {oblast_aop: undefined | Option<'oblast_aop'> | undefined; settlement_aop: string | undefined | undefined}[]
      | undefined
    // sc/scs [integer] of staff in total
    scs: number | undefined
    // sc/scf [integer] of staff with contract
    scf: number | undefined
    // sc/scv [integer] of volunteers
    scv: number | undefined
    // wa/wayn [select_one] Does the CSO have their own warehouse (belonging to the CSO)?
    wayn: undefined | Option<'hcc'>
    // wa/was [select_multiple] If not, how are items stored?
    was: undefined | Option<'was'>[]
    // wa/waso [text] Other:
    waso: string | undefined
    // nft/nftw [select_multiple] Which (technical) assistance would the CSO require to increase its efficiency in the provision of urgent humanitarian assistance?
    nftw: undefined | Option<'nftw'>[]
    // nft/nfto [text] Other
    nfto: string | undefined
    // cc/ccp [select_one] Permission to access hard-to-reach areas:
    ccp: undefined | Option<'hcc'>
    // cc/ccpy [text] If yes, from whom:
    ccpy: string | undefined
    // hc/hcc [select_one] Cooperation with UN Agencies and INGOs:
    hcc: undefined | Option<'hcc'>
    // hc/hcy [select_multiple] If yes, which
    hcy: undefined | Option<'hcy'>[]
    // hc/hco [text] Other
    hco: string | undefined
  }
  export const options = {
    hcc: {
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
    undefined: {
      he: `HEAT`,
      gl: `Gloves`,
      ep: `Eye protection`,
      hs: `Hazmat suits`,
      hvc: `High-visibility clothing`,
      ma: `Masks`,
      bv: `Bulletproof vests`,
      sp: `Satellite phones`,
      gb: `Grab bags`,
      ew: `Emergency water`,
      sf: `Spare fuel`,
      oth: `Other:`,
      pa: `PAST`,
      gps: `GPS training`,
      fa: `First Aid`,
      oth_tr: `Other`,
      cor: `Coordination`,
      com: `Communication`,
      ati: `Access to Information`,
      atg: `Access (to target groups)`,
      lsc: `Logistics/Supply Chain`,
      rmm: `Risk mitigation, management`,
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
      mo: `ministries and other central executive bodies`,
      orc: `oblast, rayon and city military administrations`,
      ss: `social services`,
      lsg: `local self-government bodies (local councils)`,
      pao: `police and other law enforcement agencies.`,
    },
    nftw: {
      eq: `Equipment`,
      fr: `Financial resources`,
      in: `Infrastructure (warehouse etc.)`,
      tr: `Trainings (capacity development)`,
      oth: `Other`,
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
      rdcc: _.rdcc ? +_.rdcc : undefined,
      idd: _.idd ? new Date(_.idd) : undefined,
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
      scv: _.scv ? +_.scv : undefined,
      was: _.was?.split(' '),
      nftw: _.nftw?.split(' '),
      hcy: _.hcy?.split(' '),
    }) as T
}
