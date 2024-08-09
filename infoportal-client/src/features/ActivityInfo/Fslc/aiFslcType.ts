import {DrcProgram} from '@infoportal-common'

export namespace AiFslcType {
  type Opt<T extends keyof typeof options> = keyof (typeof options)[T]

  const activities = {
    'Distribution of in-kind food assistance': {
      'General Food Distribution': {
        '# of individuals receiving in-kind food assistance to ensure their immediate access to food': 'c9dypo1ls348s0b5'
      },
      'Rapid Response Ration': {
        '# of individuals receiving in-kind food assistance to ensure their immediate access to food': 'czaqo8pls348s0b6'
      },
      'Institutional feeding': {
        '# of individuals receiving in-kind food assistance to ensure their immediate access to food': 'c6eqanrls348s0b7'
      },
      'Hot meals': {
        '# of individuals receiving in-kind food assistance to ensure their immediate access to food': 'ckvrpisls348s0b8'
      }
    },
    'Provision of market-based assistance': {
      'Provision of market-based relief voucher assistance (value voucher or commodity voucher)': {
        '# of individuals receiving market-based assistance to ensure their immediate access to food': 'cz6z2r0ls348s0b9'
      }
    },
    'Agriculture and livestock inputs (in-kind)': {
      'Cereal seeds and tools': {
        '# of individuals provided with emergency agriculture and livestock inputs, contributing to their food consumption': 'cixs9g2ls348s0ba'
      },
      'Vegetable seed and tools': {
        '# of individuals provided with emergency agriculture and livestock inputs, contributing to their food consumption': 'cpebsb1ls348s0bb'
      },
      'Emergency livestock and poultry input (restocking, poultry distribution)': {
        '# of individuals provided with emergency agriculture and livestock inputs, contributing to their food consumption': 'cej6la3ls348s0bc'
      },
      'Support to livestock and poultry health': {
        '# of individuals provided with emergency agriculture and livestock inputs, contributing to their food consumption': 'cneib8ls348s0bd'
      },
      'Support to livestock and poultry feed': {
        '# of individuals provided with emergency agriculture and livestock inputs, contributing to their food consumption': 'cig2ayfls348s0be'
      },
      'Support to beekeepers (tools and equipment)': {
        '# of individuals provided with emergency agriculture and livestock inputs, contributing to their food consumption': 'ck031yals348s0bf'
      },
      'Training on agricultural practice': {
        '# of individuals provided with emergency agriculture and livestock inputs, contributing to their food consumption': 'c49afnvls348s0bg'
      }
    },
    'Agriculture and livestock inputs (cash)': {
      'Agricultural grants': {
        '# of individuals receiving sectoral cash to contributing to household food security': 'c6b7ldwls348s0bh'
      },
      'Sectoral cash for seeds and tools': {
        '# of individuals receiving sectoral cash to contributing to household food security': 'cih2ke9ls348s0bi'
      },
      'Sectoral cash for livestock and poultry input (restocking/distribution)': {
        '# of individuals receiving sectoral cash to contributing to household food security': 'c4s25icls348s0bj'
      },
      'Sectoral cash for temporary livestock shelter': {
        '# of individuals receiving sectoral cash to contributing to household food security': 'c3ivapgls348s0bk'
      },
      'Sectoral cash for animal feed': {
        '# of individuals receiving sectoral cash to contributing to household food security': 'cwp0gqrls348s0bl'
      },
      'Sectoral cash for livestock health': {
        '# of individuals receiving sectoral cash to contributing to household food security': 'cvhl3kyls348s0bm'
      }
    },
    'Temporary rehabilitation of the agricultural infrastructure, cooperative support, and value chain': {
      'Support to cooperatives and market linkages': {
        '# of individuals supported with rehabilitation of the agricultural infrastructure, cooperative support, and value chain': 'clelxdqls348s0bn'
      },
      'Temporary repair of grain and vegetable storage': {
        '# of individual farmers supported with repairs of their livestock shelter, grain, and vegetable storage': 'c5z99zsls348s0bo'
      },
      'Temporary repair of livestock shelter/barns': {
        '# of individual farmers supported with repairs of their livestock shelter, grain, and vegetable storage': 'cgo6mccls348s0bp'
      }
    },
    'Urban and off-farm (Non-agricultural) livelihoods': {
      'Small business grants (startup grants)': {
        '# of individuals provided with livelihoods assets restoration support, assistance in establishing small business, and skills enhancing employability': 'c1v7epols348s0bq'
      },
      'Cash for work': {
        '# of individuals provided with livelihoods assets restoration support, assistance in establishing small business, and skills enhancing employability': 'cs92sbbls348s0br'
      },
      'Employment and reskilling': {
        '# of individuals provided with livelihoods assets restoration support, assistance in establishing small business, and skills enhancing employability': 'cl2lo8pls348s0bs'
      },
      'Job placement and counseling': {
        '# of individuals provided with livelihoods assets restoration support, assistance in establishing small business, and skills enhancing employability': 'c4pozswls348s0bt'
      },
      'Temporary employment programs': {
        '# of individuals provided with livelihoods assets restoration support, assistance in establishing small business, and skills enhancing employability': 'c9shzxfls348s0bu'
      },
      'Technical and vocational education and training (TVET)': {
        '# of individuals provided with livelihoods assets restoration support, assistance in establishing small business, and skills enhancing employability': 'cyatasals348s0bv'
      },
      'Bussiness trainings and skill enhancement workshops': {
        '# of individuals provided with livelihoods assets restoration support, assistance in establishing small business, and skills enhancing employability': 'c68psfcls348s0bw'
      }
    }
  }


