import {useI18n} from '@infoportal/client-i18n'
import {Controller, useForm, useWatch} from 'react-hook-form'
import {Ip} from '@infoportal/api-sdk'
import React, {useEffect} from 'react'
import {Box, Checkbox, InputBase, Slider} from '@mui/material'
import {
  getQuestionTypeByWidget,
  useQuestionInfo,
  useWidgetSettingsContext,
} from '@/features/Dashboard/Widget/WidgetSettingsPanel'
import {SelectQuestionInput} from '@/shared/customInput/SelectQuestionInput'
import {WidgetSettingsFilterQuestion} from '@/features/Dashboard/Widget/shared/WidgetSettingsFilter'
import {WidgetSettingsSection} from '@/features/Dashboard/Widget/shared/WidgetSettingsSection'
import {useDashboardContext} from '@/features/Dashboard/Context/DashboardContext'
import {SwitchBox} from '@/shared/customInput/SwitchBox'
import {WidgetLabel} from '@/features/Dashboard/Widget/shared/WidgetLabel'
import {useEffectSetTitle} from '@/features/Dashboard/Widget/shared/useEffectSetTitle'
import {ChoiceMapper, ChoicesMapperPanel} from '@/features/Dashboard/Widget/shared/ChoicesMapper'
import {Core, Datatable} from '@/shared'
import {SliderNumberInput} from '@/shared/customInput/SliderNumberInput'

export function BarChartSettings() {
  const {m} = useI18n()
  const langIndex = useDashboardContext(_ => _.langIndex)
  const schema = useDashboardContext(_ => _.schema)
  const {widget, onChange} = useWidgetSettingsContext()
  const config = widget.config as Ip.Dashboard.Widget.Config['BarChart']
  const {choices} = useQuestionInfo(config.questionName)
  const form = useForm<Ip.Dashboard.Widget.Config['BarChart']>({
    mode: 'onChange',
    defaultValues: {
      ...widget.config,
      showEvolution: config.showEvolution ?? true,
    },
  })

  useEffectSetTitle(config.questionName)

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
        <WidgetSettingsFilterQuestion name="filter" form={form} sx={{mb: 1}} />
      </WidgetSettingsSection>
      <WidgetSettingsSection title={m.customize}>
        <Controller
          name="limit"
          control={form.control}
          render={({field, fieldState}) => (
            <SliderNumberInput
              {...field}
              label={m._dashboard.listLimit}
              value={field.value ?? choices?.length}
              onChange={(e, value) => {
                if (choices && value === choices?.length) field.onChange(null)
                else field.onChange(value)
              }}
              disabled={!choices}
              defaultValue={choices?.length}
              max={choices?.length ?? 1}
              sx={{mb: 1}}
            />
          )}
        />
        <Controller
          name="showEvolution"
          control={form.control}
          render={({field, fieldState}) => (
            <SwitchBox
              checked={field.value}
              onChange={(e, checked) => field.onChange(checked)}
              size="small"
              label={m._dashboard.showEvolution}
              sx={{mb: 1}}
            />
          )}
        />
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
      </WidgetSettingsSection>
      {config.questionName && choices && (
        <WidgetSettingsSection title={m.mapping}>
          <ChoicesMapperPanel>
            {[...choices.map(_ => _.name), Datatable.Utils.blank]?.map((choiceName, i) => (
              <ChoiceMapper
                key={choiceName + langIndex}
                question={config.questionName!}
                choiceName={choiceName}
                before={
                  <Controller
                    control={form.control}
                    name={`hiddenChoices`}
                    render={({field}) => {
                      const selected = field.value ?? []
                      const toggle = (name: string, checked: boolean) => {
                        const next = checked ? [...selected, name] : selected.filter(v => v !== name)
                        field.onChange(next)
                      }
                      return (
                        <Checkbox
                          size="small"
                          checked={!selected.includes(choiceName)}
                          onChange={e => toggle(choiceName, !e.target.checked)}
                        />
                      )
                    }}
                  />
                }
              >
                <Controller
                  control={form.control}
                  name={`mapping.${choiceName}.${langIndex}`}
                  render={({field}) => (
                    <InputBase
                      {...field}
                      onChange={e => {
                        field.onChange(e.target.value)
                      }}
                      value={field.value ?? ''}
                      endAdornment={<Core.IconBtn children="clear" size="small" onClick={() => field.onChange(null)} />}
                    />
                  )}
                />
              </ChoiceMapper>
            ))}
          </ChoicesMapperPanel>
        </WidgetSettingsSection>
      )}
    </Box>
  )
}
