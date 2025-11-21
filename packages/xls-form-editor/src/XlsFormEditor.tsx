import {Box, SxProps, Tab, Tabs, useTheme} from '@mui/material'
import * as Datatable from '@infoportal/client-datatable'
import {useI18n} from '@infoportal/client-i18n'
import {CellText} from './CellText'
import {useXlsFormStore, XlsChoicesRow, XlsSurveyRow} from './useStore'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {CellBoolean} from './CellBoolean'
import {CellSelectType} from './CellSelectType'
import {CellFormula} from './CellFormula'
import {CellSelectAppearance} from './CellSelectAppearance'
import {selectsQuestionTypes, selectsQuestionTypesSet} from './settings'
import * as Core from '@infoportal/client-core'
import {Ip} from '@infoportal/api-sdk'
import {RowId} from '@infoportal/client-datatable/dist/core/types'
import {CellSelectListName} from './CellSelectListName'
import {SurveyTable} from './SurveyTable'
import {ChoicesTable} from './ChoicesTable'

export const getDataKey = (_: XlsSurveyRow | XlsChoicesRow) => {
  return _.key
}

export type TableName = 'survey' | 'choices'

const tableSx: SxProps = {
  height: 'calc(100vh - 192px)',
  '& .dtd': {px: 0},
}

export const XlsFormEditor = ({
  value,
  onChange,
}: {
  value?: Ip.Form.Schema
  onChange?: (_: Ip.Form.Schema) => void
  onSave?: (_: Ip.Form.Schema) => void
}) => {
  const {m} = useI18n()
  const schema = useXlsFormStore(_ => _.schema)
  const setSchema = useXlsFormStore(_ => _.setSchema)
  const addSurveyRow = useXlsFormStore(_ => _.addRows)
  const [rowsToAdd, setRowsToAdd] = useState(1)
  const [activeTab, setActiveTab] = useState<TableName>('survey')
  const datatableHandle = useRef<Datatable.Handle>(null)

  useEffect(() => {
    if (!value) return
    setSchema(value)
  }, [value])

  useEffect(() => {
    onChange?.(schema as any)
  }, [schema])

  return (
    <Core.Panel sx={{width: '100%', mb: 0, overflowX: 'auto'}}>
      {activeTab === 'survey' ? (
        <SurveyTable sx={tableSx} handleRef={datatableHandle} />
      ) : (
        activeTab === 'choices' && <ChoicesTable handleRef={datatableHandle} sx={tableSx} />
      )}
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
        <Tabs
          sx={{height: 36, minHeight: 36, marginLeft: 'auto'}}
          value={activeTab}
          onChange={(e, v: TableName) => setActiveTab(v)}
        >
          <Tab label="survey" value="survey" sx={{py: 0.5, minHeight: 34, height: 34}} />
          <Tab label="choices" value="choices" sx={{py: 0.5, minHeight: 34, height: 34}} />
        </Tabs>
      </Box>
    </Core.Panel>
  )
}
