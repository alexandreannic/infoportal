import {fnSwitch} from '@alexandreannic/ts-utils'
import {
  AILocationHelper,
  DrcOffice,
  DrcProgram,
  DrcProject,
  DrcProjectHelper,
  DrcSector,
  KoboGeneralMapping,
  KoboMetaStatus,
  KoboProtection,
  KoboTagStatus,
  OblastIndex,
  Person,
  Protection_communityMonitoring,
  Protection_gbv,
  Protection_groupSession,
  Protection_hhs3,
  Protection_pss,
  Protection_referral,
  ProtectionCommunityMonitoringTags,
  ProtectionHhsTags,
  safeArray
} from '@infoportal-common'
import {KoboMetaOrigin} from './KoboMetaType'
import {KoboMetaMapper, MetaMapperInsert} from './KoboMetaService'
import Gender = Person.Gender

export class KoboMetaMapperProtection {

  static readonly communityMonitoring: MetaMapperInsert<KoboMetaOrigin<Protection_communityMonitoring.T, ProtectionCommunityMonitoringTags>> = row => {
    const answer = Protection_communityMonitoring.map(row.answers)
    const persons = KoboGeneralMapping.collectXlsKoboIndividuals(answer).map(KoboGeneralMapping.mapPerson)
    if (answer.informant_gender || answer.informant_age) {
      persons.push({
        age: answer.informant_age,
        gender: fnSwitch(answer.informant_gender!, {
          female: Gender.Female,
          male: Gender.Male,
          other: Gender.Other,
          unspecified: undefined,
        }, () => undefined)
      })
    }
    return {
      office: fnSwitch(answer.staff_to_insert_their_DRC_office!, {
        chernihiv: DrcOffice.Chernihiv,
        dnipro: DrcOffice.Dnipro,
        kharkiv: DrcOffice.Kharkiv,
        lviv: DrcOffice.Lviv,
        mykolaiv: DrcOffice.Mykolaiv,
        sumy: DrcOffice.Sumy,
      }, () => undefined),
      oblast: OblastIndex.byKoboName(answer.ben_det_oblast)?.name!,
      raion: KoboGeneralMapping.searchRaion(answer.ben_det_raion),
      hromada: KoboGeneralMapping.searchHromada(answer.ben_det_hromada),
      settlement: answer.ben_det_hromada_001,
      sector: DrcSector.Protection,
      activity: answer.activity ? fnSwitch(answer.activity, {
        fgd: DrcProgram.FGD,
        kll: DrcProgram.CommunityLevelPm,
        observation: DrcProgram.Observation,
      }) : undefined,
      persons,
      personsCount: persons.length,
      project: row.tags?.project ? [row.tags?.project] : [],
      donor: row.tags?.project ? [DrcProjectHelper.donorByProject[row.tags?.project]] : [],
      status: KoboMetaStatus.Committed,
      lastStatusUpdate: row.date,
    }
  }

  static readonly groupSession: MetaMapperInsert<KoboMetaOrigin<Protection_groupSession.T>> = row => {
    const answer = Protection_groupSession.map(row.answers)
    const activity = fnSwitch(answer.activity as any, {
      gpt: DrcProgram.AwarenessRaisingSession,
      pss: DrcProgram.AwarenessRaisingSession,
      // let:
    }, () => undefined)
    if (!activity) return
    // if (answer.activity as any === 'gbv' || answer.activity === 'pss' || answer.activity === 'other' || answer.activity === 'let') return
    const persons = KoboGeneralMapping.collectXlsKoboIndividuals(answer).map(KoboGeneralMapping.mapPerson)
    const project = answer.project ? fnSwitch(answer.project, {
      bha: DrcProject['UKR-000345 BHA2'],
      echo: DrcProject['UKR-000322 ECHO2'],
      okf: DrcProject['UKR-000309 OKF'],
      uhf4: DrcProject['UKR-000314 UHF4'],
      uhf6: DrcProject['UKR-000336 UHF6'],
      novo: DrcProject['UKR-000360 Novo-Nordisk'],
      uhf8: DrcProject['UKR-000363 UHF8'],
    }, () => DrcProjectHelper.searchByCode(DrcProjectHelper.searchCode(answer.project))) : undefined
    return {
      office: fnSwitch(answer.staff_to_insert_their_DRC_office!, {
        chernihiv: DrcOffice.Chernihiv,
        dnipro: DrcOffice.Dnipro,
        kharkiv: DrcOffice.Kharkiv,
        lviv: DrcOffice.Lviv,
        mykolaiv: DrcOffice.Mykolaiv,
        sumy: DrcOffice.Sumy,
      }, () => undefined),
      oblast: OblastIndex.byKoboName(answer.ben_det_oblast)?.name!,
      raion: KoboGeneralMapping.searchRaion(answer.ben_det_raion),
      hromada: KoboGeneralMapping.searchHromada(answer.ben_det_hromada),
      settlement: answer.ben_det_hromada_001,
      sector: DrcSector.Protection,
      activity: activity,
      persons,
      personsCount: persons.length,
      project: project ? [project] : [],
      donor: project ? [DrcProjectHelper.donorByProject[project]] : [],
      status: KoboMetaStatus.Committed,
      lastStatusUpdate: row.date,
    }
  }

