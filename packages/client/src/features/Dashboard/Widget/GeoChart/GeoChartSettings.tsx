import {
  getQuestionTypeByWidget,
  useQuestionInfo,
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
import {Country, CountryCode, SelectGeoIso, styleUtils} from '@infoportal/client-core'
import {useEffectSetTitle} from '@/features/Dashboard/Widget/shared/useEffectSetTitle'
import {Box, Icon, InputBase, useTheme} from '@mui/material'
import {Kobo} from 'kobo-sdk'
import {WidgetLabel} from '@/features/Dashboard/Widget/shared/WidgetLabel'

export const GeoChartSettings = () => {
  const t = useTheme()
  const {m} = useI18n()
  const {schema} = useDashboardContext()
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
            <Box
              sx={{
                border: '1px solid',
                borderColor: t.vars.palette.divider,
                borderRadius: styleUtils(t).color.input.default.borderRadius,
              }}
            >
              {choices?.map(choice => (
                <Controller
                  key={choice.name}
                  name={`mapping.${choice.name}`}
                  control={form.control}
                  render={({field}) => (
                    <ChoiceMapper
                      {...field}
                      countryCode={values.countryIsoCode as CountryCode}
                      choice={choice}
                      question={config.questionName!}
                    />
                  )}
                />
              ))}
            </Box>
          </>
        )}
      </WidgetSettingsSection>
    </>
  )
}

function ChoiceMapper({
  countryCode,
  question,
  choice,
  onChange,
  value = '',
}: {
  value?: string
  onChange: (_: string | null) => void
  question: string
  countryCode?: CountryCode
  choice: Kobo.Form.Choice
}) {
  const {schema} = useDashboardContext()
  const t = useTheme()
  return (
    <Box
      sx={{
        '&:not(:last-of-type)': {
          borderBottom: '1px solid',
          borderColor: t.vars.palette.divider,
        },
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 0.5,
        // mb: 0.5,
      }}
    >
      <InputBase value={schema.translate.choice(question, choice.name)} title={choice.name} />
      <Icon color="disabled">arrow_forward</Icon>
      <SelectGeoIso
        fullWidth
        value={value}
        countryCode={countryCode}
        onChange={onChange}
        renderInput={params => (
          <InputBase fullWidth {...params.InputProps} inputProps={params.inputProps} ref={params.InputProps.ref} />
        )}
      />
    </Box>
  )
}
