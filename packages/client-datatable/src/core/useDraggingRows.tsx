import React, {useCallback, useMemo, useState} from 'react'
import {DatatableContext} from './DatatableContext'

export type UseDraggingRows = ReturnType<typeof useDraggingRows>

export const useDraggingRows = ({
  // dataFilteredAndSorted,
  selectedRows,
  selecting,
  isRowSelected,
  rowHeight,
  dispatch,
}: {
  dispatch: DatatableContext['dispatch']
  rowHeight: number
  selecting?: boolean
  isRowSelected: (rowIndex: number) => boolean
  // dataFilteredAndSorted: any[]
  selectedRows: {
    min: number
    max: number
  }
}) => {
  const [draggingRange, setDraggingRange] = useState<{min: number; max: number} | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  const enabled = !selecting && selectedRows.min !== -1 && selectedRows.max !== -1

  const isRowDragging = useCallback(
    (rowIndex: number) => {
      if (!draggingRange || !enabled) return false
      return rowIndex >= draggingRange.min && rowIndex <= draggingRange.max
    },
    [draggingRange, enabled],
  )

  const handleDragStart = useCallback(
    (rowIndex: number, e: React.DragEvent) => {
      if (isRowSelected(rowIndex)) setDraggingRange(selectedRows)

      console.log(rowHeight)
      const dragPreview = createDragGhostEl(rowHeight * (selectedRows.max - selectedRows.min))
      document.body.appendChild(dragPreview)
      e.dataTransfer?.setDragImage(dragPreview, 0, 0)
      setTimeout(() => document.body.removeChild(dragPreview), 0)
    },
    [isRowSelected],
  )

  const handleDragOver = useCallback((rowIndex: number, e: React.DragEvent) => {
    e.preventDefault() // allow drop
    setOverIndex(rowIndex)
  }, [])

  const handleDrop = useCallback(() => {
    if (draggingRange == null || overIndex == null) return
    dispatch({type: 'REORDER_ROWS', range: draggingRange, index: overIndex})
    setDraggingRange(null)
    setOverIndex(null)
  }, [draggingRange, overIndex])

  const dropIndicatorIndex = useMemo((): number | null => {
    if (!enabled || !draggingRange || overIndex == null) return null
    if (overIndex < draggingRange.min) return overIndex
    if (overIndex > draggingRange.max) return overIndex
    return null
  }, [enabled, draggingRange, overIndex])

  return {
    isRowDragging,
    enabled,
    draggingRange,
    // overIndex,
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