  static readonly referral: MetaMapperInsert<KoboMetaOrigin<Protection_referral.T, ProtectionHhsTags>> = row => {
    const answer = Protection_referral.map(row.answers)
    const project = DrcProjectHelper.searchByCode(DrcProjectHelper.searchCode(answer.project_code))
    const projects = project ? [project] : []
    return KoboMetaMapper.make({
      office: fnSwitch(answer.staff_to_insert_their_DRC_office!, {
        chernihiv: DrcOffice.Chernihiv,
        dnipro: DrcOffice.Dnipro,
        kharkiv: DrcOffice.Kharkiv,
        lviv: DrcOffice.Lviv,
        mykolaiv: DrcOffice.Mykolaiv,
        sumy: DrcOffice.Sumy,
      }, () => undefined),
      project: projects,
      donor: projects.map(_ => DrcProjectHelper.donorByProject[_]),
      oblast: OblastIndex.byKoboName(answer.oblast)?.name!,
      raion: KoboGeneralMapping.searchRaion(answer.raion),
      hromada: KoboGeneralMapping.searchHromada(answer.hromada),
      settlement: answer.settement,
      sector: DrcSector.Protection,
      activity: DrcProgram.Referral,
      status: KoboMetaStatus.Committed,
      lastStatusUpdate: answer.date_closure,
      personsCount: 1,
      persons: [{
        age: answer.age,
        gender: fnSwitch(answer.gender!, {
          boy: Gender.Male,
          man: Gender.Male,
          girl: Gender.Female,
          woman: Gender.Female,
          other: Gender.Other,
          unspecified: undefined,
        }, () => undefined)
      }],
      enumerator: answer.staff_code,
    })
  }

  static readonly hhs: MetaMapperInsert<KoboMetaOrigin<Protection_hhs3.T, ProtectionHhsTags>> = row => {
    const answer = Protection_hhs3.map(row.answers)
    const persons = KoboGeneralMapping.collectXlsKoboIndividuals(answer).map(KoboGeneralMapping.mapPerson)
    const projects = safeArray(row.tags?.projects)
    if (answer.have_you_filled_out_this_form_before === 'yes' || answer.present_yourself === 'no') return
    return KoboMetaMapper.make({
      office: fnSwitch(answer.staff_to_insert_their_DRC_office!, {
        chernihiv: DrcOffice.Chernihiv,
        dnipro: DrcOffice.Dnipro,
        kharkiv: DrcOffice.Kharkiv,
        lviv: DrcOffice.Lviv,
        mykolaiv: DrcOffice.Mykolaiv,
        sumy: DrcOffice.Sumy,
      }, () => undefined),
      oblast: OblastIndex.byIso(answer.where_are_you_current_living_oblast)?.name!,
      raion: AILocationHelper.findRaionByIso(answer.where_are_you_current_living_raion)?.en,
      hromada: AILocationHelper.findHromadaByIso(answer.where_are_you_current_living_hromada!)?.en,
      settlement: answer.settlement,
      sector: DrcSector.Protection,
      activity: DrcProgram.ProtectionMonitoring,
      persons,
      personsCount: persons.length,
      project: projects,
      donor: projects.map(_ => DrcProjectHelper.donorByProject[_]),
      status: KoboMetaStatus.Committed,
      lastStatusUpdate: row.date,
    })
  }

