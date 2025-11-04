import {Answers, useDashboardContext} from '@/features/Dashboard/Context/DashboardContext'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/shared/WidgetCardPlaceholder'
import {WidgetTitle} from '@/features/Dashboard/Widget/shared/WidgetTitle'
import {Core, Datatable} from '@/shared'
import {Box} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'
import {useCallback, useMemo} from 'react'

export function BarChartWidget({widget}: {widget: Ip.Dashboard.Widget}) {
  const config = widget.config as Ip.Dashboard.Widget.Config['BarChart']

  const byPeriod = useDashboardContext(_ => _.data.filterFns.byPeriodCurrentDelta)
  const getFilteredData = useDashboardContext(_ => _.data.getFilteredData)
  const filterFns = useDashboardContext(_ => _.data.filterFns)
  const langIndex = useDashboardContext(_ => _.langIndex)
  const filter = useDashboardContext(_ => _.filter.get)
  const updateQuestion = useDashboardContext(_ => _.filter.updateQuestion)
  const schema = useDashboardContext(_ => _.schema)

  const choices = useMemo(() => {
    if (!config.questionName) return
    return schema.helper.getOptionsByQuestionName(config.questionName)
  }, [config.questionName])

  const labels = useMemo(() => {
    const q = config.questionName
    if (!q) return {}
    if (!choices) return {}
    return choices.reduceObject<Record<string, string>>(_ => [_.name, schema.translate.choice(q, _.name)])
  }, [config.questionName, schema])

  const filteredData = useMemo(() => {
    return getFilteredData([
      filterFns.byPeriodCurrent,
      filterFns.byDashboardFilter({excludedQuestion: config.questionName}),
      filterFns.byWidgetFilter(config.filter),
    ])
  }, [
    getFilteredData,
    config.questionName,
    config.filter,
    filterFns.byDashboardFilter,
    filterFns.byPeriodCurrent,
    filterFns.byWidgetFilter,
  ])

  const question = schema.helper.questionIndex[config.questionName!]
  const multiple = question?.type === 'select_multiple'

  const hiddenChoices = useMemo(() => {
    return config.hiddenChoices?.map(_ => (config.mapping ?? {})[_]?.[langIndex] ?? _)
  }, [config.hiddenChoices, langIndex, config.mapping])

  const by = useMemo(() => {
    if (!config.questionName) return
    return config.mapping
      ? (_: Answers) => {
          const value = _[config.questionName!] ?? Datatable.Utils.blank
          if (multiple) {
            const safeValue = value && !Array.isArray(value) ? [value] : value
            return (safeValue as string[])?.map(v => config.mapping?.[v]?.[langIndex] ?? v)
          }
          return config.mapping?.[value]?.[langIndex] ?? value
        }
      : (_: Answers) => _[config.questionName!] ?? Datatable.Utils.blank
  }, [config.mapping, langIndex, config.questionName])

  const handleChoiceClick = useCallback(
    (key: string) => {
      if (config.mapping) {
        const values = Object.entries(config.mapping)
          .filter(([choiceName, mappedValues]) => mappedValues?.[langIndex] === key)
          .map(_ => _[0])
        updateQuestion(config.questionName!, values.length === 0 ? [key] : values)
      } else {
        updateQuestion(config.questionName!, [key])
      }
    },
    [config.questionName!, config.mapping],
  )

  if (!config.questionName || !question) return <WidgetCardPlaceholder type={widget.type} />

  return (
    <Box sx={{p: 1}}>
      <WidgetTitle>{widget.i18n_title?.[langIndex]}</WidgetTitle>
      <Core.ChartBarBy
        checked={filter.questions[config.questionName]}
        onClickData={handleChoiceClick}
        compareBy={byPeriod}
        multiple={multiple}
        hideValue={!config.showValue}
        data={filteredData}
        labels={labels}
        limit={config.limit}
        skippedValues={hiddenChoices}
        by={by!}
      />
    </Box>
  )
}
