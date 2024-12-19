import {DrcProgram, DrcProject, groupBy, KoboMetaStatus, PeriodHelper} from 'infoportal-common'
import {aiInvalidValueFlag, AiTable, checkAiValid} from '@/features/ActivityInfo/shared/AiTable'
import {AiWashType} from '@/features/ActivityInfo/Wash/aiWashType'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {fnSwitch} from '@alexandreannic/ts-utils'
import {AiMapper} from '@/features/ActivityInfo/shared/AiMapper'
import {ActivityInfoSdk} from '@/core/sdk/server/activity-info/ActiviftyInfoSdk'
import {activitiesConfig} from '@/features/ActivityInfo/ActivityInfo'
import {Period} from 'infoportal-common'

export namespace AiWashMapper {

  const planCodes = {
    [DrcProject['UKR-000314 UHF4']]: 'WASH-DRC-00001',
    [DrcProject['UKR-000270 Pooled Funds']]: 'WASH-DRC-00002',
    [DrcProject['UKR-000298 Novo-Nordisk']]: 'WASH-DRC-00003',
    [DrcProject['UKR-000309 OKF']]: 'WASH-DRC-00004',
    // Wrong assigment in kobo form
    [DrcProject['UKR-000284 BHA']]: 'WASH-DRC-00005',
    [DrcProject['UKR-000345 BHA2']]: 'WASH-DRC-00005',
    [DrcProject['UKR-000330 SDC2']]: 'WASH-DRC-00006',
    [DrcProject['UKR-000347 DANIDA']]: 'WASH-DRC-00007',
    [DrcProject['UKR-000329 SIDA H2R']]: 'WASH-DRC-00009',
    [DrcProject['UKR-000342 Pooled Funds']]: 'WASH-DRC-00009',
  }

  const getPlanCode = (p: DrcProject): AiWashType.Type['Activity Plan Code'] => {
    // @ts-ignore
    return planCodes[p] ?? `${aiInvalidValueFlag} ${p}`
  }

  export type Bundle = AiTable<AiWashType.Type>

  export const req = (api: ApiSdk) => {
    return (period: Partial<Period>): Promise<Bundle[]> => {
      const periodStr = AiMapper.getPeriodStr(period)
      return api.koboMeta.search({
        status: [KoboMetaStatus.Committed],
        activities: [
          DrcProgram.NFI,
          DrcProgram.HygieneKit,
        ]
      })
        .then(_ => _.data.filter(_ => PeriodHelper.isDateIn(period, _.lastStatusUpdate)))
        .then(data => {
          let i = 0
          return Promise.all(groupBy({
            data,
            groups: [
              {by: _ => _.project?.[0]!,},
              {by: _ => _.oblast!},
              {by: _ => _.raion!},
              {by: _ => _.hromada!},
              {by: _ => _.settlement!},
              {
                by: _ => fnSwitch(_.displacement!, {
                  Idp: 'Internally Displaced',
                  NonDisplaced: 'Non-Displaced',
                  Returnee: 'Returnees',
                  Refugee: 'Non-Displaced',
                }, () => 'Non-Displaced')
              },
              {by: _ => _.activity!}
            ],
            finalTransform: async (grouped, [project, oblast, raion, hromada, settlement, displacement, activity]) => {
              const disaggregation = AiMapper.disaggregatePersons(grouped.flatMap(_ => _.persons).compact())
              const ai: AiWashType.Type = {
                'Activity Plan Code': getPlanCode(project),
                'Implementing Partner': 'Danish Refugee Council',
                'Reporting Organization': 'Danish Refugee Council',
                'WASH': '# of individuals benefiting from hygiene kit/items distribution (in-kind)',
                'Response Theme': 'No specific theme',
                'Settlement': aiInvalidValueFlag,
                ...await AiMapper.getLocationByMeta(oblast, raion, hromada, settlement),
                'Location Type': 'Individuals/households',
                'Reporting Month': periodStr === '2024-01' ? '2024-02' : periodStr,
                'Disaggregation by population group and/or gender and age known?': 'Yes',
                'Population Group': displacement,
                'Total Reached (No Disaggregation)': 0, //disaggregation['Total Individuals Reached']
                'Girls (0-17)': disaggregation['Girls (0-17)'] ?? 0,
                'Boys (0-17)': disaggregation['Boys (0-17)'] ?? 0,
                'Adult Women (18-59)': disaggregation['Adult Women (18-59)'] ?? 0,
                'Adult Men (18-59)': disaggregation['Adult Men (18-59)'] ?? 0,
                'Older Women (60+)': disaggregation['Older Women (60+)'] ?? 0,
                'Older Men (60+)': disaggregation['Older Men (60+)'] ?? 0,
                'People with disability': disaggregation['People with Disability'] ?? 0,
              }
              const request = ActivityInfoSdk.makeRecordRequests({
                activityIdPrefix: 'drcwash',
                activityYYYYMM: periodStr,
                formId: activitiesConfig.wash.id,
                activity: AiWashType.map(AiMapper.mapLocationToRecordId(ai)),
                activityIndex: i++,
              })

              return {
                submit: checkAiValid(ai.Oblast, ai.Raion, ai.Hromada, ai['Settlement'], ai['Activity Plan Code']),
                recordId: request.changes[0].recordId,
                data: grouped,
                activity: ai,
                requestBody: request,
              }
            }
          }).transforms)
        })
    }
  }

}