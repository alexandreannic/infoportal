import {useI18n} from '@infoportal/client-i18n'
import {useForm} from 'react-hook-form'
import {Ip} from 'infoportal-api-sdk'
import React, {useEffect} from 'react'
import {Box, Slider} from '@mui/material'
import {
  Label,
  useQuestionInfo,
  useWidgetSettingsContext,
} from '@/features/Dashboard/Widget/WidgetSettingsPanel'
import {Core} from '@/shared'
import {SelectChoices} from '@/features/Dashboard/Widget/shared/SelectChoices'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'

export function CardSettings() {
  const {m} = useI18n()
  const {schema} = useDashboardContext()
  const {question, choices} = useQuestionInfo()
  const {widget} = useWidgetSettingsContext()
  const barChartForm = useForm<Ip.Dashboard.Widget.Config['BarChart']>()

  if (!question) {
    return <Core.Alert severity="error" title={m.anErrorOccurred} />
  }

  return (
    <Box>
      <SelectChoices value={[]} onChange={console.log} />
      <Label uppercase></Label>
    </Box>
  )
}
