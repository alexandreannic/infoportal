import {Datatable} from '@/shared/Datatable3/state/types.js'
import {UseCellSelection, useCellSelectionEngine} from '@/shared/Datatable3/state/useCellSelectionEngine.js'
import React, {useCallback, useEffect, useMemo} from 'react'
import {KeyOf} from '@axanc/ts-utils'
import {Popover} from '@mui/material'
import {DatatableContext} from '@/shared/Datatable3/state/DatatableContext.js'
import {IpBtn, IpIconBtn, Txt} from '@/shared/index.js'

export type UseCellSelectionComputed = ReturnType<typeof useCellSelectionComputed>

export const useCellSelectionComputed = <T extends Datatable.Row>({
  filteredAndSortedData,
  cellSelectionEngine,
  visibleColumns,
  columnsIndex,
}: {
  columnsIndex: Record<KeyOf<T>, Datatable.Column.InnerProps<any>>
  visibleColumns: Datatable.Column.InnerProps<T>[]
  cellSelectionEngine: UseCellSelection
  filteredAndSortedData: T[]
}) => {
  const {state, isRowSelected, isSelected, isColumnSelected} = cellSelectionEngine

  const selectedRowIds = useMemo(() => {
    const selectedRowIds = new Set()
    filteredAndSortedData.forEach((_, index) => {
      if (isRowSelected(index)) selectedRowIds.add(_)
    })
    return selectedRowIds
  }, [filteredAndSortedData, isRowSelected])

  const selectedColumnsIds = useMemo(() => {
    const selectedColumns = new Set<string>()
    visibleColumns.forEach((_, index) => {
      if (isColumnSelected(index)) selectedColumns.add(_.id)
    })
    return selectedColumns
  }, [visibleColumns, isColumnSelected])

  const selectedColumnUniq = useMemo(() => {
    if (selectedColumnsIds.size === 1) {
      const colId = [...selectedColumnsIds][0]
      return columnsIndex[colId]
    }
  }, [selectedColumnsIds])

  useEffect(
    function selectFullRowOnIndexSelected() {
      if (selectedColumnsIds.has('index')) {
        state.setSelectionStart(_ => _ && {..._, col: 0})
        state.setSelectionStart(_ => _ && {..._, col: visibleColumns.length})
      }
    },
    [selectedColumnsIds],
  )

  const selectColumn = useCallback((columnIndex: number) => {
    state.setSelectionStart({row: 0, col: columnIndex})
    state.setSelectionEnd({row: filteredAndSortedData.length, col: columnIndex})
  }, [])

  const areAllColumnsSelected = useMemo(() => {
    return selectedColumnsIds.size === visibleColumns.length
  }, [selectedColumnsIds])

  const selectedCount = useMemo(() => {
    if (!state.selectionStart || !state.selectionEnd) return 0
    return (
      (Math.abs(state.selectionStart.col - state.selectionEnd.col) + 1) *
      (Math.abs(state.selectionStart.row - state.selectionEnd.row) + 1)
    )
  }, [isSelected])

  return {
    selectedCount,
    areAllColumnsSelected,
    selectedRowIds,
    selectedColumnsIds,
    selectedColumnUniq,
    selectColumn,
  }
}

export const SelectedCellPopover = (props: DatatableContext['cellSelection']) => {
  return (
    <Popover
      onClose={props.engine.reset}
      open={!!props.engine.anchorEl && props.selectedCount > 0}
      anchorEl={props.engine.anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      slotProps={{
        root: {
          disableEnforceFocus: true,
          disableAutoFocus: true,
          disableRestoreFocus: true,
          keepMounted: true,
          sx: {
            pointerEvents: 'none', // prevent root modal layer from intercepting
          },
        },
        paper: {
          sx: {
            pointerEvents: 'auto', // allow interactions inside popover
            px: 1,
            py: 0.5,
          },
        },
        backdrop: {
          sx: {
            display: 'none',
          },
        },
      }}
    >
      <div style={{padding: 10}}>
        <IpBtn variant="outlined" icon="clear" onClick={props.engine.reset} color="primary">
          {props.selectedCount}
        </IpBtn>
        <Txt block color="hint"></Txt>
        {props.selectedColumnUniq && props.selectedColumnUniq.subHeader}
        {props.areAllColumnsSelected && 'DELETE'}
      </div>
    </Popover>
  )
}
