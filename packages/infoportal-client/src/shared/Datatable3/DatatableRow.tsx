import {Datatable} from '@/shared/Datatable3/state/types.js'
import {VirtualItem} from '@tanstack/react-virtual'
import {Skeleton} from '@mui/material'
import React, {memo} from 'react'
import VirtualCell = Datatable.VirtualCell

export const DatatableRow = memo(DatatableRow_, (prevProps, nextProps) => {
  return (
    prevProps.rowId === nextProps.rowId &&
    prevProps.virtualItem === nextProps.virtualItem &&
    prevProps.virtualRow === nextProps.virtualRow &&
    prevProps.columns === nextProps.columns &&
    prevProps.cellSelection_handleMouseDown === nextProps.cellSelection_handleMouseDown &&
    prevProps.cellSelection_handleMouseEnter === nextProps.cellSelection_handleMouseEnter &&
    // prevProps.cellSelection_isSelected === nextProps.cellSelection_isSelected

    // prevProps.cellSelection_isRowInSelection === nextProps.cellSelection_isRowInSelection

    !prevProps.cellSelection_isRowInSelection &&
    !nextProps.cellSelection_isRowInSelection
  )
})

function DatatableRow_<T extends Datatable.Row>({
  rowId,
  virtualItem,
  virtualRow,
  columns,
  cellSelection_isSelected,
  cellSelection_handleMouseDown,
  cellSelection_handleMouseEnter,
}: {
  virtualRow: Record<string, VirtualCell>
  rowId: string
  columns: Datatable.Column.InnerProps<T>[]
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

  return (
    <div
      className="dtr"
      key={rowId}
      style={{
        height: `${virtualItem.size}px`,
        transform: `translateY(${virtualItem.start}px)`,
      }}
    >
      {columns.map((col, colIndex) => {
        let cell = virtualRow?.[col.id]
        const selected = cellSelection_isSelected(virtualItem.index, colIndex)
        const key = virtualItem.key + col.id
        if (!cell) {
          return <CellSkeleton key={key} />
          //   // if (col.id === 'id')
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
    </div>
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
    style,
    className = 'dtd',
  }: Datatable.VirtualCell & {
    colIndex: number
    rowIndex: number
    handleMouseDown: (rowIndex: number, colIndex: number, event: React.MouseEvent<HTMLElement>) => void
    handleMouseEnter: (rowIndex: number, colIndex: number) => void
  }) => {
    return (
      <div
        className={'dtd ' + className}
        style={style}
        title={tooltip}
        onMouseDown={e => handleMouseDown(rowIndex, colIndex, e)}
        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
      >
        {label}
      </div>
    )
  },
)
