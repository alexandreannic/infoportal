import {Controller, UseFormReturn} from 'react-hook-form'
import {useI18n} from '@infoportal/client-i18n'
import {SelectQuestionInput} from '@/shared/SelectQuestionInput'
import {SelectChoices} from '@/features/Dashboard/Widget/SettingsPanel/shared/SelectChoices'
import {RangeInput} from '@/features/Dashboard/Widget/SettingsPanel/shared/RangeInput'
import React from 'react'
import {useQuestionInfo} from '@/features/Dashboard/Widget/SettingsPanel/WidgetSettingsPanel'
import {Ip} from 'infoportal-api-sdk'
import {Core} from '@/shared'
import {Box, BoxProps, Icon, SxProps, useTheme} from '@mui/material'
import {styleUtils} from '@infoportal/client-core'
import {Kobo} from 'kobo-sdk'
import {useDashboardContext} from '@/features/Dashboard/DashboardContext'

const formName: Record<keyof Ip.Dashboard.Widget.ConfigFilter, keyof Ip.Dashboard.Widget.ConfigFilter> = {
  questionName: 'questionName',
  number: 'number',
  choices: 'choices',
}

export function WidgetSettingsFilterQuestion<T extends Record<string, any>>({
  form,
  name,
  sx,
  ...props
}: BoxProps & {
  name: string
  form: UseFormReturn<T>
}) {
  const {schema} = useDashboardContext()
  const t = useTheme()
  const {m} = useI18n()
  const questionName: string | undefined = form.watch(`${name}.${formName.questionName}` as any)
  const {choices, question} = useQuestionInfo(questionName)

  return (
    <Box
      sx={{
        background: styleUtils(t).color.toolbar.default.background,
        p: 1,
        borderRadius: t.vars.shape.borderRadius,
        ...sx,
      }}
      {...props}
    >
      <Core.Txt bold block sx={{display: 'flex', alignItems: 'center', mb: 1.5}}>
        <Icon fontSize="small" sx={{mr: 0.5, color: t.vars.palette.text.secondary}}>
          filter_alt
        </Icon>
        {m.filters}
      </Core.Txt>
      <Controller
        name={`${name}.${formName.questionName}` as any}
        control={form.control}
        rules={{
          required: true,
        }}
        render={({field, fieldState}) => (
          <SelectQuestionInput
            {...field}
            onChange={(e, _) => {
              field.onChange(_)
              form.setValue(`${name}.${formName.choices}` as any, [] as any)
            }}
            schema={schema.schema}
            questionTypeFilter={['select_multiple', 'select_one', 'decimal', 'integer']}
            InputProps={{
              label: m.question,
              error: !!fieldState.error,
              helperText: null,
            }}
          />
        )}
      />
      <WidgetSettingsFilter question={question} form={form} name={name} sx={{mt: 2}}/>
    </Box>
  )
}

export function WidgetSettingsFilter<T extends Record<string, any>>({
  form,
  name,
  question,
  label,
  sx,
}: {
  form: UseFormReturn<T>
  name: string
  label?: string
  question?: Kobo.Form.Question
  sx?: SxProps
}) {
  const {m} = useI18n()
  if (!question) return <></>
  if (question.type === 'select_one' || question.type === 'select_multiple') {
    return (
      <Controller
        name={`${name}.${formName.choices}` as any}
        control={form.control}
        render={({field}) => <SelectChoices {...field} sx={sx} questionName={question.name} label={label ?? m.value} />}
      />
    )
  }
  return (
    <Controller
      name={`${name}.${formName.number}` as any}
      control={form.control}
      render={({field}) => <RangeInput label={label ?? m.value} sx={sx} {...field} />}
    />
  )
}
