import {useXlsFormStore} from '../core/useStore'
import {Box, Checkbox} from '@mui/material'
import * as Datatable from '@infoportal/client-datatable'
import {SelectType} from '../input/CellSelectType'
import {SelectAppearance} from '../input/CellSelectAppearance'
import {SelectListName} from '../input/CellSelectListName'
import {useMemo} from 'react'
import {Api} from '@infoportal/api-sdk'

type ActionBarProps = {
  value?: any
  rowKeys: string[]
  lang?: string
} & (
  | {
      field: keyof Api.Form.Question
      table: 'survey'
    }
  | {
      field: keyof Api.Form.Choice
      table: 'choices'
    }
)

const selectSx = {
  '& fieldset': {
    border: 'none',
  },
}

export const ActionBar = ({field, value, lang, rowKeys, table}: ActionBarProps) => {
  const updateCells = useXlsFormStore(_ => _.updateCells)
  const translations = useXlsFormStore(_ => _.schema.translations)
  const fieldIndex = useMemo(() => {
    if (lang) return translations.indexOf(lang)
  }, [translations, lang])

  return (
    <Datatable.AsyncInputWrapper
      label={field}
      value={value ?? ''}
      onConfirm={async (value: any) => {
        updateCells({
          field,
          fieldIndex,
          value,
          table: 'survey',
          rowKeys,
        })
        return {editedCount: rowKeys.length}
      }}
      renderInput={({value, placeholder, onChange}) => {
        switch (field) {
          case 'select_from_list_name': {
            return <SelectListName value={value} onChange={onChange} sx={selectSx} autoWidthPopover />
          }
          case 'appearance': {
            return <SelectAppearance value={value} onChange={onChange} sx={selectSx} autoWidthPopover />
          }
          case 'type': {
            return <SelectType value={value} onChange={onChange} autoWidthPopover sx={selectSx} />
          }
          case 'required': {
            return <Checkbox checked={Boolean(value)} onChange={(e, checked) => onChange(checked)} />
          }
          case 'relevant':
          case 'constraint':
          case 'default':
          case 'constraint_message':
          case 'choice_filter':
          case 'calculation':
          case 'list_name':
          case 'hint':
          case 'label':
          case 'name': {
            return (
              <Box
                placeholder={placeholder}
                component="input"
                value={value}
                onChange={e => onChange((e.target as any).value)}
                sx={{
                  fontWeight: 'bold',
                  flex: 1,
                  height: '100%',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  background: 'none',
                }}
              />
            )
          }
          default:
            return
        }
      }}
    />
  )
}
