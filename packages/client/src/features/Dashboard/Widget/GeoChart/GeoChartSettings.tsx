import {
  getQuestionTypeByWidget,
  useQuestionInfo,
  useWidgetSettingsContext,
} from '@/features/Dashboard/Widget/WidgetSettingsPanel'
import {Ip} from 'infoportal-api-sdk'
import {Controller, useForm, useWatch} from 'react-hook-form'
import {SelectQuestionInput} from '@/shared/customInput/SelectQuestionInput'
import {WidgetSettingsFilterQuestion} from '@/features/Dashboard/Widget/shared/WidgetSettingsFilter'
import {WidgetSettingsSection} from '@/features/Dashboard/Widget/shared/WidgetSettingsSection'
import React, {useEffect} from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {useDashboardContext} from '@/features/Dashboard/Context/DashboardContext'
import {Core} from '@/shared'
import {Country, SelectGeoIso} from '@infoportal/client-core'
import {useEffectSetTitle} from '@/features/Dashboard/Widget/shared/useEffectSetTitle'
import {InputBase} from '@mui/material'
import {ChoiceMapper, ChoicesMapperPanel} from '@/features/Dashboard/Widget/shared/ChoicesMapper'
import {WidgetLabel} from '@/features/Dashboard/Widget/shared/WidgetLabel'

export const GeoChartSettings = () => {
  const {m} = useI18n()
  const schema = useDashboardContext(_ => _.schema)

  const {widget, onChange} = useWidgetSettingsContext()
  const config = widget.config as Ip.Dashboard.Widget.Config['GeoChart']
  const form = useForm<Ip.Dashboard.Widget.Config['GeoChart']>({
    mode: 'onChange',
    defaultValues: config,
  })
  const {choices} = useQuestionInfo(config.questionName)

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
            <Core.SelectCountry
              {...field}
              sx={{mb: 1}}
              label={m.country}
              value={field.value as Country}
              onChange={field.onChange}
            />
          )}
        />
        {config.questionName && (
          <>
            <WidgetLabel>{m.mapping}</WidgetLabel>
            <Controller
              control={form.control}
              name="mapping"
              render={({field}) => (
                <ChoicesMapperPanel {...field}>
                  {choices?.map(_ => _.name).map((choiceName, i) => (
                    <ChoiceMapper choiceName={choiceName} question={config.questionName!} key={choiceName}>
                      <Controller
                        name={`mapping.${choiceName}`}
                        control={form.control}
                        render={({field}) => (
                          <SelectGeoIso
                            {...field}
                            fullWidth
                            countryCode={config.countryIsoCode}
                            renderInput={params => (
                              <InputBase
                                fullWidth
                                {...params.InputProps}
                                inputProps={params.inputProps}
                                ref={params.InputProps.ref}
                              />
                            )}
                          />
                        )}
                      />
                    </ChoiceMapper>
                  ))}
                </ChoicesMapperPanel>
              )}
            />
          </>
        )}
      </WidgetSettingsSection>
    </>
  )
}
