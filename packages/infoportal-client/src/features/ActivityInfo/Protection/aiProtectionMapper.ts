import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {aiInvalidValueFlag, AiTable, checkAiValid} from '@/features/ActivityInfo/shared/AiTable'
import {AiProtectionType} from '@/features/ActivityInfo/Protection/aiProtectionType'
import {DrcProgram, DrcProject, groupBy, KoboMetaStatus, PeriodHelper} from 'infoportal-common'
import {fnSwitch} from '@alexandreannic/ts-utils'
import {AiMapper} from '@/features/ActivityInfo/shared/AiMapper'
import {ActivityInfoSdk} from '@/core/sdk/server/activity-info/ActiviftyInfoSdk'
import {activitiesConfig} from '@/features/ActivityInfo/ActivityInfo'

export namespace AiProtectionMapper {

  type Bundle = AiTable<AiProtectionType.Type, AiProtectionType.TypeSub>

  const getPlanCode = (_?: DrcProject): AiProtectionType.Type['Plan/Project Code'] => {
    const planCode = Object.freeze({
      [DrcProject['UKR-000298 Novo-Nordisk']]: 'PRT-DRC-00001',
      [DrcProject['UKR-000309 OKF']]: 'PRT-DRC-00002',
      [DrcProject['UKR-000314 UHF4']]: 'PRT-DRC-00003',
      [DrcProject['UKR-000322 ECHO2']]: 'PRT-DRC-00004',
      [DrcProject['UKR-000345 BHA2']]: 'PRT-DRC-00005',
      [DrcProject['UKR-000336 UHF6']]: 'PRT-DRC-00006',
      [DrcProject['UKR-000330 SDC2']]: 'PRT-DRC-00007',
      [DrcProject['UKR-000304 PSPU']]: 'PRT-DRC-00008',
      [DrcProject['UKR-000372 ECHO3']]: 'PRT-DRC-00009',
      [DrcProject['UKR-000363 UHF8']]: 'PRT-DRC-00010',
      [DrcProject['UKR-000350 SIDA']]: 'PRT-DRC-00011',
    })
    // @ts-ignore
    return planCode[_] ?? `${aiInvalidValueFlag} ${_}`
  }