  export interface Type {
    'Reporting Month': string,
    'Reporting Organization': Opt<'Reporting Organization'>,
    'Implementing Partner'?: Opt<'Implementing Partner'>,
    'Activity Plan Code': Opt<'Activity Plan Code'>,
    'Activity and indicator': Opt<'Activity and indicator'>,
    'Implementation Status': Opt<'Implementation Status'>,
    'Frequency'?: Opt<'Frequency'>,
    'Modality': Opt<'Modality'>,
    'Kcal covered  (per person per day)'?: number,
    'Unit'?: Opt<'Unit'>,
    'Total Quantity distributed (per person)'?: number,
    'Total Value (local currency)'?: number,
    'Currency'?: Opt<'Currency'>,
    'Cash delivery mechanism'?: Opt<'Cash delivery mechanism'>,
    'Oblast': string,
    'Raion': string,
    'Hromada': string,
    'Settlement'?: string,
    'Location type'?: Opt<'Location type'>,
    'Population Group': Opt<'Population Group'>,
    'Number of people reached': number,
    'Girls (0-17)': number,
    'Boys (0-17)': number,
    'Adult Women (18-59)': number,
    'Adult Men (18-59)': number,
    'Older Women (60+)': number,
    'Older Men (60+)': number,
    'Number of people with disability'?: number,
    'Number of reached households'?: number,
    'New beneficiaries (same activity)': number,
    'Were these people reached in 2024 by another FSL sub-activity?': Opt<'Were these people reached in 2024 by another FSL sub-activity?'>,
    'If yes, which sub-activity'?: Opt<'If yes, which sub-activity'>,
    'If yes, how many people received from both sub-activities'?: number,
    'Comments'?: string
  }

