import {Controller, useForm, useWatch} from 'react-hook-form'
import {SelectQuestionInput} from '@/shared/SelectQuestionInput'
import {getQuestionTypeByWidget, useWidgetSettingsContext} from '@/features/Dashboard/Widget/WidgetSettingsPanel'
import {WidgetSettingsSection} from '@/features/Dashboard/Widget/shared/WidgetSettingsSection'
import React, {useEffect} from 'react'
import {Box} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'
import {useI18n} from '@infoportal/client-i18n'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {RangeTableEditor} from '@/features/Dashboard/Widget/Table/RangeTableEditor'
import {Kobo} from 'kobo-sdk'

export const questionTypeNumbers = new Set<Kobo.Form.QuestionType>(['integer', 'decimal'])

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
          name="column.questionName"
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
        {questionTypeNumbers.has(schema.helper.questionIndex[values.column?.questionName!]?.type) && (
          <Controller
            name="column.rangesIfTypeNumber"
            control={form.control}
            rules={{
              required: true,
            }}
            render={({field, fieldState}) => <RangeTableEditor value={field.value} onChange={field.onChange} />}
          />
        )}
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
        {questionTypeNumbers.has(schema.helper.questionIndex[values.row?.questionName!]?.type) && (
          <Controller
            name="row.rangesIfTypeNumber"
            control={form.control}
            rules={{
              required: true,
            }}
            render={({field, fieldState}) => <RangeTableEditor value={field.value} onChange={field.onChange} />}
          />
        )}{' '}
      </WidgetSettingsSection>
    </Box>
  )
}
