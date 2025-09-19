import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'

export type UseCellSelection = ReturnType<typeof useCellSelectionEngine>

const voidFn = () => void 0

export const useCellSelectionEngine = ({
  tableRef,
  disabled,
}: {
  disabled?: boolean
  tableRef: React.MutableRefObject<HTMLDivElement>
}) => {
  const selecting = useRef<boolean>(false)
  const scrollInterval = useRef<NodeJS.Timeout | null>(null)
  const [selectionStart, setSelectionStart] = useState<{row: number; col: number} | null>(null)
  const [selectionEnd, setSelectionEnd] = useState<{row: number; col: number} | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const anchor = useRef<{row: number; col: number} | null>(null) // last clicked cell for shift

  const reset = useCallback(() => {
    setSelectionStart(null)
    setSelectionEnd(null)
    setAnchorEl(null)
    selecting.current = false
    anchor.current = null
  }, [])

  const handleMouseDown = useCallback((rowIndex: number, colIndex: number, event: React.MouseEvent<HTMLElement>) => {
    const isShift = event.shiftKey
    setAnchorEl(null)
    if (isShift && anchor.current) {
      // Shift+click: select rect from anchor to current cell
      setSelectionStart(anchor.current)
      setSelectionEnd({row: rowIndex, col: colIndex})
    } else {
      // Normal click: start new selection
      selecting.current = true
      setSelectionStart({row: rowIndex, col: colIndex})
      setSelectionEnd({row: rowIndex, col: colIndex})
      anchor.current = {row: rowIndex, col: colIndex}
    }
  }, [])

  const handleMouseEnter = useCallback(
    (rowIndex: number, colIndex: number) => {
      if (!selecting.current) return
      if (selectionStart) {
        setSelectionEnd({row: rowIndex, col: colIndex})
      }
    },
    [selectionStart],
  )

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

  const {rowMin, rowMax, colMin, colMax} = useMemo(() => {
    if (!selectionStart || !selectionEnd) return {rowMin: -1, rowMax: -1, colMin: -1, colMax: -1}
    const rowMin = Math.min(selectionStart.row, selectionEnd.row)
    const rowMax = Math.max(selectionStart.row, selectionEnd.row)
    const colMin = Math.min(selectionStart.col, selectionEnd.col)
    const colMax = Math.max(selectionStart.col, selectionEnd.col)
    return {rowMin, rowMax, colMin, colMax}
  }, [selectionStart, selectionEnd])

  const isRowSelected = useCallback((rowIndex: number) => rowIndex >= rowMin && rowIndex <= rowMax, [rowMin, rowMax])
  const isColumnSelected = useCallback((colIndex: number) => colIndex >= colMin && colIndex <= colMax, [colMin, colMax])
  const isSelected = useCallback(
    (rowIndex: number, colIndex: number) => isRowSelected(rowIndex) && isColumnSelected(colIndex),
    [rowMin, rowMax, colMin, colMax],
  )

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
      selectionStart,
      selectionEnd,
      setSelectionStart: disabled ? voidFn : setSelectionStart,
      setSelectionEnd: disabled ? voidFn : setSelectionEnd,
    },
    isSelected,
    isRowSelected,
    isColumnSelected,
    anchorEl,
    setAnchorEl,
    handleMouseDown: disabled ? voidFn : handleMouseDown,
    handleMouseEnter: disabled ? voidFn : handleMouseEnter,
    handleMouseUp: disabled ? voidFn : handleMouseUp,
    handleMouseMove: disabled ? voidFn : handleMouseMove,
  }
}
