import * as Datatable from '@infoportal/client-datatable'
import {useXlsFormStore, XlsChoicesRow, XlsSurveyRow} from '../core/useStore'
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
import {ActionBar} from './ActionBar'

export const ChoicesTable = ({sx, handleRef}: {handleRef: RefObject<Datatable.Handle | null>; sx?: SxProps}) => {
  const {m} = useI18n()
  const t = useTheme()
  const reorderRows = useXlsFormStore(_ => _.reorderRows)
  const choices = useXlsFormStore(_ => _.schema.choices)
  const translations = useXlsFormStore(_ => _.schema.translations)

  const columns: Datatable.Column.Props<XlsChoicesRow>[] = useMemo(() => {
    const defaultWith = 160
    const cols: Datatable.Column.Props<XlsChoicesRow>[] = [
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
        id: 'list_name',
        head: 'list_name',
        type: 'select_one',
        render: row => {
          return {
            value: row.list_name,
            label: <CellText cellPointer={{table: 'choices', rowKey: row.key, field: 'list_name'}} />,
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
            label: <CellText cellPointer={{table: 'choices', rowKey: row.key, field: 'name'}} />,
            option: row.name,
          }
        },
      },
      ...translations.map((lang, i) => {
        return Datatable.Column.make<XlsChoicesRow>({
          id: 'label:' + lang,
          head: 'label' + ':' + lang,
          width: 260,
          type: 'string',
          render: row => {
            const value = row.label?.[i]
            return {
              value: value,
              label: <CellText cellPointer={{table: 'choices', rowKey: row.key, field: 'label', fieldIndex: i}} />,
              option: value,
            }
          },
        })
      }),
    ]
    return cols.map(_ => {
      if (_.width) return _
      return {
        ..._,
        width: defaultWith,
      }
    })
  }, [translations])

  const handleEvent = useCallback((action: Datatable.Action<XlsChoicesRow>) => {
    switch (action.type) {
      case 'REORDER_ROWS': {
        reorderRows({table: 'choices', ...action})
        break
      }
    }
  }, [])

  return (
    <Datatable.Component
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
          renderFormulaBarOnColumnSelected: ({columnId, rowIds, commonValue}) => {
            const [field, lang] = columnId.split(':') as [keyof XlsChoicesRow, string | undefined]
            return (
              <ActionBar rowKeys={rowIds} table="choices" value={commonValue} field={field} lang={lang} />
            )
          },
        },
        columnsResize: {enabled: true},
        columnsToggle: {enabled: true},
      }}
      rowHeight={34}
      showRowIndex
      ref={handleRef}
      onEvent={handleEvent}
      sx={sx}
      id="xls-form-editor"
      columns={columns}
      getRowChangeTracker={getDataKey}
      getRowKey={getDataKey}
      data={choices}
    />
  )
}
