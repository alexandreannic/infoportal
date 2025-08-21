import {Datatable} from '@/shared/Datatable3/state/types.js'
import React, {useCallback, useEffect, useMemo} from 'react'
import {DatatableFilterValue} from '@/shared/Datatable/util/datatableType.js'
import {useVirtualizer} from '@tanstack/react-virtual'
import {Badge} from '@mui/material'
import './Datatable.css'
import {DatatableHead} from '@/shared/Datatable3/DatatableHead.js'
import {SelectedCellPopover, useCellSelection} from '@/shared/Datatable3/state/useCellSelection.js'
import {Datatable3Provider, useDatatable3Context} from '@/shared/Datatable3/state/DatatableContext.js'
import {IpIconBtn, Txt} from '@/shared/index.js'
import {useMemoFn} from '@axanc/react-hooks'
import {Obj} from '@axanc/ts-utils'
import {useI18n} from '@/core/i18n/index.js'
import {DatatablePopupStats} from '@/shared/Datatable3/popup/DatatablePopupStats.js'
import {DatatableFilterModal3} from '@/shared/Datatable3/popup/DatatablePopupFilter.js'
import {DatatableRow} from '@/shared/Datatable3/DatatableRow.js'

export const Datatable3 = <T extends Datatable.Row>({data, columns, header, ...props}: Datatable.Props<T>) => {
  useEffect(() => {
    data?.forEach((d: any, i) => {
      d.index = i
    })
  }, [data])

  if (!data) return 'Loading...'
  return (
    <Datatable3Provider {...props} data={data} columns={columns}>
      <DatatableWithData header={header} />
    </Datatable3Provider>
  )
}

export const DatatableWithData = <T extends Datatable.Row>({header}: {header: Datatable.Props<T>['header']}) => {
  const {m, formatLargeNumber} = useI18n()
  const {
    columns,
    state: {sortBy, filters, colWidths, colVisibility, virtualTable, popup},
    dispatch,
    getRowKey,
    data,
    dataFilteredAndSorted,
    dataFilteredExceptBy,
    getColumnOptions,
  } = useDatatable3Context(_ => _)

  useEffect(() => {
    dispatch({type: 'INIT_DATA', data: dataFilteredAndSorted, columns: columns.all, getRowKey, limit: 40})
  }, [dataFilteredAndSorted])

  const parentRef = React.useRef(null)

  const overscan = 10
  const rowVirtualizer = useVirtualizer({
    count: dataFilteredAndSorted?.length ?? 0,
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

  const cellSelection = useCellSelection(parentRef)
  const filterCount = useMemoFn(filters, _ => Obj.keys(_).length)

  const onCellClick = useCallback((rowIndex: number, colIndex: number, event: React.MouseEvent<HTMLElement>) => {
    console.log(
      rowIndex,
      colIndex,
      columns.visible[colIndex].id,
      dataFilteredAndSorted[rowIndex],
      dataFilteredAndSorted[rowIndex][columns.visible[colIndex].id],
    )
  }, [])

  console.log(
    columns.visible.map(_ => _.id),
    colWidths,
  )
  return (
    <>
      <div className="dt-toolbar">
        <Badge
          badgeContent={filterCount}
          color="primary"
          overlap="circular"
          onClick={() => {
            dispatch({type: 'FILTER_CLEAR'})
            rowVirtualizer.scrollToIndex(0)
          }}
        >
          <IpIconBtn children="filter_alt_off" tooltip={m.clearFilter} disabled={!filterCount} />
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
      <div className="dt" ref={parentRef} style={{['--cols' as any]: columns.cssGridTemplate}}>
        <DatatableHead onMouseDown={() => cellSelection.reset()} />
        <div
          className="dtbody"
          onMouseUp={cellSelection.handleMouseUp}
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualItem => {
            const row = dataFilteredAndSorted[virtualItem.index]
            const rowId = getRowKey(row)
            const isRowInSelection = cellSelection.isRowSelected(virtualItem.index)
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
                cellSelection_isSelected={cellSelection.isSelected}
                cellSelection_handleMouseDown={cellSelection.handleMouseDown}
                cellSelection_handleMouseEnter={cellSelection.handleMouseEnter}
              />
            )
          })}
        </div>
        <SelectedCellPopover {...cellSelection} />
        {(() => {
          switch (popup?.name) {
            case 'STATS': {
              return <DatatablePopupStats event={popup.event} columnId={popup.columnId} />
            }
            case 'FILTER': {
              const column = columns.indexMap[popup.columnId]
              if (!column.type) {
                console.error('Missing type in', column)
                return
              }
              return (
                <DatatableFilterModal3
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
                  onChange={(p: string, v: DatatableFilterValue) => {
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
      </div>
    </>
  )
}
