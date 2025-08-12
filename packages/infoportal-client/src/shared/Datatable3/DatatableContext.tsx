import React, {ReactNode, useMemo, useReducer} from 'react'
import {Datatable} from '@/shared/Datatable3/types.js'
import {datatableReducer, initialState} from '@/shared/Datatable3/reducer.js'
import {KeyOf, seq} from '@axanc/ts-utils'
import {useDatatableData} from '@/shared/Datatable3/useDatatableData.js'
import {createContext, useContextSelector} from 'use-context-selector'
import {useDatatableOptions3} from '@/shared/Datatable3/useDatatableOptions3.js'
import {DatatableOptions} from '@/shared/Datatable/util/datatableType.js'

export type DatatableContext<T extends Datatable.Row = any> = {
  getColumnOptions: (_: KeyOf<T>) => DatatableOptions[] | undefined
  state: Datatable.State<T>
  dispatch: React.Dispatch<Datatable.Event<T>>
  columnsIndex: Record<string, Datatable.Column.InnerProps<T>>
  columns: Datatable.Column.InnerProps<T>[]
  data: T[]
  dataFilteredAndSorted: T[]
  getRowKey: Datatable.Props<T>['getRowKey']
  dataFilteredExceptBy: (key: KeyOf<T>) => T[]
}
const Context = createContext<DatatableContext>({} as any)

export const useDatatable3Context = <Selected extends any>(selector: (_: DatatableContext) => Selected): Selected => {
  return useContextSelector(Context, selector)
}

export const Datatable3Provider = <T extends Datatable.Row>({
  data,
  children,
  columns,
  getRowKey,
}: {
  getRowKey: Datatable.Props<T>['getRowKey']
  columns: Datatable.Column.InnerProps<T>[]
  children: ReactNode
  data: T[]
}) => {
  const [state, dispatch] = useReducer(datatableReducer<T>(), initialState<T>())
  const columnsIndex = useMemo(
    () => seq(columns).reduceObject<Record<string, Datatable.Column.InnerProps<T>>>(_ => [_.id, _]),
    [columns],
  )

  const {filteredAndSortedData, filterExceptBy} = useDatatableData<T>({
    data,
    filters: state.filters,
    sortBy: state.sortBy,
    colIndex: columnsIndex,
  })

  const getColumnOptions: any /** TODO */ = useDatatableOptions3<T>({
    dataFilteredAndSorted: filteredAndSortedData,
    dataFilteredExceptBy: filterExceptBy as any, //TODO
    columns: columns,
    columnsIndex,
    filters: state.filters,
  })

  return (
    <Context.Provider
      value={{
        columnsIndex,
        data,
        getRowKey,
        columns,
        getColumnOptions,
        dataFilteredAndSorted: filteredAndSortedData,
        dataFilteredExceptBy: filterExceptBy as any, //TODO
        state,
        dispatch,
      }}
    >
      {children}
    </Context.Provider>
  )
}
