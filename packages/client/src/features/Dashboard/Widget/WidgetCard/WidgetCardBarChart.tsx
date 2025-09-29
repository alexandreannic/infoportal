import {Ip} from 'infoportal-api-sdk'
import {useDashboardCreatorContext} from '@/features/Dashboard/DashboardCreator'
import React, {useMemo} from 'react'
import {Box} from '@mui/material'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/WidgetCard/WidgetCard'
import {Core} from '@/shared'
import {filterToFunction} from '@/features/Dashboard/Widget/WidgetCard/WidgetCardLineChart'

export function WidgetCardBarChart({widget}: {widget: Ip.Dashboard.Widget}) {
  const config = widget.config as Ip.Dashboard.Widget.Config['BarChart']
  const {flatSubmissions, schema} = useDashboardCreatorContext()
  const labels = useMemo(() => {
    const q = config.questionName
    if (!q) return {}
    return schema.helper
      .getOptionsByQuestionName(q)
      .reduceObject<Record<string, string>>(_ => [_.name, schema.translate.choice(q, _.name)])
  }, [config.questionName, schema])
  if (!config.questionName) return <WidgetCardPlaceholder type={widget.type} />
  const data = useMemo(() => {
    if (config.filter) return flatSubmissions.filter(filterToFunction(config.filter))
    return flatSubmissions
  }, [flatSubmissions])
  return <Core.ChartBarMultipleByKey data={data} label={labels} limit={config.limit} property={config.questionName} />
}
