import {Box, Checkbox, useTheme} from '@mui/material'
import * as Datatable from '@infoportal/client-datatable'
import {schema} from './schema.fixture'
import {useI18n} from '@infoportal/client-i18n'
import {Ip} from 'infoportal-api-sdk'
import {useForm} from 'react-hook-form'

export const XlsFormEditor = () => {
  const {m} = useI18n()
  const t = useTheme()
  const form = useForm({
    defaultValues: schema,
  })
  return (
    <Box>
      <Datatable.Component
        id="xls-form-editor"
        columns={[
          {
            id: 'name',
            head: m.name,
            type: 'string',
            render: row => {
              return {
                value: row.name,
                label: (
                  <Box sx={{color: t.vars.palette.text.secondary, fontFamily: 'monospace'}}>
                    ${row.$kuid} {row.name}
                  </Box>
                ),
                option: row.name,
              }
            },
          },
          {
            id: 'type',
            head: m.type,
            type: 'select_one',
            render: row => {
              return {
                value: row.type,
                label: row.type,
                option: row.type,
              }
            },
          },
          {
            id: 'required',
            head: m.required,
            type: 'select_one',
            width: 40,
            render: row => {
              return {
                value: '' + row.required,
                label: <Checkbox checked={row.required} />,
                option: '' + row.required,
              }
            },
          },
          ...schema.translations.map((lang, i) => {
            return Datatable.Column.make<Ip.Form.Schema['survey'][number]>({
              id: 'label:' + lang,
              head: m.label + ':' + lang,
              type: 'string',
              render: row => {
                const value = row.label?.[i]
                return {
                  value: value,
                  label: <Box sx={{color: t.vars.palette.text.secondary, fontFamily: 'monospace'}}>{value}</Box>,
                  option: value,
                }
              },
            })
          }),
        ]}
        getRowKey={_ => _.name + (_.$kuid ?? '')}
        data={schema.survey}
      />
    </Box>
  )
}
