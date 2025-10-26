import {Ip} from 'infoportal-api-sdk'
import React, {useMemo} from 'react'
import {Core} from '@/shared'
import {filterToFunction} from '@/features/Dashboard/Widget/LineChart/LineChartWidget'
import {map} from '@axanc/ts-utils'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/shared/WidgetCardPlaceholder'
import {Box} from '@mui/material'

export function PieChartWidget({widget}: {widget: Ip.Dashboard.Widget}) {
  const config = widget.config as Ip.Dashboard.Widget.Config['PieChart']

  const flatSubmissions = useDashboardContext(_ => _.flatSubmissions)
  const flattenRepeatGroupData = useDashboardContext(_ => _.flattenRepeatGroupData)
  const flatSubmissionsDelta = useDashboardContext(_ => _.flatSubmissionsDelta)
  const langIndex = useDashboardContext(_ => _.langIndex)
  const schema = useDashboardContext(_ => _.schema)

  const filteredData = useMemo(() => {
    const d = flattenRepeatGroupData.flattenIfRepeatGroup(flatSubmissions, config.questionName)
    return map(filterToFunction(schema, config.filter), d.filter) ?? d
  }, [flatSubmissions, config.questionName, config.filter])

  const filteredDataBefore = useMemo(() => {
    if (!flatSubmissionsDelta) return
    const d = flattenRepeatGroupData.flattenIfRepeatGroup(flatSubmissionsDelta, config.questionName)
    return map(filterToFunction(schema, config.filter), d.filter) ?? d
  }, [flatSubmissionsDelta, config.questionName, config.filter])

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
    <Box sx={{p: 1, display: 'flex', alignItems: 'center', height: '100%'}}>
      <Core.ChartPieWidgetBy<any>
        title={widget.i18n_title?.[langIndex]}
        data={filteredData}
        compare={
          filteredDataBefore && config.showEvolution
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
    </Box>
  )
}
