import {Badge, Box, Icon, LinearProgress, TablePagination,} from '@mui/material'
import React, {isValidElement, useEffect, useMemo} from 'react'
import {useI18n} from '@/core/i18n'
import {Txt} from 'mui-extension'
import {Enum, map} from '@alexandreannic/ts-utils'
import {IpIconBtn} from '../IconBtn'
import {useMemoFn} from '@alexandreannic/react-hooks-lib'
import {generateXLSFromArray} from '@/shared/Datatable/util/generateXLSFile'
import {DatatableBody} from './DatatableBody'
import {DatatableHead} from './DatatableHead'
import {DatatableColumn, DatatableRow, DatatableTableProps} from '@/shared/Datatable/util/datatableType'
import {DatatableProvider, useDatatableContext} from '@/shared/Datatable/context/DatatableContext'
import {DatatableColumnToggle} from '@/shared/Datatable/DatatableColumnsToggle'
import {usePersistentState} from '@/shared/hook/usePersistantState'
import {DatatableModal} from '@/shared/Datatable/DatatableModal'
import {DatatableErrorBoundary} from '@/shared/Datatable/DatatableErrorBundary'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'
import {DatatableSkeleton} from '@/shared/Datatable/DatatableSkeleton'
import {useAsync} from '@/shared/hook/useAsync'
import {format} from 'date-fns'
import {Utils} from '@/utils/utils'
import {slugify} from '@infoportal-common'

