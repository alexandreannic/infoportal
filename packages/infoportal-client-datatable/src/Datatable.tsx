import React, {useCallback, useEffect} from 'react'
import {useVirtualizer} from '@tanstack/react-virtual'
import {Badge, Box, BoxProps} from '@mui/material'
import './css/Datatable.css'
import {DatatableHead} from '@/DatatableHead.js'
import {DatatableProvider, useDatatableContext} from '@/core/DatatableContext.js'
import {IconBtn, Txt} from '@infoportal/client-core'
import {useMemoFn} from '@axanc/react-hooks'
import {Obj} from '@axanc/ts-utils'
import {useConfig} from '@/DatatableConfig.js'
import {PopupStats} from '@/popup/PopupStats.js'
import {DatatableFilterModal} from '@/popup/PopupFilter.js'
import {DatatableRow} from '@/DatatableRow.js'
import {DatatableColumnToggle} from '@/DatatableColumnsToggle.js'
import {FilterValue, Props, Row} from '@/core/types.js'
import {PopupSelectedCell} from '@/popup/PopupSelectedCell.js'

export const Datatable = <T extends Row>({data, columns, showRowIndex, contentProps, header, ...props}: Props<T>) => {
  if (!data) return 'Loading...'
  const tableRef = React.useRef(null) as unknown as React.MutableRefObject<HTMLDivElement>
  return (
    <DatatableProvider {...props} data={data} columns={columns} showRowIndex={showRowIndex} tableRef={tableRef}>
      <DatatableWithData header={header} tableRef={tableRef} contentProps={contentProps} />
    </DatatableProvider>
  )
}

const DatatableWithData = <T extends Row>({
  header,
  tableRef,
  contentProps,
}: {
  contentProps?: BoxProps
  tableRef: React.MutableRefObject<HTMLDivElement>
  header: Props<T>['header']
}) => {
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
  } = useDatatableContext(_ => _)

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
  }, [columns.all])

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

  const filterCount = useMemoFn(filters, _ => Obj.keys(_).length)

  const onCellClick = useCallback((rowIndex: number, colIndex: number, event: React.MouseEvent<HTMLElement>) => {
    const row = dataFilteredAndSorted[rowIndex]
    const column = columns.visible[colIndex]
    if (column.onClick) {
      column.onClick({data: row, rowIndex, event})
    }
  }, [])

  return (
    <div>
      <div className="dt-toolbar">
        <DatatableColumnToggle
          columns={columns.all}
          hiddenColumns={columns.all.map(_ => _.id).filter(_ => !columns.visible.map(_ => _.id).includes(_))}
          onChange={hiddenColumns => dispatch({type: 'SET_HIDDEN_COLUMNS', hiddenColumns})}
        />
        <Badge
          badgeContent={filterCount}
          color="primary"
          overlap="circular"
          onClick={() => {
            dispatch({type: 'FILTER_CLEAR'})
            rowVirtualizer.scrollToIndex(0)
          }}
        >
          <IconBtn children="filter_alt_off" tooltip={m.clearFilter} disabled={!filterCount} />
        </Badge>
        {typeof header === 'function'
          ? header({
              data: (data ?? []) as T[],
              filteredAndSortedData: (dataFilteredAndSorted ?? []) as T[],
            })
          : header}
        <Txt bold color="hint" sx={{mr: 0.5}}>
          {formatLargeNumber(dataFilteredAndSorted.length)}
        </Txt>
      </div>
      <Box
        className="dt"
        ref={tableRef}
        style={{['--cols' as any]: columns.cssGridTemplate, ...contentProps?.style}}
        {...contentProps}
      >
        <DatatableHead onMouseDown={() => cellSelection.engine.reset()} />
        <div
          className="dtbody"
          onMouseUp={cellSelection.engine.handleMouseUp}
          style={{
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
        <PopupSelectedCell {...cellSelection} />
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
