import {Badge, Box, Icon, LinearProgress, Popover, TablePagination} from '@mui/material'
import React, {useEffect, useMemo} from 'react'
import {useI18n} from '@/core/i18n'
import {Txt} from '@/shared/Txt'
import {map, Obj} from '@axanc/ts-utils'
import {IpIconBtn} from '@/shared'
import {useMemoFn} from '@axanc/react-hooks'
import {DatatableBody} from './DatatableBody'
import {DatatableHead} from './DatatableHead'
import {DatatableColumn, DatatableRow, DatatableTableProps} from '@/shared/Datatable/util/datatableType'
import {DatatableProvider, useDatatableContext} from '@/shared/Datatable/context/DatatableContext'
import {DatatableColumnToggle} from '@/shared/Datatable/DatatableColumnsToggle'
import {DatatableModal} from '@/shared/Datatable/DatatableModal'
import {DatatableErrorBoundary} from '@/shared/Datatable/DatatableErrorBundary'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'
import {DatatableSkeleton} from '@/shared/Datatable/DatatableSkeleton'
import {useAsync} from '@/shared/hook/useAsync'
import {format} from 'date-fns'
import {slugify} from 'infoportal-common'
import {DatatableXlsGenerator} from '@/shared/Datatable/util/generateXLSFile'
import {DatatableSelectToolbar} from '@/shared/Datatable/DatatableSelectToolbar'
import {PanelBody} from '../Panel'

