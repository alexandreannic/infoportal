import {useI18n} from '@infoportal/client-i18n'
import {Controller, useForm, useWatch} from 'react-hook-form'
import {Ip} from 'infoportal-api-sdk'
import React, {useEffect} from 'react'
import {Box, Icon} from '@mui/material'
import {getQuestionTypeByWidget, useWidgetSettingsContext} from '@/features/Dashboard/Widget/WidgetSettingsPanel'
import {Core} from '@/shared'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {SelectQuestionInput} from '@/shared/SelectQuestionInput'
import {WidgetSettingsFilterQuestion} from '@/features/Dashboard/Widget/shared/WidgetSettingsFilter'
import {WidgetSettingsSection} from '@/features/Dashboard/Widget/shared/WidgetSettingsSection'
import {Obj} from '@axanc/ts-utils'
import {MaterialIconSelector} from '@/features/Dashboard/Widget/shared/MaterialIconSelector'
import {useEffectSetTitle} from '@/features/Dashboard/Widget/shared/useEffectSetTitle'

export function CardSettings() {
  const {m} = useI18n()
  const schema = useDashboardContext(_ => _.schema)
  const {widget, onChange} = useWidgetSettingsContext()
  const config = widget.config as Ip.Dashboard.Widget.Config['Card']
  const form = useForm<Ip.Dashboard.Widget.Config['Card']>({
    mode: 'onChange',
    defaultValues: {
      ...widget.config,
    },
  })

  useEffectSetTitle(config.questionName)

  const values = useWatch({control: form.control})

  useEffect(() => {
    onChange({config: values})
  }, [values])

  const actions = {
    count: {icon: 'numbers', label: m.count},
    sum: {icon: 'functions', label: m.sum},
    avg: {icon: 'point_scan', label: m.average},
    min: {icon: 'arrow_downward', label: m.min},
    max: {icon: 'arrow_upward', label: m.max},
  }

  return (
    <Box>
      <WidgetSettingsSection title={m.source}>
        <Controller
          name="operation"
          control={form.control}
          rules={{
            required: true,
          }}
          render={({field, fieldState}) => (
            <Core.SelectSingle
              {...field}
              sx={{mb: 2}}
              label={m._dashboard.operation}
              hideNullOption
              options={Obj.entries(actions).map(([operation, _]) => ({
                value: operation,
                children: (
                  <>
                    <Icon
                      fontSize="small"
                      color="disabled"
                      children={_.icon}
                      sx={{width: 40, textAlign: 'center', ml: -1.5}}
                    />
                    {_.label}
                  </>
                ),
              }))}
            />
          )}
        />
        {values.operation && values.operation !== 'count' && (
          <Controller
            name="questionName"
            control={form.control}
            rules={{
              required: true,
            }}
            render={({field, fieldState}) => (
              <SelectQuestionInput
                {...field}
                sx={{mb: 1.5}}
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
        )}
        <WidgetSettingsFilterQuestion name="filter" form={form} sx={{mb: 1}} />
      </WidgetSettingsSection>
      <WidgetSettingsSection title={m.customize}>
        <Controller
          name="icon"
          control={form.control}
          render={({field, fieldState}) => <MaterialIconSelector {...field} />}
        />
      </WidgetSettingsSection>
    </Box>
  )
}
