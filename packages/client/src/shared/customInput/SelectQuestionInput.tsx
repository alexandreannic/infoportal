import {
  Autocomplete,
  AutocompleteProps,
  Box,
  CircularProgress,
  createFilterOptions,
  Theme,
  useTheme,
} from '@mui/material'
import {colorRepeatedQuestionHeader, KoboTypeIcon} from '@infoportal/database-column'
import {KoboSchemaHelper, removeHtml} from 'infoportal-common'
import React, {useCallback, useMemo} from 'react'
import {seq} from '@axanc/ts-utils'
import {Kobo} from 'kobo-sdk'
import {Core} from '../index'
import {useI18n} from '@infoportal/client-i18n'
import {darkenVar} from '@infoportal/client-core'

type Props = Omit<AutocompleteProps<string, false, any, any>, 'options' | 'renderInput'> & {
  schema?: KoboSchemaHelper.Bundle<any>
  loading?: boolean
  InputProps?: Core.InputProps
  questionTypeFilter?: Array<Kobo.Form.QuestionType>
  langIndex?: number
}

const optionInRepeatStyle = (t: Theme) => ({
  '&.Mui-focused, &[aria-selected="true"]': {
    backgroundColor: darkenVar(colorRepeatedQuestionHeader(t), 0.05) + ' !important',
  },
  background: colorRepeatedQuestionHeader,
})

export const SelectQuestionInput = ({
  langIndex = 0,
  schema,
  loading,
  questionTypeFilter = [],
  value,
  onInputChange,
  InputProps,
  onChange,
  sx,
  ...props
}: Props) => {
  const {m} = useI18n()
  const t = useTheme()
  const questions = useMemo(() => {
    const survey = schema?.schema.survey.filter(_ => _.type !== 'end_repeat' && _.type !== 'end_group')
    if (questionTypeFilter.length === 0) return survey
    return survey?.filter(_ => questionTypeFilter.includes(_.type))
  }, [questionTypeFilter, schema])

  const questionIndex = schema?.helper.questionIndex ?? {}
  const filterOptions = useCallback(
    (
      index: Record<
        string,
        | undefined
        | {
            name: string
            label?: string[]
          }
      >,
    ) =>
      createFilterOptions({
        stringify: (optionName: string) => {
          const item = index[optionName]
          if (!item) return optionName

          const label = KoboSchemaHelper.getLabel(item, langIndex)
          const labelText = Array.isArray(label) ? label.join(' ') : label || ''
          return `${item.name} ${labelText}`.trim()
        },
      }),
    [schema],
  )

  return (
    <Autocomplete
      value={value}
      loading={loading}
      onInputChange={(e, newInputValue, reason) => {
        if (reason === 'reset') {
          onInputChange?.(e, '', reason)
        } else {
          onInputChange?.(e, newInputValue, reason)
        }
      }}
      filterOptions={filterOptions(questionIndex)}
      onChange={(e, _, reason, details) => {
        onChange?.(e, _, reason, details)
      }}
      options={questions?.map(_ => _.name!) ?? []}
      groupBy={_ => {
        return schema?.helper.group.getByQuestionName(_)?.name ?? ''
      }}
      renderGroup={params => {
        const label = schema?.translate.question(params.group)
        return (
          <li key={params.key} title={label}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 13,
                padding: '4px 10px',
                background: 'rgba(0,0,0,0.04)',
              }}
            >
              {label}
            </div>
            <ul style={{paddingLeft: 0, margin: 0}}>{params.children}</ul>
          </li>
        )
      }}
      renderInput={({InputProps: renderInputProps, ...renderProps}) => (
        <Core.Input
          label={m.question}
          sx={sx}
          {...renderInputProps}
          {...renderProps}
          {...InputProps}
          endAdornment={
            <>
              {loading ? <CircularProgress size={20} /> : undefined}
              {renderInputProps.endAdornment}
            </>
          }
        />
      )}
      renderValue={_ => KoboSchemaHelper.getLabel(questionIndex[_], langIndex).replace(/<[^>]+>/g, '') ?? _}
      renderOption={(props, option) => {
        const isInRepeatGroup = !!schema?.helper.group.getByQuestionName(option)
        const label = removeHtml(schema?.translate.question(option))
        return (
          <Box
            component="li"
            {...props}
            key={option}
            sx={isInRepeatGroup ? optionInRepeatStyle(t) : undefined}
            title={label}
          >
            <KoboTypeIcon children={questionIndex[option]?.type} sx={{ml: -0.5, mr: 1}} />
            <div>
              <Core.Txt block>{label ?? option}</Core.Txt>
              <Core.Txt color="disabled">{option}</Core.Txt>
            </div>
          </Box>
        )
      }}
    />
  )
}
