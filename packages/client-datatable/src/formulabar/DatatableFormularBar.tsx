import {useCtx} from '../core/DatatableContext'
import {useConfig} from '../DatatableConfig'
import React, {useMemo} from 'react'
import {Box, Icon, useTheme} from '@mui/material'
import {Btn, Txt} from '@infoportal/client-core'
import {BtnCopyCells} from '../ui/BtnCopyCell'

const cellSelectionDangerThreshold = 200

export const DatatableFormularBar = () => {
  const columnsIndex = useCtx(_ => _.columns.indexMap)
  const selectedColumnIds = useCtx(_ => _.state.selectedColumnIds)
  const selectedRowIds = useCtx(_ => _.state.selectedRowIds)
  const reset = useCtx(_ => _.cellSelection.reset)
  const areAllColumnsSelected = useCtx(_ => _.cellSelection.areAllColumnsSelected)
  const selectedCount = useCtx(_ => _.cellSelection.selectedCount)
  const renderFormulaBarOnRowSelected = useCtx(_ => _.module?.cellSelection?.renderFormulaBarOnRowSelected)
  const renderFormulaBarOnColumnSelected = useCtx(_ => _.module?.cellSelection?.renderFormulaBarOnColumnSelected)
  const dataFilteredAndSorted = useCtx(_ => _.dataFilteredAndSorted)
  const columns = useCtx(_ => _.columns.visible)
  const getRowKey = useCtx(_ => _.getRowKey)

  const selectedColumnUniq = useMemo(() => {
    if (!selectedColumnIds || selectedColumnIds.size !== 1) return
    return columnsIndex[[...selectedColumnIds][0]]
  }, [selectedColumnIds])

  const commonSelectedValue = useMemo(() => {
    if (!selectedRowIds || !selectedColumnUniq) return
    let lastValue: undefined | any = undefined
    dataFilteredAndSorted.every(row => {
      const key = getRowKey(row)
      if (!selectedRowIds.has(key)) return true
      const value = selectedColumnUniq.render(row).value
      if (lastValue && lastValue !== value) return false
      lastValue = value
      return true
    })
    return lastValue
  }, [selectedRowIds, selectedColumnUniq, dataFilteredAndSorted])

  const rowIds = useMemo(() => selectedRowIds ? [...selectedRowIds] : [], [selectedRowIds])

  const t = useTheme()

  const renderColumnSelected = useMemo(() => {
    if (!selectedColumnUniq || !renderFormulaBarOnColumnSelected) return
    return renderFormulaBarOnColumnSelected({rowIds, commonValue: commonSelectedValue, columnId: selectedColumnUniq.id})
  }, [selectedColumnUniq, renderFormulaBarOnColumnSelected])

  const renderRowSelected = useMemo(() => {
    if (!areAllColumnsSelected || !renderFormulaBarOnRowSelected) return
    return renderFormulaBarOnRowSelected && renderFormulaBarOnRowSelected({rowIds})
  }, [areAllColumnsSelected, renderFormulaBarOnRowSelected])

  return (
    <Box
      sx={{
        gap: t.vars.spacing,
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        px: 1,
        py: 0,
        minHeight: 40,
        // borderTop: '1px solid',
        borderColor: t.vars.palette.divider,
        background: t.vars.palette.background.paper,
        justifyContent: 'flex-end',
      }}
    >
      {renderColumnSelected}
      {renderRowSelected}
      {selectedCount > 0 && (
        <>
          <BtnCopyCells />
          <Btn size="small" variant="outlined" onClick={reset} color="primary" sx={{minWidth: 0}}>
            <Icon>clear</Icon>
          </Btn>
        </>
      )}
      <Counter
        columnsCount={selectedColumnIds?.size || columns.length}
        rowsCount={selectedRowIds?.size || dataFilteredAndSorted.length}
      />
    </Box>
  )
}

function Counter({columnsCount, rowsCount}: {columnsCount: number; rowsCount: number}) {
  const {formatLargeNumber} = useConfig()
  const total = columnsCount * rowsCount
  return (
    <Txt color="disabled" fontWeight="400" sx={{display: 'flex', alignItems: 'center'}}>
      <Icon fontSize="inherit">view_column</Icon>
      {formatLargeNumber(columnsCount)}
      <Box sx={{mx: 0.5}}>×</Box>
      <Icon fontSize="inherit">table_rows</Icon>
      {formatLargeNumber(rowsCount)}
      <Box sx={{mx: 0.5}}>=</Box>
      <Txt bold color={total > cellSelectionDangerThreshold ? 'error' : undefined}>
        {formatLargeNumber(total)}
      </Txt>
    </Txt>
  )
}
