import React, {Dispatch, useCallback, useEffect, useMemo} from 'react'
import {KeyOf} from '@axanc/ts-utils'
import {UseCellSelection} from './useCellSelectionEngine'
import {Column, Props, Row} from './types.js'
import {DatatableContext} from './DatatableContext'
import {CellSelectionCoord} from './reducer'

export type UseCellSelectionComputed = ReturnType<typeof useCellSelectionComputed>

export const useCellSelectionComputed = <T extends Row>({
  dispatch,
  filteredAndSortedData,
  engine,
  visibleColumns,
  columnsIndex,
  getRowKey,
  selectionStart,
  selectionEnd,
}: {
  dispatch: DatatableContext['dispatch']
  selectionStart: CellSelectionCoord | null
  selectionEnd: CellSelectionCoord | null
  getRowKey: Props<T>['getRowKey']
  columnsIndex: Record<KeyOf<T>, Column.InnerProps<any>>
  visibleColumns: Column.InnerProps<T>[]
  engine: UseCellSelection
  filteredAndSortedData: T[]
}) => {
  const {state, isRowSelected, isColumnSelected} = engine

  const selectedRowIds = useMemo(() => {
    const ids = new Set<string>()
    filteredAndSortedData.forEach((_, index) => {
      if (isRowSelected(index)) ids.add(getRowKey(_))
    })
    return ids
  }, [filteredAndSortedData, isRowSelected])

  const selectedColumnsIds = useMemo(() => {
    const ids = new Set<string>()
    visibleColumns.forEach((_, index) => {
      if (isColumnSelected(index)) ids.add(_.id)
    })
    return ids
  }, [visibleColumns, isColumnSelected])

  const selectedColumnUniq = useMemo(() => {
    if (selectedColumnsIds.size === 1) {
      const colId = [...selectedColumnsIds][0]
      return columnsIndex[colId]
    }
  }, [selectedColumnsIds, columnsIndex])

  useEffect(
    function selectFullRowOnIndexSelected() {
      const isIndexSelected = selectedColumnsIds.has('index')
      if (isIndexSelected) {
        dispatch({type: 'CELL_SELECTION_SET_END', coord: {col: 0}})
        dispatch({type: 'CELL_SELECTION_SET_START', coord: {col: visibleColumns.length}})
      }
    },
    [selectedColumnsIds],
  )

  const selectColumn = useCallback(
    (columnIndex: number, event: React.MouseEvent<HTMLDivElement>) => {
      dispatch({type: 'CELL_SELECTION_SET_START', coord: {row: 0, col: columnIndex}})
      dispatch({type: 'CELL_SELECTION_SET_END', coord: {row: filteredAndSortedData.length - 1, col: columnIndex}})
      engine.anchorEl = event.target as any
    },
    [filteredAndSortedData],
  )

  const areAllColumnsSelected = useMemo(() => {
    return selectedColumnsIds.size === visibleColumns.length
  }, [selectedColumnsIds, visibleColumns.length])

  const selectedCount = useMemo(() => {
    if (!state.selectionStart || !state.selectionEnd) return 0
    return selectedColumnsIds.size * selectedRowIds.size
  }, [selectedColumnsIds, selectedRowIds])

  return {
    selectedCount,
    areAllColumnsSelected,
    selectedRowIds,
    selectedColumnsIds,
    selectedColumnUniq,
    selectColumn,
  }
}
