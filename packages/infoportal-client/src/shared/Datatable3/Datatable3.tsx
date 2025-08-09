import {Datatable} from '@/shared/Datatable3/types.js'
import React, {memo, useEffect, useMemo, useReducer, useState} from 'react'
import {datatableReducer, initialState} from '@/shared/Datatable3/reducer.js'
import {DatatableColumn} from '@/shared/Datatable/util/datatableType.js'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils.js'
import {useVirtualizer} from '@tanstack/react-virtual'
import {Popover, Skeleton, styled} from '@mui/material'
import './Datatable.css'
import {DatatableHead} from '@/shared/Datatable3/DatatableHead.js'
import {SelectedCellPopover, useCellSelection} from '@/shared/Datatable3/useCellSelection.js'

const toInnerColumn = <T extends Datatable.Row>(col: Datatable.Column.Props<T>): Datatable.Column.InnerProps<T> => {
  if (Datatable.Column.isInner(col)) {
    return col
  }
  if (Datatable.Column.isQuick(col)) {
    if (col.type === undefined) {
      ;(col as unknown as DatatableColumn.InnerProps<T>).render = (_: T) => {
        const value = col.renderQuick(_) ?? (DatatableUtils.blank as any)
        return {label: value, value: undefined}
      }
    } else {
      ;(col as unknown as DatatableColumn.InnerProps<T>).render = (_: T) => {
        const value = col.renderQuick(_) ?? (DatatableUtils.blank as any)
        return {
          label: value,
          tooltip: value,
          option: value,
          value,
        }
      }
    }
  }
  return col as unknown as Datatable.Column.InnerProps<T>
}

const harmonizeColRenderValue = <T extends Datatable.Row>(
  col: Datatable.Column.InnerProps<T>,
): Datatable.Column.InnerProps<T> => {
  const baseRender = col.render

  const newRender = (row: T) => {
    const rendered = baseRender(row)

    let value = rendered.value

    if (col.type === 'select_multiple') {
      if (!Array.isArray(value)) {
        value = [value as string]
      }
      if (value.length === 0) {
        value = [DatatableUtils.blank]
      }
      value = value.map(v => v ?? DatatableUtils.blank)
    } else if (value === undefined || value === null) {
      value = DatatableUtils.blank
    }
    return {
      ...rendered,
      value,
      option: rendered.option ?? rendered.label,
    }
  }

  return {
    ...col,
    render: newRender as any,
  }
}

export const Datatable3 = <T extends Datatable.Row>({data, columns: outerColumns, ...props}: Datatable.Props<T>) => {
  useEffect(() => {
    data?.forEach((d: any, i) => {
      d.index = i
    })
  }, [data])
  const columns = useMemo(() => {
    const x = outerColumns.map(toInnerColumn).map(harmonizeColRenderValue)
    const indexCol: Datatable.Column.InnerProps<any> = {
      type: 'string',
      id: 'index',
      head: 'index',
      render: (_: any) => ({
        value: _?.index,
        label: _?.index,
      }),
    }
    return [indexCol, ...x]
  }, [outerColumns])

  if (!data) return 'Loading...'
  return <DatatableWithData {...props} data={data} columns={columns} />
}

export const DatatableWithData = <T extends Datatable.Row>({
  defaultLimit = 100,
  getRowKey,
  data,
  columns,
}: Datatable.Props<T> & {
  columns: Datatable.Column.InnerProps<T>[]
  data: T[]
}) => {
  const [state, dispatch] = useReducer(datatableReducer<T>(), initialState<T>())

  const cssGridTemplate = useMemo(
    () =>
      columns
        // .filter(c => state.visibleCols.has(c.id))
        .map(c => (state.colWidths[c.id] ?? 120) + 'px')
        .join(' '),
    [columns, state.colWidths, state.colVisibility],
  )

  useEffect(() => {
    dispatch({type: 'INIT_DATA', data, columns, getRowKey, limit: defaultLimit})
  }, [data])

  const parentRef = React.useRef(null)

  const overscan = 10
  const rowVirtualizer = useVirtualizer({
    count: data?.length ?? 0,
    debug: false,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan,
  })

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse()
    const lastIndex = lastItem?.index
    if (!lastIndex) {
      return
    }
    if (lastIndex >= data.length) {
      return
    }
    dispatch({type: 'SET_DATA', data, columns, getRowKey, offset: lastIndex, limit: 22 + overscan})
  }, [rowVirtualizer.getVirtualItems()])

  const cellSelection = useCellSelection(parentRef)

  return (
    <div className="dt" style={{['--cols' as any]: cssGridTemplate}} ref={parentRef}>
      <DatatableHead
        dispatch={dispatch}
        colWidths={state.colWidths}
        onMouseDown={() => cellSelection.reset()}
        columns={columns}
      />
      <div
        className="dtbody"
        onMouseUp={cellSelection.handleMouseUp}
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map(virtualRow => {
          const row = data[virtualRow.index]
          const rowId = getRowKey(row)
          return (
            <div
              className="dtr"
              key={rowId}
              style={{
                height: `${virtualRow.size}px`,
                // top: start,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {columns.map((col, colIndex) => {
                const key = Datatable.buildKey2({colId: col.id, rowId})
                const cell = state.virtualTable[rowId]?.[col.id]
                const selected = cellSelection.isSelected(virtualRow.index, colIndex)

                if (!cell)
                  return (
                    <div key={key} className="dtd">
                      {rowId}
                    </div>
                  )
                return (
                  <Cell
                    rowIndex={virtualRow.index}
                    colIndex={colIndex}
                    handleMouseDown={cellSelection.handleMouseDown}
                    handleMouseEnter={cellSelection.handleMouseEnter}
                    className={cell.className + (selected ? ' selected' : '')}
                    label={cell.label}
                    tooltip={cell.tooltip as any}
                    style={cell.style}
                    key={key}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
      <SelectedCellPopover {...cellSelection} />
    </div>
  )
}

// const Row = memo(
//   ({
//     row,
//     rowId,
//     start,
//     size,
//     columns,
//   }: {
//     columns: Datatable.Column.InnerProps<any>[]
//     start: number
//     size: number
//     rowId: string
//     row: any
//   }) => {
//     return (
//       <div
//         className="dtr"
//         key={rowId}
//         style={{
//           height: `${size}px`,
//           // top: start,
//           transform: `translateY(${start}px)`,
//         }}
//       >
//         {columns.map(col => {
//           const rendered = col.render(row)
//           return (
//             <Cell
//               // className={cell.className}
//               label={rendered.label}
//               tooltip={rendered.tooltip as any}
//               style={col.style?.(row)}
//               key={rowId + col.id}
//             />
//           )
//         })}
//       </div>
//     )
//   },
// )

const CellSkeletonRoot = styled('div')(({theme}) => ({
  paddingRight: theme.spacing(2),
  paddingLeft: theme.spacing(2),
}))

const CellSkeleton = () => {
  return (
    <CellSkeletonRoot>
      <Skeleton />
    </CellSkeletonRoot>
  )
}

const CellRoot = styled('div')(({theme}) => ({}))

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