  export const map = (a: Type) => ({
    'c5xzo7ilqc8soyxy': a['Reporting Month'] === undefined ? undefined : a['Reporting Month'],
    'c3x7t6ylqc66x155': a['Reporting Organization'] === undefined ? undefined : 'czbgrslpwg36j52' + ':' + options['Reporting Organization'][a['Reporting Organization']!],
    'cuemiqzlqc6c2k88': a['Implementing Partner'] === undefined ? undefined : 'czbgrslpwg36j52' + ':' + options['Implementing Partner'][a['Implementing Partner']!],
    'c47kem6ls28yvcg4': a['Activity Plan Code'] === undefined ? undefined : 'cjjdxkylqdjn7p72' + ':' + options['Activity Plan Code'][a['Activity Plan Code']!],
    'cwboqx7lqc9cx5i12': a['Activity and indicator'] === undefined ? undefined : 'cvseljqlqb3ntvj7j' + ':' + options['Activity and indicator'][a['Activity and indicator']!],
    'c3lymiilqc9r6qr14': a['Implementation Status'] === undefined ? undefined : options['Implementation Status'][a['Implementation Status']!],
    'cp6l488lqca6as81s': a['Frequency'] === undefined ? undefined : options['Frequency'][a['Frequency']!],
    // 'cc8x4wylqc9v51s19': a['Modality'] === undefined ? undefined : options['Modality'][a['Modality']!],
    'c14yq8gls26mj3nc': a['Kcal covered  (per person per day)'] === undefined ? undefined : a['Kcal covered  (per person per day)'],
    'cet46puls26p5noe': a['Unit'] === undefined ? undefined : options['Unit'][a['Unit']!],
    'c4hr51dls270cnki': a['Total Quantity distributed (per person)'] === undefined ? undefined : a['Total Quantity distributed (per person)'],
    'chs58s3lqca2w271q': a['Total Value (local currency)'] === undefined ? undefined : a['Total Value (local currency)'],
    'c9axoqdlqca1d331n': a['Currency'] === undefined ? undefined : options['Currency'][a['Currency']!],
    'cxjlomilqc9wp9b1c': a['Cash delivery mechanism'] === undefined ? undefined : options['Cash delivery mechanism'][a['Cash delivery mechanism']!],
    'cddimyllqc7p5vdk': a['Oblast'] === undefined ? undefined : 'cemuxawlq3kfmqf2' + ':' + a['Oblast'],
    'cgzvhgwlqc7zjuvl': a['Raion'] === undefined ? undefined : 'cd5q9sdlq3kklo314' + ':' + a['Raion'],
    'cluq8u7lqc81x2bm': a['Hromada'] === undefined ? undefined : 'cwlaxxlq3kp2bu5a' + ':' + a['Hromada'],
    'cn8bos4lqc84hi0n': a['Settlement'] === undefined ? undefined : 'cfn5ltdlq3lbcb95w' + ':' + a['Settlement'],
    'c1m3xohls2786wqk': a['Location type'] === undefined ? undefined : options['Location type'][a['Location type']!],
    'c68n3qzlqc981m410': a['Population Group'] === undefined ? undefined : 'cf8ig2alq6dbe8t2' + ':' + options['Population Group'][a['Population Group']!],
    'cdhyf9tlqcab8261z': a['Number of people reached'] === undefined ? undefined : a['Number of people reached'],
    'cii0393lqcajgwu21': a['Girls (0-17)'] === undefined ? undefined : a['Girls (0-17)'],
    'cbmkl0klqcale6622': a['Boys (0-17)'] === undefined ? undefined : a['Boys (0-17)'],
    'c5xgzvblqcamsrx23': a['Adult Women (18-59)'] === undefined ? undefined : a['Adult Women (18-59)'],
    'chcj26blqcax7ou24': a['Adult Men (18-59)'] === undefined ? undefined : a['Adult Men (18-59)'],
    'cgzc21slqcaxhqn25': a['Older Women (60+)'] === undefined ? undefined : a['Older Women (60+)'],
    'cqoejaglqcay3pr26': a['Older Men (60+)'] === undefined ? undefined : a['Older Men (60+)'],
    'cq4uxglqcayeav27': a['Number of people with disability'] === undefined ? undefined : a['Number of people with disability'],
    'caomv6mls27r2m3t': a['Number of reached households'] === undefined ? undefined : a['Number of reached households'],
    'ck0g4kpls27s7dvu': a['New beneficiaries (same activity)'] === undefined ? undefined : a['New beneficiaries (same activity)'],
    'c2jbl2kls27x2tow': a['Were these people reached in 2024 by another FSL sub-activity?'] === undefined ? undefined : options['Were these people reached in 2024 by another FSL sub-activity?'][a['Were these people reached in 2024 by another FSL sub-activity?']!],
    'chpi4dhls8w61ct2': a['If yes, which sub-activity'] === undefined ? undefined : 'cvseljqlqb3ntvj7j' + ':' + options['If yes, which sub-activity'][a['If yes, which sub-activity']!],
    'cad7my8ls282dx115': a['If yes, how many people received from both sub-activities'] === undefined ? undefined : a['If yes, how many people received from both sub-activities'],
    'ctbdca9ls28349s16': a['Comments'] === undefined ? undefined : a['Comments']
  })

