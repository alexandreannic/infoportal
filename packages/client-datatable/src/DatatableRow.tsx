import {VirtualItem} from '@tanstack/react-virtual'
import {Box, BoxProps, Skeleton, useTheme} from '@mui/material'
import React, {memo, useCallback} from 'react'
import {Column, Props, Row, RowId} from './core/types.js'
import {CachedCell} from './core/reducer'
import {UseDraggingRows} from './core/useDraggingRows'
import {DatatableContext, useCtx} from './core/DatatableContext'
import {UseCellSelection} from './core/useCellSelection'

export const DatatableRow = ({virtualItem}: {virtualItem: VirtualItem}) => {
  const {
    cachedData,
    selectedRowIds,
    selectedColumnIds,
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
    getRowChangeTracker,
  } = useCtx(_ => ({
    selectedRowIds: _.state.selectedRowIds,
    selectedColumnIds: _.state.selectedColumnIds,
    cachedData: _.state.cachedData,
    isDragging: _.dndRows.isRowDragging,
    isOver: _.dndRows.overIndex === virtualItem.index,
    isDraggable: _.dndRows.isRowDraggable,
    handleDragStart: _.dndRows.handleDragStart,
    handleDragOver: _.dndRows.handleDragOver,
    handleDrop: _.dndRows.handleDrop,
    columns: _.columns.visible,
    rowStyle: _.rowStyle,
    getRowChangeTracker: _.getRowChangeTracker,
    cellSelection_handleMouseDown: _.cellSelection.handleMouseDown,
    cellSelection_handleMouseEnter: _.cellSelection.handleMouseEnter,
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
      getRowChangeTracker={getRowChangeTracker}
      onCellClick={onCellClick}
      rowStyle={rowStyle}
      row={row}
      isDraggable={isDraggable(rowId)}
      isDragging={isDragging(rowId)}
      isOver={isOver}
      selectedColumnIds={selectedRowIds && selectedRowIds.has(rowId) && selectedColumnIds}
      handleDragStart={handleDragStart}
      handleDragOver={handleDragOver}
      handleDrop={handleDrop}
      cellSelection_handleMouseDown={cellSelection_handleMouseDown}
      cellSelection_handleMouseEnter={cellSelection_handleMouseEnter}
    />
  )
}

const DatatableRowInner = <T extends Row>({
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
  selectedColumnIds,
  handleDrop,
  cellSelection_handleMouseDown,
  cellSelection_handleMouseEnter,
}: {
  onCellClick: (rowIndex: number, colIndex: number, event: React.MouseEvent<HTMLElement>) => void
  cachedRow: Record<string, CachedCell>
  rowId: RowId
  row: T
  rowStyle: Props<any>['rowStyle']
  getRowChangeTracker: Props<any>['getRowChangeTracker']
  columns: Column.InnerProps<T>[]
  virtualItem: VirtualItem
  cellSelection_handleMouseDown: UseCellSelection['handleMouseDown']
  cellSelection_handleMouseEnter: UseCellSelection['handleMouseEnter']
  selectedColumnIds: false | DatatableContext['state']['selectedColumnIds']
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
        const colSelected = selectedColumnIds !== false && selectedColumnIds?.has(col.id)
        const isFirstCol = colIndex === 0
        return (
          <Cell
            draggable={isFirstCol && colSelected && isDraggable}
            onDragStart={isFirstCol ? e => handleDragStart(rowId, e) : undefined}
            onDragOver={isFirstCol ? e => handleDragOver(virtualItem.index, e) : undefined}
            onDrop={isFirstCol ? handleDrop : undefined}
            onClick={onCellClick}
            key={key}
            rowIndex={virtualItem.index}
            colIndex={colIndex}
            rowId={rowId}
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
}

const DatatableRowMemo = memo(DatatableRowInner, (prevProps, nextProps) => {
  if (prevProps.getRowChangeTracker && nextProps.getRowChangeTracker && prevProps.cachedRow !== undefined) {
    return (
      nextProps.getRowChangeTracker(nextProps.row) === prevProps.getRowChangeTracker(prevProps.row) &&
      // prevProps.isDraggable === nextProps.isDraggable &&
      // prevProps.isDragging === nextProps.isDragging &&
      // prevProps.isOver === nextProps.isOver &&
      // prevProps.isColumnSelected === nextProps.isColumnSelected
      //
      // prevProps.onCellClick === nextProps.onCellClick &&
      // prevProps.cachedRow === nextProps.cachedRow &&
      // prevProps.rowId === nextProps.rowId &&
      // prevProps.row === nextProps.row &&
      // prevProps.getRowChangeTracker === nextProps.getRowChangeTracker &&
      // prevProps.rowStyle === nextProps.rowStyle &&
      // prevProps.columns === nextProps.columns &&
      // prevProps.virtualItem === nextProps.virtualItem &&
      prevProps.cellSelection_handleMouseDown === nextProps.cellSelection_handleMouseDown &&
      prevProps.cellSelection_handleMouseEnter === nextProps.cellSelection_handleMouseEnter &&
      prevProps.selectedColumnIds === nextProps.selectedColumnIds &&
      prevProps.handleDragStart === nextProps.handleDragStart &&
      prevProps.handleDragOver === nextProps.handleDragOver &&
      prevProps.handleDrop === nextProps.handleDrop &&
      prevProps.isDraggable === nextProps.isDraggable &&
      prevProps.isDragging === nextProps.isDragging &&
      prevProps.isOver === nextProps.isOver
    )
  }
  return (
    prevProps.onCellClick === nextProps.onCellClick &&
    prevProps.cachedRow === nextProps.cachedRow &&
    prevProps.rowId === nextProps.rowId &&
    prevProps.row === nextProps.row &&
    // prevProps.getRowChangeTracker === nextProps.getRowChangeTracker &&
    prevProps.rowStyle === nextProps.rowStyle &&
    prevProps.columns === nextProps.columns &&
    prevProps.virtualItem === nextProps.virtualItem &&
    prevProps.cellSelection_handleMouseDown === nextProps.cellSelection_handleMouseDown &&
    prevProps.cellSelection_handleMouseEnter === nextProps.cellSelection_handleMouseEnter &&
    prevProps.selectedColumnIds === nextProps.selectedColumnIds &&
    prevProps.handleDragStart === nextProps.handleDragStart &&
    prevProps.handleDragOver === nextProps.handleDragOver &&
    prevProps.handleDrop === nextProps.handleDrop &&
    prevProps.isDraggable === nextProps.isDraggable &&
    prevProps.isDragging === nextProps.isDragging &&
    prevProps.isOver === nextProps.isOver
  )
})

const CellSkeleton = () => {
  return (
    <div className="dtd skeleton">
      <Skeleton width="100%" />
    </div>
  )
}

// const blinkAnim = keyframes`
//   0% {
//     background-color: transparent;
//   }
//   20% {
//     background-color: rgba(123, 123, 0, 0.2);
//   }
//   100% {
//     background-color: transparent;
//   }
// `
//
// const useStyles = makeStyles()(() => ({
//   root: {
//     transition: 'background-color 0.3s',
//   },
//   blink: {
//     animation: `${blinkAnim} 0.5s ease-in-out`,
//   },
// }))

const Cell = memo(
  ({
    handleMouseDown,
    handleMouseEnter,
    colIndex,
    rowIndex,
    label,
    rowId,
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
      rowId: RowId
      handleMouseDown: (rowIndex: number, colIndex: number, rowId: RowId, event: React.MouseEvent<HTMLElement>) => void
      handleMouseEnter: (rowIndex: number, colIndex: number) => void
    }) => {
    // const {classes, cx} = useStyles()
    // const ref = useRef<HTMLDivElement>(null)

    // useEffect(() => {
    //   const el = ref.current
    //   if (!el) return
    //
    //   // Remove and re-add the animation class to replay it every render
    //   el.classList.remove(classes.blink)
    //   // force reflow to restart animation
    //   void el.offsetWidth
    //   el.classList.add(classes.blink)
    // })

    return (
      <div
        {...props}
        // ref={ref}
        // className={cx('dtd', className, selected && 'selected', classes.root)}
        className={'dtd ' + className + (selected ? ' selected' : '')}
        style={style}
        onClick={onClick ? e => onClick(rowIndex, colIndex, e) : undefined}
        title={tooltip}
        onMouseDown={e => handleMouseDown(rowIndex, colIndex, rowId, e)}
        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
      >
        {label}
      </div>
    )
  },
)