  export const req = (api: ApiSdk) => (periodStr: string): Promise<Bundle[]> => {
    const period = PeriodHelper.fromYYYYMM(periodStr)
    return api.koboMeta.search({
      activities: [
        DrcProgram.Counselling,
        DrcProgram.MHPSSActivities,
        DrcProgram.PGS,
        DrcProgram.ProtectionMonitoring,
        DrcProgram.CommunityLevelPm,
        DrcProgram.AwarenessRaisingSession,
        DrcProgram.Referral,
      ],
      status: [KoboMetaStatus.Committed],
    })
      .then(_ => _.data.filter(_ => PeriodHelper.isDateIn(period, _.lastStatusUpdate)))
      .then(data => {
        let i = 0
        return Promise.all(groupBy({
          data,
          groups: [
            {by: _ => _.oblast!},
            {by: _ => _.raion!},
            {by: _ => _.hromada!},
            {by: _ => _.settlement!},
            {by: _ => _.project?.[0]!},
          ],
          finalTransform: async (grouped, [oblast, raion, hromada, settlement, project]) => {
            const ai: AiProtectionType.Type = {
              ...await AiMapper.getLocationByMeta(oblast, raion, hromada, settlement),
              'Plan/Project Code': getPlanCode(project),
              'Reporting Organization': 'Danish Refugee Council',
              'Response Theme': 'No specific theme',
            }
            const subActivities: {data: any[], ai: AiProtectionType.TypeSub}[] = []
            groupBy({
              data: grouped,
              groups: [
                {by: _ => _.activity!},
                {by: _ => _.displacement!},
              ],
              finalTransform: (grouped, [activity, displacement]) => {
                const disaggregation = AiMapper.disaggregatePersons(grouped.flatMap(_ => _.persons).compact())
                subActivities.push({
                  data: grouped,
                  ai: {
                    'Indicators': fnSwitch(activity, {
                      [DrcProgram.Counselling]: '# of individuals who received protection counselling',
                      [DrcProgram.FGD]: '# of interviews conducted with key informants through community level protection monitoring',
                      [DrcProgram.PGS]: '# of individuals who received individual or group-based psychosocial support',
                      [DrcProgram.MHPSSActivities]: '# of individuals who received individual or group-based psychosocial support',
                      [DrcProgram.ProtectionMonitoring]: '# of individuals reached through protection monitoring at the household level',
                      [DrcProgram.CommunityLevelPm]: '# of interviews conducted with key informants through community level protection monitoring',
                      [DrcProgram.AwarenessRaisingSession]: '# of individuals who participated in awareness raising activities on Protection',
                      [DrcProgram.Referral]: '# of individuals with specific needs referred to specialized services and assistance',
                    }, () => aiInvalidValueFlag as any),
                    'Population Group': AiMapper.mapPopulationGroup(displacement),
                    'Reporting Month': periodStr === '2024-01' ? '2024-02' : periodStr,
                    ...fnSwitch<DrcProgram, Partial<AiProtectionType.TypeSub>>(activity, {
                      [DrcProgram.FGD]: {
                        'Total Individuals Reached': null as unknown as number,
                        'Girls (0-17)': null as unknown as number,
                        'Boys (0-17)': null as unknown as number,
                        'Older Women (60+)': null as unknown as number,
                        'Older Men (60+)': null as unknown as number,
                        'Non-individuals Reached/Quantity': grouped.length,
                      },
                      [DrcProgram.CommunityLevelPm]: {
                        'Total Individuals Reached': null as unknown as number,
                        'Girls (0-17)': null as unknown as number,
                        'Boys (0-17)': null as unknown as number,
                        'Adult Women (18-59)': null as unknown as number,
                        'Adult Men (18-59)': null as unknown as number,
                        'Older Women (60+)': null as unknown as number,
                        'People with Disability': null as unknown as number,
                        'Older Men (60+)': null as unknown as number,
                        'Non-individuals Reached/Quantity': grouped.length,
                      },
                    }, () => {
                      return {
                        'People with Disability': null as unknown as number,
                        'Non-individuals Reached/Quantity': null as unknown as undefined,
                        'Total Individuals Reached': disaggregation['Total Individuals Reached'] ?? 0,
                        'Girls (0-17)': disaggregation['Girls (0-17)'] ?? 0,
                        'Boys (0-17)': disaggregation['Boys (0-17)'] ?? 0,
                        'Adult Women (18-59)': disaggregation['Adult Women (18-59)'] ?? 0,
                        'Adult Men (18-59)': disaggregation['Adult Men (18-59)'] ?? 0,
                        'Older Women (60+)': disaggregation['Older Women (60+)'] ?? 0,
                        'Older Men (60+)': disaggregation['Older Men (60+)'] ?? 0,
                      }
                    })
                  }
                })
              }
            })
            const request = ActivityInfoSdk.makeRecordRequests({
              activityIdPrefix: 'drcprot',
              activityYYYYMM: periodStr,
              formId: activitiesConfig.protection_general.id,
              activity: AiProtectionType.map(AiMapper.mapLocationToRecordId(ai)),
              subActivities: subActivities.map(_ => AiProtectionType.mapSub(_.ai)),
              activityIndex: i++,
              subformId: activitiesConfig.protection_general.subId,
            })
            return subActivities.flatMap((s) => {
              return {
                submit: checkAiValid(ai.Oblast, ai.Raion, ai.Hromada, ai.Settlement, ai['Plan/Project Code'], ...subActivities.map(_ => _.ai.Indicators)),
                recordId: request.changes[0].recordId,
                activity: ai,
                subActivity: s.ai,
                data: s.data,
                requestBody: request,
              }
            })
          }
        }).transforms).then(_ => _.flat())
      })
  }
}