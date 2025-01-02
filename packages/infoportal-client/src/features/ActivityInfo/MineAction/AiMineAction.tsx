import {Page} from '@/shared/Page'
import React from 'react'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Panel} from '@/shared/Panel'
import {AiBundleTable, aiInvalidValueFlag, AiTable, checkAiValid} from '@/features/ActivityInfo/shared/AiTable'
import {useFetcher} from '@/shared/hook/useFetcher'
import {AiMineActionType} from '@/features/ActivityInfo/MineAction/aiMineActionType'
import {ActivityInfoSdk} from '@/core/sdk/server/activity-info/ActiviftyInfoSdk'
import {activitiesConfig} from '@/features/ActivityInfo/ActivityInfo'
import {AiMapper} from '@/features/ActivityInfo/shared/AiMapper'
import {Period} from 'infoportal-common'


type Bundle = AiTable<AiMineActionType.Type, AiMineActionType.TypeSub>

export const AiMineAction = () => {
  const {api} = useAppSettings()
  const fetcher = useFetcher(async (period: Partial<Period>) => api.hdp.fetchRiskEducation().then(res => {
    const periodStr = AiMapper.getPeriodStr(period)
    return Promise.all(res.filter(_ => _['Reporting Month'] === periodStr).map(async (_,
      i) => {
      const addFlagIfNotInList = (value: string, options: Record<string, string>): any => {
        if (!options[value]) return aiInvalidValueFlag + ' ' + value
        return value
      }
      const rawActivity: AiMineActionType.Type = {
        'Reporting Organization': 'Danish Refugee Council',
        'Plan/Project Code': addFlagIfNotInList(_['Plan/Project Code'], AiMineActionType.options['Plan/Project Code']),
        ...await AiMapper.getLocationByMeta(_['Oblast Oblast ENG/UKR'], _['Raion Raion ENG/UKR'], _['Hromada Hromada ENG/PCODE/UKR'], undefined),
        // 'Oblast': addFlagIfNotInList(_['Oblast Oblast ENG/UKR'], AiMineActionType.options['Oblast']),
        // 'Raion': _['Raion Raion ENG/UKR'],
        // 'Hromada': _['Hromada Hromada ENG/PCODE/UKR'],
        'Response Theme': addFlagIfNotInList(_['Response Theme'], AiMineActionType.options['Response Theme']),
      }
      const rawSubActivity: AiMineActionType.TypeSub = {
        'Reporting Month': _['Reporting Month'],
        'Population Group': addFlagIfNotInList(_['Population Group'], AiMineActionType.optionsSub['Population Group']),
        'Indicators': addFlagIfNotInList(_['Indicator'], AiMineActionType.optionsSub.Indicators),
        'Total Individuals Reached': _['Total Individuals Reached'],
        'Girls (0-17)': _['Girls (0-17)'],
        'Boys (0-17)': _['Boys (0-17)'],
        'Adult Women (18-59)': _['Adult Women (18-59)'],
        'Adult Men (18-59)': _['Adult Men (18-59)'],
        'Older Women (60+)': _['Older Women (60+)'],
        'Older Men (60+)': _['Older Men (60+)'],
        'Non-individuals Reached/Quantity': 0,
        'People with Disability': _['People with Disability'],
      }
      const request = ActivityInfoSdk.makeRecordRequests({
        activityIdPrefix: 'drcma',
        activityYYYYMM: periodStr,
        formId: activitiesConfig.mineAction.id,
        activity: AiMineActionType.map(AiMapper.mapLocationToRecordId(rawActivity)),
        subActivities: [AiMineActionType.mapSub(rawSubActivity)],
        activityIndex: i,
        subformId: activitiesConfig.mineAction.subId,
      })
      const bundles: Bundle = {
        submit: checkAiValid(_['Oblast Oblast ENG/UKR'], _['Raion Raion ENG/UKR'], _['Hromada Hromada ENG/PCODE/UKR'], _['Plan/Project Code']),
        recordId: request.changes[0].recordId,
        activity: rawActivity,
        subActivity: rawSubActivity,
        data: [_],
        requestBody: request,
      }
      return bundles
    }))
  }))

  return (
    <Page width="full">
      <Panel>
        <AiBundleTable fetcher={fetcher} id="snfi"/>
      </Panel>
    </Page>
  )
}