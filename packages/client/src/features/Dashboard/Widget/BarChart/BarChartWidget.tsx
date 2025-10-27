import {Ip} from 'infoportal-api-sdk'
import React, {useMemo} from 'react'
import {Core} from '@/shared'
import {filterToFunction} from '@/features/Dashboard/Widget/LineChart/LineChartWidget'
import {map} from '@axanc/ts-utils'
import {Answers, useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {WidgetCardPlaceholder} from '@/features/Dashboard/Widget/shared/WidgetCardPlaceholder'
import {WidgetTitle} from '@/features/Dashboard/Widget/shared/WidgetTitle'
import {Box} from '@mui/material'
import {Datatable} from '@/shared'

export function BarChartWidget({widget}: {widget: Ip.Dashboard.Widget}) {
  const config = widget.config as Ip.Dashboard.Widget.Config['BarChart']

  const flatSubmissions = useDashboardContext(_ => _.flatSubmissions)
  const langIndex = useDashboardContext(_ => _.langIndex)
  const flatSubmissionsDelta = useDashboardContext(_ => _.flatSubmissionsDelta)
  const schema = useDashboardContext(_ => _.schema)

  const labels = useMemo(() => {
    const q = config.questionName
    if (!q) return {}
    const choices = schema.helper.getOptionsByQuestionName(q)
    if (!choices) return {}
    return choices.reduceObject<Record<string, string>>(_ => [_.name, schema.translate.choice(q, _.name)])
  }, [config.questionName, schema])

  const data = useMemo(() => {
    return map(filterToFunction(schema, config.filter), flatSubmissions.filter) ?? flatSubmissions
  }, [flatSubmissions, config.filter])

  const question = schema.helper.questionIndex[config.questionName!]
  const multiple = question?.type === 'select_multiple'

  const hiddenChoices = useMemo(() => {
    return config.hiddenChoices?.map(_ => (config.mapping ?? {})[_]?.[langIndex] ?? _)
  }, [config.hiddenChoices, langIndex, config.mapping])

  const by = useMemo(() => {
    if (!config.questionName) return
    return config.mapping
      ? (_: Answers) => {
          const value = _[config.questionName!] ?? Datatable.Utils.blank
          if (multiple) {
            const safeValue = value && !Array.isArray(value) ? [value] : value
            return (safeValue as string[])?.map(v => config.mapping?.[v]?.[langIndex] ?? v)
          }
          return config.mapping?.[value]?.[langIndex] ?? value
        }
      : (_: Answers) => _[config.questionName!] ?? Datatable.Utils.blank
  }, [config.mapping, langIndex, config.questionName])

  if (!config.questionName || !question) return <WidgetCardPlaceholder type={widget.type} />

  return (
    <Box sx={{p: 1}}>
      <WidgetTitle>{widget.i18n_title?.[langIndex]}</WidgetTitle>
      <Core.ChartBarBy
        compareTo={config.showEvolution ? flatSubmissionsDelta : undefined}
        multiple={multiple}
        hideValue={!config.showValue}
        data={data}
        label={labels}
        limit={config.limit}
        filterValue={hiddenChoices}
        by={by!}
      />
    </Box>
  )
}
