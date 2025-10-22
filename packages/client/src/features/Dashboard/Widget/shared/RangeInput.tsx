import {Box, SxProps, useTheme} from '@mui/material'
import {useI18n} from '@infoportal/client-i18n'
import React from 'react'
import {Core} from '@/shared'
import {WidgetLabel} from '@/features/Dashboard/Widget/shared/WidgetLabel'

export function RangeInput({
  value = {},
  onChange,
  label,
  sx,
}: {
  sx?: SxProps
  label?: string
  value?: {min?: number; max?: number}
  onChange: (v: {min?: number; max?: number}) => void
}) {
  const t = useTheme()
  const {m} = useI18n()
  return (
    <Box sx={sx}>
      {label && <WidgetLabel>{label}</WidgetLabel>}
      <Box sx={{display: 'flex', alignItems: 'center', gap: t.vars.spacing}}>
        <Core.AsyncInput
          placeholder={m.min}
          debounce={300}
          type="number"
          helperText={null}
          value={value.min}
          onChange={_ => onChange({max: value.max && _ ? Math.max(value.max, _) : value.max, min: _})}
        />
        <Core.AsyncInput
          helperText={null}
          placeholder={m.max}
          debounce={300}
          type="number"
          value={value.max}
          onChange={_ => onChange({min: value.min && _ ? Math.min(value.min, _) : value.min, max: _})}
        />
      </Box>
    </Box>
  )
}
