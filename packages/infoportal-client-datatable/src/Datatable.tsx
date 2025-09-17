import React, {useCallback, useEffect} from 'react'
import {useVirtualizer} from '@tanstack/react-virtual'
import {Box, LinearProgress, SxProps, Theme} from '@mui/material'
import {DatatableHead} from '@/head/DatatableHead'
import {Provider, useCtx} from '@/core/DatatableContext'
import {PopupStats} from '@/popup/PopupStats'
import {PopupFilter} from '@/popup/PopupFilter'
import {DatatableRow} from '@/DatatableRow'
import {FilterValue, Props, Row} from '@/core/types'
import {PopupSelectedCell} from '@/popup/PopupSelectedCell'
import {DatatableErrorBoundary} from '@/DatatableErrorBundary'
import {DatatableSkeleton} from '@/DatatableSkeleton'
import {DatatableToolbar} from '@/DatatableToolbar'
import {useConfig} from '@/DatatableConfig'

export const Datatable = <T extends Row>({data, sx, ...props}: Props<T>) => {
  if (!data) return <DatatableSkeleton columns={props.columns.length} {...props.contentProps} sx={sx} />
  const tableRef = React.useRef(null) as unknown as React.RefObject<HTMLDivElement>
  const defaultProps = useConfig().defaultProps
  return (
    <DatatableErrorBoundary>
      <Provider {...{...defaultProps, ...props}} data={data} tableRef={tableRef}>
        {props.loading && <LinearProgress sx={{position: 'absolute', top: 0, right: 0, left: 0, height: 3}} />}
        <DatatableWithData sx={sx} />
      </Provider>
    </DatatableErrorBoundary>
  )
}

const DatatableWithData = ({sx}: {sx?: SxProps<Theme>}) => {
  const {
    columns,
    header,
    state: {sortBy, filters, virtualTable, popup},
    dispatch,
    getRowKey,
    data,
    rowHeight = 32,
    dataFilteredAndSorted,
    dataFilteredExceptBy,
    getColumnOptions,
    cellSelection,
    tableRef,
    contentProps,
    rowStyle,
    module,
  } = useCtx(_ => _)

  const overscan = 10
  const rowVirtualizer = useVirtualizer({
    count: dataFilteredAndSorted?.length ?? 0,
    debug: false,
    getScrollElement: () => tableRef.current,
    estimateSize: () => rowHeight,
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
    <Box className="dt-container" sx={sx}>
      {header !== null && <DatatableToolbar rowVirtualizer={rowVirtualizer} />}
      <Box
        className="dt"
        ref={tableRef}
        {...contentProps}
        style={{
          ['--cols' as any]: columns.cssGridTemplate,
          ['--dt-row-height' as any]: rowHeight + 'px',
          ...contentProps?.style,
        }}
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
                rowStyle={rowStyle}
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
                <PopupFilter
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
    </Box>
  )
}
