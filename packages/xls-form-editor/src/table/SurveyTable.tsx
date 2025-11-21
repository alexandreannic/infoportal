import * as Datatable from '@infoportal/client-datatable'
import {useXlsFormStore, XlsSurveyRow} from '../core/useStore'
import {RefObject, useCallback, useMemo} from 'react'
import {CellSelectType} from '../input/CellSelectType'
import {selectsQuestionTypes, selectsQuestionTypesSet} from '../core/settings'
import {CellSelectListName} from '../input/CellSelectListName'
import {CellText} from '../input/CellText'
import {CellBoolean} from '../input/CellBoolean'
import {CellFormula} from '../input/CellFormula'
import {CellSelectAppearance} from '../input/CellSelectAppearance'
import {getDataKey} from './XlsFormEditor'
import * as Core from '@infoportal/client-core'
import {SxProps, useTheme} from '@mui/material'
import {useI18n} from '@infoportal/client-i18n'

export const SurveyTable = ({sx, handleRef}: {handleRef: RefObject<Datatable.Handle | null>; sx?: SxProps}) => {
  const {m} = useI18n()
  const t = useTheme()
  const reorderRows = useXlsFormStore(_ => _.reorderRows)
  const survey = useXlsFormStore(_ => _.schema.survey)
  const translations = useXlsFormStore(_ => _.schema.translations)

  const columns: Datatable.Column.Props<XlsSurveyRow>[] = useMemo(() => {
    const defaultWith = 160
    const cols: Datatable.Column.Props<XlsSurveyRow>[] = [
      {
        id: 'key',
        head: 'key',
        type: 'string',
        width: 70,
        render: row => {
          return {
            value: row.key,
            label: row.key,
          }
        },
      },
      {
        id: 'type',
        head: 'type',
        type: 'select_one',
        width: 70,
        render: row => {
          return {
            value: row.type,
            label: <CellSelectType cellPointer={{table: 'survey', rowKey: row.key, field: 'type'}} />,
            option: row.type,
          }
        },
      },
      {
        id: 'select_from_list_name',
        head: 'select_from_list_name',
        type: 'select_one',
        render: row => {
          return {
            value: row.select_from_list_name,
            label: selectsQuestionTypesSet.has(row.type) ? (
              <CellSelectListName cellPointer={{table: 'survey', rowKey: row.key, field: 'select_from_list_name'}} />
            ) : undefined,
            option: row.select_from_list_name,
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
            label: (
              <CellText
                cellPointer={{table: 'survey', rowKey: row.key, field: 'name'}}
                sx={{
                  color: t.vars.palette.text.secondary,
                  fontFamily: 'monospace',
                }}
              />
            ),
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
            label: <CellBoolean cellPointer={{table: 'survey', rowKey: row.key, field: 'required'}} />,
            option: '' + row.required,
          }
        },
      },
      ...translations.map((lang, i) => {
        return Datatable.Column.make<XlsSurveyRow>({
          id: 'label:' + lang,
          head: 'label' + ':' + lang,
          width: 260,
          type: 'string',
          render: row => {
            const value = row.label?.[i]
            return {
              value: value,
              label: <CellText cellPointer={{table: 'survey', rowKey: row.key, field: 'label', fieldIndex: i}} />,
              option: value,
            }
          },
        })
      }),
      ...translations.map((lang, i) => {
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
                <CellText
                  cellPointer={{table: 'survey', rowKey: row.key, fieldIndex: i, field: 'hint'}}
                  sx={{color: t.vars.palette.text.secondary}}
                />
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
            label: <CellFormula cellPointer={{table: 'survey', rowKey: row.key, field: 'relevant'}} />,
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
            label: <CellFormula cellPointer={{table: 'survey', rowKey: row.key, field: 'calculation'}} />,
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
            label: (
              <CellSelectAppearance
                questionType={row.type}
                cellPointer={{table: 'survey', rowKey: row.key, field: 'appearance'}}
              />
            ),
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
            label: <CellText cellPointer={{table: 'survey', rowKey: row.key, field: 'default'}} />,
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
            label: <CellFormula cellPointer={{table: 'survey', rowKey: row.key, field: 'constraint'}} />,
          }
        },
      },
      ...translations.map((lang, i) => {
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
                  cellPointer={{fieldIndex: i, table: 'survey', rowKey: row.key, field: 'constraint_message'}}
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
            label: selectsQuestionTypes.includes(row.type) && (
              <CellText cellPointer={{table: 'survey', rowKey: row.key, field: 'choice_filter'}} />
            ),
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
  }, [translations])

  const handleEvent = useCallback((action: Datatable.Action<XlsSurveyRow>) => {
    switch (action.type) {
      case 'REORDER_ROWS': {
        reorderRows({table: 'survey', ...action})
        break
      }
    }
  }, [])

  return (
    <Datatable.Component
      ref={handleRef}
      module={{
        export: {enabled: true},
        rowsDragging: {enabled: true},
        cellSelection: {
          mode: 'free',
          enabled: true,
          renderFormulaBarOnRowSelected: () => (
            <Core.Btn icon="delete" size="small" variant="outlined" color="error">
              {m.delete}
            </Core.Btn>
          ),
          // mode: 'row'
        },
        columnsResize: {enabled: true},
        columnsToggle: {enabled: true},
      }}
      rowHeight={34}
      showRowIndex
      onEvent={handleEvent}
      sx={sx}
      id="xls-form-editor"
      columns={columns}
      getRowChangeTracker={getDataKey}
      getRowKey={getDataKey}
      data={survey}
    />
  )
}
