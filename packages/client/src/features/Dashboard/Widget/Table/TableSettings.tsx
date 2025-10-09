import {Controller, useForm, useWatch} from 'react-hook-form'
import {SelectQuestionInput} from '@/shared/SelectQuestionInput'
import {getQuestionTypeByWidget, useWidgetSettingsContext} from '@/features/Dashboard/Widget/WidgetSettingsPanel'
import {WidgetSettingsSection} from '@/features/Dashboard/Widget/shared/WidgetSettingsSection'
import React, {useEffect} from 'react'
import {Box} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'
import {useI18n} from '@infoportal/client-i18n'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'

export function TableSettings() {
  const {m} = useI18n()
  const {schema} = useDashboardContext()
  const {widget, onChange} = useWidgetSettingsContext()
  const config = widget.config as Ip.Dashboard.Widget.Config['Table']

  const form = useForm<Ip.Dashboard.Widget.Config['Table']>({
    mode: 'onChange',
    defaultValues: {
      ...config,
      row: config.row ?? {},
      column: config.column ?? {},
    },
  })

  const values = useWatch({control: form.control})

  useEffect(() => {
    onChange({config: values})
  }, [values])

  return (
    <Box>
      <WidgetSettingsSection title={m.column}>
        <Controller
          name="row.questionName"
          control={form.control}
          rules={{
            required: true,
          }}
          render={({field, fieldState}) => (
            <SelectQuestionInput
              {...field}
              sx={{mb: 1}}
              onChange={(e, _) => field.onChange(_)}
              schema={schema}
              questionTypeFilter={getQuestionTypeByWidget(widget.type)}
              InputProps={{
                label: m.question,
                error: !!fieldState.error,
                helperText: null,
              }}
            />
          )}
        />
      </WidgetSettingsSection>
      <WidgetSettingsSection title={m.row}>
        <Controller
          name="row.questionName"
          control={form.control}
          rules={{
            required: true,
          }}
          render={({field, fieldState}) => (
            <SelectQuestionInput
              {...field}
              sx={{mb: 1}}
              onChange={(e, _) => field.onChange(_)}
              schema={schema}
              questionTypeFilter={getQuestionTypeByWidget(widget.type)}
              InputProps={{
                label: m.question,
                error: !!fieldState.error,
                helperText: null,
              }}
            />
          )}
        />
      </WidgetSettingsSection>
    </Box>
  )
}
