import {UseCellSelection} from '@/core/useCellSelectionEngine'
import React, {useCallback, useEffect, useMemo} from 'react'
import {KeyOf} from '@axanc/ts-utils'
import {Column, Row} from '@/core/types'

export type UseCellSelectionComputed = ReturnType<typeof useCellSelectionComputed>

export const useCellSelectionComputed = <T extends Row>({
  filteredAndSortedData,
  cellSelectionEngine,
  visibleColumns,
  columnsIndex,
}: {
  columnsIndex: Record<KeyOf<T>, Column.InnerProps<any>>
  visibleColumns: Column.InnerProps<T>[]
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

  const selectColumn = useCallback((columnIndex: number, event: React.MouseEvent<HTMLDivElement>) => {
    state.setSelectionStart({row: 0, col: columnIndex})
    cellSelectionEngine.setAnchorEl(event.target as any)
    state.setSelectionEnd({row: filteredAndSortedData.length - 1, col: columnIndex})
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
