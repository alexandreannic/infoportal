import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/shared/WidgetCardPlaceholder'
import {WidgetTitle} from '@/features/Dashboard/Widget/shared/WidgetTitle'
import {Core} from '@/shared'
import {seq} from '@axanc/ts-utils'
import {ChartLineCurve} from '@infoportal/client-core'
import {Box} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'
import {useMemo} from 'react'

export const LineChartWidget = ({widget}: {widget: Ip.Dashboard.Widget}) => {
  const config = widget.config as Ip.Dashboard.Widget.Config['LineChart']

  const getFilteredData = useDashboardContext(_ => _.data.getFilteredData)
  const filterFns = useDashboardContext(_ => _.data.filterFns)
  const langIndex = useDashboardContext(_ => _.langIndex)
  const schema = useDashboardContext(_ => _.schema)

  const data = useMemo(() => {
    return getFilteredData([filterFns.byPeriodCurrent, filterFns.byDashboardFilter()])
  }, [getFilteredData, filterFns.byPeriodCurrent, filterFns.byDashboardFilter])

  const lineFilters = useMemo(() => {
    return config.lines?.map(_ => filterFns.byWidgetFilter(_.filter)) ?? []
  }, [config.lines])

  if (!config.lines || config.lines.length === 0) return <WidgetCardPlaceholder type={widget.type} />
  return (
    <Box sx={{p: 1, minHeight: 0, height: '100%'}}>
      <WidgetTitle>{widget.i18n_title?.[langIndex]}</WidgetTitle>
      <Core.ChartLineByDateFiltered
        start={config.start}
        end={config.end}
        data={data}
        curves={seq(config.lines).reduceObject<Record<string, ChartLineCurve>>((line, acc, i) => [
          line.i18n_label?.[langIndex] ?? schema.translate.question(line.questionName),
          {
            getDate: _ => _[line.questionName],
            filter: lineFilters[i],
            color: line.color,
          },
        ])}
      />
    </Box>
  )
}
