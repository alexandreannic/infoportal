import {useI18n} from '@infoportal/client-i18n'
import {Controller, useForm, useWatch} from 'react-hook-form'
import {Ip} from 'infoportal-api-sdk'
import React, {useEffect} from 'react'
import {Box, Icon, Slider} from '@mui/material'
import {
  getQuestionTypeByWidget,
  useQuestionInfo,
  useWidgetSettingsContext,
} from '@/features/Dashboard/Widget/WidgetSettingsPanel'
import {Core} from '@/shared'
import {SelectChoices} from '@/features/Dashboard/Widget/shared/SelectChoices'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {SelectQuestionInput} from '@/shared/SelectQuestionInput'
import {WidgetSettingsFilterQuestion} from '@/features/Dashboard/Widget/shared/WidgetSettingsFilter'
import {WidgetSettingsSection} from '@/features/Dashboard/Widget/shared/WidgetSettingsSection'
import {Obj} from '@axanc/ts-utils'
import {MaterialIconSelector} from '@/features/Dashboard/Widget/shared/MaterialIconSelector'
import {WidgetLabel} from '@/features/Dashboard/Widget/shared/WidgetLabel'
import {ColorPickerLimited} from '@/features/Dashboard/Widget/shared/ColorPickerLimited'
import {SwitchBox} from '@/shared/SwitchBox'

export function AlertSettings() {
  const {m} = useI18n()
  const langIndex = useDashboardContext(_ => _.langIndex)
  const {widget, onChange} = useWidgetSettingsContext()
  const form = useForm<Ip.Dashboard.Widget.Config['Alert']>({
    mode: 'onChange',
    defaultValues: {
      ...widget.config,
    },
  })
  const values = useWatch({control: form.control})

  useEffect(() => {
    onChange({config: values})
  }, [values])

  return (
    <Box>
      <WidgetSettingsSection title={m.customize}>
        <Controller
          key={langIndex}
          name={`i18n_content.${langIndex}`}
          control={form.control}
          render={({field, fieldState}) => (
            <Core.AsyncInput
              helperText={null}
              minRows={3}
              value={field.value}
              multiline
              onSubmit={_ => field.onChange(_)}
              sx={{mb: 2}}
              label={m.message}
            />
          )}
        />
        <Controller
          name="type"
          control={form.control}
          render={({field, fieldState}) => (
            <ColorPickerLimited
              {...field}
              sx={{mb: 2}}
              colors={t => [
                {color: t.palette.error.main, value: 'error'},
                {color: t.palette.success.main, value: 'success'},
                {color: t.palette.warning.main, value: 'warning'},
                {color: t.palette.info.main, value: 'info'},
                {color: t.palette.divider, value: ''},
              ]}
            />
          )}
        />
        <Controller
          name="iconName"
          control={form.control}
          render={({field, fieldState}) => <MaterialIconSelector sx={{mb: 1}} {...field} />}
        />
        <Controller
          name="canHide"
          control={form.control}
          render={({field, fieldState}) => (
            <SwitchBox
              {...field}
              checked={field.value}
              onChange={(e, checked) => field.onChange(checked)}
              size="small"
              label={m._dashboard.canBeHidden}
            />
          )}
        />
      </WidgetSettingsSection>
    </Box>
  )
}
