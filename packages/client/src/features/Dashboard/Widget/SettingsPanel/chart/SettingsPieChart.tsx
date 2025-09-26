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
      {question &&
        (question.type === 'select_one' ? (
          <>
            <Controller
              name="filterChoice"
              control={form.control}
              render={({field}) => (
                <SelectChoices {...field} questionName={question.name} label={m.select} sx={{mb: 1}} />
              )}
            />

            <Controller
              name="filterChoiceBase"
              control={form.control}
              render={({field}) => <SelectChoices {...field} questionName={question.name} label={m.base} />}
            />
          </>
        ) : (
          <>
            <Box>
              <Controller
                name="filterNumber"
                control={form.control}
                render={({field}) => <RangeInput label={m.value} {...field} />}
              />
              <Controller
                name="filterNumberBase"
                control={form.control}
                render={({field}) => <RangeInput label={m.base} {...field} />}
              />
            </Box>
          </>
        ))}
      <SwitchBox sx={{mt: 2, mb: 1}} {...form.register('showValue')} label={m._dashboard.showValue} />
      <SwitchBox
        disabled={!values.showValue}
        sx={{mb: 1}}
        {...form.register('showBase')}
        label={m._dashboard.showBase}
      />
      <SwitchBox {...form.register('dense')} label={m.smaller} />
    </>
  )
}
