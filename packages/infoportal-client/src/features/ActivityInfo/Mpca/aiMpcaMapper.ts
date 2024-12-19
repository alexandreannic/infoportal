import {DrcProgram, DrcProject, DrcProjectHelper, groupBy, KoboMetaStatus, PeriodHelper} from 'infoportal-common'
import {fnSwitch} from '@alexandreannic/ts-utils'
import {ActivityInfoSdk} from '@/core/sdk/server/activity-info/ActiviftyInfoSdk'
import {aiInvalidValueFlag, AiTable, checkAiValid} from '@/features/ActivityInfo/shared/AiTable'
import {activitiesConfig} from '@/features/ActivityInfo/ActivityInfo'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {AiMapper} from '@/features/ActivityInfo/shared/AiMapper'
import {AiMpcaType} from '@/features/ActivityInfo/Mpca/aiMpcaType'
import {appConfig} from '@/conf/AppConfig'
import {Period} from 'infoportal-common'

export namespace AiMpcaMapper {

  type Bundle = AiTable<AiMpcaType.Type>

  const getPlanCode = (_: DrcProject) => {
    return fnSwitch(_ as any, {
      // TODO wrongly set on Kobo answers
      [DrcProject['UKR-000380 DANIDA']]: 'MPCA-DRC-00011',
      [DrcProject['UKR-000342 Pooled Funds']]: 'MPCA-DRC-00010',
      [DrcProject['UKR-000341 Hoffmans & Husmans']]: 'MPCA-DRC-00009',
      [DrcProject['UKR-000340 Augustinus Fonden']]: 'MPCA-DRC-00008',
      [DrcProject['UKR-000284 BHA']]: 'MPCA-DRC-00007', // TODO Probably in error from BNRE form starting from 2024-01
      [DrcProject['UKR-000345 BHA2']]: 'MPCA-DRC-00007',
      [DrcProject['UKR-000330 SDC2']]: 'MPCA-DRC-00006',
      [DrcProject['UKR-000347 DANIDA']]: 'MPCA-DRC-00005',
      [DrcProject['UKR-000336 UHF6']]: 'MPCA-DRC-00004',
      [DrcProject['UKR-000298 Novo-Nordisk']]: 'MPCA-DRC-00003',
      [DrcProject['UKR-000309 OKF']]: 'MPCA-DRC-00002',
      [DrcProject['UKR-000270 Pooled Funds']]: 'MPCA-DRC-00001',
      [DrcProject['UKR-000329 SIDA H2R']]: 'MPCA-DRC-00012',
    }, () => aiInvalidValueFlag + _)
  }

