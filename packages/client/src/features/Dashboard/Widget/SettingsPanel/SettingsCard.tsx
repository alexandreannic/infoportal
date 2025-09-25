import {useI18n} from '@infoportal/client-i18n'
import {useDashboardCreatorContext} from '@/features/Dashboard/DashboardCreator'
import {useForm} from 'react-hook-form'
import {Ip} from 'infoportal-api-sdk'
import React, {useEffect} from 'react'
import {Box, Slider} from '@mui/material'
import {Label, useWidgetSettingsContext} from '@/features/Dashboard/Widget/SettingsPanel/WidgetSettingsPanel'
import {Core} from '@/shared'
import {SelectChoices} from '@/features/Dashboard/Widget/SettingsPanel/SelectChoices'

export function SettingsBarChart() {
  const {m} = useI18n()
  const {schema} = useDashboardCreatorContext()
  const {widget, question, choices} = useWidgetSettingsContext()
  const barChartForm = useForm<Ip.Dashboard.Widget.Config['BarChart']>()

  useEffect(() => {
    barChartForm.setValue('multiple', question.type === 'select_one')
  }, [question])

  if (!question) {
    return <Core.Alert severity="error" title={m.anErrorOccurred} />
  }

  return (
    <Box>
      <SelectChoices value={[]} onChange={console.log} />
      <Label uppercase></Label>
      <Slider defaultValue={choices.length} max={choices.length} valueLabelDisplay="auto" />
    </Box>
  )
}
