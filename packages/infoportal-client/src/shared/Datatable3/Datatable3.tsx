import {Datatable} from '@/shared/Datatable3/state/types.js'
import React, {useEffect, useMemo} from 'react'
import {DatatableColumn, DatatableFilterValue} from '@/shared/Datatable/util/datatableType.js'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils.js'
import {useVirtualizer} from '@tanstack/react-virtual'
import {Badge} from '@mui/material'
import './Datatable.css'
import {DatatableHead} from '@/shared/Datatable3/DatatableHead.js'
import {SelectedCellPopover, useCellSelection} from '@/shared/Datatable3/state/useCellSelection.js'
import {Datatable3Provider, useDatatable3Context} from '@/shared/Datatable3/state/DatatableContext.js'
import {IpIconBtn} from '@/shared/index.js'
import {useMemoFn} from '@axanc/react-hooks'
import {Obj} from '@axanc/ts-utils'
import {useI18n} from '@/core/i18n/index.js'
import {DatatablePopupStats} from '@/shared/Datatable3/popup/DatatablePopupStats.js'
import {DatatableFilterModal3} from '@/shared/Datatable3/popup/DatatablePopupFilter.js'
import {DatatableRow} from '@/shared/Datatable3/DatatableRow.js'

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
  const columns: Datatable.Column.InnerProps<T>[] = useMemo(() => {
    const x = outerColumns.map(toInnerColumn).map(harmonizeColRenderValue)
    const rowNumberColumn: Datatable.Column.InnerProps<T> = {
      type: 'string',
      group: {label: 'Meta', id: 'meta'},
      id: 'index',
      head: 'index',
      align: 'right',
      width: 50,
      render: (_: any) => ({
        value: _?.index,
        label: _?.index,
      }),
    }
    return [rowNumberColumn, ...x]
  }, [outerColumns])

  if (!data) return 'Loading...'
  return (
    <Datatable3Provider {...props} data={data} columns={columns}>
      <DatatableWithData />
    </Datatable3Provider>
  )
}

export const DatatableWithData = <T extends Datatable.Row>() => {
  const {m} = useI18n()
  const {
    columns,
    columnsIndex,
    state: {sortBy, filters, colWidths, colVisibility, virtualTable, popup},
    dispatch,
    getRowKey,
    data,
    dataFilteredAndSorted,
    dataFilteredExceptBy,
    getColumnOptions,
  } = useDatatable3Context(_ => _)

  const cssGridTemplate = useMemo(
    () =>
      columns
        // .filter(c => state.visibleCols.has(c.id))
        .map(c => (colWidths[c.id] ?? c.width ?? 120) + 'px')
        .join(' '),
    [columns, colWidths, colVisibility],
  )

  useEffect(() => {
    dispatch({type: 'INIT_DATA', data: dataFilteredAndSorted, columns, getRowKey, limit: 40})
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
      columns,
      getRowKey,
      offset: lastIndex,
      limit: 22 + overscan,
    })
  }, [dataFilteredAndSorted, rowVirtualizer.getVirtualItems()])

  const cellSelection = useCellSelection(parentRef)
  const filterCount = useMemoFn(filters, _ => Obj.keys(_).length)

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
        {/*{data.length} --- {dataFilteredAndSorted.length}*/}
      </div>
      <div className="dt" ref={parentRef} style={{['--cols' as any]: cssGridTemplate}}>
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
                key={virtualItem.key}
                columns={columns}
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
              const column = columnsIndex[popup.columnId]
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
