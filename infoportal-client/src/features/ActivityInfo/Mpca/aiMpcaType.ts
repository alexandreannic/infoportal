export namespace AiMpcaType {
  type Opt<T extends keyof typeof options> = keyof (typeof options)[T]

  export interface Type {
    'Reporting Organization': Opt<'Reporting Organization'>,
    'Implementing Partner': Opt<'Implementing Partner'>,
    'Activity Plan Code': Opt<'Activity Plan Code'>,
    'Donor': Opt<'Donor'>,
    'Indicators - MPCA'?: Opt<'Indicators - MPCA'>,
    'Total amount (USD) distributed through multi-purpose cash assistance': number,
    'Payments Frequency': Opt<'Payments Frequency'>,
    'Financial Service Provider (FSP)': Opt<'Financial Service Provider (FSP)'>,
    'Response Theme': Opt<'Response Theme'>,
    'Raion'?: string,
    'Hromada': string,
    'Settlement'?: string,
    'Collective Site'?: string,
    'Reporting Month': string,
    'Activity Start Month'?: string,
    'Activity End Month'?: string,
    'Number of Covered Months': Opt<'Number of Covered Months'>,
    'Population Group': Opt<'Population Group'>,
    'Total Individuals Reached': number,
    'Girls (0-17)': number,
    'Boys (0-17)': number,
    'Adult Women (18-59)': number,
    'Adult Men (18-59)': number,
    'Older Women (60+)': number,
    'Older Men (60+)': number,
    'People with disability': number,
    'Girls with disability (0-17)'?: number,
    'Boys with disability (0-17)'?: number,
    'Adult Women with disability (18-59)'?: number,
    'Adult Men with disability (18-59)'?: number,
    'Older Women with disability (60+)'?: number,
    'Older Men with disability (60+)'?: number
  }

  export const map = (a: Type) => ({
    'cw67b3nlq6so74pf': a['Reporting Organization'] === undefined ? undefined : 'czbgrslpwg36j52' + ':' + options['Reporting Organization'][a['Reporting Organization']!],
    'c53wwymlq6so74pg': a['Implementing Partner'] === undefined ? undefined : 'czbgrslpwg36j52' + ':' + options['Implementing Partner'][a['Implementing Partner']!],
    'cxzc3wylqxzrn9i2': a['Activity Plan Code'] === undefined ? undefined : 'c80149tlqm62xpv1tk' + ':' + options['Activity Plan Code'][a['Activity Plan Code']!],
    'cmuq05dlqnsj7yqf': a['Donor'] === undefined ? undefined : 'cf9uxrylqf1ttfc2' + ':' + options['Donor'][a['Donor']!],
    'ckv9joulsvxoptn2': a['Indicators - MPCA'] === undefined ? undefined : 'cid2wxslqb3pzob9e' + ':' + options['Indicators - MPCA'][a['Indicators - MPCA']!],
    'c9aasnglqnsgaq6e': a['Total amount (USD) distributed through multi-purpose cash assistance'] === undefined ? undefined : a['Total amount (USD) distributed through multi-purpose cash assistance'],
    'cakkhd9lqntdpktd': a['Payments Frequency'] === undefined ? undefined : options['Payments Frequency'][a['Payments Frequency']!],
    'cjrs9bzlr0f2x6wd': a['Financial Service Provider (FSP)'] === undefined ? undefined : options['Financial Service Provider (FSP)'][a['Financial Service Provider (FSP)']!],
    'cb7ml4clqnt87pf3': a['Response Theme'] === undefined ? undefined : options['Response Theme'][a['Response Theme']!],
    // 'cb39ganlqf3085j4z': a['Raion'] === undefined ? undefined : 'cd5q9sdlq3kklo314' + ':' + a['Raion'],
    'cshl0i7lq6so74qp': a['Hromada'] === undefined ? undefined : 'cwlaxxlq3kp2bu5a' + ':' + a['Hromada'],
    'cn43jajlqf3085j51': a['Settlement'] === undefined ? undefined : 'cfn5ltdlq3lbcb95w' + ':' + a['Settlement'],
    'cf2masdlq6so74qr': a['Collective Site'] === undefined ? undefined : a['Collective Site'],
    'cmol4qhlq6so74qv': a['Reporting Month'] === undefined ? undefined : a['Reporting Month'],
    'c4t8d0xlqz50e1e2': a['Activity Start Month'] === undefined ? undefined : a['Activity Start Month'],
    'c4aesi0lqz510nh3': a['Activity End Month'] === undefined ? undefined : a['Activity End Month'],
    'canw5vhlqntauao6': a['Number of Covered Months'] === undefined ? undefined : options['Number of Covered Months'][a['Number of Covered Months']!],
    'cf6hv4zlq6so74qz': a['Population Group'] === undefined ? undefined : 'cf8ig2alq6dbe8t2' + ':' + options['Population Group'][a['Population Group']!],
    'c8docc8lq6so74q12': a['Total Individuals Reached'] === undefined ? undefined : a['Total Individuals Reached'],
    'cxxa4fmlq6so74q13': a['Girls (0-17)'] === undefined ? undefined : a['Girls (0-17)'],
    'cihl0t2lq6so74q14': a['Boys (0-17)'] === undefined ? undefined : a['Boys (0-17)'],
    'cm5uwnwlq6so74q15': a['Adult Women (18-59)'] === undefined ? undefined : a['Adult Women (18-59)'],
    'csp8uxllq6so74q16': a['Adult Men (18-59)'] === undefined ? undefined : a['Adult Men (18-59)'],
    'cy3skbtlq6so74q17': a['Older Women (60+)'] === undefined ? undefined : a['Older Women (60+)'],
    'c91006ylq6so74r18': a['Older Men (60+)'] === undefined ? undefined : a['Older Men (60+)'],
    'cexzo0hlq6so74r19': a['People with disability'] === undefined ? undefined : a['People with disability'],
    'cll4mlllqp9p0mr4': a['Girls with disability (0-17)'] === undefined ? undefined : a['Girls with disability (0-17)'],
    'c3cim3lqp9pzl35': a['Boys with disability (0-17)'] === undefined ? undefined : a['Boys with disability (0-17)'],
    'cutta7glqp9qq8v6': a['Adult Women with disability (18-59)'] === undefined ? undefined : a['Adult Women with disability (18-59)'],
    'cyacnhzlqp9rkug7': a['Adult Men with disability (18-59)'] === undefined ? undefined : a['Adult Men with disability (18-59)'],
    'cyk1e6rlqp9s7sk8': a['Older Women with disability (60+)'] === undefined ? undefined : a['Older Women with disability (60+)'],
    'cwt6rrtlqp9sz659': a['Older Men with disability (60+)'] === undefined ? undefined : a['Older Men with disability (60+)']
  })

  export const options = {
    'Reporting Organization': {
      'Danish Refugee Council': 'cloyih3lpwhjdsu2r0'
    },
    'Implementing Partner': {
      'Danish Refugee Council': 'cloyih3lpwhjdsu2r0'
    },
    'Activity Plan Code': {
      'MPCA-DRC-00001': 'cghgcrlltn5k1wn2',
      'MPCA-DRC-00002': 'cf1o4x9ltn5mws75',
      'MPCA-DRC-00003': 'cin9hupltn5o8y68',
      'MPCA-DRC-00004': 'clpzjvyltn5ow78a',
      'MPCA-DRC-00005': 'ccyfia1luwf5qys3',
      'MPCA-DRC-00006': 'cmfd695luwfodg67',
      'MPCA-DRC-00007': 'cj53fxfluwfvu265i',
      'MPCA-DRC-00008': 'cx68b6hlvz4sptv14y',
      'MPCA-DRC-00009': 'cz6ahurlw0lz2g52',
      'MPCA-DRC-00010': 'ch81mymlw0o1el93',
    },
    'Donor': {
      'ACT Alliance (ACT)': 'cvkyilllqf1uylbd4',
      'AICM Ukraine (AICMUA)': 'cjtjqpglqf1uylbd5',
      'ATB-Market (ATB)': 'cxbirpslqf1uylbd6',
      'AWO International (AWO)': 'cwnz6rdlqf1uylbd7',
      'Adventist Development and Relief Agency Ukraine (ADRA Ukraine)': 'ce4jer8lqf1uylbd8',
      'Adventist Development and Relief Agency Australia (ADRA Australia)': 'cabgdowlqf1uylbd9',
      'Adventist Development and Relief Agency Austria (ADRA Austria)': 'cpwsqsrlqf1uylbda',
      'Adventist Development and Relief Agency Belgium (ADRA Belgium)': 'cs2u9lwlqf1uylbdb',
      'Adventist Development and Relief Agency Canada (ADRA Canada)': 'cvhk1otlqf1uylbdc',
      'Adventist Development and Relief Agency Denmark (ADRA Denmark)': 'ctrp07llqf1uylbdd',
      'Adventist Development and Relief Agency France (ADRA France)': 'cwr2rpdlqf1uylbde',
      'Adventist Development and Relief Agency Inter-American Division (ADRA IAD)': 'cgkcztrlqf1uylbdf',
      'Adventist Development and Relief Agency Netherlands (ADRA Netherlands)': 'calwybdlqf1uylbdg',
      'Adventist Development and Relief Agency Norway (ADRA Norway)': 'cxroni7lqf1uylbdh',
      'Adventist Development and Relief Agency South America Division (ADRA South America Division)': 'ctge4ralqf1uylbdi',
      'Adventist Development and Relief Agency Spain (ADRA Spain)': 'civ5yjlqf1uylbdj',
      'Adventist Development and Relief Agency Sweden (ADRA Sweden)': 'cr41ucplqf1uylbdk',
      'Adventist Development and Relief Agency Switzerland (ADRA Switzerland)': 'cfs7rz3lqf1uylbdl',
      'Adventist Development and Relief Agency UK (ADRA UK)': 'c363d08lqf1uylbdm',
      'Agency for Technical Cooperation and Development (ACTED)': 'cwjcauslqf1uylbdn',
      'AirLight (AirLight)': 'ch0fueklqf1uylbdo',
      'Aktion Deutschland Hilft (ADH)': 'c1bwc31lqf1uylbdp',
      'Alliance2015 (Alliance2015)': 'c5br1pklqf1uylbdq',
      'American Red Cross (ARC)': 'czesx6hlqf1uylbdr',
      'Americares (Americares)': 'ckds5gmlqf1uylbds',
      'Arbeiter-Samariter-Bund Deutschland e.V. (ASB)': 'c31tki7lqf1uylbdt',
      'Arche Nova (AN)': 'cd88powlqf1uylbdu',
      'Australia, Government of (Australia)': 'cfuqhp6lqf1uylbdv',
      'Austria, Government of (Austria)': 'cgfgxzglqf1uylbdw',
      'Austrian Red Cross (ORK)': 'ck1umdblqf1uylbdx',
      'Belgium, Government of (Belgium)': 'cbgdvalqf1uylbdy',
      'British Embassy Kyiv (UKEmbassy)': 'cbiighglqf1uylbdz',
      'Brot für die Welt (BfW)': 'camrzojlqf1uylbe0',
      'Brücke Nach Kiew (Brücke)': 'chm03mylqf1uylbe1',
      'Bulgaria, Government of (Bulgaria)': 'c8tsxublqf1uylbe2',
      'Bureau of Conflict and Stabilization Operations (CSO)': 'cqv37whlqf1uylbe3',
      'CADUS e.V. - Redefine Global Solidarity (CADUS)': 'cfjo22nlqf1uylbe4',
      'CORE (CORE)': 'c863y56lqf1uylce5',
      'Canada, Government of (Canada)': 'cd83ra5lqf1uylce6',
      'Canada-Ukraine Foundation (CUFOUNDATION)': 'cgwdscelqf1uylce7',
      'Canadian Foodgrains Bank (CFGB)': 'c8fzzkilqf1uylce8',
      'Caritas Austria (CaritasAT)': 'c4gdmo6lqf1uylce9',
      'Caritas Czech Republic (CaritasCZE)': 'c362eqslqf1uylcea',
      'Caritas Germany (DCV)': 'c9724sglqf1uylceb',
      'Caritas Internationalis (CaritasInt)': 'c1invaklqf1uylcec',
      'Caritas Poland (CaritasPL)': 'crakc68lqf1uylced',
      'Caritas Switzerland (CaritasCH)': 'ct0d24vlqf1uylcee',
      'Catholic Relief Services (CRS)': 'cdozp6qlqf1uylcef',
      'Centers for Disease Control and Prevention (CDC)': 'c73pbgdlqf1uylceg',
      'Central Emergency Response Fund (CERF)': 'cu20rfolqf1uylceh',
      'ChildFund Deutschland (CFDE)': 'ccwpsk6lqf1uylcei',
      'ChildFund International (CFI)': 'cf2zyo6lqf1uylcej',
      'Choose Love (CHL)': 'cx0hh40lqf1uylcek',
      'Christian Aid (CHRAid)': 'csjg3pflqf1uylcel',
      'Christian Blind Mission (CBM)': 'c8us70jlqf1uylcem',
      'Christian Emergency Aid Cluster (CNHC)': 'c3t8efrlqf1uylcen',
      'Church in Action NL (KIA NL)': 'cqtttb1lqf1uylceo',
      'Church in Action USA (KIA USA)': 'c30btbtlqf1uylcep',
      'Coalition Plus (CoalitionPlus)': 'cagh6dglqf1uylceq',
      'Cooperating Aid Organizations (SHO)': 'cg49esolqf1uylcer',
      'Corus International (Corus)': 'cmkspuvlqf1uylces',
      'Council of Europe (COE)': 'cq447n7lqf1uylcet',
      'Crisis and Support Centre - French Ministry for Europe and Foreign Affairs (CDCS/MEAE)': 'cszofjqlqf1uylceu',
      'Crown Agents International Development (CAID)': 'cy1m86lqf1uylcev',
      'Cyprus, Government of (Cyprus)': 'cw1s6ndlqf1uylcew',
      'Czech Republic, Government of (Czech Republic)': 'c4rg9vjlqf1uylcex',
      'DFID Consortium (DFIDC)': 'cn6n7z8lqf1uylcey',
      'DRA (DRA)': 'c9fea36lqf1uylcez',
      'DanChurchAid (DCA)': 'c3ami7lqf1uylcf0',
      'Danish International Development Agency - Ministry of Foreign Affairs - Denmark (DANIDA)': 'cevc6u8lqf1uyldf1',
      'Danish People\'s Aid (DPA)': 'cv36n7jlqf1uyldf2',
      'Danish Refugee Council (DRC)': 'c9jdb9xlqf1uyldf3',
      'Delegation of the European Union to Ukraine (EEAS)': 'cu62mn0lqf1uyldf4',
      'Denmark, Government of (Denmark)': 'c3rcxdxlqf1uyldf5',
      'Directorate General for Development Cooperation of the Ministry of Foreign Affairs and International Cooperation - Italy (DGDC/MFA Italy)': 'caecybqlqf1uyldf6',
      'Disasters Emergency Committee (DEC)': 'ca9wtq0lqf1uyldf7',
      'Dnipropetrovsk Regional Center of Psychosocial Support (DRCPS)': 'cf7jwmelqf1uyldf8',
      'Development Center (DDC)': 'cgfosbmlqf1uyldf9',
      'Dutch Relief Alliance (DutchRelief)': 'c58wcwklqf1uyldfa',
      'EPAM Systems (EPAM)': 'c8ncfiplqf1uyldfb',
      'EU Advisory Mission (EUA)': 'cln193qlqf1uyldfc',
      'EU TA projects (EUTA)': 'c5rqll9lqf1uyldfd',
      'Education Cannot Wait (ECW)': 'c9idmpklqf1uyldfe',
      'Embassy of Canada to Ukraine (CAEmbassy)': 'c4vb9wplqf1uyldff',
      'Estonia, Government of (Estonia)': 'c4y8kq4lqf1uyldfg',
      'Estonian Refugee Council (ERC)': 'ckd5913lqf1uyldfh',
      'Euro-Plus (Euro+)': 'ch8oee6lqf1uyldfi',
      'European Commission Humanitarian Aid Department and Civil Protection (ECHO)': 'cc3gaj6lqf1uyldfj',
      'European Commission\'s Directorate-General for European Civil Protection and Humanitarian Aid Operations (DG ECHO)': 'cgjlouwlqf1uyldfk',
      'European Programme for Integration and Migration (EPIM)': 'cc4axxjlqf1uyldfl',
      'European Union (EU)': 'ct2gxm8lqf1uyldfm',
      'FHI 360 (FHI360)': 'cibl0ytlqf1uyldfn',
      'Faith, Hope, Love (FHL)': 'ctpdd0ylqf1uyldfo',
      'Federal Agency for Technical Relief (THW Germany)': 'c7pyz3slqf1uyldfp',
      'Federal Ministry for Economic Cooperation and Development - Germany (BMZ)': 'cwi9aj9lqf1uyldfq',
      'Federal Public Service Foreign Affairs, Foreign Trade and Development Cooperation - Belgium (MFA Belgium)': 'co5kbbplqf1uyldfr',
      'Finland, Government of (Finland)': 'cuytai8lqf1uyldfs',
      'First Ukrainian International Bank (PUMB)': 'cxqob0glqf1uyldft',
      'Foreign, Commonwealth & Development Office (FCDO)': 'cgxr4t2lqf1uyldfu',
      'Forest Initiatives and Communities (ForestCom)': 'c3dl4q3lqf1uyldfv',
      'France, Government of (France)': 'cu7um3slqf1uyldfw',
      'Fuel Relief Fund (FRF)': 'crxdd7clqf1uyldfx',
      'GOAL (GOAL)': 'ce0ewy7lqf1uyldfy',
      'Gender Creative Space (GСS)': 'c5bwbutlqf1uyldfz',
      'German Agency for International Cooperation (GIZ)': 'c52h1wylqf1uyldg0',
      'German Doctors e.V. (GD)': 'c5r4h6hlqf1uyldg1',
      'German Federal Foreign Office (GFO)': 'c155drlqf1uyldg2',
      'Germany, Government of (Germany)': 'cukmoo4lqf1uyldg3',
      'Global Affairs Canada (GAC)': 'cup4td3lqf1uyldg4',
      'Global Empowerment Mission (GEM)': 'c5e8hielqf1uyldg5',
      'Global Response Medicine (GRM)': 'c1v2pghlqf1uyldg6',
      'Global Sae-A (Sae-A)': 'cjn967nlqf1uyldg7',
      'Google (Google)': 'ctsfrqvlqf1uyldg8',
      'HEKS/EPER Swiss Church Aid (HEKS-EPER)': 'cl0t4rulqf1uyldg9',
      'Hebrew Immigrant Aid Society (HIAS)': 'cbnkkhnlqf1uyldga',
      'HelpAge Canada (HACA)': 'cqpjrd2lqf1uyldgb',
      'HelpAge International Ukraine (HAIUA)': 'cdxewzclqf1uyldgc',
      'Helvetas Swiss Intercooperation (Helvetas)': 'c5g8bgilqf1uylegd',
      'High-net-worth individual (HNWI)': 'cv06ef7lqf1uylege',
      'Humanity & Inclusion (HI)': 'cykqw2lqf1uylegf',
      'Hungary, Government of (Hungary)': 'caxmmkglqf1uylegg',
      'IKEA (IKEA)': 'c7lubulqf1uylegh',
      'INTERSOS (INTERSOS)': 'co2nqswlqf1uylegi',
      'Iceland, Government of (Iceland)': 'cbtpbuflqf1uylegj',
      'International Committee of the Red Cross (ICRC)': 'c8upptelqf1uylegk',
      'International Federation of Red Cross and Red Crescent Societies (IFRC)': 'cfqi5fslqf1uylegl',
      'International Media Support (IMS)': 'cf33k59lqf1uylegm',
      'International Medical Corps (IMC)': 'c5xtct0lqf1uylegn',
      'International Organization for Migration (IOM)': 'cmsdkg1lqf1uylego',
      'International Renaissance Foundation (IRF)': 'cvvtqtulqf1uylegp',
      'International Rescue Committee (IRC)': 'cui331elqf1uylegq',
      'International Research & Exchanges Board (IREX)': 'chb39fxlqf1uylegr',
      'International Society for Human Rights (ISHR)': 'cjbvrxtlqf1uylegs',
      'Internationale Gesellschaft für Menschenrechte (IGFM)': 'crum7nllqf1uylegt',
      'Ireland, Government of (Ireland)': 'crmlc13lqf1uylegu',
      'Irish Aid - Department of Foreign Affairs - Ireland (IrishAid)': 'c8zvg32lqf1uylegv',
      'Italian Agency for Development Cooperation (AICS)': 'ca6e1htlqf1uylegw',
      'Italy, Government of (Italy)': 'csm25mclqf1uylegx',
      'Japan International Cooperation Agency (JICA)': 'cz1sy5llqf1uylegy',
      'Japan Platform (JPF)': 'ckknd21lqf1uylegz',
      'Japan, Government of (Japan)': 'clo52jqlqf1uyleh0',
      'Johanniter International Assistance (JIA)': 'ckyafnhlqf1uyleh1',
      'Joint Distribution Committee (JDC)': 'cg7ojqylqf1uyleh2',
      'Joint Emergency Response in Ukraine (JERU)': 'cr4xnoxlqf1uyleh3',
      'KIA Foundation (KIA)': 'ch2bcchlqf1uyleh4',
      'Kidsave International (Kidsave)': 'crmo228lqf1uyleh5',
      'King Baudouin Foundation (KBF)': 'cna7voxlqf1uyleh6',
      'Kingdom of the Netherlands (KN)': 'cunsoyllqf1uyleh7',
      'Korea Foundation for International Healthcare (KOFIH)': 'cihple5lqf1uyleh8',
      'Korea, Republic of, Government of (Korea)': 'c1u51jqlqf1uyleh9',
      'Kuwait, Government of (Kuwait)': 'cx8iqhllqf1uyleha',
      'LEGO Foundation (LEGO)': 'c4h4kdjlqf1uylehb',
      'Latvia, Government of (Latvia)': 'cahjp51lqf1uylehc',
      'Leroy Merlin (LM)': 'c6b01tqlqf1uylehd',
      'Lithuania, Government of (Lithuania)': 'ch6kl6vlqf1uylehe',
      'Luxembourg Red Cross (LRC)': 'ci8b4lqlqf1uylehf',
      'Luxembourg, Government of (Luxembourg)': 'cze5845lqf1uylehg',
      'Malta, Government of (Malta)': 'ccfmojqlqf1uylehh',
      'Malteser International (MI)': 'c922fuflqf1uylehi',
      'Medair (Medair)': 'c85iflrlqf1uylehj',
      'Medecins Sans Frontieres Spain (MSF Spain)': 'cnn72jwlqf1uylehk',
      'Medecins du Monde Canada (MDM-CA)': 'c38ipq5lqf1uylehl',
      'Mental Health for Ukraine (MH4UA)': 'c5kr44tlqf1uylehm',
      'Mercy Corps (MC)': 'c42g3wblqf1uylehn',
      'Migrant Offshore Aid Station (MOAS)': 'cfcy0iclqf1uyleho',
      'Ministry for Europe and Foreign Affairs - France (MEAE France)': 'c99fuc7lqf1uylehp',
      'Ministry of Foreign Affairs - Denmark (MFA Denmark)': 'cpexwoplqf1uylehq',
      'Ministry of Foreign Affairs - Estonia (MFA Estonia)': 'cz3lgrnlqf1uylehr',
      'Ministry of Foreign Affairs - Finland (MFA Finland)': 'clf1n00lqf1uylehs',
      'Ministry of Foreign Affairs - Japan (MFA Japan)': 'cyqhg1rlqf1uyleht',
      'Ministry of Foreign Affairs - Netherlands (MFA Netherlands)': 'ckp87o2lqf1uylehu',
      'Ministry of Foreign Affairs - Norway (MFA Norway)': 'c7oxkgdlqf1uylehv',
      'Ministry of Foreign Affairs - Sweden (MFA Sweden)': 'c4bkdi2lqf1uylfhw',
      'Ministry of Foreign Affairs and International Cooperation - Italy (MFA Italy)': 'c5hqd3klqf1uylfhx',
      'Ministry of Foreign Affairs of the Czech Republic (MFA Czech)': 'cu69zjylqf1uylfhy',
      'Mission East (MEast)': 'cqwrw2slqf1uylfhz',
      'Monaco, Government of (Monaco)': 'cuj0hg8lqf1uylfi0',
      'Move Ukraine (MU)': 'cxdgduelqf1uylfi1',
      'National Endowment for Democracy (NED)': 'c3kztu4lqf1uylfi2',
      'NetJets (NetJets)': 'cn8yamqlqf1uylfi3',
      'Netherlands, Government of (Netherlands)': 'ccuof70lqf1uylfi4',
      'New Apostolic Church (NAK)': 'cdy2xevlqf1uylfi5',
      'New Zealand, Government of (New Zealand)': 'c4mb17ulqf1uylfi6',
      'Nippon International Cooperation for Community Development (NICCO)': 'crtxaq9lqf1uylfi7',
      'Nonviolent Peaceforce (NVPF)': 'ccrohn5lqf1uylfi8',
      'Norway, Government of (Norway)': 'cwtzjhslqf1uylfi9',
      'Norwegian Church Aid (NCA)': 'crcfsdulqf1uylfia',
      'Norwegian People\'s Aid (NPAID)': 'cmna78tlqf1uylfib',
      'Norwegian Red Cross (NORC)': 'c5m5bktlqf1uylfic',
      'Norwegian Refugee Council (NRC)': 'c9v889blqf1uylfid',
      'OM International (OM International)': 'cjk1q8klqf1uylfie',
      'Oak Foundation (Oak)': 'cqox59ulqf1uylfif',
      'Office for Foreign Affairs - Principality of Liechtenstein (MFA Liechtenstein)': 'cnzzoc7lqf1uylfig',
      'Office of Weapons Removal and Abatement in the U.S. State Department’s Bureau of Political-Military Affairs (PM/WRA)': 'c9jcxxflqf1uylfih',
      'Office the Ukrainian Parliament Commissioner for Human Rights (Ombudsman)': 'cvt9vd3lqf1uylfii',
      'Ole Kirk\'s Foundation (OKF)': 'ca7mk36lqf1uylfij',
      'Omaze (Omaze)': 'ca3m6oalqf1uylfik',
      'Oxfam International (Oxfam)': 'c7b7wqilqf1uylfil',
      'PMU InterLife (PMU)': 'cglosazlqf1uylfim',
      'Peace Winds Japan (PWJ)': 'cw32zi1lqf1uylfin',
      'Pentecostal Union (PU)': 'cllu804lqf1v04hio',
      'People In Need (PIN)': 'cap2jialqf1v04hip',
      'People in Peril (PIP)': 'cx5vboxlqf1v04hiq',
      'Philip Morris International (PMI)': 'crmgnnhlqf1v04hir',
      'Philippines, Government of (Philippines)': 'cy80cu7lqf1v04his',
      'Poland, Government of (Poland)': 'cjyv487lqf1v04hit',
      'Polish Medical Mission (PMM)': 'com7qedlqf1v04hiu',
      'Pomozi.ba (Pomozi.ba)': 'cgj4b1slqf1v04hiv',
      'Portugal, Government of (Portugal)': 'cesfj9ilqf1v04hiw',
      'Premiere Urgence Internationale (PUI)': 'crxb7dnlqf1v04hix',
      'Project Nadiya, USA (PNadiyaUS)': 'cvdl5aalqf1v04hiy',
      'RE/MAX (RE/MAX)': 'c1usrv1lqf1v04hiz',
      'RKESA (RKESA)': 'c80qxw8lqf1v04hj0',
      'RTL Foundation (RTLF)': 'ccrbytwlqf1v04hj1',
      'SOS Children\'s Villages (SOSCV)': 'cawckghlqf1v04hj2',
      'Samaritan Association of Latvia (LSA)': 'c8wut07lqf1v04hj3',
      'Samaritan\'s Purse (SPIR)': 'cgyzgeplqf1v04hj4',
      'Save the Children (SCI)': 'cg3rvcdlqf1v04hj5',
      'Serbia, Government of (Serbia)': 'cx0b5cdlqf1v04hj6',
      'ShelterBox (SB)': 'c4xhj4rlqf1v04hj7',
      'Sign of Hope (SoH)': 'c79a6c3lqf1v04hj8',
      'Slovakia, Government of (Slovakia)': 'c96v9ujlqf1v04hj9',
      'Slovenia, Government of (Slovenia)': 'cljm9x5lqf1v04hja',
      'Soleterre (Soleterre)': 'c73nhwzlqf1v04hjb',
      'Solidarités International (SI)': 'c62ggkllqf1v04hjc',
      'Spain, Government of (Spain)': 'cvscdkblqf1v04hjd',
      'Stichting Vluchteling - Refugee Foundation (SV)': 'cn6iu9plqf1v04hje',
      'Sweden, Government of (Sweden)': 'czf3xh3lqf1v04hjf',
      'Swedish International Development Cooperation Agency (Sida)': 'cfl714flqf1v04hjg',
      'Swiss Agency for Development and Cooperation (SDC)': 'ciwnhj9lqf1v04hjh',
      'Swiss Red Cross (SRC)': 'ce3d7f0lqf1v04hji',
      'Swiss Solidarity (Solidarity)': 'cf2tv3vlqf1v04hjj',
      'Switzerland, Government of (Switzerland)': 'cpu8tw4lqf1v04hjk',
      'Tearfund (TF)': 'ca7k94flqf1v04hjl',
      'Thailand, Government of (Thailand)': 'cxs2m4wlqf1v04hjm',
      'The Church of Jesus Christ of Latter-Day Saints (ChJC)': 'cefappglqf1v04hjn',
      'The Global Fund (GF)': 'c65yx82lqf1v04hjo',
      'Timor Leste, Government of (Timor Leste)': 'c62crmxlqf1v04hjp',
      'Triangle Generation Humanitaire (Triangle)': 'cnropc8lqf1v04hjq',
      'Tzu Chi Foundation (TzuChi)': 'cki9mlvlqf1v04hjr',
      'U.S. Department of State (DoS)': 'cq1zzmolqf1v04hjs',
      'U.S. Department of State\'s Bureau of Population, Refugees, and Migration (PRM)': 'cqaisj3lqf1v04hjt',
      'UBS (UBS)': 'caqt5cxlqf1v04hju',
      'UN Women (UNW)': 'cacfdkwlqf1v04hjv',
      'USAID / Disaster Assistance Response Team (DART)': 'csmjthzlqf1v04hjw',
      'USAID / U.S. Department of State\'s Bureau of Population, Refugees, and Migration (USAID-PRM)': 'cbixalclqf1v04hjx',
      'USAID Global Health Supply Chain Program (GHSC)': 'c2tjdoxlqf1v04hjy',
      'USAID\'s Bureau for Humanitarian Assistance (USAID/BHA)': 'c47kw7hlqf1v04hjz',
      'USAID\'s Country Development Cooperation Strategies (CDCS-USAID)': 'cofcmvblqf1v04hk0',
      'USAID\'s Office of U.S. Foreign Disaster Assistance (USAID/OFDA)': 'cf6ryqclqf1v04hk1',
      'Ukraine Humanitarian Fund (UHF)': 'c6qd7tylqf1v04hk2',
      'Ukrainian Deminers Association (UDA)': 'cow3v2rlqf1v04hk3',
      'Ukrainian Red Cross Society (URCS)': 'cg8kgnylqf1v04hk4',
      'Ukrainian Women\'s Fund (UWF)': 'ch9y8ndlqf1v04hk5',
      'United Arab Emirates, Government of (United Arab Emirates)': 'cnku3k5lqf1v04hk6',
      'United Kingdom, Government of (United Kingdom)': 'csuk32ulqf1v04hk7',
      'United Methodist Committee on Relief (UMCOR)': 'c6khktvlqf1v04hk8',
      'United Nations Children\'s Fund (UNICEF)': 'cjef90plqf1v04hk9',
      'United Nations Development Programme (UNDP)': 'c4isjeilqf1v04hka',
      'United Nations High Commissioner for Refugees (UNHCR)': 'cihxkshlqf1v04hkb',
      'United Nations Office for the Coordination of Humanitarian Affairs (OCHA)': 'c931hfmlqf1v04hkc',
      'United Nations Population Fund (UNFPA)': 'cjeb3nnlqf1v04hkd',
      'United States Agency for International Development (USAID)': 'cjd5nzolqf1v04hke',
      'United States of America, Government of (United States of America)': 'c1wscf6lqf1v04hkf',
      'Viet Nam, Government of (Viet Nam)': 'cf4q5z1lqf1v04hkg',
      'Vodafone Portugal (Vodafone PT)': 'cfhx26clqf1v04hkh',
      'Volkshilfe Österreich (Volkshilfe)': 'c5qpf26lqf1v04hki',
      'White Cross Union (WhiteCross)': 'cc87azrlqf1v04hkj',
      'World Bank (WB)': 'cqe0fnolqf1v04hkk',
      'World Childhood Foundation (WCF)': 'c8lpx6glqf1v04hkl',
      'World Food Programme (WFP)': 'cvvg1ahlqf1v04hkm',
      'World Health Organization (WHO)': 'cxrrv9qlqf1v04hkn',
      'World Telehealth Initiative (WTI)': 'ca98dunlqf1v04hko',
      'World Vision International (WVI)': 'cd743r2lqf1v04hkp',
      'ZOA (ZOA)': 'c7394ojlqf1v04ikr',
      '#stopsexting (#stopsexting)': 'c51lg7nlqf1v04iks',
      'EdCamp (EdCamp)': 'crbk0nblqf1v04ikt',
      'Enlightening Initiative (EI)': 'cf47ed7lqf1v04iku',
      'Finn Church Aid (FCA)': 'cytnpyllqf1v04ikv',
      'La Strada-Ukraine (LaStradaUA)': 'c43qe45lqf1v04ikw',
      'Mondo (MONDO)': 'chwuibslqf1v04ikx',
      'Montessori UA (Montessori)': 'c9y3pjtlqf1v04iky',
      'Posmishka UA Charity Fund (Posmishka)': 'cdiigzflqf1v04ikz',
      'Street Child (SC)': 'c7jien0lqf1v04il0',
      'Teach - for Ukraine (Teach)': 'cty8mdilqf1v04il1',
      'United Nations Educational, Scientific and Cultural Organization (UNESCO)': 'c9cuio5lqf1v04il2',
      'Direct Funding': 'ce5oq09lqf1v04il3',
      'Novo Nordisk (NN)': 'c8k5h5llqf1v04il4',
      'Howard G. Buffett Foundation (HBF)': 'c5ed3gtlqf1v04il5',
      'EU\'s Instrument contributing to Stability and Peace (IcSP)': 'c2aa74ilqf1v04il6',
      'East-SOS (East-SOS)': 'c6am6wxlqf1v04il7',
      'Fondation de France (FDF)': 'c6ryq9nlqf1v04il8',
      'CARE International (CARE I)': 'c5h586tlqf1v04il9',
      'War Child (WCH)': 'c5jambvlqf1v04ila',
      'Angels of Salvation (AOS)': 'cynoepnlqf1v04ilb',
      'Service for Foreign Policy Instruments (FPI)': 'cqgl9a8lqf1v04ilc',
      'Peace and Stabilization Operations Program Canada (PSOPs)': 'cdjhbwjlqf1v04ild',
      'Scottland, Government of (Scottland)': 'cgjsi79lqf1v04ile',
      'Pioneer (Pioneer)': 'cj7omgclqf1v04ilf',
      'Viterra (Viterra)': 'c785haalqf1v04ilg',
      'Cargill  (Cargill)': 'celnp5tlqf1v04ilh',
      'Association for Aid and Relief, Japan (AAR Japan)': 'clflnmxlqf1v04ili',
      'Plan International (PI)': 'czdezoulqf1v04ilj',
      'GIRO 555 (GIRO555)': 'cs1beyzlqf1v04ilk',
      'Lumos Foundation (Lumos)': 'cgpg6a3lqf1v04ill',
      'Fourfold Foundation (Fourfold)': 'czbn6x7lqf1v04ilm',
      'The Black Sea Trust for Regional Cooperation (BST)': 'cjw3xwslqf1v04iln',
      'Madrid City Council (Madrid CC)': 'cswh1i2lqf1v04ilo',
      'Necrosoft (Necrosoft)': 'cz9yr1glqf1v04ilp',
      'Verizon (Verizon)': 'cuemrholqf1v04ilq',
      'Voices of Children (VC)': 'chddwcrlqf1v04ilr',
      'United States Institute for Peace (USIP)': 'crn5mv3lqf1v04ils',
      'Ursula Zindel Hilti Foundation (UZH)': 'cnidew3lqf1v04ilt',
      'Mines Advisory Group International (MAG)': 'cmk0wfqlqf1v04ilu',
      'Tetra Tech (TetraTech)': 'c6gzcxhlqf1v04ilv',
      'EU Directorate General for International Partnerships (INTPA)': 'cdx6qtflqf1v04ilw',
      'Embassy of the Netherlands (NLEmbassy)': 'c8dzctylqf1v04ilx',
      'The Foundation by Dr. Friedrich Vogel-Stiftung (Vogel)': 'cxqd1bxlqf1v04ily',
      'Danish Red Cross (DRK)': 'c4jwfrslqf1v04ilz',
      'Liechtenstein, Government of (Liechtenstein)': 'cvhqioelqf1v04im0',
      'Ministry of Foreign Affairs of the Republic of Korea (MFA Korea)': 'cvpd6o4lqf1v04im1',
      'Ministry of Justice - Sweden (MJ Sweden)': 'cfx6mn2lqf1v04im2',
      'U.S. Department of State\'s Office to Monitor and Combat Trafficking in Persons (TIP)': 'cfhe3pelqf1v04im3',
      'USAID Mission to Ukraine (USAID Ukraine)': 'cxkvgl4lqf1v04im4',
      'ActionAid International (AAI)': 'c5mgr48lqf1v04im5',
      'Saxon State Parliament (SSP)': 'crj1yfnlqf1v04im6',
      'Caritas Korea (Caritas Korea)': 'cxo1t14lqf1v04im7',
      'Caritas Spain (Caritas Spain)': 'c5lovjjlqf1v04im8',
      'Australian Federation of Ukrainian Organisations (AFUO)': 'c3a8ckdlqf1v04im9',
      'Kindermissionswerk Die Sternsinger (Sternsinger)': 'c3uilcelqf1v04ima',
      'Razom (RZ)': 'c6adf60lqf1v04imb',
      'United Nations Office on Drugs and Crime (UNODC)': 'cuyboz5lqf1v04imc',
      'Nachbar in Not (NIN)': 'cm1v1pllqf1v04imd',
      'Danmarks Indsamling (DI)': 'cnkkh3alqf1v04ime',
      'Spanish Agency for International Development Cooperation (AECID)': 'cj1t6u1lqf1v04imf',
      'Cordaid (Cordaid)': 'cus3zyzlqf1v04img',
      '100% Life Rivne (100%Life Rivne)': 'ctfn1mulqf1v04imh',
      'Caritas France (Caritas France)': 'cd9i9pnlqf1v04imi',
      'Google.org (Google.org)': 'cr91nu6lqf1v04imj',
      'Office of the United Nations High Commissioner for Human Rights (OHCHR)': 'cwc2v2hlqf1v04imk',
      'Terre des Hommes (TDH)': 'c2j25b2lqf1v04iml',
      'Croatia, Government of the Republic of (Croatia)': 'cqf3whlqf1v04imm',
      'Augustinus Foundation (Augustinus)': 'cjqi0rilqf1v04imn',
      'Ministry of Foreign Affairs of the Republic of China (Taiwan) (MFA China)': 'ctm5ld4lqf1v04imo',
      'Netherlands Helsinki Committee (NHC)': 'cil991olqf1v04imp',
      'Global Partnership for Education (GPE)': 'cpy50xelqf1v04imq',
      'Food and Agriculture Organization (FAO)': 'c6bpfnclqf1v04imr',
      'World Vision Australia (WVA)': 'c88nv9xlqf1v04imt',
      'Support to Ukraine\'s Reforms for Governance Project (SURGe)': 'ct87wd6lqf1v04imu',
      'Libereco (Libereco)': 'c6ywiarlqf1v04imv',
      'Austrian Development Agency (ADA)': 'c2el4dglqf1v04imw',
      'Think Equal (TE)': 'cw5sd38lqf1v04imx',
      'Women\'s Peace & Humanitarian Fund (WPHF)': 'cq2sd7elqf1v04imy',
      'Resource Center of Non-Governmental Organizations (NGORC)': 'cfjsaeflqf1v04imz',
      'Polish Humanitarian Action (PAH)': 'cpid695lqf1v04in0',
      'Initiative Center to Support Social Action Ednannia (Ednannia)': 'c6rbnrrlqf1v04in1',
      'US Embassy in Ukraine (US Embassy)': 'c2yxkxxlqf1v04in2',
      'Consortium 12-12 (1212)': 'cgiet2ilqf1v04in3',
      'FMC Corporation (FMC)': 'cn53ryhlqf1v04in4',
      'International Centre for Migration Policy Development (ICMPD)': 'cipc7k4lqf1v04in5',
      'Ukrainian Education Platform (UEP)': 'ck3tk4qlqf1v04in6',
      'Regione Emilia Romagna (RER)': 'ce7oomlqf1v04in7',
      'Gilead Sciences (Gilead)': 'cmlu2aqlqf1v04in8',
      'World Jewish Relief (WJR)': 'cf0f4tilqf1v04in9',
      'Veterinarians Without Borders / Vétérinaires sans frontières - Canada (VWB/VSF Canada)': 'c9qv4c7lqf1v04ina',
      'Alinea International (Alinea)': 'ca5ju1mlqf1v04inb',
      'Kvinna till Kvinna Foundation (Kvinna)': 'c8hvkzwlqf1v04inc',
      'Postcode Ukraine (Postcode)': 'coptrlalqf1v04ind',
      'Danish Support Group Ukraine (DSGU)': 'ctv09eglqf1v04ine',
      'City of Power (CoP)': 'c338r0blqf1v04inf',
      'Lombardia Region, Italy (Lombardia)': 'cod6ptvlqf1v04ing',
      'ActionAid Italy (AAIT)': 'ckj41z5lqf1v04inh',
      'Center for Disaster Philanthropy (CDP)': 'cetgm3jlqf1v04ini',
      'Spirit of America (SOA)': 'cbyziqplqf1v04inj',
      'Xunta de Galicia (Spain) (XuntaSpain)': 'cokv8ozlqf1v04ink',
      'East Europe Foundation (EEF)': 'c86am8alqf1v04inl',
      'ITF Enhancing Human Security (ITF)': 'ckkeu1hlqf1v04inm',
      'Knights of Columbus (KOFC)': 'c22efn3lqf1v04inn',
      'Chemonics International (Chemonics)': 'cey63chlqf1v04ino',
      'World of Future (WF)': 'chxpbwyls90asrp2',
      'United Nations Joint Program on AIDS (UNAIDS)': 'craigttlsbnal9q2',
      'BlueCheck (BlueCheck)': 'cp84jjglsec9r652',
      'Deloitte (Deloitte)': 'cka8xtilsec9r653',
      'Concern Worldwide (CWW)': 'c4yd123lseo5olt2',
      'Help - Hilfe zur Selbsthilfe e.V. (HELP e.V.)': 'cmcb64slseoybqn3',
      'KfW Development Bank (KfW)': 'clankyalseozs1o4',
      'Norwegian Agency for Development Cooperation (Norad)': 'c2z87wrlseozs1o5',
      'ELIS (ELIS)': 'ck5tv7llsk72a8a2',
      'Diakonie Katastrophenhilfe (DK)': 'cxqg9oalsmzifht2',
      'Action Against Hunger (AAH)': 'cbrkl5olsoga77l2',
      'Charles Stewart Mott Foundation (Mott)': 'ck0k3rwlsoga77l3',
      'Multiple Donors (MDonors)': 'cd82qhhlsot2ppd3',
      'Beisheim Stiftung (Beisheim)': 'czd7a4ult2r7evm3',
      'OutcomesX (OutcomesX)': 'c1aw31hlt2r8g1q4',
      'Optima Education Center (Optima)': 'cc8zx2dlt2r95js5',
      'Caritas Slovenia (CaritasSVN)': 'cxl7gfalt320mld2',
      'Caritas Ukraine (CaritasUA)': 'cjp24oglt4bqjaz3c',
      'Catholic Near East Welfare Association Canada (CNEWA Canada)': 'c1ffsrzlt4jpkbe2',
      'GURT Resource Centre (GURT)': 'ckxsjk4lt77fno92',
      'Fund for Social Protection of Persons with Disabilities (FSPPWD)': 'cxsyfskltd0vq1w2',
      'Global Network of People Living with HIV (GNP+)': 'c8bajd8ltd0vq1w3',
      'Oxfam Great Britain (Oxfam GB)': 'cmvubk0ltd0vq1w4',
      'Ukraine, Government of (Ukraine)': 'cvwpdd2ltd0vq1w5',
      'MedGlobal (MG)': 'cyg2088ltd1bzqv6',
      'Department of Social Policy of Cherkasy City Council (DSPCHCC)': 'cuk5lcvltd4s7fo2',
      'Great Commission Society (GCS)': 'cet5i6sltei69gz2',
      'Ukrainian Catholic Education Foundation (UCEF)': 'c2f8s25ltekm1he3',
      'Presbyterian Church (USA) (PC USA)': 'c7zobh8ltekqtqf4',
      'The Ministry of Education and Research of Sweden (MERS)': 'cedoov6ltfszwfx3',
      'H&M Group (H&M)': 'ccp0pb8lth06ai73',
      'Mercedes-Benz US International (Mercedes)': 'cn46qttlth06ai74',
      'Kindernothilfe (Kindernothilfe)': 'cuzni1mlth70zu92',
      'Mondelēz International Foundation (Mondelez IF)': 'ctfnmsmltmoz6ed2',
      'PepsiCo Foundation (PepsiCo)': 'c6t524xltmoz6ed3',
      'Catholic Agency for Overseas Development (CAFOD)': 'cuy4atdltmq1f4b4',
      'Adventist Development and Relief Agency Deutschland e.V. (ADRA Deutschland)': 'c2nu5p1ltmye4so2',
      'GoodWill (GoodWill)': 'cvvk8hjltn07syv4',
      'Office of Perspective Development (OPR)': 'clzo8eltn0bj535',
      'Ensemble Ukraine (EUK)': 'c7vv0c4ltoj5u2n2',
      'Be a Hero for Ukraine (BAHFU)': 'c7q0bz5ltplqurj3',
      'Renovabis (Renovabis)': 'cx02p1yltplqurj4',
      'Unity and Strength (U&S)': 'cc8tk4vltplqurj5',
      'Private Donor (PDonor)': 'chzjdzxlu2f2sul2',
      'Trocaire (Trocaire)': 'cij5uf3lukuussn2',
      'SlovakAid (SlovakAid)': 'c9aa852lvariqm62',
      'Medico International (Medico)': 'cp7ao04lvxjtuvs2',
      'Embassy of Switzerland in Ukraine (CHEmbassy)': 'cgx9xg6lvz0inxz2'
    },
    'Indicators - MPCA': {
      '# of individuals assisted with multi-purpose cash assistance': 'cyj5n1elqb3qh9ba5',
      '# amount (USD) distributed through multi-purpose cash assistance': 'c7vtwjhlqb3qh9ba6',
      '% of households who report being able to meet their basic needs as they define and prioritize them': 'cd0hscblqb3qh9ba7',
      '% of recipients (disaggregated by sex, age, and disability) reporting that humanitarian assistance is delivered in a safe manner': 'c92m9uflqb3qh9ba8',
      '% of recipients (disaggregated by sex, age, and disability) reporting that humanitarian assistance is delivered in an accessible manner': 'czn5galqb3qh9ba9',
      '% of essential needs covered per sector': 'c64d3uwlqb3qh9baa',
      '% of recipients (disaggregated by sex, age, and disability) reporting that humanitarian assistance is delivered in a timely manner': 'c5at5eelqb3qh9bab'
    },
    'Payments Frequency': {
      'One-off': 'c22oxp8lqntdpktc',
      'Multiple payments': 'cigkge6lqnteihce'
    },
    'Financial Service Provider (FSP)': {
      'Bank Transfer': 'crpccsqlr0f2x6wc',
      'Digital Wallets': 'cqsen3tlsljp7rz8',
      'MoneyGram': 'cqfsd11lr0f5bzgf',
      'Private Post Office': 'ckvdcjxlr0f5vavh',
      'Ukrposhta (delivery)': 'c83wejdlsljok6h7',
      'Ukrposhta (pick up)': 'c56c4rhlr0f5hrkg',
      'Western Union': 'ca6qhyclr0f569te'
    },
    'Response Theme': {
      'No specific theme': 'clx2juzlqnt87pe2'
    },
    'Number of Covered Months': {
      'One month': 'czbonyjlqntauao5',
      'Two months': 'cokxxzhlqntc71k7',
      'Three months (recommended)': 'c6s6jv3lqntc9ua8',
      'Four months': 'cab6to9lqntckcz9',
      'Five months': 'ctsl3i3lqntco52a',
      'Six months': 'cwqi52ylqntcx15b'
    },
    'Population Group': {
      'Internally Displaced': 'cvw4on6lq6dgcoj5',
      'Non-Displaced': 'ck6ulx8lq6dgcok6',
      'Returnees': 'cuz9qi9lq6dgcok7'
    }
  }
}

