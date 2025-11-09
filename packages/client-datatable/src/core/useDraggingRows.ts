import React, {RefObject, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {DatatableContext} from './DatatableContext'
import {MinMax} from './reducer'
import {Theme, useTheme} from '@mui/material'
import {alphaVar} from '@infoportal/client-core'

export type UseDraggingRows = ReturnType<typeof useDraggingRows>

export const useDraggingRows = ({
  isRowSelectedRef,
  isRowSelected,
  rowHeight,
  dispatch,
  draggingRange,
  overIndex,
  disabled,
  selectionBoundary,
}: {
  disabled?: boolean
  dispatch: DatatableContext['dispatch']
  rowHeight: number
  isRowSelectedRef: RefObject<(rowIndex: number) => boolean>
  isRowSelected: (rowIndex: number) => boolean
  draggingRange: MinMax | null
  overIndex: number | null
  selectionBoundary: {
    rowMin: number
    rowMax: number
    colMin: number
    colMax: number
  }
}) => {
  const t = useTheme()
  // Refs to always have latest state
  const draggingRangeRef = useRef(draggingRange)
  const overIndexRef = useRef(overIndex)
  const selectionBoundaryRef = useRef(selectionBoundary)

  useEffect(() => {
    draggingRangeRef.current = draggingRange
  }, [draggingRange])
  useEffect(() => {
    overIndexRef.current = overIndex
  }, [overIndex])
  useEffect(() => {
    selectionBoundaryRef.current = selectionBoundary
  }, [selectionBoundary])

  const setDraggingRange = useCallback(
    (range: MinMax | null) => {
      dispatch({type: 'DRAGGING_ROWS_SET_RANGE', range})
    },
    [dispatch],
  )

  const setOverIndex = useCallback(
    (index: number | null) => {
      dispatch({type: 'DRAGGING_ROWS_SET_OVER_INDEX', overIndex: index})
    },
    [dispatch],
  )

  const isRowDraggable = useCallback(
    (rowIndex: number) => {
      if (disabled) return false
      return isRowSelected(rowIndex)
    },
    [isRowSelected],
  )

  const handleDragStart = useCallback(
    (rowIndex: number, e: React.DragEvent) => {
      const min = selectionBoundaryRef.current.rowMin
      const max = selectionBoundaryRef.current.rowMax
      if (isRowSelectedRef.current(rowIndex)) {
        setDraggingRange({min, max})
      }

      const dragHeight = rowHeight * (max - min)
      const ghost = createDragGhostEl(t, dragHeight, max - min + 1)
      document.body.appendChild(ghost)
      e.dataTransfer?.setDragImage(ghost, 0, 0)
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.dropEffect = 'move'
      setTimeout(() => document.body.removeChild(ghost), 0)
    },
    [rowHeight, setDraggingRange],
  )

  const handleDragOver = useCallback(
    (rowIndex: number, e: React.DragEvent) => {
      e.preventDefault() // required to allow drop
      setOverIndex(rowIndex)
    },
    [setOverIndex],
  )

  const handleDrop = useCallback(() => {
    const range = draggingRangeRef.current
    const over = overIndexRef.current
    if (!range || over == null) return
    dispatch({type: 'REORDER_ROWS', range, index: over})
    setDraggingRange(null)
    setOverIndex(null)
  }, [dispatch, setDraggingRange, setOverIndex])

  const isRowDragging = useCallback((rowIndex: number) => {
    const range = draggingRangeRef.current
    if (!range) return false
    return rowIndex >= range.min && rowIndex <= range.max
  }, [])

  const dropIndicatorIndex = useMemo(() => {
    if (!draggingRange || overIndex == null) return null
    if (overIndex < draggingRange.min) return overIndex
    if (overIndex > draggingRange.max) return overIndex
    return null
  }, [draggingRange, overIndex])

  return {
    isRowDraggable,
    isRowDragging,
    draggingRange,
    dropIndicatorIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
  }
}

export function createDragGhostEl(t: Theme, rowHeight: number, rowCount: number) {
  const el = document.createElement('div')
  el.style.display = 'flex'
  el.style.alignItems = 'center'
  el.style.justifyContent = 'center'
  el.style.gap = '8px'
  el.style.width = '180px'
  el.style.whiteSpace = 'nowrap'
  el.style.overflow = `visible`
  el.style.borderRadius = t.shape.borderRadius + 'px'
  el.style.color = t.vars.palette.info.contrastText
  el.style.boxShadow = t.vars?.shadows[3]
  el.style.backdropFilter = 'blur(8px)'
  el.style.padding = t.vars?.spacing
  el.style.pointerEvents = 'none'
  el.style.fontWeight = '500'
  el.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))'
  el.style.background = `linear-gradient(
    135deg,
    ${alphaVar(t.vars.palette.info.main, 0.65)},
    ${alphaVar(t.vars.palette.info.main, 0.95)}
  )`
  const icon = document.createElement('span')
  icon.classList.add('material-icons')
  icon.classList.add('MuiIcon-root')
  icon.textContent = 'drag_click'
  icon.style.fontSize = '24px'
  icon.style.opacity = '0.8'

  const label = document.createElement('span')
  label.textContent = `${rowCount} row${rowCount > 1 ? 's' : ''} selected`

  el.appendChild(icon)
  el.appendChild(label)

  const wrapper = document.createElement('div')
  wrapper.style.padding = '8px'
  wrapper.style.background = 'transparent'
  wrapper.appendChild(el)

  // required for drag image to render correctly
  el.style.position = 'absolute'
  el.style.top = '-9999px'
  el.style.left = '-9999px'
  document.body.appendChild(wrapper)

  return wrapper
}
