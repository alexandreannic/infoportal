import {useCtx} from './core/DatatableContext'
import {useConfig} from './DatatableConfig'
import React, {useMemo} from 'react'
import {Box, Icon, useTheme} from '@mui/material'
import {Btn, Txt} from '@infoportal/client-core'
import {BtnCopyCells, cellSelectionDangerThreshold} from './popup/PopupSelectedCell'

export const DatatableFormularBar = () => {
  const {engine, selectedCount, areAllColumnsSelected, selectedColumnsIds, selectedRowIds, selectedColumnUniq} = useCtx(
    _ => _.cellSelection,
  )
  const renderComponentOnRowSelected = useCtx(_ => _.module?.cellSelection?.renderComponentOnRowSelected)
  const dataFilteredAndSorted = useCtx(_ => _.dataFilteredAndSorted)
  const columns = useCtx(_ => _.columns.visible)

  const commonSelectedValue = useMemo(() => {
    if (!selectedColumnUniq) return
    let lastValue
    for (let i = engine.state.selectionBoundary.rowMin; i < engine.state.selectionBoundary.rowMax + 1; i++) {
      const row = dataFilteredAndSorted[i]
      const value = selectedColumnUniq?.render(row).value
      if (lastValue && value !== lastValue) {
        lastValue = undefined
        break
      }
      lastValue = value
    }
    return lastValue
  }, [engine.state.selectionBoundary])

  const rowIds = useMemo(() => [...selectedRowIds], [selectedRowIds])

  const t = useTheme()

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
      {/*{selectedColumnUniq && (*/}
      {/*  <Txt block size="big" bold>*/}
      {/*    {selectedColumnUniq.head}*/}
      {/*  </Txt>*/}
      {/*)}*/}

      {selectedColumnUniq &&
        selectedColumnUniq.actionOnSelected &&
        selectedColumnUniq?.actionOnSelected !== 'none' &&
        React.cloneElement(selectedColumnUniq.actionOnSelected?.({rowIds, value: commonSelectedValue}), {key: rowIds.join(',')})}
      {areAllColumnsSelected && renderComponentOnRowSelected && renderComponentOnRowSelected({rowIds})}

      {selectedCount > 0 && (
        <>
          <BtnCopyCells />
          <Btn size="small" variant="outlined" onClick={engine.reset} color="primary" sx={{minWidth: 0}}>
            <Icon>clear</Icon>
          </Btn>
        </>
      )}
      <Counter
        columnsCount={selectedColumnsIds.size || columns.length}
        rowsCount={selectedRowIds.size || dataFilteredAndSorted.length}
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
