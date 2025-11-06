import {Box, useTheme} from '@mui/material'
import * as Datatable from '@infoportal/client-datatable'
import {schema as getSchema} from './schema.fixture'
import {useI18n} from '@infoportal/client-i18n'
import {CellInput} from './CellInput'
import {useXlsFormStore, XlsSurveyRow} from './useStore'
import {useEffect, useMemo} from 'react'
import {CellBoolean} from './CellBoolean'
import {Kobo} from 'kobo-sdk'
import {CellSelectType} from './CellSelectType'

export type Question = Kobo.Form.Question & {order: number}

export const XlsFormEditor = () => {
  const {m} = useI18n()
  const t = useTheme()
  const schema = getSchema
  const setData = useXlsFormStore(_ => _.setData)
  const survey = useXlsFormStore(_ => _.survey)

  useEffect(() => {
    setData(schema.survey)
  }, [schema])

  const sxName = useMemo(() => {
    return {color: t.vars.palette.text.secondary, fontFamily: 'monospace'}
  }, [t])
  return (
    <Box>
      <Datatable.Component
        module={{
          export: {enabled: true},
          cellSelection: {enabled: true, mode: 'row'},
          columnsResize: {enabled: true},
          columnsToggle: {enabled: true},
        }}
        showRowIndex
        sx={{
          '& .dtd': {px: 0},
        }}
        id="xls-form-editor"
        columns={[
          {
            id: 'name',
            head: m.name,
            type: 'string',
            render: row => {
              return {
                value: row.name,
                label: <CellInput rowKey={row.key} field="name" sx={sxName} />,
                option: row.name,
              }
            },
          },
          {
            id: 'type',
            head: m.type,
            type: 'select_one',
            width: 70,
            render: row => {
              return {
                value: row.type,
                label: <CellSelectType rowKey={row.key} field="type" />,
                option: row.type,
              }
            },
          },
          {
            id: 'required',
            head: m.required,
            type: 'select_one',
            width: 40,
            align: 'center',
            render: row => {
              return {
                value: '' + row.required,
                label: <CellBoolean rowKey={row.key} field="required" />,
                option: '' + row.required,
              }
            },
          },
          ...schema.translations.map((lang, i) => {
            return Datatable.Column.make<XlsSurveyRow>({
              id: 'label:' + lang,
              head: m.label + ':' + lang,
              type: 'string',
              render: row => {
                const value = row.label?.[i]
                return {
                  value: value,
                  label: <CellInput rowKey={row.key} field="label" fieldIndex={i} />,
                  option: value,
                }
              },
            })
          }),
        ]}
        getRowKey={_ => _.key}
        data={survey}
      />
    </Box>
  )
}
