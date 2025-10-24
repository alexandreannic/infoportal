import {Ip} from 'infoportal-api-sdk'
import React, {useMemo} from 'react'
import {Core} from '@/shared'
import {seq} from '@axanc/ts-utils'
import {ChartLineCurve} from '@infoportal/client-core'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {KoboSchemaHelper} from 'infoportal-common'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/shared/WidgetCardPlaceholder'
import {WidgetTitle} from '@/features/Dashboard/Widget/shared/WidgetTitle'
import {Box} from '@mui/material'

export function filterToFunction<T extends Record<string, any> = Record<string, any>>(
  schema: KoboSchemaHelper.Bundle<true>,
  filter?: Ip.Dashboard.Widget.ConfigFilter,
): undefined | ((_: T) => boolean | undefined) {
  if (!filter?.questionName) return
  const filterNumber = filter.number
  const filterChoice = filter.choices
  if (filterNumber)
    return (_: T) => {
      const value = _[filter.questionName!]
      if (isNaN(value)) return false
      if (filterNumber.min && filterNumber.min > value) return false
      if (filterNumber.max && filterNumber.max < value) return false
      return true
    }
  if (filterChoice) {
    if (!filterChoice || filterChoice.length === 0) return _ => true
    const isMultiple = schema.helper.questionIndex[filter.questionName]?.type === 'select_multiple'
    const set = new Set(filterChoice)
    if (isMultiple) return (_: T) => _[filter.questionName!]?.some((_: string) => set.has(_))
    return (_: T) => set.has(_[filter.questionName!])
  }
}

export const LineChartWidget = ({widget}: {widget: Ip.Dashboard.Widget}) => {
  const config = widget.config as Ip.Dashboard.Widget.Config['LineChart']
  const {flatSubmissions, langIndex, schema} = useDashboardContext()

  const filterFns = useMemo(() => {
    return config.lines?.map(_ => filterToFunction(schema, _.filter)) ?? []
  }, [config.lines])

  if (!config.lines || config.lines.length === 0) return <WidgetCardPlaceholder type={widget.type} />
  return (
    <Box sx={{p: 1, minHeight: 0, height: '100%'}}>
      <WidgetTitle>{widget.i18n_title?.[langIndex]}</WidgetTitle>
      <Core.ChartLineByDateFiltered
        start={config.start}
        end={config.end}
        data={flatSubmissions}
        curves={seq(config.lines).reduceObject<Record<string, ChartLineCurve>>((line, acc, i) => [
          line.i18n_label?.[langIndex] ?? schema.translate.question(line.questionName),
          {
            getDate: _ => _[line.questionName],
            filter: filterFns[i],
            color: line.color,
          },
        ])}
      />
    </Box>
  )
}
