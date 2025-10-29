import {Controller, useForm, useWatch} from 'react-hook-form'
import {SelectQuestionInput} from '@/shared/customInput/SelectQuestionInput'
import {getQuestionTypeByWidget, useWidgetSettingsContext} from '@/features/Dashboard/Widget/WidgetSettingsPanel'
import {WidgetSettingsSection} from '@/features/Dashboard/Widget/shared/WidgetSettingsSection'
import React, {useEffect} from 'react'
import {Box} from '@mui/material'
import {Ip} from 'infoportal-api-sdk'
import {useI18n} from '@infoportal/client-i18n'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {RangeTableEditor} from '@/features/Dashboard/Widget/Table/RangeTableEditor'
import {Kobo} from 'kobo-sdk'
import {Core} from '@/shared'

export const questionTypeNumbers = new Set<Kobo.Form.QuestionType>(['integer', 'decimal'])

export function TableSettings() {
  const {m} = useI18n()
  const schema = useDashboardContext(_ => _.schema)
  const langIndex = useDashboardContext(_ => _.langIndex)
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
              onChange={(e, value) => {
                field.onChange(value)
                const path = `column.i18n_label` as const
                const current = form.getValues(path)
                if (value && (!current || current.every(_ => !_))) {
                  const labels = schema.helper.questionIndex[value]?.label ?? []
                  form.setValue('column.i18n_label', labels, {shouldDirty: true})
                }
              }}
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
        <Controller
          name={`column.i18n_label.${langIndex}`}
          control={form.control}
          key={langIndex}
          render={({field: {onChange, ...field}, fieldState}) => (
            <Core.AsyncInput
              key={langIndex}
              originalValue={config.column?.i18n_label?.[langIndex]}
              onSubmit={_ => onChange(_)}
              helperText={null}
              sx={{mb: 1}}
              label={m.title}
              {...field}
            />
          )}
        />
        {questionTypeNumbers.has(schema.helper.questionIndex[values.column?.questionName!]?.type!) && (
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
              onChange={(e, value) => {
                field.onChange(value)
                const path = `row.i18n_label` as const
                const current = form.getValues(path)
                if (value && (current ?? []).filter(_ => !!_).length === 0) {
                  const labels = schema.helper.questionIndex[value]?.label
                  form.setValue(path, labels, {shouldDirty: true})
                }
              }}
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
        <Controller
          name={`row.i18n_label.${langIndex}`}
          key={langIndex}
          control={form.control}
          render={({field: {onChange, ...field}, fieldState}) => (
            <Core.AsyncInput onSubmit={_ => onChange(_)} helperText={null} sx={{mb: 1}} label={m.title} {...field} />
          )}
        />
        {questionTypeNumbers.has(schema.helper.questionIndex[values.row?.questionName!]?.type!) && (
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