  static readonly pss: MetaMapperInsert<KoboMetaOrigin<Protection_pss.T, KoboTagStatus>> = row => {
    const answer = Protection_pss.map(row.answers)
    if (answer.new_ben === 'no') return
    const persons = KoboProtection.pssGetUniqueIndividuls(answer)
    const oblast = OblastIndex.byKoboName(answer.ben_det_oblast!)!
    const project = answer.project ? fnSwitch(answer.project, {
      uhf6: DrcProject['UKR-000336 UHF6'],
      okf: DrcProject['UKR-000309 OKF'],
      uhf4: DrcProject['UKR-000314 UHF4'],
      echo: DrcProject['UKR-000322 ECHO2'],
      bha: DrcProject['UKR-000284 BHA'],
      bha2: DrcProject['UKR-000345 BHA2'],
      uhf8: DrcProject['UKR-000363 UHF8'],
    }) : undefined
    return {
      office: fnSwitch(answer.staff_to_insert_their_DRC_office!, {
        chernihiv: DrcOffice.Chernihiv,
        dnipro: DrcOffice.Dnipro,
        kharkiv: DrcOffice.Kharkiv,
        lviv: DrcOffice.Lviv,
        mykolaiv: DrcOffice.Mykolaiv,
        sumy: DrcOffice.Sumy,
      }, () => undefined),
      oblast: oblast.name,
      raion: KoboGeneralMapping.searchRaion(answer.ben_det_raion),
      hromada: KoboGeneralMapping.searchHromada(answer.ben_det_hromada),
      settlement: answer.ben_det_hromada_001,
      sector: DrcSector.Protection,
      activity: DrcProgram.PSS,
      personsCount: persons.length,
      persons,
      project: project ? [project] : [],
      donor: project ? [DrcProjectHelper.donorByProject[project]] : [],
      status: KoboMetaStatus.Committed,
      lastStatusUpdate: answer.cycle_finished_at ?? row.date,
    }
  }

  static readonly gbv: MetaMapperInsert<KoboMetaOrigin<Protection_gbv.T, KoboTagStatus>> = row => {
    const answer = Protection_gbv.map(row.answers)
    if (answer.new_ben === 'no') return
    const persons = answer.hh_char_hh_det
      ?.filter(_ => _.hh_char_hh_new_ben !== 'no')
      .map(KoboGeneralMapping.mapPersonDetails) ?? []
    const oblast = OblastIndex.byKoboName(answer.ben_det_oblast!)
    const project = answer.project ? fnSwitch(answer.project, {
      bha: DrcProject['UKR-000345 BHA2'],
      sdc: DrcProject['UKR-000226 SDC'],
      danida: DrcProject['UKR-000347 DANIDA'],
      uhf8: DrcProject['UKR-000363 UHF8'],
    }, () => answer.project as DrcProject) : undefined
    return {
      office: fnSwitch(answer.staff_to_insert_their_DRC_office!, {
        chernihiv: DrcOffice.Chernihiv,
        dnipro: DrcOffice.Dnipro,
        kharkiv: DrcOffice.Kharkiv,
        mykolaiv: DrcOffice.Mykolaiv,
      }, () => undefined),
      oblast: oblast.name,
      raion: KoboGeneralMapping.searchRaion(answer.ben_det_raion),
      hromada: KoboGeneralMapping.searchHromada(answer.ben_det_hromada),
      settlement: answer.ben_det_hromada_001,
      sector: DrcSector.Protection,
      activity: DrcProgram.GBV,
      personsCount: persons.length,
      persons,
      project: project ? [project] : [],
      donor: project ? [DrcProjectHelper.donorByProject[project]] : [],
      status: KoboMetaStatus.Committed,
      lastStatusUpdate: row.date,
    }
  }
}
