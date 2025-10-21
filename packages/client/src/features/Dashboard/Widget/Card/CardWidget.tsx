import {Ip} from 'infoportal-api-sdk'
import React, {useMemo} from 'react'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/Widget'
import {filterToFunction} from '@/features/Dashboard/Widget/LineChart/LineChartWidget'
import {map} from '@axanc/ts-utils'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {toInt} from 'infoportal-common'
import {Box, Icon} from '@mui/material'

export function CardWidget({widget}: {widget: Ip.Dashboard.Widget}) {
  const config = widget.config as Ip.Dashboard.Widget.Config['Card']
  const {flatSubmissions, flatSubmissionsDelta, schema} = useDashboardContext()

  const data = useMemo(() => {
    return map(filterToFunction(schema, config.filter), flatSubmissions.filter) ?? flatSubmissions
  }, [flatSubmissions, config.filter])

  const value = useMemo(() => {
    if (config.operation === 'count') return data.length
    if (!config.questionName) return
    const mapped: number[] = data.map(_ => toInt(_[config.questionName!])).filter(_ => _ !== undefined)
    try {
      switch (config.operation) {
        case 'max': {
          return Math.max(...mapped)
        }
        case 'min': {
          return Math.min(...mapped)
        }
        case 'sum': {
          return mapped.reduce((acc, _) => acc + _, 0)
        }
        case 'avg': {
          return mapped.reduce((acc, _) => acc + _, 0) / data.length
        }
      }
    } catch (e) {
      return
    }
  }, [data, config.questionName, config.operation])

  if (value === undefined) return <WidgetCardPlaceholder type={widget.type} />

  return (
    <>
      <Box
        sx={{
          lineHeight: 1,
          fontWeight: t => t.typography.fontWeightBold,
          fontSize: '1.7em',
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: 32,
        }}
      >
        {config.icon && (
          <Icon color="disabled" sx={{mr: 1}} fontSize="large">
            {config.icon}
          </Icon>
        )}
        {value.toFixed(2)}
      </Box>
    </>
  )
}
