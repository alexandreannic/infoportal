import {SxProps} from '@mui/material'
import {useDashboardCreatorContext} from '@/features/Dashboard/DashboardCreator'
import React from 'react'
import {useWidgetSettingsContext} from '@/features/Dashboard/Widget/SettingsPanel/WidgetSettingsPanel'
import { Core } from '@/shared'

export function SelectChoices({
  value = [],
  onChange,
  label,
  sx,
}: {
  sx?: SxProps
  value?: string[]
  onChange: (_: string[]) => void
  label?: string
}) {
  const {widget, question, choices} = useWidgetSettingsContext()
  const {schema} = useDashboardCreatorContext()
  return (
    <Core.SelectMultiple
      sx={sx}
      label={label}
      value={value}
      options={choices.map(_ => ({value: _.name, children: schema.translate.choice(widget.questionName, _.name)}))}
      onChange={onChange}
    />
  )
}
