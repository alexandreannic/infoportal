import {Ip} from 'infoportal-api-sdk'
import {useDashboardCreatorContext} from '@/features/Dashboard/DashboardCreator'
import React, {useMemo} from 'react'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/WidgetCard/WidgetCard'
import {Core} from '@/shared'

export function WidgetCardPieChart({widget}: {widget: Ip.Dashboard.Widget}) {
  const config = widget.config as Ip.Dashboard.Widget.Config['PieChart']
  const {flatSubmissions, schema} = useDashboardCreatorContext()
  const [filterValue, filterBase] = useMemo(() => {
    return computeFn(config)
  }, [config.questionName, config])

  if (!config.questionName) return <WidgetCardPlaceholder type={widget.type} />

  return (
    <Core.ChartPieWidgetBy<any>
      title={widget.title}
      data={flatSubmissions}
      dense={config.dense}
      property={config.questionName}
      filter={filterValue}
      filterBase={filterBase}
      showBase={config.showBase}
      showValue={config.showValue}
    />
  )
}

function computeFn(conf: Ip.Dashboard.Widget.Config['PieChart']) {
  if (conf.questionName) {
    const qName = conf.questionName
    if (conf.filterChoice) {
      return [
        (_: Record<string, string>) => conf.filterChoice!.includes(_[qName]),
        (_: Record<string, string>) => !conf.filterChoiceBase || conf.filterChoiceBase!.includes(_[qName]),
      ]
    }
    if (conf.filterNumber) {
      return [
        (_: Record<string, number>) => {
          const value = _[qName]
          if (isNaN(value)) return false
          if (conf.filterNumber?.min && conf.filterNumber.min > value) return false
          if (conf.filterNumber?.max && conf.filterNumber.max < value) return false
          return true
        },
        (_: Record<string, number>) => {
          if (!conf.filterNumberBase) return true
          const value = _[qName]
          if (isNaN(value)) return false
          if (conf.filterNumberBase?.min && conf.filterNumberBase.min > value) return false
          if (conf.filterNumberBase?.max && conf.filterNumberBase.max < value) return false
          return true
        },
      ]
    }
  }
  return [(_: any) => true, (_: any) => true]
}
