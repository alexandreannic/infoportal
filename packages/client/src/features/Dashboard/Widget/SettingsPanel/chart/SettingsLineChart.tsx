import {useI18n} from '@infoportal/client-i18n'
import {Controller, useFieldArray, useForm, UseFormReturn, useWatch} from 'react-hook-form'
import {Ip} from 'infoportal-api-sdk'
import React, {useEffect} from 'react'
import {
  getQuestionTypeByWidget,
  useQuestionInfo,
  useWidgetSettingsContext,
} from '@/features/Dashboard/Widget/SettingsPanel/shared/WidgetSettingsPanel'
import {useDashboardCreatorContext} from '@/features/Dashboard/DashboardCreator'
import {SelectQuestionInput} from '@/shared/SelectQuestionInput'
import {Core} from '@/shared'
import {WidgetSettingsSection} from '@/features/Dashboard/Widget/SettingsPanel/WidgetSettingsSection'
import {WidgetSettingsFilter} from '@/features/Dashboard/Widget/SettingsPanel/shared/WidgetSettingsFilter'
import {Box} from '@mui/material'
import {ColorPicker} from '@/features/Dashboard/Widget/SettingsPanel/shared/ColorPicker'

export function SettingsLineChart() {
  const {schema} = useDashboardCreatorContext()
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
          title={m.line + ' ' + index}
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
  const {schema} = useDashboardCreatorContext()
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
            InputProps={{
              label: m.question,
              error: !!fieldState.error,
              helperText: fieldState.error && m.required,
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
          <Core.AsyncInput onSubmit={_ => onChange(_)} label={m.title} {...field} />
        )}
      />
      <Controller
        name={`lines.${index}.color`}
        control={form.control}
        rules={{
          required: true,
        }}
        render={({field, fieldState}) => <ColorPicker {...field} sx={{mb: 2}}/>}
      />

      <WidgetSettingsFilter name={`lines.${index}.filter`} form={form} />
    </>
  )
}
