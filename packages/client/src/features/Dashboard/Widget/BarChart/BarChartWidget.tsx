import {Ip} from 'infoportal-api-sdk'
import React, {useMemo} from 'react'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/Widget'
import {Core} from '@/shared'
import {filterToFunction} from '@/features/Dashboard/Widget/LineChart/LineChartWidget'
import {map} from '@axanc/ts-utils'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'

export function BarChartWidget({widget}: {widget: Ip.Dashboard.Widget}) {
  const config = widget.config as Ip.Dashboard.Widget.Config['BarChart']
  const {flatSubmissions, flatSubmissionsDelta, schema} = useDashboardContext()

  const labels = useMemo(() => {
    const q = config.questionName
    if (!q) return {}
    return schema.helper
      .getOptionsByQuestionName(q)
      .reduceObject<Record<string, string>>(_ => [_.name, schema.translate.choice(q, _.name)])
  }, [config.questionName, schema])

  const data = useMemo(() => {
    return map(filterToFunction(schema, config.filter), flatSubmissions.filter) ?? flatSubmissions
  }, [flatSubmissions, config.filter])

  if (!config.questionName) return <WidgetCardPlaceholder type={widget.type} />
  const multiple = schema.helper.questionIndex[config.questionName].type === 'select_multiple'

  return (
    <Core.ChartBarByKey
      compareTo={config.showEvolution ? flatSubmissionsDelta : undefined}
      multiple={multiple}
      hideValue={!config.showValue}
      data={data}
      label={labels}
      limit={config.limit}
      property={config.questionName}
    />
  )
}
