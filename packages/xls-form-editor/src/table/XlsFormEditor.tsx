import {Box, SxProps, Tab, Tabs, useTheme} from '@mui/material'
import * as Datatable from '@infoportal/client-datatable'
import {useI18n} from '@infoportal/client-i18n'
import {getDataKey, useXlsFormStore, XlsChoicesRow, XlsSurveyRow} from '../core/useStore'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import * as Core from '@infoportal/client-core'
import {Ip} from '@infoportal/api-sdk'
import {ActionBar} from './ActionBar'
import {getChoicesColumns} from './getChoicesColumns'
import {getSurveyColumns} from './getSurveyColumns'
import {parseForm} from '../core/settings'

export type TableName = 'survey' | 'choices'

const tableSx: SxProps = {
  height: 'calc(100vh - 192px)',
  '& .dtd': {px: 0},
}

export const XlsFormEditor = ({
  value,
  onChange,
  onCommit,
}: {
  value?: Ip.Form.Schema
  onChange?: (_: Ip.Form.Schema) => void
  onCommit?: (_: Ip.Form.Schema) => void
  onSave?: (_: Ip.Form.Schema) => void
}) => {
  const {m} = useI18n()
  const t = useTheme()

  const schema = useXlsFormStore(_ => _.schema)
  const setSchema = useXlsFormStore(_ => _.setSchema)
  const addSurveyRow = useXlsFormStore(_ => _.addRows)
  const reorderRows = useXlsFormStore(_ => _.reorderRows)
  const translations = useXlsFormStore(_ => _.schema.translations)
  const deleteRows = useXlsFormStore(_ => _.deleteRows)
  const undo = useXlsFormStore(_ => _.undo)
  const redo = useXlsFormStore(_ => _.redo)
  const past = useXlsFormStore(_ => _.past)
  const future = useXlsFormStore(_ => _.future)

  const [rowsToAdd, setRowsToAdd] = useState(1)
  const [activeTab, setActiveTab] = useState<TableName>('survey')
  const datatableHandle = useRef<Datatable.Handle>(null)

  const columns: Datatable.Column.Props<any>[] = useMemo(() => {
    const defaultWith = 160
    const cols = activeTab === 'survey' ? getSurveyColumns({t, translations}) : getChoicesColumns({t, translations})
    return cols.map(_ => {
      if (_.width) return _
      return {
        ..._,
        width: defaultWith,
      }
    })
  }, [activeTab, translations])

  useEffect(() => {
    if (value) setSchema(value)
  }, [value])

  useEffect(() => {
    onChange?.(parseForm(schema))
  }, [schema])

  const handleEvent = useCallback((action: Datatable.Action<XlsSurveyRow | XlsChoicesRow>) => {
    switch (action.type) {
      case 'REORDER_ROWS': {
        reorderRows({table: activeTab, ...action})
        break
      }
    }
  }, [])

  const header = useCallback(() => {
    return (
      <Box sx={{display: 'flex', width: '100%', alignItems: 'center'}}>
        <Tabs value={activeTab} onChange={(e, v: TableName) => setActiveTab(v)}>
          <Tab label="survey" value="survey" />
          <Tab label="choices" value="choices" />
        </Tabs>
        <Core.IconBtn children="undo" disabled={!past.length} onClick={undo} sx={{marginLeft: 'auto'}} />
        <Core.IconBtn children="redo" disabled={!future.length} onClick={redo} />
        <Core.Btn
          disabled={past.length === 0}
          variant="contained"
          onClick={() => {
            onCommit?.(parseForm(schema))
          }}
        >
          {m.save}
        </Core.Btn>
      </Box>
    )
  }, [onCommit, schema, activeTab])

  return (
    <Core.Panel sx={{width: '100%', mb: 0, overflowX: 'auto'}}>
      <Datatable.Component
        ref={datatableHandle}
        header={header}
        module={{
          export: {enabled: true},
          rowsDragging: {enabled: true},
          cellSelection: {
            mode: 'free',
            enabled: true,
            renderFormulaBarOnColumnSelected: ({columnId, rowIds, commonValue}) => {
              const [field, lang] = columnId.split(':') as [keyof XlsSurveyRow, string | undefined]
              return <ActionBar rowKeys={rowIds} table="survey" value={commonValue} field={field} lang={lang} />
            },
            renderFormulaBarOnRowSelected: ({rowIds}) => (
              <Core.Btn
                icon="delete"
                size="small"
                variant="outlined"
                color="error"
                onClick={() => deleteRows({table: activeTab, rowIds})}
              >
                {m.delete}
              </Core.Btn>
            ),
          },
          columnsResize: {enabled: true},
          columnsToggle: {enabled: true},
        }}
        rowHeight={34}
        showRowIndex
        onEvent={handleEvent}
        sx={tableSx}
        id={'xls-form-editor-' + activeTab}
        columns={columns}
        getRowChangeTracker={getDataKey}
        getRowKey={getDataKey}
        data={schema[activeTab]}
      />
      <Box sx={{display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', my: 0.5}}>
        <Core.Btn
          onClick={() => {
            addSurveyRow({table: activeTab, count: rowsToAdd})
            setTimeout(() => datatableHandle.current?.scrollBottom())
          }}
          icon="add"
        >
          {m.add}
        </Core.Btn>
        <Core.Input
          sx={{width: 80, mr: 1}}
          type="number"
          helperText={null}
          value={rowsToAdd}
          size="tiny"
          onChange={e => {
            setRowsToAdd(+e.target.value)
          }}
        />
        {m._xlsFormEditor.moreRows}
      </Box>
    </Core.Panel>
  )
}
