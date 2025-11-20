import {SxProps, useTheme} from '@mui/material'
import * as Datatable from '@infoportal/client-datatable'
import {useI18n} from '@infoportal/client-i18n'
import {CellText} from './CellText'
import {useXlsFormStore, XlsSurveyRow} from './useStore'
import {useCallback, useEffect, useMemo} from 'react'
import {CellBoolean} from './CellBoolean'
import {CellSelectType} from './CellSelectType'
import {CellFormula} from './CellFormula'
import {CellSelectAppearance} from './CellSelectAppearance'
import {selectsQuestionTypes} from './settings'
import {Btn, IconBtn, Panel} from '@infoportal/client-core'
import {Ip} from '@infoportal/api-sdk'

const getDataKey = (_: XlsSurveyRow) => {
  return _.key
}

const tableSx: SxProps = {
  '& .dtd': {px: 0},
}

export const XlsFormEditor = ({
  value,
  initialValue,
  onChange,
}: {
  initialValue?: Ip.Form.Schema
  value?: Ip.Form.Schema
  onChange?: (_: Ip.Form.Schema) => void
  onSave?: (_: Ip.Form.Schema) => void
}) => {
  const {m} = useI18n()
  const t = useTheme()
  const schema = useXlsFormStore(_ => _.schema)
  const setSchema = useXlsFormStore(_ => _.setSchema)
  const addSurveyRow = useXlsFormStore(_ => _.addSurveyRow)

  useEffect(() => {
    if (!initialValue) return
    setSchema(initialValue)
  }, [])

  useEffect(() => {
    if (!value) return
    setSchema(value)
  }, [value])

  useEffect(() => {
    onChange?.(schema as any)
  }, [schema])

  const sxName = useMemo(() => {
    return {color: t.vars.palette.text.secondary, fontFamily: 'monospace'}
  }, [t])

  const columns: Datatable.Column.Props<XlsSurveyRow>[] = useMemo(() => {
    const defaultWith = 160
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
          width: 260,
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
          width: 280,
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
        const {index, rowIds} = action
        const rows = [...schema.survey]
        // const moved = rows.splice(range.min, range.max - range.min + 1)
        // const target = index > range.max ? index - moved.length : index
        // rows.splice(target, 0, ...moved)
        // setSchema({...schema, survey: rows})
      }
    }
  }, [])

  const tableModule: Datatable.Props<any>['module'] = useMemo(() => {
    return {
      export: {enabled: true},
      rowsDragging: {enabled: true},
      cellSelection: {
        mode: 'free',
        enabled: true,
        renderComponentOnRowSelected: () => (
          <>
            <IconBtn>add</IconBtn>
          </>
        ),
        // mode: 'row'
      },
      columnsResize: {enabled: true},
      columnsToggle: {enabled: true},
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
        data={schema.survey}
      />
      <IconBtn onClick={() => addSurveyRow()}>add</IconBtn>
    </Panel>
  )
}
