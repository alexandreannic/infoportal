import {useEffect, useMemo, useRef, useState} from 'react'

export type UseDatatableCellSelection = ReturnType<typeof useDatatableCellSelection>

export const useDatatableCellSelection = ({currentDataIds}: {currentDataIds?: string[]}) => {
  const tbodyRef = useRef<HTMLTableSectionElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [startRowIndex, setStartRowIndex] = useState<number>()
  const [currentRowIndex, setCurrentRowIndex] = useState<number>()
  const [selectedColumnId, setSelectedColumnId] = useState<string>()
  const [popoverPos, setPopoverPos] = useState<{top: number; left: number} | null>(null)

  const {selectedRowIds, selectedRowIdFirst} = useMemo(() => {
    if (currentDataIds === undefined || startRowIndex === undefined || currentRowIndex === undefined)
      return {
        selectedRowIds: new Set<string>(),
        selectedRowIdFirst: undefined,
      }
    const [min, max] = [startRowIndex, currentRowIndex].sort((a, b) => a - b)
    return {
      selectedRowIds: new Set(currentDataIds?.slice(min, max + 1) ?? []),
      selectedRowIdFirst: currentDataIds[startRowIndex],
    }
  }, [startRowIndex, currentRowIndex, currentDataIds])

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node
      const isOutsideTable = !tbodyRef.current?.contains(target)
      const isOutsidePopover = !popoverRef.current?.contains(target)

      if (isOutsideTable && isOutsidePopover) {
        setPopoverPos(null)
        resetSelection()
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const resetSelection = () => {
    setIsSelecting(false)
    setStartRowIndex(undefined)
    setCurrentRowIndex(undefined)
    setSelectedColumnId(undefined)
  }

  const handlePointerDown = (rowIndex: number, colIndex: string, event: React.PointerEvent) => {
    console.log('handlePointerDown')
    setIsSelecting(true)
    setStartRowIndex(rowIndex)
    setCurrentRowIndex(rowIndex)
    setSelectedColumnId(colIndex)

    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    setPopoverPos({top: rect.bottom + window.scrollY, left: rect.right + window.scrollX})
  }

  const handlePointerEnter = (rowIndex: number, colIndex: string) => {
    if (!isSelecting) return
    if (colIndex !== selectedColumnId) return
    setCurrentRowIndex(rowIndex)
  }

  const handlePointerUp = () => {
    console.log('handlePointerUp')
    setIsSelecting(false)
  }

  return {
    events: {
      handlePointerDown,
      handlePointerEnter,
      handlePointerUp,
    },
    isSelecting,
    selectedColumnId,
    selectedRowIds,
    selectedRowIdFirst,
    tbodyRef,
    popoverRef,
    popoverPos,
  }
}
