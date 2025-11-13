import {Autocomplete, AutocompleteProps, Box, Chip, createFilterOptions} from '@mui/material'
import {KoboSchemaHelper} from '@infoportal/kobo-helper'
import React, {useCallback, useMemo} from 'react'
import {Ip} from '@infoportal/api-sdk'
import {Kobo} from 'kobo-sdk'
import {Core} from '../index'
import {seq} from '@axanc/ts-utils'

type Props = Omit<AutocompleteProps<string, true, false, true>, 'options' | 'renderInput'> & {
  schema: Ip.Form.Schema
  questionName: string
  InputProps: Core.InputProps
  langIndex?: number
}

export const SelectChoiceInput = ({langIndex = 0, schema, questionName, InputProps, ...props}: Props) => {
  const {question, options} = useMemo(() => {
    const question = schema.survey.find(_ => _.name === questionName)
    return {
      question,
      options: schema.choices?.filter(_ => _.list_name === question?.select_from_list_name),
    }
  }, [schema, questionName])

  const indexOptionsByName = useMemo(() => {
    return seq(options).groupByFirst(_ => _.name)
  }, [options])

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
    [schema, langIndex],
  )

  if (!question) return <Core.Input disabled value="⚠️" />
  return (
    <Autocomplete
      freeSolo
      filterOptions={filterOptions(indexOptionsByName)}
      multiple
      disableCloseOnSelect
      options={options?.map(_ => _.name) ?? []}
      // options={options?.map(_ => ({children: KoboSchemaHelper.getLabel(_, langIndex), value: _.name}))}
      renderInput={({InputProps: renderInputProps, ...renderProps}) => (
        <Core.Input {...renderInputProps} {...renderProps} {...InputProps} />
      )}
      renderValue={(value: string[], getTagProps) =>
        value.map((option: string, index: number) => (
          // eslint-disable-next-line react/jsx-key
          <Chip size="small" variant="outlined" label={option} {...getTagProps({index})} />
        ))
      }
      renderOption={(props, optionName) => (
        <Box component="li" {...props} key={optionName}>
          <div>
            <Core.Txt block>
              {KoboSchemaHelper.getLabel(indexOptionsByName[optionName], langIndex).replace(/<[^>]+>/g, '') ??
                optionName}
            </Core.Txt>
            <Core.Txt color="disabled">{optionName}</Core.Txt>
          </div>
        </Box>
      )}
      {...props}
    />
  )
}
