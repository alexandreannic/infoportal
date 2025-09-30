import {Ip} from 'infoportal-api-sdk'
import {useDashboardEditorContext} from '@/features/Dashboard/Section/DashboardSection'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/WidgetCard/WidgetCard'
import React, {useMemo} from 'react'
import {Core} from '@/shared'
import {seq} from '@axanc/ts-utils'
import {ChartLineCurve} from '@infoportal/client-core'

export function filterToFunction<T extends Record<string, any> = Record<string, any>>(
  filter: Ip.Dashboard.Widget.ConfigFilter,
): undefined | ((_: T) => boolean | undefined) {
  if (!filter?.questionName) return
  const filterNumber = filter.number
  const filterChoice = filter.choices
  if (filterNumber)
    return (_: T) => {
      const value = _[filter.questionName]
      if (isNaN(value)) return false
      if (filterNumber.min && filterNumber.min > value) return false
      if (filterNumber.max && filterNumber.max < value) return false
      return true
    }
  if (filterChoice) {
    return (_: T) => filterChoice.includes(_[filter.questionName])
  }
}

export const WidgetCardLineChart = ({widget}: {widget: Ip.Dashboard.Widget}) => {
  const config = widget.config as Ip.Dashboard.Widget.Config['LineChart']
  const {flatSubmissions, schema} = useDashboardEditorContext()

  const filterFns = useMemo(() => {
    return config.lines?.map(_ => filterToFunction(_.filter)) ?? []
  }, [config.lines])

  if (!config.lines || config.lines.length === 0) return <WidgetCardPlaceholder type={widget.type} />
  return (
    <Core.ChartLineByDateFiltered
      start={config.start}
      end={config.end}
      data={flatSubmissions}
      curves={seq(config.lines).reduceObject<Record<string, ChartLineCurve>>((line, acc, i) => [
        line.title ?? schema.translate.question(line.questionName),
        {
          getDate: _ => _[line.questionName],
          filter: filterFns[i],
          color: line.color,
        },
      ])}
    />
  )
}
