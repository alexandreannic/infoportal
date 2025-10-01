import {Ip} from 'infoportal-api-sdk'
import {useDashboardEditorContext} from '@/features/Dashboard/Section/DashboardSection'
import React, {useMemo} from 'react'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/WidgetCard/WidgetCard'
import {Core} from '@/shared'
import {filterToFunction} from '@/features/Dashboard/Widget/WidgetCard/WidgetCardLineChart'
import {map} from '@axanc/ts-utils'

export function WidgetCardBarChart({widget}: {widget: Ip.Dashboard.Widget}) {
  const config = widget.config as Ip.Dashboard.Widget.Config['BarChart']
  const {flatSubmissions, schema} = useDashboardEditorContext()

  const labels = useMemo(() => {
    const q = config.questionName
    if (!q) return {}
    return schema.helper
      .getOptionsByQuestionName(q)
      .reduceObject<Record<string, string>>(_ => [_.name, schema.translate.choice(q, _.name)])
  }, [config.questionName, schema])

  const data = useMemo(() => {
    return map(filterToFunction(config.filter), flatSubmissions.filter) ?? flatSubmissions
  }, [flatSubmissions])

  if (!config.questionName) return <WidgetCardPlaceholder type={widget.type} />

  return <Core.ChartBarMultipleByKey data={data} label={labels} limit={config.limit} property={config.questionName} />
}
