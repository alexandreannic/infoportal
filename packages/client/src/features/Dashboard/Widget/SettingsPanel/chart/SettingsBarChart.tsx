import {useI18n} from '@infoportal/client-i18n'
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
import {SelectChoices} from '@/features/Dashboard/Widget/SettingsPanel/shared/SelectChoices'
import {SelectQuestionInput} from '@/shared/SelectQuestionInput'
import {WidgetSettingsFilterQuestion} from '@/features/Dashboard/Widget/SettingsPanel/shared/WidgetSettingsFilter'
import {WidgetSettingsSection} from '@/features/Dashboard/Widget/SettingsPanel/shared/WidgetSettingsSection'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'

export function SettingsBarChart() {
  const {m} = useI18n()
  const {schema} = useDashboardContext()
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
      <WidgetSettingsSection title={m.source}>
        <Controller
          name="questionName"
          control={form.control}
          rules={{
            required: true,
          }}
          render={({field, fieldState}) => (
            <SelectQuestionInput
              {...field}
              sx={{mb: 1}}
              onChange={(e, _) => field.onChange(_)}
              schema={schema.schema}
              questionTypeFilter={getQuestionTypeByWidget(widget.type)}
              InputProps={{
                label: m.question,
                error: !!fieldState.error,
                helperText: null,
              }}
            />
          )}
        />
        <WidgetSettingsFilterQuestion name="filter" form={form} sx={{mb: 1}} />
      </WidgetSettingsSection>
      <WidgetSettingsSection title={m.properties}>
        <SelectChoices value={[]} questionName={config.questionName} sx={{mb: 1}} onChange={console.log} />
      </WidgetSettingsSection>
      <WidgetSettingsSection title={m.customize}>
        <Label>{m._dashboard.listLimit}</Label>
        <Controller
          name="limit"
          control={form.control}
          render={({field, fieldState}) => (
            <Box sx={{px: 1}}>
              <Slider
                {...field}
                disabled={!choices}
                defaultValue={choices?.length}
                max={choices?.length ?? 1}
                valueLabelDisplay="auto"
              />
            </Box>
          )}
        />
      </WidgetSettingsSection>
    </Box>
  )
}
