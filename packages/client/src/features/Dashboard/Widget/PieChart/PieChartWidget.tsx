import {useDashboardContext} from '@/features/Dashboard/Context/DashboardContext'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/shared/WidgetCardPlaceholder'
import {Core} from '@/shared'
import {Box} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'
import {useMemo} from 'react'

export function PieChartWidget({widget}: {widget: Ip.Dashboard.Widget}) {
  const config = widget.config as Ip.Dashboard.Widget.Config['PieChart']

  const getFilteredData = useDashboardContext(_ => _.data.getFilteredData)
  const filterFns = useDashboardContext(_ => _.data.filterFns)
  const flattenRepeatGroupData = useDashboardContext(_ => _.flattenRepeatGroupData)
  const langIndex = useDashboardContext(_ => _.langIndex)

  const filteredData = useMemo(() => {
    const d = getFilteredData([
      filterFns.byPeriodCurrent,
      filterFns.byDashboardFilter(),
      filterFns.byWidgetFilter(config.filter),
    ])
    return flattenRepeatGroupData.flattenIfRepeatGroup(d, config.questionName)
  }, [
    getFilteredData,
    filterFns.byPeriodCurrent,
    filterFns.byDashboardFilter,
    filterFns.byWidgetFilter,
    config.questionName,
    config.filter,
  ])

  const filterValue = useMemo(() => {
    if (!config.questionName) return
    return filterFns.byWidgetFilter({questionName: config.questionName, ...config.filterValue})
  }, [config.filterValue])

  const filterBase = useMemo(() => {
    if (!config.questionName) return
    return filterFns.byWidgetFilter({questionName: config.questionName, ...config.filterBase})
  }, [config.filterBase])

  if (!config.questionName) return <WidgetCardPlaceholder type={widget.type} />

  return (
    <Box sx={{p: 1, display: 'flex', alignItems: 'center', height: '100%'}}>
      <Core.ChartPieWidgetBy<any>
        title={widget.i18n_title?.[langIndex]}
        data={filteredData}
        compareBy={config.showEvolution ? filterFns.byPeriodCurrentDelta : undefined}
        dense={config.dense}
        property={config.questionName}
        condition={filterValue ?? (_ => true)}
        baseCondition={filterBase}
        showBase={config.showBase}
        showValue={config.showValue}
      />
    </Box>
  )
}
