import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {DatatableContext} from './DatatableContext'
import {CellSelectionCoord} from './reducer'
import {CellSelectionMode} from './types'

export type UseCellSelection = ReturnType<typeof useCellSelectionEngine>

const voidFn = () => void 0

export const useCellSelectionEngine = ({
  tableRef,
  disabled,
  dispatch,
  selectionStart,
  selectionEnd,
  mode,
}: {
  mode?: CellSelectionMode
  selectionStart: CellSelectionCoord | null
  selectionEnd: CellSelectionCoord | null
  dispatch: DatatableContext['dispatch']
  disabled?: boolean
  tableRef: React.MutableRefObject<HTMLDivElement>
}) => {
  const selecting = useRef<boolean>(false)
  const scrollInterval = useRef<NodeJS.Timeout | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const anchor = useRef<{row: number; col: number} | null>(null) // last clicked cell for shift

  const selectionBoundary = useMemo(() => {
    if (!selectionStart || !selectionEnd) {
      return {rowMin: -1, rowMax: -1, colMin: -1, colMax: -1}
    } else {
      return {
        rowMin: Math.min(selectionStart.row, selectionEnd.row),
        rowMax: Math.max(selectionStart.row, selectionEnd.row),
        colMin: Math.min(selectionStart.col, selectionEnd.col),
        colMax: Math.max(selectionStart.col, selectionEnd.col),
      }
    }
  }, [selectionStart, selectionEnd])

  const isRowSelected = useCallback(
    (rowIndex: number) => {
      return rowIndex >= selectionBoundary.rowMin && rowIndex <= selectionBoundary.rowMax
    },
    [selectionStart?.row, selectionEnd?.row],
  )

  const isColumnSelected_unstable = (colIndex: number) => {
    return colIndex >= selectionBoundary.colMin && colIndex <= selectionBoundary.colMax
  }

  const isSelected = useCallback(
    (rowIndex: number, colIndex: number) => {
      return isRowSelected(rowIndex) && isColumnSelected_unstable(colIndex)
    },
    [isRowSelected, isColumnSelected_unstable],
  )

  const reset = useCallback(() => {
    dispatch({type: 'CELL_SELECTION_CLEAR'})
    setAnchorEl(null)
    anchor.current = null
  }, [])

  const handleMouseDown = useCallback((rowIndex: number, colIndex: number, event: React.MouseEvent<HTMLElement>) => {
    if (mode === 'row' && colIndex !== 0) return
    const preventReSelectionToDnDrop = colIndex === 0 && isRowSelected(rowIndex)
    if (preventReSelectionToDnDrop) return
    const isShift = event.shiftKey
    console.log('handleMouseDown', rowIndex, colIndex)
    setAnchorEl(null)
    if (isShift && anchor.current) {
      // Shift+click: select rect from anchor to current cell
      dispatch({type: 'CELL_SELECTION_SET_START', coord: anchor.current})
      dispatch({type: 'CELL_SELECTION_SET_END', coord: {row: rowIndex, col: colIndex}})
    } else {
      // Normal click: start new selection
      selecting.current = true
      dispatch({type: 'CELL_SELECTION_SET_START', coord: {row: rowIndex, col: colIndex}})
      dispatch({type: 'CELL_SELECTION_SET_END', coord: {row: rowIndex, col: colIndex}})
      anchor.current = {row: rowIndex, col: colIndex}
    }
  }, [])

  const handleMouseEnter = useCallback((rowIndex: number, colIndex: number) => {
    if (!selecting.current) return
    dispatch({type: 'CELL_SELECTION_SET_END', coord: {row: rowIndex, col: colIndex}})
  }, [])

  const handleMouseUp = useCallback((event: React.MouseEvent<HTMLElement>) => {
    selecting.current = false
    setAnchorEl(event.target as any)
  }, [])

  const handleMouseMove = (e: MouseEvent) => {
    if (!selecting.current || !tableRef.current) return

    const rect = tableRef.current.getBoundingClientRect()
    const margin = 10 // distance from edge to trigger scroll
    const scrollSpeed = 15 // pixels per interval
    const scrollIntervalMs = 5
    // Clear any previous scroll interval to avoid stacking
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current)
      scrollInterval.current = null
    }
    // Vertical auto-scroll
    if (e.clientY < rect.top + margin) {
      scrollInterval.current = setInterval(() => {
        if (tableRef.current!.scrollTop > 0) {
          tableRef.current!.scrollTop = Math.max(0, tableRef.current!.scrollTop - scrollSpeed)
        }
      }, scrollIntervalMs)
    } else if (e.clientY > rect.bottom - margin) {
      scrollInterval.current = setInterval(() => {
        const maxScrollTop = tableRef.current!.scrollHeight - tableRef.current!.clientHeight
        if (tableRef.current!.scrollTop < maxScrollTop) {
          tableRef.current!.scrollTop = Math.min(maxScrollTop, tableRef.current!.scrollTop + scrollSpeed)
        }
      }, scrollIntervalMs)
    }
    // Horizontal auto-scroll
    else if (e.clientX < rect.left + margin) {
      scrollInterval.current = setInterval(() => {
        if (tableRef.current!.scrollLeft > 0) {
          tableRef.current!.scrollLeft = Math.max(0, tableRef.current!.scrollLeft - scrollSpeed)
        }
      }, scrollIntervalMs)
    } else if (e.clientX > rect.right - margin) {
      scrollInterval.current = setInterval(() => {
        const maxScrollLeft = tableRef.current!.scrollWidth - tableRef.current!.clientWidth
        if (tableRef.current!.scrollLeft < maxScrollLeft) {
          tableRef.current!.scrollLeft = Math.min(maxScrollLeft, tableRef.current!.scrollLeft + scrollSpeed)
        }
      }, scrollIntervalMs)
    }
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current)
        scrollInterval.current = null
      }
    })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', () => {
        if (scrollInterval.current) {
          clearInterval(scrollInterval.current)
          scrollInterval.current = null
        }
      })
      if (scrollInterval.current) clearInterval(scrollInterval.current)
    }
  }, [])

  return {
    reset,
    state: {
      selectionBoundary,
      selecting: selecting.current,
      selectionStart,
      selectionEnd,
    },
    isSelected,
    isRowSelected,
    isColumnSelected: isColumnSelected_unstable,
    anchorEl,
    setAnchorEl,
    handleMouseDown: disabled ? voidFn : handleMouseDown,
    handleMouseEnter: disabled ? voidFn : handleMouseEnter,
    handleMouseUp: disabled ? voidFn : handleMouseUp,
    handleMouseMove: disabled ? voidFn : handleMouseMove,
  }
}
