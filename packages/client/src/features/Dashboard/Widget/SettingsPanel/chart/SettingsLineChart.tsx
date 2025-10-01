import {useI18n} from '@infoportal/client-i18n'
import {Controller, useFieldArray, useForm, UseFormReturn, useWatch} from 'react-hook-form'
import {Ip} from 'infoportal-api-sdk'
import React, {useEffect} from 'react'
import {
  getQuestionTypeByWidget,
  useQuestionInfo,
  useWidgetSettingsContext,
} from '@/features/Dashboard/Widget/SettingsPanel/WidgetSettingsPanel'
import {SelectQuestionInput} from '@/shared/SelectQuestionInput'
import {Core} from '@/shared'
import {WidgetSettingsSection} from '@/features/Dashboard/Widget/SettingsPanel/shared/WidgetSettingsSection'
import {WidgetSettingsFilterQuestion} from '@/features/Dashboard/Widget/SettingsPanel/shared/WidgetSettingsFilter'
import {Box} from '@mui/material'
import {ColorPicker} from '@/features/Dashboard/Widget/SettingsPanel/shared/ColorPicker'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'

export function SettingsLineChart() {
  const {schema} = useDashboardContext()
  const {widget, onChange} = useWidgetSettingsContext()
  const config = widget.config as Ip.Dashboard.Widget.Config['LineChart']
  const {m} = useI18n()
  const form = useForm<Ip.Dashboard.Widget.Config['LineChart']>({
    mode: 'onChange',
    defaultValues: config,
  })

  const values = useWatch({control: form.control})

  useEffect(() => {
    onChange({config: values})
  }, [values])

  const {fields, append, remove} = useFieldArray({
    control: form.control,
    name: 'lines' as any,
  })

  return (
    <>
      {fields.map((field, index) => (
        <WidgetSettingsSection
          title={m.line + ' ' + (index + 1)}
          key={field.id}
          action={<Core.IconBtn children="delete" onClick={() => remove(index)} />}
        >
          <Line form={form} index={index} />
        </WidgetSettingsSection>
      ))}
      <Box sx={{display: 'flex', alignItems: 'center'}}>
        <Core.IconBtn onClick={() => append({})}>add</Core.IconBtn>
        {m._dashboard.newLine}
      </Box>
    </>
  )
}

function Line({form, index}: {index: number; form: UseFormReturn<Ip.Dashboard.Widget.Config['LineChart']>}) {
  const {m} = useI18n()
  const questionName = form.watch(`lines.${index}.questionName`)

  const {widget, onChange} = useWidgetSettingsContext()
  const {schema} = useDashboardContext()
  const {choices, question} = useQuestionInfo(questionName)

  return (
    <>
      <Controller
        name={`lines.${index}.questionName`}
        control={form.control}
        rules={{
          required: true,
        }}
        render={({field, fieldState}) => (
          <SelectQuestionInput
            {...field}
            onChange={(e, _) => {
              field.onChange(_)
            }}
            schema={schema.schema}
            questionTypeFilter={getQuestionTypeByWidget(widget.type)}
            sx={{mb: 1}}
            InputProps={{
              label: m.question,
              error: !!fieldState.error,
              helperText: null,
            }}
          />
        )}
      />
      <Controller
        name={`lines.${index}.title`}
        control={form.control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, ...field}, fieldState}) => (
          <Core.AsyncInput onSubmit={_ => onChange(_)} helperText={null} sx={{mb: 1}} label={m.title} {...field} />
        )}
      />

      <WidgetSettingsFilterQuestion name={`lines.${index}.filter`} form={form} sx={{mb: 1}} />

      <Controller
        name={`lines.${index}.color`}
        control={form.control}
        rules={{
          required: true,
        }}
        render={({field, fieldState}) => <ColorPicker {...field} value={field.value ?? ''} />}
      />
    </>
  )
}
