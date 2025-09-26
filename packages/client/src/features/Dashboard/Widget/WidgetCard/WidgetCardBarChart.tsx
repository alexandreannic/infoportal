import {Ip} from 'infoportal-api-sdk'
import {useDashboardCreatorContext} from '@/features/Dashboard/DashboardCreator'
import React, {useMemo} from 'react'
import {Box} from '@mui/material'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/WidgetCard/WidgetCard'
import {Core} from '@/shared'

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
  return <Core.ChartBarMultipleByKey data={flatSubmissions} label={labels} property={config.questionName} />
}
