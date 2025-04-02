import {Obj, seq} from '@axanc/ts-utils'
import {OblastName} from '../location/index.js'

export enum DrcOffice {
  Kyiv = 'Kyiv',
  Sumy = 'Sumy',
  Mykolaiv = 'Mykolaiv',
  Lviv = 'Lviv',
  Chernihiv = 'Chernihiv',
  Kharkiv = 'Kharkiv',
  Dnipro = 'Dnipro',
  Poltava = 'Poltava',
  Chernivtsi = 'Chernivtsi',
  Sloviansk = 'Sloviansk',
  Ivankiv = 'Ivankiv',
  Ichna = 'Ichna',
  Kherson = 'Kherson',
  Zaporizhzhya = 'Zaporizhzhya',
}

export const oblastByDrcOffice: Record<DrcOffice, OblastName> = {
  Kyiv: 'Kyivska',
  Sumy: 'Sumska',
  Mykolaiv: 'Mykolaivska',
  Lviv: 'Lvivska',
  Chernihiv: 'Chernihivska',
  Kharkiv: 'Kharkivska',
  Dnipro: 'Dnipropetrovska',
  Poltava: 'Poltavska',
  Chernivtsi: 'Chernihivska',
  Sloviansk: 'Donetska',
  Ivankiv: 'Ivano-Frankivska',
  Ichna: 'Chernihivska',
  Kherson: 'Khersonska',
  Zaporizhzhya: 'Zaporizka',
}

export const drcOffices = Obj.values(DrcOffice)

export enum DrcSector {
  NFI = 'NFI',
  WaSH = 'WaSH',
  Education = 'Education',
  GeneralProtection = 'GeneralProtection',
  DrcSector = 'DrcSector',
  Livelihoods = 'Livelihoods',
  FoodSecurity = 'FoodSecurity',
  MPCA = 'MPCA',
  Health = 'Health',
  Nutrition = 'Nutrition',
  Shelter = 'Shelter',
  Evacuations = 'Evacuations',
  GBV = 'GBV',
  EORE = 'EORE',
  PSS = 'PSS',
  VA = 'VA',
}

export enum DrcProgram {
  CashForFuel = 'CashForFuel',
  CashForUtilities = 'CashForUtilities',
  CashForRent = 'CashForRent',
  CashForRepair = 'CashForRepair',
  CashForEducation = 'CashForEducation',
  MPCA = 'MPCA',
  NFI = 'NFI',
  ShelterRepair = 'ShelterRepair',
  Referral = 'Referral',
  ESK = 'ESK',
  InfantWinterClothing = 'InfantWinterClothing',
  HygieneKit = 'HygieneKit',
  SectoralCashForAgriculture = 'SectoralCashForAgriculture',
  VET = 'VET',
  MSME = 'MSME',
  SectoralCashForAnimalShelterRepair = 'SectoralCashForAnimalShelterRepair',
  SectoralCashForAnimalFeed = 'SectoralCashForAnimalFeed',
  Counselling = 'Counselling',
  PSS = 'PSS',
  // GBV = 'GBV',
  ProtectionMonitoring = 'ProtectionMonitoring',
  AwarenessRaisingSession = 'AwarenessRaisingSession',
  CommunityLevelPm = 'CommunityLevelPm',
  Legal = 'Legal',
  FGD = 'FGD',
  Observation = 'Observation',
  WGSS = 'WGSS',
  DignityKits = 'DignityKits',
  CaseManagement = 'CaseManagement',
  LegalAid = 'LegalAid',
  CapacityBuilding = 'CapacityBuilding',
  MHPSSActivities = 'MHPSSActivities',
  PGS = 'PsychosocialGroupSession',
  PIS = 'PsychosocialIndividualSession',
  PFA = 'PsychologicalFirstAid',
  TIA = 'TIA',
}

