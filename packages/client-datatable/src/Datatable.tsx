import React, {JSX, useEffect, useImperativeHandle, useMemo} from 'react'
import {useVirtualizer} from '@tanstack/react-virtual'
import {Box, LinearProgress, SxProps, Theme} from '@mui/material'
import {DatatableSkeleton} from './DatatableSkeleton'
import {useConfig} from './DatatableConfig'
import {FilterValue, Props, Row} from './core/types.js'
import {DatatableErrorBoundary} from './DatatableErrorBundary'
import {Provider, useCtx} from './core/DatatableContext'
import {DatatableToolbar} from './DatatableToolbar'
import {DatatableHead} from './head/DatatableHead'
import {DatatableRow} from './DatatableRow'
import {PopupStats} from './popup/PopupStats'
import {PopupFilter} from './popup/PopupFilter'
import {DatatableFormularBar} from './formulabar/DatatableFormularBar'

export interface DatatableHandle {
  scrollBottom: () => void
  scrollTop: () => void
}

export const Datatable = React.forwardRef(function <T extends Row>(
  {data, sx, rowHeight = 36, ...props}: Props<T>,
  ref: React.Ref<DatatableHandle>,
) {
  const tableRef = React.useRef(null) as unknown as React.RefObject<HTMLDivElement>
  const defaultProps = useConfig().defaultProps

  useImperativeHandle(ref, () => ({
    scrollTop: () => {
      tableRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },

    scrollBottom: () => {
      tableRef.current.scrollTo({
        top: tableRef.current.scrollHeight,
        behavior: 'smooth',
      })
    },
  }))

  if (!data && props.loading)
    return <DatatableSkeleton columns={props.columns.length} {...props.contentProps} sx={sx} />

  return (
    <DatatableErrorBoundary>
      <Provider {...{...defaultProps, ...props}} rowHeight={rowHeight} data={data ?? []} tableRef={tableRef}>
        {props.loading && <LinearProgress sx={{position: 'absolute', top: 0, right: 0, left: 0, height: 3}} />}
        <DatatableWithData sx={sx} />
      </Provider>
    </DatatableErrorBoundary>
  )
}) as <T extends Row>(props: Props<T> & {ref?: React.Ref<DatatableHandle>}) => JSX.Element

const DatatableWithData = ({sx}: {sx?: SxProps<Theme>}) => {
  const {
    sortBy,
    filters,
    popup,
    columns,
    header,
    dispatch,
    getRowKey,
    data,
    rowHeight,
    dataFilteredAndSorted,
    loading,
    dataFilteredExceptBy,
    getColumnOptions,
    cellSelection,
    tableRef,
    contentProps,
    module,
    renderEmptyState,
  } = useCtx(_ => ({
    sortBy: _.state.sortBy,
    filters: _.state.filters,
    popup: _.state.popup,
    columns: _.columns,
    header: _.header,
    dispatch: _.dispatch,
    getRowKey: _.getRowKey,
    data: _.data,
    rowHeight: _.rowHeight,
    dataFilteredAndSorted: _.dataFilteredAndSorted,
    loading: _.loading,
    dataFilteredExceptBy: _.dataFilteredExceptBy,
    getColumnOptions: _.getColumnOptions,
    cellSelection: _.cellSelection,
    tableRef: _.tableRef,
    contentProps: _.contentProps,
    module: _.module,
    renderEmptyState: _.renderEmptyState,
  }))

  const rowVirtualizer = useVirtualizer({
    count: dataFilteredAndSorted?.length ?? 0,
    getScrollElement: () => tableRef.current,
    estimateSize: () => rowHeight,
    overscan: 10,
  })

  useEffect(() => {
    const items = rowVirtualizer.getVirtualItems()
    if (!items.length) return

    dispatch({
      type: 'INIT_VIEWPORT_CACHE',
      data: dataFilteredAndSorted,
      columns: columns.all,
      getRowKey,
      offset: items[0].index,
      limit: items.length,
    })
  }, [dataFilteredAndSorted, columns.all, rowVirtualizer.range])

  useEffect(() => {
    const items = rowVirtualizer.getVirtualItems()
    if (!items.length) return

    const lastItem = items[items.length - 1]
    const lastIndex = lastItem.index

    if (lastIndex < dataFilteredAndSorted.length - 1) {
      dispatch({
        type: 'APPEND_VIEWPORT_CACHE',
        data: dataFilteredAndSorted,
        columns: columns.all,
        getRowKey,
        offset: lastIndex,
        limit: 22,
      })
    }
  }, [dataFilteredAndSorted, rowVirtualizer.range])

  return (
    <Box className="dt-container" sx={sx}>
      {header !== null && <DatatableToolbar rowVirtualizer={rowVirtualizer} />}
      {module?.cellSelection?.enabled &&
        (module.cellSelection.renderFormulaBarOnColumnSelected ||
          module.cellSelection.renderFormulaBarOnRowSelected) && <DatatableFormularBar />}

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
        <DatatableHead onMouseDown={cellSelection.reset} />
        {renderEmptyState && data.length === 0 && !loading && renderEmptyState}
        <div
          className="dtbody"
          onMouseUp={cellSelection.handleMouseUp}
          style={{
            userSelect: module?.cellSelection?.enabled ? 'none' : undefined,
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualItem => (
            <DatatableRow key={virtualItem.key} virtualItem={virtualItem} />
          ))}
        </div>
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
