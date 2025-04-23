import React, {ReactNode, useContext, useEffect, useMemo} from 'react'
import {UseSetState} from '@alexandreannic/react-hooks-lib'
import {UseDatatableData, useDatatableData} from '@/shared/Datatable/context/useDatatableData'
import {DatatableModal, useDatatableModal} from '@/shared/Datatable/context/useDatatableModal'
import {useSetStateIp} from '@/shared/hook/useSetState'
import {seq} from '@axanc/ts-utils'
import {DatatableColumn, DatatableRow, DatatableTableProps, OrderBy} from '@/shared/Datatable/util/datatableType'
import {UseDatatableOptions, useDatatableOptions} from '@/shared/Datatable/context/useDatatableOptions'
import {KeyOf} from 'infoportal-common'
import {UseDatabaseColVisibility, useDatabaseColVisibility} from '@/shared/Datatable/context/useDatabaseColVisibility'

export interface DatatableContext<T extends DatatableRow> {
  data: UseDatatableData<T>
  columnsIndex: Record<string, DatatableColumn.InnerProps<T>>
  select: DatatableTableProps<T>['select']
  columns: DatatableColumn.InnerProps<T>[]
  getRenderRowKey: DatatableTableProps<T>['getRenderRowKey']
  onResizeColumn: DatatableTableProps<T>['onResizeColumn']
  columnsToggle: UseDatabaseColVisibility<T>
  rowStyle: DatatableTableProps<T>['rowStyle']
  selected: UseSetState<string>
  modal: DatatableModal<T>
  options: UseDatatableOptions<T>
}

const DatatableContext = React.createContext({} as DatatableContext<any>)

export const useDatatableContext = <T extends DatatableRow>() => useContext<DatatableContext<T>>(DatatableContext)

export const DatatableProvider = <T extends DatatableRow>({
  children,
  defaultLimit,
  columns,
  select,
  rowStyle,
  onResizeColumn,
  // sortBy,
  // orderBy,
  onDataChange,
  columnsToggle: _columnsToggle,
  onFiltersChange,
  getRenderRowKey,
  defaultFilters,
  data: _data,
  id,
}: {
  id: string
  defaultLimit?: number
  onFiltersChange: DatatableTableProps<T>['onFiltersChange']
  onDataChange: DatatableTableProps<T>['onDataChange']
  defaultFilters: DatatableTableProps<T>['defaultFilters']
  columns: DatatableColumn.InnerProps<T>[]
  data: DatatableTableProps<T>['data']
  getRenderRowKey: DatatableTableProps<T>['getRenderRowKey']
  select: DatatableTableProps<T>['select']
  rowStyle: DatatableTableProps<T>['rowStyle']
  sortBy?: KeyOf<T>
  orderBy?: OrderBy
  onResizeColumn: DatatableTableProps<T>['onResizeColumn']
  columnsToggle: DatatableTableProps<T>['columnsToggle']
  children: ReactNode
}) => {
  const selected = useSetStateIp<string>()
  const columnsIndex = useMemo(
    () => seq(columns).reduceObject<Record<string, DatatableColumn.InnerProps<T>>>((_) => [_.id, _]),
    [columns],
  )
  const data = useDatatableData<T>({
    id,
    columnsIndex,
    data: _data,
    defaultLimit,
    defaultFilters,
  })

  useEffect(() => {
    onFiltersChange?.(data.filters)
    onDataChange?.({
      data: data.data,
      filteredData: data.filteredData,
      filteredAndSortedData: data.filteredAndSortedData,
      filteredSortedAndPaginatedData: data.filteredSortedAndPaginatedData,
    })
  }, [data.filters])

  const options = useDatatableOptions<T>({
    data,
    columns: columns,
    columnsIndex,
  })

  const columnsToggle = useDatabaseColVisibility({
    columns,
    id,
    ..._columnsToggle,
  })

  const modal = useDatatableModal<T>({data})

  const typeSafeContext: DatatableContext<T> = {
    columnsIndex,
    selected,
    data,
    rowStyle,
    modal,
    columns,
    select,
    columnsToggle,
    options,
    onResizeColumn,
    getRenderRowKey,
  }

  return <DatatableContext.Provider value={typeSafeContext}>{children}</DatatableContext.Provider>
}
