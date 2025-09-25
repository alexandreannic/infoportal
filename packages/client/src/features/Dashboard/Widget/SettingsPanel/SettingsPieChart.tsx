import {useI18n} from '@infoportal/client-i18n'
import {Controller, useForm, useWatch} from 'react-hook-form'
import {Ip} from 'infoportal-api-sdk'
import React, {useEffect} from 'react'
import {Box, SxProps, useTheme} from '@mui/material'
import {SwitchBox} from '@/shared/SwitchBox'
import {Label, useWidgetSettingsContext} from '@/features/Dashboard/Widget/SettingsPanel/WidgetSettingsPanel'
import {SelectChoices} from './SelectChoices'
import {Core} from '@/shared'

export function SettingsPieChart() {
  const {widget, question, onChange} = useWidgetSettingsContext()
  const {m} = useI18n()
  const form = useForm<Ip.Dashboard.Widget.Config['PieChart']>({
    mode: 'onChange',
    defaultValues: widget.config,
  })

  const values = useWatch({control: form.control})

  useEffect(() => {
    onChange({config: values})
  }, [values])
  return (
    <>
      {question.type === 'select_one' ? (
        <>
          <Controller
            name="filterChoice"
            control={form.control}
            render={({field}) => <SelectChoices {...field} label={m.select} sx={{mb: 1}} />}
          />

          <Controller
            name="filterChoiceBase"
            control={form.control}
            render={({field}) => <SelectChoices {...field} label={m.base} />}
          />
        </>
      ) : (
        <>
          <Box>
            <Controller
              name="filterNumber"
              control={form.control}
              render={({field}) => <RangeInput label={m.value} {...field} />}
            />
            <Controller
              name="filterNumberBase"
              control={form.control}
              render={({field}) => <RangeInput label={m.base} {...field} />}
            />
          </Box>
        </>
      )}
      <SwitchBox sx={{mt: 2, mb: 1}} {...form.register('showValue')} label={m._dashboard.showValue} />
      <SwitchBox sx={{mb: 1}} {...form.register('showBase')} label={m._dashboard.showBase} />
      <SwitchBox {...form.register('dense')} label={m.smaller} />
    </>
  )
}

function RangeInput({
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
      {label && <Label>{label}</Label>}
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
