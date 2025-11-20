import React, {useCallback, useEffect, useMemo, useRef} from 'react'
import {DatatableContext} from './DatatableContext'
import {CellSelectionMode, Column, GetRowKey, Props, Row, RowId} from './types'
import {columnIndexId} from './useColumns'
import {State} from './reducer'

export type UseCellSelection = ReturnType<typeof useCellSelection>

const voidFn = () => void 0

export const useCellSelection = <T extends Row = any>({
  mode,
  tableRef,
  disabled,
  dispatch,
  selectedColumnIds,
  selectedRowIds,
  getRowKey,
  visibleColumns,
  filteredAndSortedData,
}: {
  mode?: CellSelectionMode
  tableRef: React.MutableRefObject<HTMLDivElement>
  disabled?: boolean
  dispatch: DatatableContext['dispatch']
  selectedColumnIds: Set<string> | null
  selectedRowIds: Set<RowId> | null
  visibleColumns: Column.InnerProps<T>[]
  filteredAndSortedData: T[]
  getRowKey: GetRowKey
}) => {
  const selecting = useRef<boolean>(false)
  const scrollInterval = useRef<NodeJS.Timeout | null>(null)
  const anchor = useRef<{row: number; col: number} | null>(null) // last clicked cell for shift

  const reset = useCallback(() => {
    dispatch({type: 'CELL_SELECTION_CLEAR'})
    anchor.current = null
  }, [])

  const setCellsSelection = ({startRow, startCol, endRow, endCol}: {startRow: number, startCol: number, endRow: number, endCol: number}) => {
    const rowMin = Math.min(startRow, endRow)
    const rowMax = Math.max(startRow, endRow)
    const colMin = Math.min(startCol, endCol)
    const colMax = Math.max(startCol, endCol)
    const rowIds: RowId[] = []
    const colIds: string[] = []
    for (let i = rowMin; i <= rowMax; i++) {
      rowIds.push(getRowKey(filteredAndSortedData[i]))
    }
    for (let i = colMin; i <= colMax; i++) {
      colIds.push(visibleColumns[i].id)
    }
    // Shift+click: select rect from anchor to current cell
    dispatch({type: 'CELL_SELECTION_SET_ROW_IDS', rowIds})
    dispatch({type: 'CELL_SELECTION_SET_COLUMN_IDS', colIds})
  }

  const selectedRowIdsRef = useRef<State<any>['selectedRowIds']>(null)
  const selectedColumnIdsRef = useRef<State<any>['selectedColumnIds']>(null)

  useEffect(() => {
    selectedRowIdsRef.current = selectedRowIds
  }, [selectedRowIds])

  useEffect(() => {
    selectedColumnIdsRef.current = selectedColumnIds
  }, [selectedColumnIds])

  const handleMouseDown = useCallback(
    (rowIndex: number, colIndex: number, rowId: RowId, event: React.MouseEvent<HTMLElement>) => {
      if (mode === 'row' && colIndex !== 0) return
      const preventReSelectionToAllowDnDrop = colIndex === 0
        && selectedColumnIdsRef.current?.has(columnIndexId)
        && selectedRowIdsRef.current?.has(rowId)
      if (preventReSelectionToAllowDnDrop) return
      const isShift = event.shiftKey
      if (isShift && anchor.current) {
        setCellsSelection({
          startRow: anchor.current.row,
          startCol: anchor.current.col,
          endRow: rowIndex,
          endCol: colIndex,
        })
      } else {
        // Normal click: start new selection
        selecting.current = true
        anchor.current = {row: rowIndex, col: colIndex}
        setCellsSelection({
          startRow: rowIndex,
          startCol: colIndex,
          endRow: rowIndex,
          endCol: colIndex,
        })
      }
    },
    [dispatch, mode],
  )

  const handleMouseEnter = useCallback(
    (rowIndex: number, colIndex: number) => {
      if (!selecting.current || !anchor.current) return
      setCellsSelection({
        startRow: anchor.current.row,
        startCol: anchor.current.col,
        endRow: rowIndex,
        endCol: colIndex,
      })
    },
    [dispatch],
  )

  const handleMouseUp = useCallback((event: React.MouseEvent<HTMLElement>) => {
    selecting.current = false
  }, [])

  useEffect(() => {
    // optimized scroll logic with named handlers
    const margin = 10
    const scrollSpeed = 15
    const scrollIntervalMs = 16
    const scrollDirRef = {v: 0, h: 0} // local within effect
    const onMouseMove = (e: MouseEvent) => {
      if (!selecting.current || !tableRef.current) return
      const rect = tableRef.current.getBoundingClientRect()
      const newV = e.clientY < rect.top + margin ? -1 : e.clientY > rect.bottom - margin ? 1 : 0
      const newH = e.clientX < rect.left + margin ? -1 : e.clientX > rect.right - margin ? 1 : 0

      // if direction changed, restart interval
      if (newV !== scrollDirRef.v || newH !== scrollDirRef.h) {
        scrollDirRef.v = newV
        scrollDirRef.h = newH
        if (scrollInterval.current) {
          clearInterval(scrollInterval.current)
          scrollInterval.current = null
        }
        if (newV !== 0 || newH !== 0) {
          scrollInterval.current = setInterval(() => {
            if (!tableRef.current) return
            if (scrollDirRef.v === -1)
              tableRef.current.scrollTop = Math.max(0, tableRef.current.scrollTop - scrollSpeed)
            if (scrollDirRef.v === 1)
              tableRef.current.scrollTop = Math.min(
                tableRef.current.scrollHeight - tableRef.current.clientHeight,
                tableRef.current.scrollTop + scrollSpeed,
              )
            if (scrollDirRef.h === -1)
              tableRef.current.scrollLeft = Math.max(0, tableRef.current.scrollLeft - scrollSpeed)
            if (scrollDirRef.h === 1)
              tableRef.current.scrollLeft = Math.min(
                tableRef.current.scrollWidth - tableRef.current.clientWidth,
                tableRef.current.scrollLeft + scrollSpeed,
              )
          }, scrollIntervalMs)
        }
      }
    }

    const onMouseUp = () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current)
        scrollInterval.current = null
      }
      selecting.current = false
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      if (scrollInterval.current) clearInterval(scrollInterval.current)
    }
  }, [tableRef])

  const areAllColumnsSelected = useMemo(() => {
    return selectedColumnIds?.size === visibleColumns.length
  }, [selectedColumnIds, visibleColumns.length])

  const selectedCount = useMemo(() => {
    if (!selectedColumnIds || !selectedRowIds) return 0
    return selectedColumnIds.size * selectedRowIds.size
  }, [selectedColumnIds, selectedRowIds])

  useEffect(
    function selectFullRowOnIndexSelected() {
      if (!selectedColumnIds) return
      if (selectedColumnIds.has(columnIndexId) && selectedColumnIds.size !== visibleColumns.length) {
        dispatch({type: 'CELL_SELECTION_SET_COLUMN_IDS', colIds: visibleColumns.map(_ => _.id)})
      }
    },
    [selectedColumnIds],
  )

  const selectColumn = useCallback(
    (columnIndex: number, event: React.MouseEvent<HTMLDivElement>) => {
      dispatch({type: 'CELL_SELECTION_SET_ROW_IDS', rowIds: filteredAndSortedData.map(getRowKey)})
      dispatch({type: 'CELL_SELECTION_SET_COLUMN_IDS', colIds: [visibleColumns[columnIndex].id]})
    },
    [filteredAndSortedData],
  )

  return {
    reset,
    selecting: selecting,
    areAllColumnsSelected,
    selectedCount,
    selectColumn,
    selectedRowIdsRef,
    handleMouseDown: disabled ? voidFn : handleMouseDown,
    handleMouseEnter: disabled ? voidFn : handleMouseEnter,
    handleMouseUp: disabled ? voidFn : handleMouseUp,
  }
}