  export const options = {
    'Reporting Organization': {
      'Danish Refugee Council': 'cloyih3lpwhjdsu2r0'
    },
    'Implementing Partner': {
      'Danish Refugee Council': 'cloyih3lpwhjdsu2r0'
    },
    'Activity Plan Code': {
      'FSLC-DRC-00001': 'csp3fvaltn0j3ou2',
      'FSLC-DRC-00002': 'cbcn08hltn0lsg03',
      'FSLC-DRC-00003': 'cex9iwdltn0pa1y4',
    },
    'Activity and indicator': {
      [DrcProgram.SectoralCashForAgriculture]: 'cv58tzkluclbdwv3',
      [DrcProgram.SectoralCashForAnimalFeed]: 'cx8imqaluclbdwv7',
      [DrcProgram.SectoralCashForAnimalShelterRepair]: 'cy77eh2luclbdwvb',
      [DrcProgram.VET]: 'ca0kvknluclbdwvy', // Found manually from AI
      // [DrcProgram.SectoralCashForAgriculture]: activities['Agriculture and livestock inputs (cash)']['Agricultural grants']['# of individuals receiving sectoral cash to contributing to household food security'],
      // [DrcProgram.SectoralCashForAnimalFeed]: activities['Agriculture and livestock inputs (cash)']['Sectoral cash for animal feed']['# of individuals receiving sectoral cash to contributing to household food security'],
      // [DrcProgram.SectoralCashForAnimalShelterRepair]: activities['Temporary rehabilitation of the agricultural infrastructure, cooperative support, and value chain']['Temporary repair of livestock shelter/barns']['# of individual farmers supported with repairs of their livestock shelter, grain, and vegetable storage'],
    },
    'Implementation Status': {
      'Completed': 'cg07fuklqc9r6qq13',
      'Ongoing': 'c6s86zqlqc9sloo15'
    },
    'Frequency': {
      'Weekly': 'cobeyzclqca6as81r',
      'Fortnight': 'cy66rvklqca75ce1t',
      'Monthly': 'cr09863lqca7avy1u',
      'Quarterly': 'c672byclqca7ezi1v',
      'One-off': 'cgjbd91lqca7msv1w',
      'Other': 'cdfo485lqca7xym1x'
    },
    'Modality': {
      'In-kind': 'c3jort9lqc9v51s18',
      'Service': 'c1zk7xolqc9vuvs1a',
      'Cash': 'clm9r4bls26ivpt8',
      'Voucher': 'c5qzjvzls26izg19'
    },
    'Unit': {
      'Tons': 'c19r7opls26p5nod',
      'Kilograms': 'cmdpumdls26qzmof',
      'Grams': 'cwoj9z1ls26r2a7g',
      'Trainings': 'c1llff3ls26rdo9h',
      'Animals': 'cuvmooilsogvr3q2'
    },
    'Currency': {
      'EUR': 'c4kgwg9lqca2b8e1o',
      'UAH': 'cuc2fcqlqca1d331m',
      'USD': 'cxfbx1plqca2e4m1p'
    },
    'Cash delivery mechanism': {
      'ATM Card': 'ccupph2lqc9wp9b1b',
      'Bank Transfer': 'cm3fx07lqc9xsyg1d',
      'Direct cash payment': 'cfpj6qglqc9xymn1e',
      'E-transfer': 'crpuyxwlqc9ycad1f',
      'E-voucher': 'cn3kwz7lqc9ygev1g',
      'Mobile Money': 'cm8mloclqc9ymrq1h',
      'Money Transfer Agent': 'c9wcc13lqc9z1j91i',
      'Paper Voucher': 'cr6f8z3lqc9z9f21j',
      'Post Office': 'cf1261jlqc9ze661k',
      'Other mechanisms': 'cybkw5hlqc9zj3k1l'
    },
    'Location type': {
      'Rural': 'cazwy1bls2786wqj',
      'Urban / Peri-urban': 'cd7dhfvls279bv8l',
      'Collective centers': 'cqhhz4als279lhqm',
      'Health Institution': 'cqi9ossls279thwn',
      'Educational institution': 'cfyj2e3ls279vcyo',
      'Social Institution': 'cszqcjxls27a1qlp',
      'Charity / NGO': 'cijxlcnls27acalq',
      'Local authority': 'c4w31sls27ahbir',
      'Other': 'cer3u3yls27amhjs'
    },
    'Population Group': {
      'Internally Displaced': 'cvw4on6lq6dgcoj5',
      'Non-Displaced': 'ck6ulx8lq6dgcok6',
      'Returnees': 'cuz9qi9lq6dgcok7'
    },
    'Were these people reached in 2024 by another FSL sub-activity?': {
      'Yes': 'cmqxgadls27x2tov',
      'No': 'clcxcdzls27xkm0x'
    },
    'If yes, which sub-activity': {
      // "FSL": 'c9dypo1ls348s0b5',
      // "FSL": 'czaqo8pls348s0b6',
      // "FSL": 'c6eqanrls348s0b7',
      // "FSL": 'ckvrpisls348s0b8',
      // "FSL": 'cz6z2r0ls348s0b9',
      // "FSL": 'cixs9g2ls348s0ba',
      // "FSL": 'cpebsb1ls348s0bb',
      // "FSL": 'cej6la3ls348s0bc',
      // "FSL": 'cneib8ls348s0bd',
      // "FSL": 'cig2ayfls348s0be',
      // "FSL": 'ck031yals348s0bf',
      // "FSL": 'c49afnvls348s0bg',
      // "FSL": 'c6b7ldwls348s0bh',
      // "FSL": 'cih2ke9ls348s0bi',
      // "FSL": 'c4s25icls348s0bj',
      // "FSL": 'c3ivapgls348s0bk',
      // "FSL": 'cwp0gqrls348s0bl',
      // "FSL": 'cvhl3kyls348s0bm',
      // "FSL": 'clelxdqls348s0bn',
      // "FSL": 'c5z99zsls348s0bo',
      // "FSL": 'cgo6mccls348s0bp',
      // "FSL": 'c1v7epols348s0bq',
      // "FSL": 'cs92sbbls348s0br',
      // "FSL": 'cl2lo8pls348s0bs',
      // "FSL": 'c4pozswls348s0bt',
      // "FSL": 'c9shzxfls348s0bu',
      // "FSL": 'cyatasals348s0bv',
      // "FSL": 'c68psfcls348s0bw'
    }
  }

}