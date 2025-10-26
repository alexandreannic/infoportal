import {useTheme} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'
import React, {useMemo} from 'react'
import {Core} from '@/shared'
import {map, Obj} from '@axanc/ts-utils'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {filterToFunction} from '@/features/Dashboard/Widget/LineChart/LineChartWidget'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/shared/WidgetCardPlaceholder'
import {WidgetTitle} from '@/features/Dashboard/Widget/shared/WidgetTitle'

export const GeoChartWidget = ({widget}: {widget: Ip.Dashboard.Widget}) => {
  const t = useTheme()
  const config = widget.config as Ip.Dashboard.Widget.Config['GeoChart']

  const flatSubmissions = useDashboardContext(_ => _.flatSubmissions)
  const langIndex = useDashboardContext(_ => _.langIndex)
  const schema = useDashboardContext(_ => _.schema)

  const filteredData = useMemo(() => {
    return map(filterToFunction(schema, config.filter), flatSubmissions.filter) ?? flatSubmissions
  }, [flatSubmissions, config.filter])

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
