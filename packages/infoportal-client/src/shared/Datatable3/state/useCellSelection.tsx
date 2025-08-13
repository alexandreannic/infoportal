import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {Popover} from '@mui/material'

export const useCellSelection = (parentRef: React.MutableRefObject<any>) => {
  const selecting = useRef<boolean>(false)
  const scrollInterval = useRef<NodeJS.Timeout | null>(null)
  const [selectionStart, setSelectionStart] = useState<{row: number; col: number} | null>(null)
  const [selectionEnd, setSelectionEnd] = useState<{row: number; col: number} | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const anchor = useRef<{row: number; col: number} | null>(null) // last clicked cell for shift

  const reset = () => {
    setSelectionStart(null)
    setSelectionEnd(null)
    setAnchorEl(null)
    selecting.current = false
    anchor.current = null
  }

  const handleMouseDown = useCallback((rowIndex: number, colIndex: number, event: React.MouseEvent<HTMLElement>) => {
    const isShift = event.shiftKey

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
    if (!selecting.current || !parentRef.current) return

    const rect = parentRef.current.getBoundingClientRect()
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
        if (parentRef.current!.scrollTop > 0) {
          parentRef.current!.scrollTop = Math.max(0, parentRef.current!.scrollTop - scrollSpeed)
        }
      }, scrollIntervalMs)
    } else if (e.clientY > rect.bottom - margin) {
      scrollInterval.current = setInterval(() => {
        const maxScrollTop = parentRef.current!.scrollHeight - parentRef.current!.clientHeight
        if (parentRef.current!.scrollTop < maxScrollTop) {
          parentRef.current!.scrollTop = Math.min(maxScrollTop, parentRef.current!.scrollTop + scrollSpeed)
        }
      }, scrollIntervalMs)
    }
    // Horizontal auto-scroll
    else if (e.clientX < rect.left + margin) {
      scrollInterval.current = setInterval(() => {
        if (parentRef.current!.scrollLeft > 0) {
          parentRef.current!.scrollLeft = Math.max(0, parentRef.current!.scrollLeft - scrollSpeed)
        }
      }, scrollIntervalMs)
    } else if (e.clientX > rect.right - margin) {
      scrollInterval.current = setInterval(() => {
        const maxScrollLeft = parentRef.current!.scrollWidth - parentRef.current!.clientWidth
        if (parentRef.current!.scrollLeft < maxScrollLeft) {
          parentRef.current!.scrollLeft = Math.min(maxScrollLeft, parentRef.current!.scrollLeft + scrollSpeed)
        }
      }, scrollIntervalMs)
    }
  }

  const isSelected = (rowIndex: number, colIndex: number) => {
    if (!selectionStart || !selectionEnd) return false
    const rowMin = Math.min(selectionStart.row, selectionEnd.row)
    const rowMax = Math.max(selectionStart.row, selectionEnd.row)
    const colMin = Math.min(selectionStart.col, selectionEnd.col)
    const colMax = Math.max(selectionStart.col, selectionEnd.col)
    return rowIndex >= rowMin && rowIndex <= rowMax && colIndex >= colMin && colIndex <= colMax
  }

  const selectedCount = useMemo(() => {
    if (!selectionStart || !selectionEnd) return 0
    return (Math.abs(selectionStart.col - selectionEnd.col) + 1) * (Math.abs(selectionStart.row - selectionEnd.row) + 1)
  }, [selectionStart, selectionEnd])

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
    selectedCount,
    reset,
    anchorEl,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    isSelected,
    handleMouseMove,
  }
}

export const SelectedCellPopover = ({
  reset,
  selectedCount,
  anchorEl,
}: Pick<ReturnType<typeof useCellSelection>, 'selectedCount' | 'reset' | 'anchorEl'>) => {
  return (
    <Popover
      onClose={reset}
      open={!!anchorEl && selectedCount > 0}
      anchorEl={anchorEl}
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
      <div style={{padding: 10}}>Selection {selectedCount}</div>
    </Popover>
  )
}