export class DrcSectorHelper {
  private static readonly byProgram: Record<DrcProgram, DrcSector[]> = {
    CashForFuel: [DrcSector.Shelter],
    CashForUtilities: [DrcSector.Shelter],
    CashForRent: [DrcSector.Shelter],
    CashForRepair: [DrcSector.Shelter],
    CashForEducation: [DrcSector.Education],
    MPCA: [DrcSector.MPCA],
    NFI: [DrcSector.NFI],
    ShelterRepair: [DrcSector.Shelter],
    ESK: [DrcSector.Shelter],
    InfantWinterClothing: [DrcSector.NFI],
    HygieneKit: [DrcSector.NFI],
    Referral: [DrcSector.GeneralProtection],
    SectoralCashForAgriculture: [DrcSector.Livelihoods],
    VET: [DrcSector.Livelihoods],
    MSME: [DrcSector.Livelihoods],
    SectoralCashForAnimalShelterRepair: [DrcSector.Livelihoods],
    SectoralCashForAnimalFeed: [DrcSector.Livelihoods],
    Counselling: [DrcSector.GeneralProtection],
    PSS: [DrcSector.GeneralProtection],
    ProtectionMonitoring: [DrcSector.GeneralProtection],
    CommunityLevelPm: [DrcSector.GeneralProtection],
    Legal: [DrcSector.GeneralProtection],
    FGD: [DrcSector.GeneralProtection],
    Observation: [DrcSector.GeneralProtection],
    WGSS: [DrcSector.GBV], //	# of women and girls who received recreational and livelihood skills including vocational education sessions in women and girls safe spaces
    DignityKits: [DrcSector.GBV], //	# of women and girls at risk who received dignity kits
    CapacityBuilding: [DrcSector.GBV], //	# of non-GBV service providers trained on GBV prevention, risk mitigation and referrals that meet GBViE minimum standards
    MHPSSActivities: [DrcSector.PSS],
    PsychosocialGroupSession: [DrcSector.PSS],
    CaseManagement: [DrcSector.GBV], //	# of individuals reached with humanitarian cash and voucher assistance for GBV case management and
    AwarenessRaisingSession: [DrcSector.GeneralProtection, DrcSector.GBV], //	# of individuals reached with awareness-raising activities and GBV-life-saving information
    LegalAid: [DrcSector.GBV], //	# of individuals at risk supported with GBV specialized legal assistance and counseling
    PsychosocialIndividualSession: [DrcSector.PSS],
    PsychologicalFirstAid: [DrcSector.PSS],
    TIA: [DrcSector.VA],
    //	# of operational women and girls\' safe spaces
    // CapacityBuilding: DrcSector.GBV,	//	# of GBV service providers trained on GBV prevention and response that meet GBViE minimum standards
  } as const

  private static readonly autoValidatedActivity = new Set([
    DrcProgram.NFI,
    DrcProgram.HygieneKit,
    DrcProgram.ESK,
    DrcProgram.InfantWinterClothing,
  ])
  static readonly isAutoValidatedActivity = (_: DrcProgram) => DrcSectorHelper.autoValidatedActivity.has(_)

  static readonly findFirstByProgram = (p: DrcProgram): DrcSector => {
    // @ts-ignore
    return DrcSectorHelper.byProgram[p][0]
  }
}

export const drcOfficeShort: Record<DrcOffice, string> = {
  [DrcOffice.Kyiv]: 'KYV',
  [DrcOffice.Sumy]: 'UMY',
  [DrcOffice.Mykolaiv]: 'NLV',
  [DrcOffice.Lviv]: 'LWO',
  [DrcOffice.Chernihiv]: 'CEJ',
  [DrcOffice.Kharkiv]: 'HRK',
  [DrcOffice.Dnipro]: 'DNK',
  [DrcOffice.Poltava]: 'Poltava',
  [DrcOffice.Chernivtsi]: 'Chernivtsi',
  [DrcOffice.Sloviansk]: 'Sloviansk',
  [DrcOffice.Ivankiv]: 'Ivankiv',
  [DrcOffice.Ichna]: 'Ichna',
  [DrcOffice.Kherson]: 'Kherson',
  [DrcOffice.Zaporizhzhya]: 'Zaporizhzhya',
}

