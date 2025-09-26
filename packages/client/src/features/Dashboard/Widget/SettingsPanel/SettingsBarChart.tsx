import {useI18n} from '@infoportal/client-i18n'
import {useDashboardCreatorContext} from '@/features/Dashboard/DashboardCreator'
import {Controller, useForm, useWatch} from 'react-hook-form'
import {Ip} from 'infoportal-api-sdk'
import React, {useEffect} from 'react'
import {Box, Slider} from '@mui/material'
import {
  getQuestionTypeByWidget,
  Label,
  useQuestionInfo,
  useWidgetSettingsContext,
} from '@/features/Dashboard/Widget/SettingsPanel/WidgetSettingsPanel'
import {SelectChoices} from '@/features/Dashboard/Widget/SettingsPanel/SelectChoices'
import {SelectQuestionInput} from '@/shared/SelectQuestionInput'

export function SettingsBarChart() {
  const {m} = useI18n()
  const {schema} = useDashboardCreatorContext()
  const {widget, onChange} = useWidgetSettingsContext()
  const config = widget.config as Ip.Dashboard.Widget.Config['BarChart']
  const {question, choices} = useQuestionInfo(config.questionName)
  const form = useForm<Ip.Dashboard.Widget.Config['BarChart']>({
    mode: 'onChange',
    defaultValues: widget.config,
  })

  useEffect(() => {
    if (!question) return
    form.setValue('multiple', question.type === 'select_one')
    if (!widget.title) onChange({title: schema.translate.question(question.name)})
  }, [question])

  const values = useWatch({control: form.control})

  useEffect(() => {
    onChange({config: values})
  }, [values])

  return (
    <Box>
      <Controller
        name="questionName"
        control={form.control}
        rules={{
          required: true,
        }}
        render={({field, fieldState}) => (
          <SelectQuestionInput
            {...field}
            onChange={(e, _) => field.onChange(_)}
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
      <SelectChoices value={[]} questionName={config.questionName} onChange={console.log} />
      <Label uppercase></Label>
      <Slider disabled={!choices} defaultValue={choices?.length} max={choices?.length ?? 1} valueLabelDisplay="auto" />
    </Box>
  )
}
