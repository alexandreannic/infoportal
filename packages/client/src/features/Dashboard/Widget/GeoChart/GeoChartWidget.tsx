import {useTheme} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'
import React, {useMemo} from 'react'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/Card/CardWidget'
import {Core} from '@/shared'
import {map, Obj} from '@axanc/ts-utils'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {filterToFunction} from '@/features/Dashboard/Widget/LineChart/LineChartWidget'

export const GeoChartWidget = ({widget}: {widget: Ip.Dashboard.Widget}) => {
  const t = useTheme()
  const config = widget.config as Ip.Dashboard.Widget.Config['GeoChart']
  const {flatSubmissions, schema} = useDashboardContext()

  const filteredData = useMemo(() => {
    return map(filterToFunction(schema, config.filter), flatSubmissions.filter) ?? flatSubmissions
  }, [flatSubmissions, config.filter])

  const data = useMemo(() => {
    if (!config.questionName) return []
    const record = filteredData.groupByAndApply(
      _ => _[config.questionName!],
      _ => _.length,
    )
    return Obj.entries(record).map(([iso, count]) => ({iso, count}))
  }, [config, filteredData])

  if (!config.questionName) return <WidgetCardPlaceholder type={widget.type} />

  return <Core.ChartGeo data={data} fixCountry={config.countryIsoCode as any} />
}