  export const reqCashRegistration = (api: ApiSdk) => (period: Partial<Period>): Promise<Bundle[]> => {
    const periodStr = AiMapper.getPeriodStr(period)
    let i = 0
    return api.mpca.search({
      // filters: {
      //   filterBy: [
      //     {column: 'activity', type: 'array', value: [DrcProgram.MPCA]},
      //     {column: 'status', value: [KoboMetaStatus.Committed]},
      //   ],
      // }
    })
      .then(_ => _.data.filter(_ => {
        if (_.activity !== DrcProgram.MPCA) return false
        if (_.status !== KoboMetaStatus.Committed) return false
        return _.lastStatusUpdate && PeriodHelper.isDateIn(period, _.lastStatusUpdate)
      }))
      .then(data => {
          return Promise.all(groupBy({
            data,
            groups: [
              {by: _ => _.oblast},
              {by: _ => _.raion!},
              {by: _ => _.hromada!},
              {by: _ => _.settlement!},
              {by: _ => _.project?.[0]!},
              {
                by: _ => AiMapper.mapPopulationGroup(_.displacement)
              },
            ],
            finalTransform: async (grouped, [oblast, raion, hromada, settlement, project, displacement]) => {
              const disag = AiMapper.disaggregatePersons(grouped.flatMap(_ => _.persons).compact())
              const loc = await AiMapper.getLocationByMeta(oblast, raion, hromada, settlement)
              const ai: AiMpcaType.Type = {
                'Reporting Organization': 'Danish Refugee Council',
                'Implementing Partner': 'Danish Refugee Council',
                'Raion': loc.Raion,
                'Hromada': loc.Hromada,
                'Settlement': loc.Settlement,
                'Donor': fnSwitch(DrcProjectHelper.donorByProject[project], {
                  SIDA: 'Swedish International Development Cooperation Agency (Sida)',
                  UHF: 'Ukraine Humanitarian Fund (UHF)',
                  NovoNordisk: 'Novo Nordisk (NN)',
                  OKF: `Ole Kirk's Foundation (OKF)`,
                  PoolFunds: 'Private Donor (PDonor)',
                  HoffmansAndHusmans: 'Private Donor (PDonor)',
                  SDCS: `Swiss Agency for Development and Cooperation (SDC)`,
                  BHA: `USAID's Bureau for Humanitarian Assistance (USAID/BHA)`,
                  FINM: 'Ministry of Foreign Affairs - Finland (MFA Finland)',
                  FCDO: 'Foreign, Commonwealth & Development Office (FCDO)',
                  AugustinusFonden: 'Augustinus Foundation (Augustinus)',
                  EUIC: `EU\'s Instrument contributing to Stability and Peace (IcSP)`,
                  DUT: 'Dutch Relief Alliance (DutchRelief)',
                  ECHO: 'European Commission Humanitarian Aid Department and Civil Protection (ECHO)',
                  DANI: `Danish International Development Agency - Ministry of Foreign Affairs - Denmark (DANIDA)`,
                  SDC: 'Swiss Agency for Development and Cooperation (SDC)',
                }, () => aiInvalidValueFlag) as any,
                'Response Theme': 'No specific theme',
                'Number of Covered Months': 'Three months (recommended)',
                'Financial Service Provider (FSP)': 'Bank Transfer',
                'Population Group': displacement,
                'Total amount (USD) distributed through multi-purpose cash assistance': grouped.sum(_ => _.amountUahFinal ?? 0) * appConfig.uahToUsd,
                'Payments Frequency': 'Multiple payments',
                'Activity Plan Code': getPlanCode(project) as any,
                'Indicators - MPCA': '# of individuals assisted with multi-purpose cash assistance',
                'Reporting Month': periodStr === '2024-01' ? '2024-02' : periodStr,
                'Girls (0-17)': disag['Girls (0-17)'] ?? 0,
                'Boys (0-17)': disag['Boys (0-17)'] ?? 0,
                'Adult Women (18-59)': disag['Adult Women (18-59)'] ?? 0,
                'Adult Men (18-59)': disag['Adult Men (18-59)'] ?? 0,
                'Older Women (60+)': disag['Older Women (60+)'] ?? 0,
                'Older Men (60+)': disag['Older Men (60+)'] ?? 0,
                'Total Individuals Reached': disag['Total Individuals Reached'] ?? 0,
                'People with disability': disag['People with Disability'] ?? 0,
                'Girls with disability (0-17)': disag['Girls with disability (0-17)'] ?? 0,
                'Boys with disability (0-17)': disag['Boys with disability (0-17)'] ?? 0,
                'Adult Women with disability (18-59)': disag['Adult Women with disability (18-59)'] ?? 0,
                'Adult Men with disability (18-59)': disag['Adult Men with disability (18-59)'] ?? 0,
                'Older Women with disability (60+)': disag['Older Women with disability (60+)'] ?? 0,
                'Older Men with disability (60+)': disag['Older Men with disability (60+)'] ?? 0,
              } as const
              const request = ActivityInfoSdk.makeRecordRequests({
                activityIdPrefix: 'drcmpca',
                activityYYYYMM: periodStr,
                formId: activitiesConfig.mpca.id,
                activity: AiMpcaType.map(AiMapper.mapLocationToRecordId(ai)),
                activityIndex: i++,
              })
              return {
                submit: checkAiValid(ai.Raion, ai.Hromada, ai.Settlement, ai['Activity Plan Code']),
                recordId: request.changes[0].recordId,
                data: grouped,
                activity: ai,
                requestBody: request,
              }
            }
          }).transforms)
        }
      )
  }
}