export enum DrcDonor {
  PFRU = 'PFRU',
  GFFO = 'GFFO',
  DMFA = 'DMFA',
  BHA = 'BHA',
  ECHO = 'ECHO',
  SDC = 'SDC',
  FCDO = 'FCDO',
  OKF = 'OKF',
  PSPU = 'PSPU',
  PoolFunds = 'PoolFunds',
  FINM = 'FINM',
  FREM = 'FREM',
  EUIC = 'EUIC',
  PMRA = 'PMRA',
  PMKA = 'PMKA',
  SIDA = 'SIDA',
  UHF = 'UHF',
  UNHC = 'UNHC',
  DANI = 'DANI',
  DUT = 'DUT',
  NovoNordisk = 'NovoNordisk',
  SDCS = 'SDCS',
  MOFA = 'MOFA',
  AugustinusFonden = 'AugustinusFonden',
  HoffmansAndHusmans = 'HoffmansAndHusmans',
  None = 'None',
}

export const drcDonorTranlate: Record<DrcDonor, string> = {
  PFRU: 'PFRU',
  GFFO: 'GFFO',
  DMFA: 'DMFA',
  BHA: 'BHA',
  ECHO: 'ECHO',
  SDC: 'SDC',
  FCDO: 'FCDO',
  OKF: 'OKF',
  PSPU: 'PSPU',
  PoolFunds: 'Pooled Funds',
  FINM: 'FINM',
  FREM: 'FREM',
  EUIC: 'EUIC',
  PMRA: 'PMRA',
  PMKA: 'PMKA',
  SIDA: 'SIDA',
  UHF: 'UHF',
  UNHC: 'UNHC',
  DANI: 'Danida',
  DUT: 'DUT',
  NovoNordisk: 'Novo Nordisk',
  SDCS: 'SDCS',
  MOFA: 'MOFA',
  AugustinusFonden: 'Augustinus Fonden',
  HoffmansAndHusmans: 'Hoffmans & Husmans',
  None: 'None',
}

export enum DrcProject {
  'UKR-000226 SDC' = 'UKR-000226 SDC',
  'UKR-000230 PM WRA' = 'UKR-000230 PM WRA',
  'UKR-000231 PM WKA' = 'UKR-000231 PM WKA',
  'UKR-000247 FCDO' = 'UKR-000247 FCDO',
  'UKR-000249 Finnish MFA' = 'UKR-000249 Finnish MFA',
  'UKR-000255 EU IcSP' = 'UKR-000255 EU IcSP',
  'UKR-000267 DANIDA' = 'UKR-000267 DANIDA',
  'UKR-000269 ECHO1' = 'UKR-000269 ECHO1',
  'UKR-000270 Pooled Funds' = 'UKR-000270 Pooled Funds',
  'UKR-000270 Pooled Funds Old (MPCA)' = 'UKR-000270 Pooled Funds Old (MPCA)',
  'UKR-000274 Novo-Nordilsk' = 'UKR-000274 Novo-Nordilsk',
  'UKR-000276 UHF3' = 'UKR-000276 UHF3',
  'UKR-000284 BHA' = 'UKR-000284 BHA',
  'UKR-000286 DMFA' = 'UKR-000286 DMFA',
  'UKR-000290 SDC Shelter' = 'UKR-000290 SDC Shelter',
  'UKR-000293 French MFA' = 'UKR-000293 French MFA',
  'UKR-000294 Dutch I' = 'UKR-000294 Dutch I',
  'UKR-000298 Novo-Nordisk' = 'UKR-000298 Novo-Nordisk',
  'UKR-000301 DANISH MoFA' = 'UKR-000301 DANISH MoFA',
  'UKR-000304 PSPU' = 'UKR-000304 PSPU',
  'UKR-000306 Dutch II' = 'UKR-000306 Dutch II',
  'UKR-000308 UNHCR' = 'UKR-000308 UNHCR',
  'UKR-000309 OKF' = 'UKR-000309 OKF',
  'UKR-000331 GFFO' = 'UKR-000331 GFFO',
  'UKR-000314 UHF4' = 'UKR-000314 UHF4',
  'UKR-000322 ECHO2' = 'UKR-000322 ECHO2',
  'UKR-000323 PFRU' = 'UKR-000323 PFRU',
  'UKR-000330 SDC2' = 'UKR-000330 SDC2',
  'UKR-000336 UHF6' = 'UKR-000336 UHF6',
  'UKR-000340 Augustinus Fonden' = 'UKR-000340 Augustinus Fonden',
  'UKR-000341 Hoffmans & Husmans' = 'UKR-000341 Hoffmans & Husmans',
  'UKR-000342 Pooled Funds' = 'UKR-000342 Pooled Funds',
  'UKR-000345 BHA2' = 'UKR-000345 BHA2',
  'UKR-000347 DANIDA' = 'UKR-000347 DANIDA',
  'UKR-000348 BHA3' = 'UKR-000348 BHA3',
  'UKR-000350 SIDA' = 'UKR-000350 SIDA',
  'UKR-000352 UHF7' = 'UKR-000352 UHF7',
  'UKR-000355 Danish MFA' = 'UKR-000355 Danish MFA',
  'UKR-000360 Novo-Nordisk' = 'UKR-000360 Novo-Nordisk',
  'UKR-000363 UHF8' = 'UKR-000363 UHF8',
  'UKR-000390 UHF9' = 'UKR-000390 UHF9',
  // @deprecated wrong code 371, it should be 372
  'UKR-000370 SIDA' = 'UKR-000370 SIDA',
  'UKR-000371 ECHO3' = 'UKR-000371 ECHO3',
  'UKR-000372 ECHO3' = 'UKR-000372 ECHO3',
  'UKR-000373 Novo-Nordilsk' = 'UKR-000373 Novo-Nordilsk',
  'UKR-000378 Danish MFA' = 'UKR-000378 Danish MFA',
  'UKR-000380 DANIDA' = 'UKR-000380 DANIDA',
  'UKR-000385 Pooled Funds' = 'UKR-000385 Pooled Funds',
  'UKR-000386 Pooled Funds' = 'UKR-000386 Pooled Funds',
  'UKR-000388 BHA' = 'UKR-000388 BHA',
  'UKR-000396 Danish MFA' = 'UKR-000396 Danish MFA',
  'UKR-000397 GFFO' = 'UKR-000397 GFFO',
  'UKR-000399 SDC3' = 'UKR-000399 SDC3',
  'SIDA 518-570A' = 'SIDA 518-570A',
  'UKR-000316 UHF5' = 'UKR-000316 UHF5',
  'UKR-000329 SIDA H2R' = 'UKR-000329 SIDA H2R',
  'UKR-000291_292 UNHCR' = 'UKR-000291_292 UNHCR',
  'UKR-000xxx DANIDA' = 'UKR-000xxx DANIDA',
  'UKR-000399 SDC' = 'UKR-000399 SDC',
  'None' = 'None',
}

