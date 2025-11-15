import React, {RefObject, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {DatatableContext} from './DatatableContext'
import {MinMax, State} from './reducer'
import {Theme, useTheme} from '@mui/material'
import {alphaVar} from '@infoportal/client-core'

export type UseDraggingRows = ReturnType<typeof useDraggingRows>

export const useDraggingRows = ({
  rowHeight,
  dispatch,
  overIndex,
  disabled,
  selectedRowIds,
  selectedRowIdsRef,
  selecting,
}: {
  selectedRowIdsRef: RefObject<State<any>['selectedRowIds']>,
  selecting: RefObject<boolean>
  disabled?: boolean
  dispatch: DatatableContext['dispatch']
  rowHeight: number
  selectedRowIds: State<any>['selectedRowIds']
  overIndex: number | null
}) => {
  const t = useTheme()
  // Refs to always have latest state
  const overIndexRef = useRef(overIndex)
  useEffect(() => {
    overIndexRef.current = overIndex
  }, [overIndex])

  const setOverIndex = useCallback(
    (index: number | null) => {
      dispatch({type: 'DRAGGING_ROWS_SET_OVER_INDEX', overIndex: index})
    },
    [dispatch],
  )

  const isRowDraggable = useCallback(
    (rowId: string) => {
      if (disabled || !selectedRowIds) return false
      return selectedRowIds.has(rowId)
    },
    [selectedRowIds],
  )

  const handleDragStart = useCallback(
    (rowId: string, e: React.DragEvent) => {
      if (selecting.current || !selectedRowIdsRef.current?.has(rowId)) {
        e.preventDefault()
        return
      }
      const rowsCount = selectedRowIdsRef.current?.size ?? 0
      const dragHeight = rowHeight * rowsCount
      const ghost = createDragGhostEl(t, dragHeight, rowsCount)
      document.body.appendChild(ghost)
      e.dataTransfer?.setDragImage(ghost, 0, 0)
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.dropEffect = 'move'
      setTimeout(() => document.body.removeChild(ghost), 0)
    },
    [rowHeight],
  )

  const handleDragOver = useCallback(
    (rowIndex: number, e: React.DragEvent) => {
      if (selecting.current) {
        e.preventDefault()
        return
      }
      e.preventDefault() // required to allow drop
      setOverIndex(rowIndex)
    },
    [setOverIndex],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      if (selecting.current) {
        e.preventDefault()
        return
      }
      const over = overIndexRef.current
      if (!selectedRowIdsRef.current || over == null) return
      dispatch({type: 'REORDER_ROWS', rowIds: [...selectedRowIdsRef.current], index: over})
      setOverIndex(null)
    },
    [dispatch, setOverIndex],
  )

  const isRowDragging = useCallback((rowId: string) => {
    if (!overIndex || !selectedRowIds) return false
    return selectedRowIds.has(rowId)
  }, [selectedRowIds, overIndex])

  return {
    overIndex,
    isRowDraggable,
    isRowDragging,
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
