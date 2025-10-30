import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/shared/WidgetCardPlaceholder'
import {WidgetTitle} from '@/features/Dashboard/Widget/shared/WidgetTitle'
import {Core} from '@/shared'
import {Obj} from '@axanc/ts-utils'
import {Ip} from 'infoportal-api-sdk'
import {useMemo} from 'react'

export const GeoChartWidget = ({widget}: {widget: Ip.Dashboard.Widget}) => {
  const config = widget.config as Ip.Dashboard.Widget.Config['GeoChart']

  const getFilteredData = useDashboardContext(_ => _.data.getFilteredData)
  const filterFns = useDashboardContext(_ => _.data.filterFns)
  const langIndex = useDashboardContext(_ => _.langIndex)

  const filteredData = useMemo(() => {
    return getFilteredData([filterFns.byPeriodCurrent, filterFns.byWidgetFilter(config.filter)])
  }, [getFilteredData, config.filter, filterFns.byPeriodCurrent, filterFns.byWidgetFilter])

  const data = useMemo(() => {
    if (!config.questionName) return []
    const record = filteredData.groupByAndApply(
      _ => {
        const value = _[config.questionName!]
        const mappedValue = config.mapping?.[value]
        if (mappedValue && mappedValue !== '') return mappedValue
        return value
      },
      _ => _.length,
    )
    return Obj.entries(record).map(([iso, count]) => ({iso, count}))
  }, [config, filteredData])

  if (!config.questionName) return <WidgetCardPlaceholder type={widget.type} />

  return (
    <>
      <WidgetTitle sx={{mx: 1, mt: 1}}>{widget.i18n_title?.[langIndex]}</WidgetTitle>
      <Core.ChartGeo data={data} country={config.countryIsoCode as any} />
    </>
  )
}
