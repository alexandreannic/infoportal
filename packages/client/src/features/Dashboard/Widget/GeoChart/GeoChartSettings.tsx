import {
  getQuestionTypeByWidget,
  useWidgetSettingsContext,
} from '@/features/Dashboard/Widget/WidgetSettingsPanel'
import {Ip} from 'infoportal-api-sdk'
import {Controller, useForm, useWatch} from 'react-hook-form'
import {SelectQuestionInput} from '@/shared/SelectQuestionInput'
import {WidgetSettingsFilterQuestion} from '@/features/Dashboard/Widget/shared/WidgetSettingsFilter'
import {WidgetSettingsSection} from '@/features/Dashboard/Widget/shared/WidgetSettingsSection'
import React, {useEffect} from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {Core} from '@/shared'
import type {Country} from '@infoportal/client-core'

export const GeoChartSettings = () => {
  const {m} = useI18n()
  const {schema} = useDashboardContext()
  const {widget, onChange} = useWidgetSettingsContext()
  const config = widget.config as Ip.Dashboard.Widget.Config['GeoChart']
  const form = useForm<Ip.Dashboard.Widget.Config['GeoChart']>({
    mode: 'onChange',
    defaultValues: config,
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
        <WidgetSettingsFilterQuestion form={form} name="filter" />
      </WidgetSettingsSection>
      <WidgetSettingsSection title={m.properties}>
        <Controller
          name="countryIsoCode"
          control={form.control}
          render={({field, fieldState}) => (
            <Core.SelectCountry {...field} label={m.country} value={field.value as Country} onChange={field.onChange} />
          )}
        />
      </WidgetSettingsSection>
    </>
  )
}
