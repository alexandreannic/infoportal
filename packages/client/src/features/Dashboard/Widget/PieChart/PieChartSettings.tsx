import {useI18n} from '@infoportal/client-i18n'
import {Controller, useForm, useWatch} from 'react-hook-form'
import {Ip} from '@infoportal/api-sdk'
import React, {useEffect} from 'react'
import {SwitchBox} from '@/shared/customInput/SwitchBox'
import {
  getQuestionTypeByWidget,
  useQuestionInfo,
  useWidgetSettingsContext,
} from '@/features/Dashboard/Widget/WidgetSettingsPanel'
import {SelectQuestionInput} from '@/shared/customInput/SelectQuestionInput'
import {
  WidgetSettingsFilter,
  WidgetSettingsFilterQuestion,
} from '@/features/Dashboard/Widget/shared/WidgetSettingsFilter'
import {WidgetSettingsSection} from '@/features/Dashboard/Widget/shared/WidgetSettingsSection'
import {useDashboardContext} from '@/features/Dashboard/Context/DashboardContext'
import {useEffectSetTitle} from '@/features/Dashboard/Widget/shared/useEffectSetTitle'

export function PieChartSettings() {
  const schema = useDashboardContext(_ => _.schemaInspector)
  const dashboard = useDashboardContext(_ => _.dashboard)

  const {widget, onChange} = useWidgetSettingsContext()
  const config = widget.config as Ip.Dashboard.Widget.Config['PieChart']
  const {question} = useQuestionInfo(config.questionName)
  const {m} = useI18n()
  const form = useForm<Ip.Dashboard.Widget.Config['PieChart']>({
    mode: 'onChange',
    defaultValues: config,
  })

  useEffectSetTitle(config.questionName)

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
              inspector={schema}
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
        <Controller
          name="showValue"
          control={form.control}
          render={({field, fieldState}) => (
            <SwitchBox
              checked={field.value}
              onChange={(e, checked) => field.onChange(checked)}
              size="small"
              label={m._dashboard.showValue}
              sx={{mb: 1}}
            />
          )}
        />
        <Controller
          name="showBase"
          control={form.control}
          render={({field, fieldState}) => (
            <SwitchBox
              checked={field.value}
              onChange={(e, checked) => field.onChange(checked)}
              size="small"
              label={m._dashboard.showBase}
              sx={{mb: 1}}
            />
          )}
        />

        <Controller
          name="showEvolution"
          control={form.control}
          render={({field}) => {
            return (
              <SwitchBox
                checked={field.value}
                onChange={(e, checked) => field.onChange(checked)}
                disabled={!dashboard.periodComparisonDelta}
                sx={{mb: 1}}
                size="small"
                label={m._dashboard.showEvolution}
              />
            )
          }}
        />
        <Controller
          name="dense"
          control={form.control}
          render={({field, fieldState}) => (
            <SwitchBox
              checked={field.value}
              onChange={(e, checked) => field.onChange(checked)}
              size="small"
              label={m.smaller}
              sx={{mb: 1}}
            />
          )}
        />
      </WidgetSettingsSection>
    </>
  )
}
