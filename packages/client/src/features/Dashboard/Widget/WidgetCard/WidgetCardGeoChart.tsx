import {useTheme} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'
import React, {useMemo} from 'react'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/WidgetCard/WidgetCard'
import {Core} from '@/shared'
import {Obj} from '@axanc/ts-utils'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'

export const WidgetCardGeoChart = ({widget}: {widget: Ip.Dashboard.Widget}) => {
  const t = useTheme()
  const config = widget.config as Ip.Dashboard.Widget.Config['GeoChart']
  const {flatSubmissions, schema} = useDashboardContext()

  const data = useMemo(() => {
    if (!config.questionName) return []
    const record = flatSubmissions.groupByAndApply(
      _ => _[config.questionName!],
      _ => _.length,
    )
    return Obj.entries(record).map(([iso, count]) => ({iso, count}))
  }, [config, flatSubmissions])

  if (!config.questionName) return <WidgetCardPlaceholder type={widget.type} />

  return <Core.ChartGeoIso2 data={data} country={config.countryIsoCode as any} />
}
