import {Theme} from '@mui/material'
import * as Datatable from '@infoportal/client-datatable'
import {CellText} from '../input/CellText'
import {Ip} from '@infoportal/api-sdk'

export function getChoicesColumns({
  t,
  translations,
}: {
  t: Theme
  translations: string[]
}): Datatable.Column.Props<Ip.Form.Choice>[] {
  return [
    {
      id: 'list_name',
      head: 'list_name',
      type: 'select_one',
      render: row => {
        return {
          value: row.list_name,
          label: <CellText cellPointer={{table: 'choices', rowKey: row.$kuid, field: 'list_name'}} />,
          option: row.list_name,
        }
      },
    },
    {
      id: 'name',
      head: 'name',
      type: 'select_one',
      render: row => {
        return {
          value: row.name,
          label: <CellText cellPointer={{table: 'choices', rowKey: row.$kuid, field: 'name'}} />,
          option: row.name,
        }
      },
    },
    ...translations.map((lang, i) => {
      return Datatable.Column.make<Ip.Form.Choice>({
        id: 'label:' + lang,
        head: 'label' + ':' + lang,
        width: 260,
        type: 'string',
        render: row => {
          const value = row.label?.[i]
          return {
            value: value,
            label: <CellText cellPointer={{table: 'choices', rowKey: row.$kuid, field: 'label', fieldIndex: i}} />,
            option: value,
          }
        },
      })
    }),
  ]
}