export const Datatable = <T extends DatatableRow = DatatableRow>({
  total,
  data,
  columns,
  getRenderRowKey,
  defaultLimit,
  showColumnsToggle,
  showColumnsToggleBtnTooltip,
  rowsPerPageOptions = [20, 50, 100, 500],
  select,
  onFiltersChange,
  onDataChange,
  defaultFilters,
  rowStyle,
  ...props
}: DatatableTableProps<T>) => {
  const innerColumns = useMemo(() => {
    return columns.map(col => {
      if (DatatableColumn.isQuick(col)) {
        if (col.type === undefined) {
          (col as unknown as DatatableColumn.InnerProps<T>).render = (_: T) => {
            const value = col.renderQuick(_) ?? DatatableUtils.blank as any
            return {label: value, value: undefined}
          }
        } else {
          (col as unknown as DatatableColumn.InnerProps<T>).render = (_: T) => {
            const value = col.renderQuick(_) ?? DatatableUtils.blank as any
            return {
              label: value,
              tooltip: value,
              option: value,
              value,
            }
          }
        }
      } else if (DatatableColumn.isInner(col)) {
        const render = col.render
        col.render = (_: T) => {
          const rendered = render(_)
          if (col.type === 'select_multiple' && (rendered.value === undefined || rendered.value === null || (rendered.value as any)?.length === 0))
            rendered.value = [DatatableUtils.blank]
          else if (rendered.value === undefined || rendered.value === null)
            rendered.value = DatatableUtils.blank
          if (rendered.option === undefined) rendered.option = rendered.label
          return rendered as any
        }
      }
      return col as DatatableColumn.InnerProps<T>
    })
  }, [columns])

  return (
    <DatatableErrorBoundary>
      <DatatableProvider
        id={props.id}
        columns={innerColumns}
        data={data}
        defaultLimit={defaultLimit}
        select={select}
        getRenderRowKey={getRenderRowKey}
        rowStyle={rowStyle}
        onFiltersChange={onFiltersChange}
        onDataChange={onDataChange}
        defaultFilters={defaultFilters}
      >
        <_Datatable
          rowsPerPageOptions={rowsPerPageOptions}
          {...props}
        />
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
  ...props
}: Pick<DatatableTableProps<T>, 'exportAdditionalSheets' | 'onClickRows' | 'hidePagination' | 'id' | 'title' | 'showExportBtn' | 'rowsPerPageOptions' | 'renderEmptyState' | 'header' | 'loading' | 'sx'>) => {
  const ctx = useDatatableContext()
  const _generateXLSFromArray = useAsync(generateXLSFromArray)
  useEffect(() => ctx.select?.onSelect(ctx.selected.toArray), [ctx.selected.get])
  const {m} = useI18n()

  const exportToCSV = () => {
    if (ctx.data.filteredAndSortedData) {
      _generateXLSFromArray.call((slugify(title) ?? id ?? 'noname') + '_' + format(new Date(), 'yyyy-MM-dd_HH:mm:ss'), [
        {
          sheetName: 'data',
          data: ctx.data.filteredAndSortedData,
          schema: ctx.columns
            .filter(_ => _.noCsvExport !== true)
            .map((q, i) => ({
              head: q.head as string ?? q.id,
              render: (row: any) => {
                const rendered = q.render(row)
                if (rendered.export) return rendered.export
                let value = rendered.label
                if (value instanceof Date) value = format(value, 'yyyy-MM-dd hh:mm:ss')
                if (isValidElement(value)) value = Utils.extractInnerText(value)
                if (value !== '' && !isNaN(value as any)) value = +(value as number)
                return value as any
              }
            })),
        },
        ...exportAdditionalSheets ? exportAdditionalSheets(ctx.data.filteredAndSortedData as any) : []
      ])
    }
  }

  const filterCount = useMemoFn(ctx.data.filters, _ => Enum.keys(_).length)

  const [hiddenColumns, setHiddenColumns] = usePersistentState<string[]>([], {storageKey: DatatableUtils.localStorageKey.column + id})
  const filteredColumns = useMemo(() => ctx.columns.filter(_ => !hiddenColumns.includes(_.id)), [ctx.columns, hiddenColumns])

  return (
    <Box {...props}>
      {header !== null && (
        <Box sx={{position: 'relative', p: 1, display: 'flex', alignItems: 'center', width: '100%'}}>
          <Badge badgeContent={filterCount} color="primary" overlap="circular" onClick={() => {
            ctx.data.setFilters({})
            ctx.data.resetSearch()
          }}>
            <IpIconBtn children="filter_alt_off" tooltip={m.clearFilter} disabled={!filterCount}/>
          </Badge>
          <DatatableColumnToggle
            sx={{mr: 1}}
            columns={ctx.columns}
            hiddenColumns={hiddenColumns}
            onChange={_ => setHiddenColumns(_)}
            title={m.toggleDatatableColumns}
          />
          {typeof header === 'function' ? header({
            data: ctx.data.data as T[],
            filteredData: ctx.data.filteredData as T[],
            filteredAndSortedData: ctx.data.filteredAndSortedData as T[],
          }) : header}
          {showExportBtn && (
            <IpIconBtn
              loading={_generateXLSFromArray.loading}
              onClick={exportToCSV}
              children="download"
              tooltip={<div dangerouslySetInnerHTML={{__html: m._koboDatabase.downloadAsXLS}}/>}
            />
          )}
          {ctx.selected.size > 0 && (
            <Box sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
              borderRadius: t => t.shape.borderRadius + 'px',
              background: t => t.palette.background.paper,
            }}>
              <Box sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                fontWeight: t => t.typography.fontWeightBold,
                background: t => t.palette.action.focus,
                pl: 1,
                pr: 2,
                border: t => `2px solid ${t.palette.primary.main}`,
                borderTopLeftRadius: t => t.shape.borderRadius + 'px',
                borderTopRightRadius: t => t.shape.borderRadius + 'px',
                // margin: .75,
                // color: t => t.palette.primary.main,
                // borderRadius: t => t.shape.borderRadius + 'px',
              }}>
                <IpIconBtn color="primary" children="clear" onClick={ctx.selected.clear}/>
                <Box sx={{mr: 1, whiteSpace: 'nowrap'}}>
                  <b>{ctx.selected.size}</b> {m.selected}
                </Box>
                {ctx.select?.selectActions}
              </Box>
            </Box>
          )}
        </Box>
      )}
      <Box sx={{overflowX: 'auto'}}>
        <Box sx={{
          // width: 'max-coontent'
        }}>
          <Box id={id} component="table" className="borderY table" sx={{minWidth: '100%'}}>
            <DatatableHead
              data={ctx.data.filteredSortedAndPaginatedData?.data}
              search={ctx.data.search}
              filters={ctx.data.filters}
              columns={filteredColumns}
              columnsIndex={ctx.columnsIndex}
              select={ctx.select}
              selected={ctx.selected}
              onOpenFilter={ctx.modal.filterPopover.open}
              onOpenStats={ctx.modal.statsPopover.open}
            />
            <tbody>
            {map(ctx.data.filteredSortedAndPaginatedData, data => {
              return data.data.length > 0 ? (
                <DatatableBody
                  onClickRows={onClickRows}
                  data={data.data}
                  select={ctx.select}
                  columns={filteredColumns}
                  getRenderRowKey={ctx.getRenderRowKey}
                  selected={ctx.selected}
                  rowStyle={ctx.rowStyle}
                />
              ) : (
                <tr>
                  <td className="td-loading" colSpan={ctx.columns?.length ?? 1}>
                    <Box sx={{display: 'flex', alignItems: 'center', p: 4}}>
                      <Icon color="disabled" sx={{fontSize: 40, mr: 2}}>block</Icon>
                      <Txt color="disabled" size="title">{m.noDataAtm}</Txt>
                    </Box>
                  </td>
                </tr>
              )
            })}
            </tbody>
          </Box>
        </Box>
      </Box>
      {loading && (ctx.data.data ? (
        <LinearProgress sx={{position: 'absolute', left: 0, right: 0, top: 0}}/>
      ) : (
        <DatatableSkeleton/>
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
              offset: newPage * newLimit
            }))
          }}
        />
      )}
      <DatatableModal/>
    </Box>
  )
}

