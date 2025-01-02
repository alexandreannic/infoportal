import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {AiFslcType} from '@/features/ActivityInfo/Fslc/aiFslcType'
import {add, DrcProgram, DrcProject, groupBy, KoboMetaStatus, PeriodHelper, safeNumber} from 'infoportal-common'
import {fnSwitch, Seq} from '@alexandreannic/ts-utils'
import {ActivityInfoSdk} from '@/core/sdk/server/activity-info/ActiviftyInfoSdk'
import {activitiesConfig} from '@/features/ActivityInfo/ActivityInfo'
import {aiInvalidValueFlag, AiTable, checkAiValid} from '@/features/ActivityInfo/shared/AiTable'
import {AiMapper} from '@/features/ActivityInfo/shared/AiMapper'
import {IKoboMeta, KoboMetaEcrecTags} from 'infoportal-common'
import {Period} from 'infoportal-common'

export namespace AiFslcMapper {
  export type Bundle = AiTable<AiFslcType.Type>

  const getPlanCode = (_: DrcProject) => {
    return fnSwitch(_, {
      [DrcProject['UKR-000348 BHA3']]: 'FSLC-DRC-00001',
      [DrcProject['UKR-000336 UHF6']]: 'FSLC-DRC-00002',
      [DrcProject['UKR-000352 UHF7']]: 'FSLC-DRC-00003',
      [DrcProject['UKR-000363 UHF8']]: 'FSLC-DRC-00004',
      [DrcProject['UKR-000372 ECHO3']]: 'FSLC-DRC-00005',
    }, () => aiInvalidValueFlag + _)
  }

  export const reqCashRegistration = (api: ApiSdk) => (period: Partial<Period>): Promise<Bundle[]> => {
    const periodStr = AiMapper.getPeriodStr(period)
    let i = 0
    return api.koboMeta.search({
      activities: [
        DrcProgram.SectoralCashForAgriculture,
        DrcProgram.SectoralCashForAnimalShelterRepair,
        DrcProgram.SectoralCashForAnimalFeed,
        DrcProgram.MSME,
        DrcProgram.VET,
      ],
      status: [KoboMetaStatus.Committed]
    })
      .then(_ => _.data.filter(_ => PeriodHelper.isDateIn(period, _.lastStatusUpdate)))
      .then(data => {
        return Promise.all(groupBy({
          data,
          groups: [
            {by: _ => _.activity!},
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
          ],
          finalTransform: async (grouped: Seq<IKoboMeta<KoboMetaEcrecTags>>, [activity, project, oblast, raion, hromada, settlment, displacement]) => {
            let disaggregation = AiMapper.disaggregatePersons(grouped.flatMap(_ => _.persons).compact())
            if (activity === DrcProgram.VET) {
              const total = add(disaggregation['Adult Men (18-59)'] + disaggregation['Adult Women (18-59)'])
              disaggregation = {
                'Adult Men (18-59)': safeNumber(disaggregation['Adult Men (18-59)']),
                'Adult Women (18-59)': safeNumber(disaggregation['Adult Women (18-59)']),
                'Total Individuals Reached': total,
                'People with Disability': Math.min(total, disaggregation['People with Disability']),
              } as any
            }
            const ai: AiFslcType.Type = {
              'Reporting Month': fnSwitch(periodStr, {
                '2024-01': '2024-03',
                '2024-02': '2024-03'
              }, () => periodStr),
              'Reporting Organization': 'Danish Refugee Council',
              'Activity and indicator': activity as any,
              'Implementing Partner': 'Danish Refugee Council',
              'Activity Plan Code': getPlanCode(project) as never,
              ...await AiMapper.getLocationByMeta(oblast, raion, hromada, settlment),
              'Population Group': displacement,
              ...(() => {
                if (activity === DrcProgram.MSME) {
                  const total = Math.round(grouped.sum(_ => _.tags?.employeesCount ?? 0) * 2.6)
                  const women = Math.floor(total / 2)
                  return {
                    'New beneficiaries (same activity)': total,
                    'Number of reached households': grouped.length,
                    'Number of people reached': total,
                    'Adult Women (18-59)': women,
                    'Adult Men (18-59)': total - women,
                    'Frequency': 'One-off',
                    'Total Value (local currency)': grouped.sum(_ => _.tags?.amount ?? 0),
                    'Currency': 'UAH',
                    'Cash delivery mechanism': 'Bank Transfer',
                    'Were these people reached in 2024 by another FSL sub-activity?': 'No',
                    // 'If yes, which sub-activity': 'c68psfcls348s0bw' as any,
                    // 'If yes, how many people received from both sub-activities': 0,
                  }
                }
                return {
                  'New beneficiaries (same activity)': disaggregation['Total Individuals Reached'] ?? 0,
                  'Number of people reached': disaggregation['Total Individuals Reached'] ?? 0,
                  'Girls (0-17)': disaggregation['Girls (0-17)'] ?? 0,
                  'Boys (0-17)': disaggregation['Boys (0-17)'] ?? 0,
                  'Adult Women (18-59)': disaggregation['Adult Women (18-59)'] ?? 0,
                  'Adult Men (18-59)': disaggregation['Adult Men (18-59)'] ?? 0,
                  'Older Women (60+)': disaggregation['Older Women (60+)'] ?? 0,
                  'Older Men (60+)': disaggregation['Older Men (60+)'] ?? 0,
                  'Number of people with disability': disaggregation['People with Disability'],
                  'Number of reached households': grouped.length,
                }
              })(),
              'Implementation Status': 'Completed',
              'Modality': 'Cash',
              'Were these people reached in 2024 by another FSL sub-activity?': 'No',
              // ...fnSwitch(activity, {
              //   [DrcProgram.MSME]: () => {
              //
              //   },
              // }, () => undefined)
            }
            const request = ActivityInfoSdk.makeRecordRequests({
              activityIdPrefix: 'drcflsc',
              activityYYYYMM: periodStr,
              formId: activitiesConfig.fslc.id,
              activity: AiFslcType.map(AiMapper.mapLocationToRecordId(ai)),
              activityIndex: i++,
            })

            return {
              submit: checkAiValid(ai.Oblast, ai.Raion, ai.Hromada, ai['Activity Plan Code']),
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