export const Datatable = <T extends DatatableRow = DatatableRow>({
  total,
  data,
  columns,
  onResizeColumn,
  getRenderRowKey,
  defaultLimit,
  rowsPerPageOptions = [20, 50, 100, 500],
  select,
  onFiltersChange,
  onDataChange,
  defaultFilters,
  rowStyle,
  columnsToggle,
  ...props
}: DatatableTableProps<T>) => {
  const innerColumns = useMemo(() => {
    return columns
      .map(col => {
        if (DatatableColumn.isQuick(col)) {
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
        return col as unknown as DatatableColumn.InnerProps<T>
      })
      .map(col => {
        const render = col.render
        col.render = (_: T) => {
          const rendered = render(_)
          if (col.type === 'select_multiple') {
            if (!Array.isArray(rendered.value)) {
              rendered.value = [rendered.value as string]
            }
            if (rendered.value.length === 0) rendered.value = [DatatableUtils.blank]
            // rendered.value = rendered.value.map(_ => _ ?? DatatableUtils.blank)
          } else if (rendered.value === undefined || rendered.value === null) rendered.value = DatatableUtils.blank
          if (!Object.hasOwn(rendered, 'option')) rendered.option = rendered.label
          return rendered as any
        }
        return col
      })
  }, [columns])

  return (
    <DatatableErrorBoundary>
      <DatatableProvider
        id={props.id}
        columns={innerColumns}
        onResizeColumn={onResizeColumn}
        data={data}
        defaultLimit={defaultLimit}
        select={select}
        getRenderRowKey={getRenderRowKey}
        rowStyle={rowStyle}
        onFiltersChange={onFiltersChange}
        columnsToggle={columnsToggle}
        onDataChange={onDataChange}
        defaultFilters={defaultFilters}
      >
        <_Datatable rowsPerPageOptions={rowsPerPageOptions} {...props} />
      </DatatableProvider>
    </DatatableErrorBoundary>
  )
}

const _Datatable = <T extends DatatableRow>({
  header,
  id,
  showExportBtn,
  renderEmptyState,
  loading,
  hidePagination,
  rowsPerPageOptions,
  title,
  onClickRows,
  exportAdditionalSheets,
  contentProps,
  ...props
}: Pick<
  DatatableTableProps<T>,
  | 'contentProps'
  | 'exportAdditionalSheets'
  | 'onClickRows'
  | 'hidePagination'
  | 'id'
  | 'title'
  | 'showExportBtn'
  | 'rowsPerPageOptions'
  | 'renderEmptyState'
  | 'header'
  | 'loading'
  | 'sx'
>) => {
  const ctx = useDatatableContext()
  const _generateXLSFromArray = useAsync(DatatableXlsGenerator.download)
  useEffect(() => ctx.select?.onSelect(ctx.selected.toArray), [ctx.selected.toArray])
  const {m} = useI18n()

  const exportToCSV = () => {
    if (ctx.data.filteredAndSortedData) {
      _generateXLSFromArray.call((slugify(title) ?? id ?? 'noname') + '_' + format(new Date(), 'yyyy-MM-dd_HH:mm:ss'), [
        {
          sheetName: 'data',
          data: ctx.data.filteredAndSortedData,
          schema: ctx.columns.filter(_ => _.noCsvExport !== true).map(DatatableXlsGenerator.columnsToParams),
        },
        ...(exportAdditionalSheets ? exportAdditionalSheets(ctx.data.filteredAndSortedData as any) : []),
      ])
    }
  }

  const filterCount = useMemoFn(ctx.data.filters, _ => Obj.keys(_).length)

  return (
    <Box {...props}>
      {header !== null && (
        <Box sx={{p: 1, position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'center', width: '100%'}}>
          <Badge
            badgeContent={filterCount}
            color="primary"
            overlap="circular"
            onClick={() => {
              ctx.data.setFilters({})
              ctx.data.resetSearch()
            }}
          >
            <IpIconBtn children="filter_alt_off" tooltip={m.clearFilter} disabled={!filterCount} />
          </Badge>
          {!ctx.columnsToggle.hideButton && (
            <DatatableColumnToggle
              columns={ctx.columns}
              hiddenColumns={ctx.columnsToggle.hiddenColumns}
              onChange={_ => ctx.columnsToggle.setHiddenColumns(_)}
              title={m._datatable.toggleColumns}
            />
          )}
          {showExportBtn && (
            <IpIconBtn
              loading={_generateXLSFromArray.loading}
              onClick={exportToCSV}
              children="download"
              tooltip={<div dangerouslySetInnerHTML={{__html: m._koboDatabase.downloadAsXLS}} />}
            />
          )}
          {typeof header === 'function'
            ? header({
                data: (ctx.data.data ?? []) as T[],
                filteredAndSortedData: (ctx.data.filteredAndSortedData ?? []) as T[],
              })
            : header}
          {ctx.selected.size > 0 && (
            <DatatableSelectToolbar>
              <IpIconBtn color="primary" children="clear" onClick={ctx.selected.clear} />
              <Box sx={{mr: 1, whiteSpace: 'nowrap'}}>
                <b>{ctx.selected.size}</b> {m.selected}
              </Box>
              {ctx.select?.selectActions}
            </DatatableSelectToolbar>
          )}
        </Box>
      )}
      <Box sx={{overflowX: 'auto'}}>
        <Box {...contentProps}>
          <Box id={id} component="table" className="borderY table" sx={{minWidth: '100%'}}>
            <DatatableHead
              onResizeColumn={ctx.onResizeColumn}
              data={ctx.data.filteredSortedAndPaginatedData?.data}
              search={ctx.data.search}
              filters={ctx.data.filters}
              onHideColumns={ctx.columnsToggle.handleHide}
              columns={ctx.columnsToggle.filteredColumns}
              columnsIndex={ctx.columnsIndex}
              select={ctx.select}
              selected={ctx.selected}
              onOpenFilter={ctx.modal.filterPopover.open}
              onOpenStats={ctx.modal.statsPopover.open}
            />
            <tbody ref={ctx.selection.tbodyRef} onPointerUp={ctx.selection.events.handlePointerUp}>
              {map(ctx.data.filteredSortedAndPaginatedData, data => {
                return data.data.length > 0 ? (
                  <DatatableBody
                    // onPointerUp={ctx.selection.events.handlePointerUp}
                    selectedColumnId={ctx.selection.selectedColumnId}
                    selectedRowIds={ctx.selection.selectedRowIds}
                    // selectedRowIdFirst={ctx.selection.selectedRowIdFirst}
                    handlePointerDown={ctx.selection.events.handlePointerDown}
                    handlePointerEnter={ctx.selection.events.handlePointerEnter}
                    // handlePointerUp={ctx.selection.events.handlePointerUp}
                    // selectedRowIdFirst={ctx.selection.selectedRowInitial}
                    onClickRows={onClickRows}
                    data={data.data}
                    select={ctx.select}
                    columns={ctx.columnsToggle.filteredColumns}
                    getRenderRowKey={ctx.getRenderRowKey}
                    selected={ctx.selected}
                    rowStyle={ctx.rowStyle}
                  />
                ) : (
                  <tr>
                    <td className="td-loading" colSpan={ctx.columns?.length ?? 1}>
                      <Box sx={{display: 'flex', alignItems: 'center', p: 4}}>
                        <Icon color="disabled" sx={{fontSize: 40, mr: 2}}>
                          block
                        </Icon>
                        <Txt color="disabled" size="title">
                          {m.noDataAtm}
                        </Txt>
                      </Box>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Box>
        </Box>
      </Box>
      {loading &&
        (ctx.data.data ? (
          <LinearProgress sx={{position: 'absolute', left: 0, right: 0, top: 0}} />
        ) : (
          <DatatableSkeleton columns={ctx.columns.length} />
        ))}
      {!hidePagination && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={ctx.data.filteredData?.length ?? 0}
          rowsPerPage={ctx.data.search.limit}
          page={ctx.data.search.offset / ctx.data.search.limit}
          onPageChange={(event: unknown, newPage: number) => {
            ctx.data.setSearch(prev => ({...prev, offset: newPage * ctx.data.search.limit}))
          }}
          onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const newLimit = parseInt(event.target.value, 10)
            const newPage = Math.floor(ctx.data.search.offset / newLimit)
            ctx.data.setSearch(prev => ({
              ...prev,
              limit: newLimit,
              offset: newPage * newLimit,
            }))
          }}
        />
      )}
      <DatatableModal />
    </Box>
  )
}
