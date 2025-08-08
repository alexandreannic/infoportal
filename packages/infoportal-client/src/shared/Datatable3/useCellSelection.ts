import {useCallback, useRef, useState} from 'react'

export const useCellSelection = () => {
  const isSelected = useRef<boolean>(false)
  const [selectionStart, setSelectionStart] = useState<{row: number; col: number} | null>(null)
  const [selectionEnd, setSelectionEnd] = useState<{row: number; col: number} | null>(null)

  const handleMouseDown = useCallback(
    (rowIndex: number, colIndex: number) => {
      isSelected.current = true
      setSelectionStart({row: rowIndex, col: colIndex})
      setSelectionEnd({row: rowIndex, col: colIndex})
    },
    [selectionStart, selectionEnd],
  )

  const handleMouseEnter = useCallback(
    (rowIndex: number, colIndex: number) => {
      if (!isSelected.current) return
      if (selectionStart) {
        setSelectionEnd({row: rowIndex, col: colIndex})
      }
    },
    [selectionStart],
  )

  const handleMouseUp = useCallback(() => {
    isSelected.current = false
  }, [])

  const isCellSelected = (rowIndex: number, colIndex: number) => {
    if (!selectionStart || !selectionEnd) return false
    const rowMin = Math.min(selectionStart.row, selectionEnd.row)
    const rowMax = Math.max(selectionStart.row, selectionEnd.row)
    const colMin = Math.min(selectionStart.col, selectionEnd.col)
    const colMax = Math.max(selectionStart.col, selectionEnd.col)
    return rowIndex >= rowMin && rowIndex <= rowMax && colIndex >= colMin && colIndex <= colMax
  }

  return {
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    isCellSelected,
  }
}