export const allProjects = Obj.values(DrcProject)

export class DrcProjectHelper {
  static readonly list = Obj.keys(DrcProject)

  static readonly donorByProject: Record<DrcProject, DrcDonor> = {
    'UKR-000226 SDC': DrcDonor.SDC,
    'UKR-000230 PM WRA': DrcDonor.PMRA,
    'UKR-000231 PM WKA': DrcDonor.PMKA,
    'UKR-000247 FCDO': DrcDonor.FCDO,
    'UKR-000249 Finnish MFA': DrcDonor.FINM,
    'UKR-000255 EU IcSP': DrcDonor.EUIC,
    'UKR-000267 DANIDA': DrcDonor.DANI,
    'UKR-000269 ECHO1': DrcDonor.ECHO,
    'UKR-000270 Pooled Funds': DrcDonor.PoolFunds,
    'UKR-000270 Pooled Funds Old (MPCA)': DrcDonor.PoolFunds,
    'UKR-000274 Novo-Nordilsk': DrcDonor.NovoNordisk,
    'UKR-000276 UHF3': DrcDonor.UHF,
    'UKR-000284 BHA': DrcDonor.BHA,
    'UKR-000286 DMFA': DrcDonor.DMFA,
    'UKR-000290 SDC Shelter': DrcDonor.SDCS,
    'UKR-000293 French MFA': DrcDonor.FREM,
    'UKR-000294 Dutch I': DrcDonor.DUT,
    'UKR-000298 Novo-Nordisk': DrcDonor.NovoNordisk,
    'UKR-000301 DANISH MoFA': DrcDonor.MOFA,
    'UKR-000304 PSPU': DrcDonor.PSPU,
    'UKR-000306 Dutch II': DrcDonor.DUT,
    'UKR-000308 UNHCR': DrcDonor.UNHC,
    'UKR-000309 OKF': DrcDonor.OKF,
    'UKR-000331 GFFO': DrcDonor.GFFO,
    'UKR-000314 UHF4': DrcDonor.UHF,
    'UKR-000322 ECHO2': DrcDonor.ECHO,
    'UKR-000323 PFRU': DrcDonor.PFRU,
    'UKR-000330 SDC2': DrcDonor.SDC,
    'UKR-000336 UHF6': DrcDonor.UHF,
    'UKR-000340 Augustinus Fonden': DrcDonor.AugustinusFonden,
    'UKR-000341 Hoffmans & Husmans': DrcDonor.HoffmansAndHusmans,
    'UKR-000342 Pooled Funds': DrcDonor.PoolFunds,
    'UKR-000345 BHA2': DrcDonor.BHA,
    'UKR-000347 DANIDA': DrcDonor.DANI,
    'UKR-000348 BHA3': DrcDonor.BHA,
    'UKR-000350 SIDA': DrcDonor.SIDA,
    'UKR-000352 UHF7': DrcDonor.UHF,
    'UKR-000355 Danish MFA': DrcDonor.DMFA,
    'UKR-000360 Novo-Nordisk': DrcDonor.NovoNordisk,
    'UKR-000363 UHF8': DrcDonor.UHF,
    'UKR-000390 UHF9': DrcDonor.UHF,
    'UKR-000371 ECHO3': DrcDonor.ECHO,
    'UKR-000372 ECHO3': DrcDonor.ECHO,
    'UKR-000380 DANIDA': DrcDonor.DANI,
    'SIDA 518-570A': DrcDonor.SIDA,
    'UKR-000316 UHF5': DrcDonor.UHF,
    'UKR-000329 SIDA H2R': DrcDonor.SIDA,
    'UKR-000291_292 UNHCR': DrcDonor.UNHC,
    'UKR-000xxx DANIDA': DrcDonor.DANI,
    'UKR-000370 SIDA': DrcDonor.SIDA,
    'UKR-000385 Pooled Funds': DrcDonor.PoolFunds,
    'UKR-000386 Pooled Funds': DrcDonor.PoolFunds,
    'UKR-000388 BHA': DrcDonor.BHA,
    'UKR-000396 Danish MFA': DrcDonor.DMFA,
    'UKR-000397 GFFO': DrcDonor.GFFO,
    'UKR-000399 SDC3': DrcDonor.SDC,
    'UKR-000378 Danish MFA': DrcDonor.DMFA,
    'UKR-000373 Novo-Nordilsk': DrcDonor.NovoNordisk,
    'UKR-000399 SDC': DrcDonor.SDC,
    None: DrcDonor.None,
  }

