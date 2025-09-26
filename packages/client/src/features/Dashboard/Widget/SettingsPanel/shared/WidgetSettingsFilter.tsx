import {Controller, UseFormReturn} from 'react-hook-form'
import {useI18n} from '@infoportal/client-i18n'
import {useDashboardCreatorContext} from '@/features/Dashboard/DashboardCreator'
import {SelectQuestionInput} from '@/shared/SelectQuestionInput'
import {SelectChoices} from '@/features/Dashboard/Widget/SettingsPanel/shared/SelectChoices'
import {RangeInput} from '@/features/Dashboard/Widget/SettingsPanel/shared/RangeInput'
import React, {useState} from 'react'
import {useQuestionInfo} from '@/features/Dashboard/Widget/SettingsPanel/shared/WidgetSettingsPanel'
import {Ip} from 'infoportal-api-sdk'
import {Core} from '@/shared'
import {Box, Icon, useTheme} from '@mui/material'
import {styleUtils} from '@infoportal/client-core'

const formName: Record<keyof Ip.Dashboard.Widget.ConfigFilter, keyof Ip.Dashboard.Widget.ConfigFilter> = {
  questionName: 'questionName',
  number: 'number',
  choices: 'choices',
}

export function WidgetSettingsFilter<T extends Record<string, any>>({
  form,
  name,
}: {
  name: string
  form: UseFormReturn<T>
}) {
  const t = useTheme()
  const {m} = useI18n()
  const {schema} = useDashboardCreatorContext()
  const questionName: string | undefined = form.watch(`${name}.${formName.questionName}` as any)
  const {choices, question} = useQuestionInfo(questionName)

  return (
    <Box
      sx={{background: styleUtils(t).color.toolbar.default.background, p: 1, borderRadius: t.vars.shape.borderRadius}}
    >
      <Core.Txt bold block sx={{display: 'flex', alignItems: 'center', mb: 1.5}}>
        <Icon sx={{mr: 0.5, color: t.vars.palette.text.secondary}}>filter_alt</Icon>
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
              helperText: fieldState.error && m.required,
            }}
          />
        )}
      />
      {question &&
        (question.type === 'select_one' || question.type === 'select_multiple' ? (
          <Controller
            name={`${name}.${formName.choices}` as any}
            control={form.control}
            render={({field}) => <SelectChoices {...field} questionName={question.name} label={m.select} />}
          />
        ) : (
          <Controller
            name={`${name}.${formName.number}` as any}
            control={form.control}
            render={({field}) => <RangeInput label={m.value} {...field} />}
          />
        ))}
    </Box>
  )
}
