import {useI18n} from '@infoportal/client-i18n'
import {Controller, useForm, useWatch} from 'react-hook-form'
import {Ip} from 'infoportal-api-sdk'
import React, {useEffect} from 'react'
import {Box} from '@mui/material'
import {SwitchBox} from '@/shared/SwitchBox'
import {
  getQuestionTypeByWidget,
  useQuestionInfo,
  useWidgetSettingsContext,
} from '@/features/Dashboard/Widget/SettingsPanel/shared/WidgetSettingsPanel'
import {SelectChoices} from '@/features/Dashboard/Widget/SettingsPanel/shared/SelectChoices'
import {SelectQuestionInput} from '@/shared/SelectQuestionInput'
import {useDashboardCreatorContext} from '@/features/Dashboard/DashboardCreator'
import {RangeInput} from '@/features/Dashboard/Widget/SettingsPanel/shared/RangeInput'
import {
  WidgetSettingsFilter,
  WidgetSettingsFilterQuestion,
} from '@/features/Dashboard/Widget/SettingsPanel/shared/WidgetSettingsFilter'

export function SettingsPieChart() {
  const {schema} = useDashboardCreatorContext()
  const {widget, onChange} = useWidgetSettingsContext()
  const config = widget.config as Ip.Dashboard.Widget.Config['PieChart']
  const {question} = useQuestionInfo(config.questionName)
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
      <WidgetSettingsFilterQuestion form={form} name="filter" />
      <WidgetSettingsFilter label={m._dashboard.valueToDisplay} form={form} question={question} name="filterValue" />
      <WidgetSettingsFilter label={m._dashboard.base} form={form} question={question} name="filterBase" />
      <SwitchBox sx={{mt: 2, mb: 1}} {...form.register('showValue')} size="small" label={m._dashboard.showValue} />
      <SwitchBox
        size="small"
        disabled={!values.showValue}
        sx={{mb: 1}}
        {...form.register('showBase')}
        label={m._dashboard.showBase}
      />
      <SwitchBox {...form.register('dense')} size="small" label={m.smaller} />
    </>
  )
}
