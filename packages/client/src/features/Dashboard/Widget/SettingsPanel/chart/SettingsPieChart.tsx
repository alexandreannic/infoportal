import {useI18n} from '@infoportal/client-i18n'
import {Controller, useForm, useWatch} from 'react-hook-form'
import {Ip} from 'infoportal-api-sdk'
import React, {useEffect} from 'react'
import {SwitchBox} from '@/shared/SwitchBox'
import {
  getQuestionTypeByWidget,
  useQuestionInfo,
  useWidgetSettingsContext,
} from '@/features/Dashboard/Widget/SettingsPanel/WidgetSettingsPanel'
import {SelectQuestionInput} from '@/shared/SelectQuestionInput'
import {
  WidgetSettingsFilter,
  WidgetSettingsFilterQuestion,
} from '@/features/Dashboard/Widget/SettingsPanel/shared/WidgetSettingsFilter'
import {WidgetSettingsSection} from '@/features/Dashboard/Widget/SettingsPanel/shared/WidgetSettingsSection'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'

export function SettingsPieChart() {
  const {schema} = useDashboardContext()
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
              onChange={(e, _) => {
                field.onChange(_)
                form.setValue('filterValue', undefined)
                form.setValue('filterBase', undefined)
              }}
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
        <WidgetSettingsFilterQuestion form={form} name="filter" />
      </WidgetSettingsSection>
      <WidgetSettingsSection title={m.properties}>
        <WidgetSettingsFilter
          sx={{mb: 1}}
          label={m._dashboard.valueToDisplay}
          form={form}
          question={question}
          name="filterValue"
        />
        <WidgetSettingsFilter
          sx={{mb: 1}}
          label={m._dashboard.base}
          form={form}
          question={question}
          name="filterBase"
        />
      </WidgetSettingsSection>
      <WidgetSettingsSection title={m.customize}>
        <SwitchBox sx={{mb: 1}} {...form.register('showValue')} size="small" label={m._dashboard.showValue} />
        <SwitchBox
          size="small"
          disabled={!values.showValue}
          sx={{mb: 1}}
          {...form.register('showBase')}
          label={m._dashboard.showBase}
        />
        <SwitchBox {...form.register('dense')} size="small" label={m.smaller} />
      </WidgetSettingsSection>
    </>
  )
}
