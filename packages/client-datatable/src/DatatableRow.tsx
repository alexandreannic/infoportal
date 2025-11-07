import {VirtualItem} from '@tanstack/react-virtual'
import {Box, Skeleton, useTheme} from '@mui/material'
import React, {memo} from 'react'
import {Column, Props, Row} from './core/types.js'
import {VirtualCell} from './core/reducer'

export const DatatableRow = memo(DatatableRow_, (prevProps, nextProps) => {
  return (
    prevProps.rowId === nextProps.rowId &&
    prevProps.virtualItem === nextProps.virtualItem &&
    prevProps.virtualRow === nextProps.virtualRow &&
    prevProps.rowStyle === nextProps.rowStyle &&
    prevProps.columns === nextProps.columns &&
    prevProps.onCellClick === nextProps.onCellClick &&
    prevProps.cellSelection_handleMouseDown === nextProps.cellSelection_handleMouseDown &&
    prevProps.cellSelection_handleMouseEnter === nextProps.cellSelection_handleMouseEnter &&
    prevProps.isOver === nextProps.isOver &&
    prevProps.isDragging === nextProps.isDragging &&
    prevProps.draggingEnabled === nextProps.draggingEnabled &&
    // prevProps.cellSelection_isSelected === nextProps.cellSelection_isSelected
    // prevProps.cellSelection_isRowInSelection === nextProps.cellSelection_isRowInSelection

    !prevProps.cellSelection_isRowInSelection &&
    !nextProps.cellSelection_isRowInSelection
  )
}) as typeof DatatableRow_

function DatatableRow_<T extends Row>({
  rowId,
  virtualItem,
  virtualRow,
  columns,
  onCellClick,
  cellSelection_isSelected,
  cellSelection_handleMouseDown,
  cellSelection_handleMouseEnter,
  rowStyle,
  row,
  //
  draggingEnabled,
  isOver,
  isDragging,
  handleDragOver,
  handleDragStart,
  handleDrop,
}: {
  draggingEnabled?: boolean
  isOver?: boolean
  isDragging?: boolean
  handleDragOver: (index: number, e: React.DragEvent) => void
  handleDragStart: (index: number, e: React.DragEvent) => void
  handleDrop: () => void
  //
  onCellClick: (rowIndex: number, colIndex: number, event: React.MouseEvent<HTMLElement>) => void
  virtualRow: Record<string, VirtualCell>
  rowId: string
  row: T
  rowStyle: Props<any>['rowStyle']
  columns: Column.InnerProps<T>[]
  virtualItem: VirtualItem
  cellSelection_isSelected: (rowIndex: number, colIndex: number) => boolean
  cellSelection_handleMouseDown: (rowIndex: number, colIndex: number, event: React.MouseEvent<HTMLElement>) => void
  cellSelection_handleMouseEnter: (rowIndex: number, colIndex: number) => void
  // Only used to optimize re-renders
  cellSelection_isRowInSelection: boolean
}) {
  // console.log('====', virtualItem.index, rowId)
  // useEffect(() => console.log(virtualItem.index + '-1 ' + ' cellSelection'), [cellSelection_isSelected])
  // useEffect(() => console.log(virtualItem.index + '-2 ' + ' virtualRow'), [virtualRow])
  // useEffect(() => console.log(virtualItem.index + '-3 ' + ' columns'), [columns])
  // useEffect(() => console.log(virtualItem.index + '-5 ' + ' virtualItem'), [virtualItem])

  const t = useTheme()

  return (
    <Box
      className="dtr"
      key={rowId}
      draggable={draggingEnabled}
      onDragStart={e => {
        handleDragStart(virtualItem.index, e)
      }}
      onDragOver={e => handleDragOver(virtualItem.index, e)}
      onDrop={handleDrop}
      sx={{
        ...rowStyle?.(row),
        height: `${virtualItem.size}px`,
        transform: `translateY(${virtualItem.start}px)`,
        opacity: isDragging ? 0.5 : 1,
        cursor: draggingEnabled ? 'grab' : undefined,
        borderTop: isOver ? '3px solid ' + t.vars.palette.primary.main : undefined,
      }}
    >
      {columns.map((col, colIndex) => {
        let cell = virtualRow?.[col.id]
        const selected = cellSelection_isSelected(virtualItem.index, colIndex)
        const key = virtualItem.key + col.id
        if (!cell) {
          return <CellSkeleton key={key} />
          // // if (col.id === 'id')
          // cell = data?.[virtualRow.index]
          //   console.log({
          //     count: dataFilteredAndSorted?.length ?? 0,
          //     i: virtualRow.index,
          //     index: row.index,
          //     virtualTable,
          //   })
          // return <CellSkeleton key={key} />
        }
        return (
          <Cell
            onClick={onCellClick}
            key={key}
            rowIndex={virtualItem.index}
            colIndex={colIndex}
            handleMouseDown={cellSelection_handleMouseDown}
            handleMouseEnter={cellSelection_handleMouseEnter}
            className={cell.className + (selected ? ' selected' : '')}
            label={cell.label}
            tooltip={cell.tooltip as any}
            style={cell.style}
          />
        )
      })}
    </Box>
  )
}

const CellSkeleton = () => {
  return (
    <div className="dtd skeleton">
      <Skeleton width="100%" />
    </div>
  )
}

const Cell = memo(
  ({
    handleMouseDown,
    handleMouseEnter,
    colIndex,
    rowIndex,
    label,
    tooltip,
    onClick,
    style,
    className = '',
  }: VirtualCell & {
    onClick?: (rowIndex: number, colIndex: number, event: React.MouseEvent<HTMLElement>) => void
    colIndex: number
    rowIndex: number
    handleMouseDown: (rowIndex: number, colIndex: number, event: React.MouseEvent<HTMLElement>) => void
    handleMouseEnter: (rowIndex: number, colIndex: number) => void
  }) => {
    return (
      <div
        className={'dtd ' + className}
        style={style}
        onClick={onClick ? e => onClick(rowIndex, colIndex, e) : undefined}
        title={tooltip}
        onMouseDown={e => handleMouseDown(rowIndex, colIndex, e)}
        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
      >
        {label}
      </div>
    )
  },
)
