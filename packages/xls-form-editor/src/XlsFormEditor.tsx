import {Box, SxProps, useTheme} from '@mui/material'
import * as Datatable from '@infoportal/client-datatable'
import {schema as getSchema} from './schema.fixture'
import {useI18n} from '@infoportal/client-i18n'
import {CellText} from './CellText'
import {useXlsFormStore, XlsSurveyRow} from './useStore'
import {useCallback, useEffect, useMemo} from 'react'
import {CellBoolean} from './CellBoolean'
import {Kobo} from 'kobo-sdk'
import {CellSelectType} from './CellSelectType'
import {CellFormula} from './CellFormula'
import {CellSelectAppearance} from './CellSelectAppearance'
import {selectsQuestionTypes} from './settings'
import {Panel} from '@infoportal/client-core'

const getDataKey = (_: XlsSurveyRow) => _.key

const tableSx: SxProps = {
  '& .dtd': {px: 0},
}

const tableModule: Datatable.Props<any>['module'] = {
  export: {enabled: true},
  rowsDragging: {enabled: true},
  cellSelection: {hideFormulaBar: true, enabled: true, mode: 'row'},
  columnsResize: {enabled: true},
  columnsToggle: {enabled: true},
}

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

  const columns: Datatable.Column.Props<XlsSurveyRow>[] = useMemo(() => {
    const defaultWith = 190
    const cols: Datatable.Column.Props<XlsSurveyRow>[] = [
      {
        id: 'type',
        head: 'type',
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
        id: 'name',
        head: 'name',
        type: 'string',
        render: row => {
          return {
            value: row.name,
            label: <CellText rowKey={row.key} field="name" sx={sxName} />,
            option: row.name,
          }
        },
      },
      {
        id: 'required',
        head: 'required',
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
          head: 'label' + ':' + lang,
          width: 280,
          type: 'string',
          render: row => {
            const value = row.label?.[i]
            return {
              value: value,
              label: <CellText rowKey={row.key} field="label" fieldIndex={i} />,
              option: value,
            }
          },
        })
      }),
      ...schema.translations.map((lang, i) => {
        return Datatable.Column.make<XlsSurveyRow>({
          id: 'hint:' + lang,
          head: 'hint' + ':' + lang,
          type: 'string',
          width: 320,
          render: row => {
            const value = row.hint?.[i]
            return {
              value: value,
              label: (
                <CellText rowKey={row.key} field="hint" fieldIndex={i} sx={{color: t.vars.palette.text.secondary}} />
              ),
              option: value,
            }
          },
        })
      }),
      {
        id: 'relevant',
        head: 'relevant',
        type: 'string',
        render: row => {
          return {
            value: row.relevant,
            label: <CellFormula rowKey={row.key} field="relevant" />,
          }
        },
      },
      {
        id: 'calculation',
        head: 'calculation',
        type: 'string',
        render: row => {
          return {
            value: row.calculation,
            label: <CellFormula rowKey={row.key} field="calculation" />,
          }
        },
      },
      {
        id: 'appearance',
        head: 'appearance',
        type: 'string',
        render: row => {
          return {
            value: row.appearance,
            label: <CellSelectAppearance questionType={row.type} rowKey={row.key} field="appearance" />,
          }
        },
      },
      {
        id: 'default',
        head: 'default',
        type: 'string',
        render: row => {
          return {
            value: row.default,
            label: <CellText rowKey={row.key} field="default" />,
          }
        },
      },
      {
        id: 'constraint',
        head: 'constraint',
        type: 'string',
        render: row => {
          return {
            value: row.constraint,
            label: <CellFormula rowKey={row.key} field="constraint" />,
          }
        },
      },
      ...schema.translations.map((lang, i) => {
        return Datatable.Column.make<XlsSurveyRow>({
          id: 'constraint_message:' + lang,
          head: 'constraint_message' + ':' + lang,
          type: 'string',
          render: row => {
            const value = row.constraint_message?.[i]
            return {
              value: value,
              label: (
                <CellText
                  rowKey={row.key}
                  field="constraint_message"
                  fieldIndex={i}
                  sx={{color: t.vars.palette.text.secondary}}
                />
              ),
              option: value,
            }
          },
        })
      }),
      {
        id: 'choice_filter',
        head: 'choice_filter',
        type: 'string',
        render: row => {
          return {
            value: row.choice_filter,
            label: selectsQuestionTypes.includes(row.type) && <CellText rowKey={row.key} field="choice_filter" />,
          }
        },
      },
    ]
    return cols.map(_ => {
      if (_.width) return _
      return {
        ..._,
        width: defaultWith,
      }
    })
  }, [schema])

  const handleEvent = useCallback((action: Datatable.Action<XlsSurveyRow>) => {
    switch (action.type) {
      case 'REORDER_ROWS': {
        const {index, range} = action
        const rows = [...survey]
        const moved = rows.splice(range.min, range.max - range.min + 1)
        const target = index > range.max ? index - moved.length : index
        rows.splice(target, 0, ...moved)
        setData(rows)
      }
    }
  }, [])

  return (
    <Panel sx={{width: '100%', mb: 0, overflowX: 'auto'}}>
      <Datatable.Component
        module={tableModule}
        showRowIndex
        onEvent={handleEvent}
        sx={tableSx}
        id="xls-form-editor"
        columns={columns}
        getRowChangeTracker={getDataKey}
        getRowKey={getDataKey}
        data={survey}
      />
    </Panel>
  )
}
