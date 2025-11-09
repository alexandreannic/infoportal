import React, {RefObject, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {DatatableContext} from './DatatableContext'
import {MinMax} from './reducer'

export type UseDraggingRows = ReturnType<typeof useDraggingRows>

export const useDraggingRows = ({
  selectionRef,
  isRowSelected,
  rowHeight,
  dispatch,
  draggingRange,
  overIndex,
  disabled,
}: {
  disabled?: boolean
  dispatch: DatatableContext['dispatch']
  rowHeight: number
  isRowSelected: (rowIndex: number) => boolean
  draggingRange: MinMax | null
  overIndex: number | null
  selectionRef: RefObject<{rowMin: number; rowMax: number}>
}) => {
  /** ---------- Refs to always have latest state ---------- */
  const draggingRangeRef = useRef(draggingRange)
  const overIndexRef = useRef(overIndex)

  useEffect(() => {
    draggingRangeRef.current = draggingRange
  }, [draggingRange])
  useEffect(() => {
    overIndexRef.current = overIndex
  }, [overIndex])

  /** ---------- Core helpers ---------- */

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

  // const canDnd = !disabled && !selecting && selectedRows.min !== -1 && selectedRows.max !== -1

  const isRowDraggable = useCallback(
    (rowIndex: number) => {
      if (disabled) return false
      return isRowSelected(rowIndex)
    },
    [isRowSelected],
  )
  /** ---------- Stable handlers ---------- */

  const handleDragStart = useCallback(
    (rowIndex: number, e: React.DragEvent) => {
      const min = selectionRef.current.rowMin
      const max = selectionRef.current.rowMax
      if (isRowSelected(rowIndex)) {
        setDraggingRange({min, max})
      }

      const dragHeight = rowHeight * (max - min)
      const ghost = createDragGhostEl(dragHeight)
      document.body.appendChild(ghost)
      e.dataTransfer?.setDragImage(ghost, 0, 0)
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.dropEffect = 'move'
      setTimeout(() => document.body.removeChild(ghost), 0)
    },
    [isRowSelected, rowHeight, setDraggingRange],
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

  /** ---------- Derived helpers ---------- */

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

function createDragGhostEl(height: number) {
  const dragPreview = document.createElement('div')
  dragPreview.style.width = '70%'
  dragPreview.style.height = `${height}px`
  dragPreview.style.background = 'rgba(100, 150, 255, 0.2)' // light transparent blue
  dragPreview.style.border = '1px solid rgba(100, 150, 255, 0.6)'
  dragPreview.style.borderRadius = '4px'
  dragPreview.style.boxSizing = 'border-box'
  dragPreview.style.position = 'absolute'
  dragPreview.style.top = '-9999px'
  dragPreview.style.left = '-9999px'
  return dragPreview
}
