import {Controller, get, UseFormReturn, useWatch} from 'react-hook-form'
import {useI18n} from '@infoportal/client-i18n'
import {SelectQuestionInput} from '@/shared/customInput/SelectQuestionInput'
import {SelectChoices} from '@/features/Dashboard/Widget/shared/SelectChoices'
import {RangeInput} from '@/shared/customInput/RangeInput'
import React from 'react'
import {useQuestionInfo} from '@/features/Dashboard/Widget/WidgetSettingsPanel'
import {Api} from '@infoportal/api-sdk'
import {Core} from '@/shared'
import {Box, BoxProps, Icon, SxProps, useTheme} from '@mui/material'
import {Kobo} from 'kobo-sdk'
import {useDashboardContext} from '@/features/Dashboard/Context/DashboardContext'
import {styleUtils} from '@infoportal/client-core'

const formName: Record<keyof Api.Dashboard.Widget.ConfigFilter, keyof Api.Dashboard.Widget.ConfigFilter> = {
  questionName: 'questionName',
  number: 'number',
  choices: 'choices',
  date: 'date',
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
  const schema = useDashboardContext(_ => _.schemaInspector)
  const t = useTheme()
  const {m} = useI18n()
  const questionName: string | undefined = form.watch(`${name}.${formName.questionName}` as any)
  const {choices, question} = useQuestionInfo(questionName)

  const values = useWatch({control: form.control})

  if (!get(values, name)) {
    return (
      <Core.Btn
        icon="add"
        sx={{...sx, borderStyle: 'dashed', borderRadius: styleUtils(t).color.input.default.borderRadius}}
        fullWidth
        variant="outlined"
        onClick={() => form.setValue(name as any, {} as any)}
      >
        {m.addFilter}
      </Core.Btn>
    )
  }
  return (
    <Box
      sx={{
        ...Core.styleUtils(t).color.toolbar.default,
        p: 1,
        borderRadius: t.vars.shape.borderRadius,
        ...sx,
      }}
      {...props}
    >
      <Core.Txt bold block sx={{display: 'flex', alignItems: 'center', mb: 0.5}}>
        <Icon fontSize="small" sx={{mr: 0.5, color: t.vars.palette.text.secondary}}>
          filter_alt
        </Icon>
        {m.filters}
        <Core.IconBtn
          size="small"
          sx={{marginLeft: 'auto'}}
          color="error"
          onClick={() => form.setValue(name as any, null as any)}
        >
          delete
        </Core.IconBtn>
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
            inspector={schema}
            questionTypeFilter={['select_multiple', 'date', 'datetime', 'today', 'select_one', 'decimal', 'integer']}
            InputProps={{
              label: m.question,
              error: !!fieldState.error,
              helperText: null,
            }}
          />
        )}
      />
      <WidgetSettingsFilter question={question} form={form} name={name} sx={{mt: 2}} />
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
  switch (question.type) {
    case 'select_one':
    case 'select_multiple': {
      return (
        <Controller
          name={`${name}.${formName.choices}` as any}
          control={form.control}
          render={({field}) => (
            <SelectChoices {...field} sx={sx} questionName={question.name} label={label ?? m.value} />
          )}
        />
      )
    }
    case 'date':
    case 'datetime':
    case 'today': {
      return (
        <Controller
          name={`${name}.${formName.date}` as any}
          control={form.control}
          render={({field}) => (
            <Core.PeriodPicker
              {...field}
              sx={sx}
              value={field.value?.map((_: string | undefined) => (_ ? new Date(_) : _))}
            />
          )}
        />
      )
    }
    default: {
      return (
        <Controller
          name={`${name}.${formName.number}` as any}
          control={form.control}
          render={({field}) => <RangeInput label={label ?? m.value} sx={sx} {...field} />}
        />
      )
    }
  }
}
