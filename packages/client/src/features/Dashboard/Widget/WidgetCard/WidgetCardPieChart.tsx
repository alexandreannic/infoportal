import {Ip} from 'infoportal-api-sdk'
import {useDashboardCreatorContext} from '@/features/Dashboard/DashboardCreator'
import React, {useMemo} from 'react'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/WidgetCard/WidgetCard'
import {Core} from '@/shared'
import {filterToFunction} from '@/features/Dashboard/Widget/WidgetCard/WidgetCardLineChart'
import {map} from '@axanc/ts-utils'

export function WidgetCardPieChart({widget}: {widget: Ip.Dashboard.Widget}) {
  const config = widget.config as Ip.Dashboard.Widget.Config['PieChart']
  const {flatSubmissions, schema} = useDashboardCreatorContext()

  const filteredData = useMemo(() => {
    return map(filterToFunction(config.filter), flatSubmissions.filter) ?? flatSubmissions
  }, [flatSubmissions])

  const filterValue = useMemo(() => {
    if (!config.questionName) return
    return filterToFunction({questionName: config.questionName, ...config.filterValue})
  }, [config.filterValue])

  const filterBase = useMemo(() => {
    if (!config.questionName) return
    return filterToFunction({questionName: config.questionName, ...config.filterBase})
  }, [config.filterBase])

  if (!config.questionName) return <WidgetCardPlaceholder type={widget.type} />

  return (
    <Core.ChartPieWidgetBy<any>
      title={widget.title}
      data={filteredData}
      dense={config.dense}
      property={config.questionName}
      filter={filterValue ?? (_ => true)}
      filterBase={filterBase ?? (_ => true)}
      showBase={config.showBase}
      showValue={config.showValue}
    />
  )
}
