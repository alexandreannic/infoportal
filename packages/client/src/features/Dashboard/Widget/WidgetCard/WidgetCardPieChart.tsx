import {Ip} from 'infoportal-api-sdk'
import React, {useMemo} from 'react'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/WidgetCard/WidgetCard'
import {Core} from '@/shared'
import {filterToFunction} from '@/features/Dashboard/Widget/WidgetCard/WidgetCardLineChart'
import {map} from '@axanc/ts-utils'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'

export function WidgetCardPieChart({widget}: {widget: Ip.Dashboard.Widget}) {
  const config = widget.config as Ip.Dashboard.Widget.Config['PieChart']
  const {flatSubmissions, flatSubmissionsDelta, schema} = useDashboardContext()

  const filteredData = useMemo(() => {
    return map(filterToFunction(schema, config.filter), flatSubmissions.filter) ?? flatSubmissions
  }, [flatSubmissions, config.filter])

  const filteredDataBefore = useMemo(() => {
    if (!flatSubmissionsDelta) return
    return map(filterToFunction(schema, config.filter), flatSubmissionsDelta.filter) ?? flatSubmissionsDelta
  }, [flatSubmissionsDelta, config.filter])

  const filterValue = useMemo(() => {
    if (!config.questionName) return
    return filterToFunction(schema, {questionName: config.questionName, ...config.filterValue})
  }, [config.filterValue])

  const filterBase = useMemo(() => {
    if (!config.questionName) return
    return filterToFunction(schema, {questionName: config.questionName, ...config.filterBase})
  }, [config.filterBase])

  if (!config.questionName) return <WidgetCardPlaceholder type={widget.type} />

  return (
    <Core.ChartPieWidgetBy<any>
      title={widget.title}
      data={filteredData}
      compare={
        filteredDataBefore && !config.hideEvolution
          ? {
              before: filteredDataBefore,
            }
          : undefined
      }
      dense={config.dense}
      property={config.questionName}
      filter={filterValue ?? (_ => true)}
      filterBase={filterBase ?? (_ => true)}
      showBase={config.showBase}
      showValue={config.showValue}
    />
  )
}
