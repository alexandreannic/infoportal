import {Autocomplete, AutocompleteProps, Box, createFilterOptions} from '@mui/material'
import {KoboTypeIcon} from '@infoportal/database-column'
import {KoboSchemaHelper} from 'infoportal-common'
import React, {useCallback, useMemo} from 'react'
import {map, seq} from '@axanc/ts-utils'
import {Kobo} from 'kobo-sdk'
import {Ip} from 'infoportal-api-sdk'
import {Core} from '.'

type Props = Omit<AutocompleteProps<any, any, any, any>, 'options' | 'renderInput'> & {
  schema: Ip.Form.Schema
  InputProps: Core.InputProps
  questionTypeFilter: Array<Kobo.Form.QuestionType>
  langIndex?: number
}

export const SelectQuestionInput = ({
  langIndex = 0,
  schema,
  questionTypeFilter,
  value,
  onInputChange,
  InputProps,
  onChange,
  ...props
}: Props) => {
  const questions = useMemo(() => {
    return map(schema.survey, schema => schema.filter(_ => questionTypeFilter.includes(_.type)))
  }, [questionTypeFilter, schema])

  const questionIndex = useMemo(() => {
    return seq(questions)
      .compactBy('name')
      .groupByFirst(_ => _.name)
  }, [schema])

  const filterOptions = useCallback(
    (
      index: Record<
        string,
        {
          name: string
          label?: string[]
        }
      >,
    ) =>
      createFilterOptions({
        stringify: (optionName: string) => KoboSchemaHelper.getLabel(index[optionName], langIndex),
      }),
    [schema],
  )

  return (
    <Autocomplete
      value={value}
      onInputChange={(e, newInputValue, reason) => {
        if (reason === 'reset') {
          onInputChange?.(e, '', reason)
        } else {
          onInputChange?.(e, newInputValue, reason)
        }
      }}
      filterOptions={filterOptions(questionIndex)}
      onChange={(e, _, reason, details) => {
        if (_) {
          onChange?.(e, _, reason, details)
          // accessForm.setValue('questionAnswer', [])
        }
      }}
      options={questions?.map(_ => _.name!) ?? []}
      renderInput={({InputProps: renderInputProps, ...renderProps}) => (
        <Core.Input
          label={m.question}
          {...renderInputProps}
          {...renderProps}
          {...InputProps}
          endAdornment={loading ? <CircularProgress size={20} /> : undefined}
        />
      )}
      renderOption={(props, option) => {
        return (
          <Box component="li" {...props} key={option}>
            <KoboTypeIcon children={questionIndex[option].type} sx={{ml: -0.5, mr: 1}} />
            <div>
              <Core.Txt block>
                {KoboSchemaHelper.getLabel(questionIndex[option], langIndex).replace(/<[^>]+>/g, '') ?? option}
              </Core.Txt>
              <Core.Txt color="disabled">{option}</Core.Txt>
            </div>
          </Box>
        )
      }}
    />
  )
}
