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
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
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
    [selectionBoundary.rowMin, selectionBoundary.rowMax],
  )

  const isRowSelectedRef = useRef(isRowSelected)
  useEffect(() => {
    isRowSelectedRef.current = isRowSelected
  }, [isRowSelected])

  const isColumnSelected = useCallback(
    (colIndex: number) => {
      return colIndex >= selectionBoundary.colMin && colIndex <= selectionBoundary.colMax
    },
    [selectionBoundary.colMin, selectionBoundary.colMax],
  )

  const isSelected = useCallback(
    (rowIndex: number, colIndex: number) => {
      return isRowSelected(rowIndex) && isColumnSelected(colIndex)
    },
    [isRowSelected, isColumnSelected],
  )

  const reset = useCallback(() => {
    dispatch({type: 'CELL_SELECTION_CLEAR'})
    setAnchorEl(null)
    anchor.current = null
  }, [])

  const handleMouseDown = useCallback(
    (rowIndex: number, colIndex: number, event: React.MouseEvent<HTMLElement>) => {
      if (mode === 'row' && colIndex !== 0) return
      const preventReSelectionToDnDrop = colIndex === 0 && isRowSelectedRef.current(rowIndex)
      if (preventReSelectionToDnDrop) return
      const isShift = event.shiftKey
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
    },
    [dispatch, mode],
  )

  const handleMouseEnter = useCallback(
    (rowIndex: number, colIndex: number) => {
      if (!selecting.current) return
      dispatch({type: 'CELL_SELECTION_SET_END', coord: {row: rowIndex, col: colIndex}})
    },
    [dispatch],
  )

  const handleMouseUp = useCallback((event: React.MouseEvent<HTMLElement>) => {
    selecting.current = false
    setAnchorEl(event.target as any)
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

  return {
    reset,
    state: {
      selectionBoundary,
      selecting: selecting,
      selectionStart,
      selectionEnd,
    },
    anchorEl,
    isSelected,
    isRowSelected,
    isRowSelectedRef,
    isColumnSelected: isColumnSelected,
    handleMouseDown: disabled ? voidFn : handleMouseDown,
    handleMouseEnter: disabled ? voidFn : handleMouseEnter,
    handleMouseUp: disabled ? voidFn : handleMouseUp,
    // handleMouseMove: disabled ? voidFn : handleMouseMove,
  }
}