// {
//   'changes'
// :
//   [{
//     'formId': 'c9vv9j8lqm633lj1tm',
//     'recordId': 'ckzcu54lvz4y5kt2',
//     'parentRecordId': null,
//     'fields': {
//       'cw67b3nlq6so74pf': 'czbgrslpwg36j52:cloyih3lpwhjdsu2r0',
//       'c53wwymlq6so74pg': 'czbgrslpwg36j52:cloyih3lpwhjdsu2r0',
//       'cxzc3wylqxzrn9i2': 'c80149tlqm62xpv1tk:cghgcrlltn5k1wn2',
//       'cmuq05dlqnsj7yqf': 'cf9uxrylqf1ttfc2:cjqi0rilqf1v04imn',
//       'ckv9joulsvxoptn2': 'cid2wxslqb3pzob9e:cyj5n1elqb3qh9ba5',
//       'c9aasnglqnsgaq6e': 0,
//       'cakkhd9lqntdpktd': 'c22oxp8lqntdpktc',
//       'c23tps3lu6qi1jq6': 'ce3ihfulu6qm5qe8',
//       'cjrs9bzlr0f2x6wd': 'crpccsqlr0f2x6wc',
//       'cb7ml4clqnt87pf3': 'clx2juzlqnt87pe2',
//       'cshl0i7lq6so74qp': 'cwlaxxlq3kp2bu5a:cvzx6adlq3la4du28i',
//       'cmol4qhlq6so74qv': '2024-01',
//       'c4t8d0xlqz50e1e2': '2024-01',
//       'c4aesi0lqz510nh3': '2024-01',
//       'canw5vhlqntauao6': 'c6s6jv3lqntc9ua8',
//       'cf6hv4zlq6so74qz': 'cf8ig2alq6dbe8t2:ck6ulx8lq6dgcok6',
//       'c8docc8lq6so74q12': 0,
//       'cxxa4fmlq6so74q13': 0,
//       'cihl0t2lq6so74q14': 0,
//       'cm5uwnwlq6so74q15': 0,
//       'csp8uxllq6so74q16': 0,
//       'cy3skbtlq6so74q17': 0,
//       'c91006ylq6so74r18': 0,
//       'cexzo0hlq6so74r19': 0,
//       'cll4mlllqp9p0mr4': 0,
//       'c3cim3lqp9pzl35': 0,
//       'cutta7glqp9qq8v6': 0,
//       'cyacnhzlqp9rkug7': 0,
//       'cyk1e6rlqp9s7sk8': 0,
//       'cwt6rrtlqp9sz659': 0
//     }
//   }]
// }