  static readonly projectByDonor: Record<DrcDonor, DrcProject[]> = seq(
    Obj.entries(DrcProjectHelper.donorByProject),
  ).groupByAndApply(
    (_) => _[1],
    (_) => _.map((_) => _[0]),
  )

  static readonly extractCode = (str?: string): string | undefined => {
    if (!str) return undefined

    let match = str.match(/UKR.?(000\d\d\d)/i)
    if (match) return match[1]

    match = str.match(/(\d{3,})/)
    if (match) return `000${match[1]}`

    return undefined
  }

  static readonly searchCode = (value?: string): string | undefined => {
    if (value) return value.match(/(000)?(\d\d\d)/)?.[2]
  }

  static readonly search = (str?: string): DrcProject | undefined => {
    return DrcProjectHelper.searchByCode(DrcProjectHelper.extractCode(str))
  }

  static readonly searchByCode = (code?: string): DrcProject | undefined => {
    if (code) return Obj.values(DrcProject).find((_) => _.includes(code))
  }

  static readonly budgetByProject: Partial<Record<DrcProject, number>> = {
    [DrcProject['UKR-000322 ECHO2']]: 10243523, //.13, // 9423057.51 EURO from PIP
    [DrcProject['UKR-000284 BHA']]: 57000000,
    [DrcProject['UKR-000269 ECHO1']]: 3000000,
    [DrcProject['UKR-000345 BHA2']]: 10080572.0,
  }
}

export type DrcJob = string
