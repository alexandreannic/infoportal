import {Answers, useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/shared/WidgetCardPlaceholder'
import {WidgetTitle} from '@/features/Dashboard/Widget/shared/WidgetTitle'
import {Core, Datatable} from '@/shared'
import {Box} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'
import {useCallback, useMemo} from 'react'

export function BarChartWidget({widget}: {widget: Ip.Dashboard.Widget}) {
  const config = widget.config as Ip.Dashboard.Widget.Config['BarChart']

  const getFilteredData = useDashboardContext(_ => _.data.getFilteredData)
  const filterFns = useDashboardContext(_ => _.data.filterFns)
  const langIndex = useDashboardContext(_ => _.langIndex)
  const filter = useDashboardContext(_ => _.filter.get)
  const updateFilter = useDashboardContext(_ => _.filter.updateQuestion)
  const schema = useDashboardContext(_ => _.schema)

  const labels = useMemo(() => {
    const q = config.questionName
    if (!q) return {}
    const choices = schema.helper.getOptionsByQuestionName(q)
    if (!choices) return {}
    return choices.reduceObject<Record<string, string>>(_ => [_.name, schema.translate.choice(q, _.name)])
  }, [config.questionName, schema])

  const filteredData = useMemo(() => {
    return getFilteredData([filterFns.byPeriodCurrent, filterFns.byWidgetFilter(config.filter)])
  }, [getFilteredData, config.filter, filterFns.byPeriodCurrent, filterFns.byWidgetFilter])

  const dataDelta = useMemo(() => {
    return getFilteredData([filterFns.byPeriodCurrentDelta, filterFns.byWidgetFilter(config.filter)])
  }, [getFilteredData, config.filter, filterFns.byWidgetFilter, filterFns.byPeriodCurrentDelta])

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

  const handleFilter = useCallback(
    (key: string) => {
      if (config.mapping) {
        console.log(key, config.mapping)
        const values = Object.entries(config.mapping)
          .filter(([choiceName, mappedValues]) => mappedValues?.[langIndex] === key)
          .map(_ => _[0])
        updateFilter(config.questionName!, values)
      } else {
        updateFilter(config.questionName!, [key])
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
        onClickData={handleFilter}
        compareTo={config.showEvolution ? dataDelta : undefined}
        multiple={multiple}
        hideValue={!config.showValue}
        data={filteredData}
        label={labels}
        limit={config.limit}
        filterValue={hiddenChoices}
        by={by!}
      />
    </Box>
  )
}
