import {useAppSettings} from '@/core/context/ConfigContext'
import React from 'react'
import {AiBundleTable, AiTable, checkAiValid} from '@/features/ActivityInfo/shared/AiTable'
import {add, groupBy, PeriodHelper} from 'infoportal-common'
import {Panel} from '@/shared/Panel'
import {Page} from '@/shared/Page'
import {ActivityInfoSdk} from '@/core/sdk/server/activity-info/ActiviftyInfoSdk'
import {AiGbvType} from '@/features/ActivityInfo/Gbv/aiGbvType'
import {AiGbvMapper} from '@/features/ActivityInfo/Gbv/AiGbvMapper'
import {activitiesConfig} from '@/features/ActivityInfo/ActivityInfo'
import {useFetcher} from '@/shared/hook/useFetcher'
import {AiMapper} from '@/features/ActivityInfo/shared/AiMapper'
import {Period} from 'infoportal-common'

type AiGbvBundle = AiTable<AiGbvType.Type, AiGbvType.TypeSub>

export const AiGbv = () => {
  const {api} = useAppSettings()

  const req = (period: Partial<Period>) => {
    const periodStr = AiMapper.getPeriodStr(period)
    return api.kobo.typedAnswers.search.protection_gbv()
      .then(data => data.data.filter(_ => PeriodHelper.isDateIn(period, _.date)))
      .then(AiGbvMapper.mapGbvActivity(period))
      .then(data => {
        const bundles: AiGbvBundle[] = []
        let i = 0
        groupBy({
          data,
          groups: [
            {by: _ => _.Oblast!},
            {by: _ => _.Raion!},
            {by: _ => _.Hromada!},
            {by: _ => _.Settlement!},
            {by: _ => _['Plan/Project Code']!},

          ],
          finalTransform: (grouped, [Oblast, Raion, Hromada, Settlement, PlanCode]) => {
            const activity: AiGbvType.Type = {
              Oblast, Raion, Hromada, Settlement,
              'Reporting Organization': 'Danish Refugee Council',
              'Response Theme': 'No specific theme',
              'Plan/Project Code': PlanCode,
            }
            const subActivities: AiGbvType.TypeSub[] = []
            groupBy({
              data: grouped,
              groups: [
                {by: _ => _['Indicators']!},
                {by: _ => _['Population Group']!},
                {by: _ => _['Type of distribution']!},
                {by: _ => _['Who distributed the kits?']!},
              ],
              finalTransform: (grouped, [
                Indicators,
                PopulationGroup,
                DistributionType,
                DistributionWho,
              ]) => {
                subActivities.push({
                  'Reporting Month': periodStr,
                  'Population Group': PopulationGroup,
                  'Indicators': Indicators,
                  'Total Individuals Reached': grouped.sum(_ => add(
                    _['Girls (0-17)'],
                    _['Boys (0-17)'],
                    _['Adult Women (18-59)'],
                    _['Adult Men (18-59)'],
                    _['Older Women (60+)'],
                    _['Older Men (60+)'],
                  )),
                  ...Indicators === '# of women and girls at risk who received dignity kits' ? {
                    'Type of distribution': DistributionType,
                    'Who distributed the kits?': DistributionWho,
                    'Dignity kits in stock?': 'No',
                    'Basic/Essential': grouped.sum(_ => add(_['Basic/Essential'])),
                    'Elderly': grouped.sum(_ => add(_['Elderly'])),
                    'Winter': grouped.sum(_ => add(_['Winter'])),
                    'Other': grouped.sum(_ => add(_['Other'])),
                    'Any assessment/feedback done/collected on post distribution of kits?': 'No assessments planned/done',
                  } : {
                    'Type of distribution': undefined,
                    'Who distributed the kits?': undefined,
                    'Non-individuals Reached/Quantity': undefined,
                    'Basic/Essential': undefined,
                    'Elderly': undefined,
                    'Winter': undefined,
                    'Other': undefined,
                    'Dignity kits in stock?': undefined,
                    'Any assessment/feedback done/collected on post distribution of kits?': undefined,
                  },
                  'Girls (0-17)': grouped.sum(_ => add(_['Girls (0-17)'])),
                  'Boys (0-17)': grouped.sum(_ => add(_['Boys (0-17)'])),
                  'Adult Women (18-59)': grouped.sum(_ => add(_['Adult Women (18-59)'])),
                  'Adult Men (18-59)': grouped.sum(_ => add(_['Adult Men (18-59)'])),
                  'Older Women (60+)': grouped.sum(_ => add(_['Older Women (60+)'])),
                  'Older Men (60+)': grouped.sum(_ => add(_['Older Men (60+)'])),
                })
              }
            })
            const request = ActivityInfoSdk.makeRecordRequests({
              activityIdPrefix: 'drcgbv',
              activityYYYYMM: periodStr,
              formId: activitiesConfig.gbv.id,
              activity: AiGbvType.map(AiMapper.mapLocationToRecordId(activity)),
              subActivities: subActivities.map(AiGbvType.mapSub),
              activityIndex: i++,
              subformId: activitiesConfig.gbv.subId,
            })
            subActivities.forEach(s => {
              bundles.push({
                submit: checkAiValid(
                  activity.Oblast,
                  activity.Raion,
                  activity.Hromada,
                  activity.Settlement,
                  activity['Plan/Project Code'],
                  ...subActivities.map(_ => _.Indicators)),
                recordId: request.changes[0].recordId,
                activity: activity,
                subActivity: s,
                data: grouped.map(_ => ({koboId: _.answer.id, ..._.answer})).distinct(_ => _.koboId),
                requestBody: request,
              })
            })
          }
        })
        return bundles
      })
  }
  const fetcher = useFetcher(req)

  return (
    <Page width="full">
      <Panel>
        <AiBundleTable id="gbv" fetcher={fetcher}/>
      </Panel>
    </Page>
  )
}