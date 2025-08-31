import React, {useCallback, useEffect} from 'react'
import {useVirtualizer} from '@tanstack/react-virtual'
import {Badge, Box} from '@mui/material'
import {DatatableHead} from '@/head/DatatableHead'
import {Provider, useCtx} from '@/core/DatatableContext'
import {IconBtn, Txt} from '@infoportal/client-core'
import {useMemoFn} from '@axanc/react-hooks'
import {Obj} from '@axanc/ts-utils'
import {useConfig} from '@/DatatableConfig'
import {PopupStats} from '@/popup/PopupStats'
import {DatatableFilterModal} from '@/popup/PopupFilter'
import {DatatableRow} from '@/DatatableRow'
import {DatatableColumnToggle} from '@/DatatableColumnsToggle'
import {FilterValue, Props, Row} from '@/core/types'
import {PopupSelectedCell} from '@/popup/PopupSelectedCell'
import {DatatableErrorBoundary} from '@/DatatableErrorBundary'
import {DatatableSkeleton} from '@/DatatableSkeleton'
import {DatatableToolbar} from '@/DatatableToolbar'

export const Datatable = <T extends Row>({data, ...props}: Props<T>) => {
  if (!data) return <DatatableSkeleton columns={props.columns.length} />
  const tableRef = React.useRef(null) as unknown as React.MutableRefObject<HTMLDivElement>
  // {loading &&
  // (ctx.data.data ? (
  //   <LinearProgress sx={{position: 'absolute', left: 0, right: 0, top: 0}} />
  // ) : (
  //   <DatatableSkeleton columns={ctx.columns.length} />
  // ))}

  return (
    <DatatableErrorBoundary>
      <Provider {...props} data={data} tableRef={tableRef}>
        <DatatableWithData />
      </Provider>
    </DatatableErrorBoundary>
  )
}

const DatatableWithData = <T extends Row>() => {
  const {m, formatLargeNumber} = useConfig()
  const {
    columns,
    state: {sortBy, filters, virtualTable, popup},
    dispatch,
    getRowKey,
    data,
    dataFilteredAndSorted,
    dataFilteredExceptBy,
    getColumnOptions,
    cellSelection,
    tableRef,
    contentProps,
    module,
  } = useCtx(_ => _)

  const overscan = 10
  const rowVirtualizer = useVirtualizer({
    count: dataFilteredAndSorted?.length ?? 0,
    debug: false,
    getScrollElement: () => tableRef.current,
    estimateSize: () => 32,
    overscan,
  })

  useEffect(() => {
    const items = rowVirtualizer.getVirtualItems()
    dispatch({
      type: 'INIT_DATA',
      data: dataFilteredAndSorted,
      columns: columns.all,
      getRowKey,
      offset: items[0]?.index ?? 0,
      limit: items.length + overscan,
    })
  }, [dataFilteredAndSorted, columns.all])

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse()
    const lastIndex = lastItem?.index
    if (!lastIndex) {
      return
    }
    if (lastIndex >= dataFilteredAndSorted.length) {
      return
    }
    dispatch({
      type: 'SET_DATA',
      data: dataFilteredAndSorted,
      columns: columns.all,
      getRowKey,
      offset: lastIndex,
      limit: 22 + overscan,
    })
  }, [dataFilteredAndSorted, rowVirtualizer.getVirtualItems()])

  const onCellClick = useCallback((rowIndex: number, colIndex: number, event: React.MouseEvent<HTMLElement>) => {
    const row = dataFilteredAndSorted[rowIndex]
    const column = columns.visible[colIndex]
    if (column.onClick) {
      column.onClick({data: row, rowIndex, event})
    }
  }, [])

  return (
    <div>
      <DatatableToolbar rowVirtualizer={rowVirtualizer} />
      <Box
        className="dt"
        ref={tableRef}
        {...contentProps}
        style={{['--cols' as any]: columns.cssGridTemplate, ...contentProps?.style}}
      >
        <DatatableHead onMouseDown={() => cellSelection.engine.reset()} />
        <div
          className="dtbody"
          onMouseUp={cellSelection.engine.handleMouseUp}
          style={{
            userSelect: module?.cellSelection?.enabled ? 'none' : undefined,
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualItem => {
            const row = dataFilteredAndSorted[virtualItem.index]
            const rowId = getRowKey(row)
            const isRowInSelection = cellSelection.engine.isRowSelected(virtualItem.index)
            return (
              <DatatableRow
                row={row}
                key={virtualItem.key}
                onCellClick={onCellClick}
                columns={columns.visible}
                rowId={rowId}
                virtualRow={virtualTable[rowId]}
                virtualItem={virtualItem}
                cellSelection_isRowInSelection={isRowInSelection}
                cellSelection_isSelected={cellSelection.engine.isSelected}
                cellSelection_handleMouseDown={cellSelection.engine.handleMouseDown}
                cellSelection_handleMouseEnter={cellSelection.engine.handleMouseEnter}
              />
            )
          })}
        </div>
        <PopupSelectedCell />
        {(() => {
          switch (popup?.name) {
            case 'STATS': {
              return <PopupStats event={popup.event} columnId={popup.columnId} />
            }
            case 'FILTER': {
              const column = columns.indexMap[popup.columnId]
              if (!column.type) {
                console.error('Missing type in', column)
                return
              }
              return (
                <DatatableFilterModal
                  data={dataFilteredExceptBy(popup.columnId) ?? []}
                  title={column.head}
                  anchorEl={popup.event.target}
                  columnId={popup.columnId}
                  renderValue={(_: any) => column.render(_).value}
                  options={getColumnOptions(popup.columnId)}
                  type={column.type}
                  sortBy={sortBy}
                  onOrderByChange={_ => dispatch({type: 'SORT', orderBy: _, column: popup.columnId})}
                  value={filters[popup.columnId] as any}
                  filterActive={!!filters[popup.columnId]}
                  onClose={() => dispatch({type: 'CLOSE_POPUP'})}
                  onClear={() => dispatch({type: 'FILTER', value: {[popup.columnId]: undefined}})}
                  onChange={(p: string, v: FilterValue) => {
                    dispatch({type: 'FILTER', value: {[p]: v}})
                    dispatch({type: 'CLOSE_POPUP'})
                    rowVirtualizer.scrollToIndex(0)
                  }}
                />
              )
            }
            default: {
              return null
            }
          }
        })()}
      </Box>
    </div>
  )
}
