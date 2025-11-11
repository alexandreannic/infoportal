import {VirtualItem} from '@tanstack/react-virtual'
import {Box, BoxProps, Skeleton, useTheme} from '@mui/material'
import React, {memo, useCallback} from 'react'
import {Column, Props, Row} from './core/types.js'
import {CachedCell} from './core/reducer'
import {UseDraggingRows} from './core/useDraggingRows'
import {useCtx} from './core/DatatableContext'
import {UseCellSelection} from './core/useCellSelectionEngine'

export const DatatableRow = ({virtualItem}: {virtualItem: VirtualItem}) => {
  const {
    cachedData,
    isRowSelected,
    isColumnSelected,
    cellSelection_handleMouseDown,
    cellSelection_handleMouseEnter,
    isDragging,
    isOver,
    isDraggable,
    handleDragStart,
    handleDragOver,
    handleDrop,
    columns,
    rowStyle,
    dataFilteredAndSorted,
    getRowKey,
  } = useCtx(_ => ({
    isRowSelected: _.cellSelection.engine.isRowSelected(virtualItem.index),
    isColumnSelected: _.cellSelection.engine.isColumnSelected,
    cachedData: _.state.cachedData,
    isDragging: _.dndRows.isRowDragging(virtualItem.index),
    isOver: _.dndRows.dropIndicatorIndex === virtualItem.index,
    isDraggable: _.dndRows.isRowDraggable(virtualItem.index),
    handleDragStart: _.dndRows.handleDragStart,
    handleDragOver: _.dndRows.handleDragOver,
    handleDrop: _.dndRows.handleDrop,
    columns: _.columns.visible,
    rowStyle: _.rowStyle,
    cellSelection_handleMouseDown: _.cellSelection.engine.handleMouseDown,
    cellSelection_handleMouseEnter: _.cellSelection.engine.handleMouseEnter,
    dataFilteredAndSorted: _.dataFilteredAndSorted,
    getRowKey: _.getRowKey,
  }))
  const row = dataFilteredAndSorted[virtualItem.index]
  const rowId = getRowKey(row)
  const cachedRow = cachedData[rowId]

  const onCellClick = useCallback(
    (rowIndex: number, colIndex: number, event: React.MouseEvent<HTMLElement>) => {
      const row = dataFilteredAndSorted[rowIndex]
      const column = columns[colIndex]
      if (column.onClick) {
        column.onClick({data: row, rowIndex, event})
      }
    },
    [dataFilteredAndSorted, columns],
  )

  return (
    <DatatableRowMemo
      rowId={rowId}
      virtualItem={virtualItem}
      cachedRow={cachedRow}
      columns={columns}
      onCellClick={onCellClick}
      rowStyle={rowStyle}
      row={row}
      isDraggable={isDraggable}
      isDragging={isDragging}
      isOver={isOver}
      isColumnSelected={isRowSelected && isColumnSelected}
      handleDragStart={handleDragStart}
      handleDragOver={handleDragOver}
      handleDrop={handleDrop}
      cellSelection_handleMouseDown={cellSelection_handleMouseDown}
      cellSelection_handleMouseEnter={cellSelection_handleMouseEnter}
    />
  )
}

const DatatableRowMemo = memo(
  <T extends Row>({
    rowId,
    virtualItem,
    cachedRow,
    columns,
    onCellClick,
    rowStyle,
    row,
    isDraggable,
    isDragging,
    isOver,
    handleDragStart,
    handleDragOver,
    isColumnSelected,
    handleDrop,
    cellSelection_handleMouseDown,
    cellSelection_handleMouseEnter,
  }: {
    onCellClick: (rowIndex: number, colIndex: number, event: React.MouseEvent<HTMLElement>) => void
    cachedRow: Record<string, CachedCell>
    rowId: string
    row: T
    rowStyle: Props<any>['rowStyle']
    columns: Column.InnerProps<T>[]
    virtualItem: VirtualItem
    cellSelection_handleMouseDown: UseCellSelection['handleMouseDown']
    cellSelection_handleMouseEnter: UseCellSelection['handleMouseEnter']
    isColumnSelected: false | UseCellSelection['isColumnSelected']
    handleDragStart: UseDraggingRows['handleDragStart']
    handleDragOver: UseDraggingRows['handleDragOver']
    handleDrop: UseDraggingRows['handleDrop']
    isDraggable?: boolean
    isDragging?: boolean
    isOver?: boolean
  }) => {
    const t = useTheme()
    return (
      <Box
        className="dtr"
        key={rowId}
        sx={{
          ...rowStyle?.(row),
          height: `${virtualItem.size}px`,
          transform: `translateY(${virtualItem.start}px)`,
          opacity: isDragging ? 0.5 : 1,
          cursor: isDraggable ? 'grab' : undefined,
          borderTop: isOver ? '3px solid ' + t.vars.palette.primary.main : undefined,
        }}
      >
        {columns.map((col, colIndex) => {
          let cell = cachedRow?.[col.id]
          const key = virtualItem.key + col.id
          if (!cell) {
            return <CellSkeleton key={key} />
          }
          const colSelected = isColumnSelected !== false && isColumnSelected(colIndex)
          const isFirstCol = colIndex === 0
          return (
            <Cell
              draggable={isFirstCol && colSelected && isDraggable}
              onDragStart={isFirstCol ? e => handleDragStart(virtualItem.index, e) : undefined}
              onDragOver={isFirstCol ? e => handleDragOver(virtualItem.index, e) : undefined}
              onDrop={isFirstCol ? handleDrop : undefined}
              onClick={onCellClick}
              key={key}
              rowIndex={virtualItem.index}
              colIndex={colIndex}
              handleMouseDown={cellSelection_handleMouseDown}
              handleMouseEnter={cellSelection_handleMouseEnter}
              selected={colSelected}
              className={cell.className}
              label={cell.label}
              tooltip={cell.tooltip as any}
              style={cell.style}
            />
          )
        })}
      </Box>
    )
  },
)

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
    selected,
    className = '',
    ...props
  }: CachedCell &
    Pick<BoxProps, 'draggable' | 'onDragStart' | 'onDragOver' | 'onDrop'> & {
      selected?: boolean
      onClick?: (rowIndex: number, colIndex: number, event: React.MouseEvent<HTMLElement>) => void
      colIndex: number
      rowIndex: number
      handleMouseDown: (rowIndex: number, colIndex: number, event: React.MouseEvent<HTMLElement>) => void
      handleMouseEnter: (rowIndex: number, colIndex: number) => void
    }) => {
    return (
      <div
        {...props}
        className={'dtd ' + className + (selected ? ' selected' : '')}
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
