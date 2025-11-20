import React, {ReactNode, useCallback, useReducer} from 'react'
import {KeyOf} from '@axanc/ts-utils'
import {createContext, useContextSelector} from 'use-context-selector'
import {useEffectFn} from '@axanc/react-hooks'
import {GetRowKey, Props, Row} from './types.js'
import {Action, datatableReducer, initialState, State} from './reducer'
import {useDatatableColumns, UseDatatableColumns} from './useColumns'
import {UseCellSelection, useCellSelection} from './useCellSelection'
import {useData} from './useData'
import {useDatatableOptions} from './useOptions'
import {UseDraggingRows, useDraggingRows} from './useDraggingRows'

export type DatatableContext<T extends Row = any> = Omit<Props<T>, 'getRowKey' | 'rowHeight' | 'data' | 'columns'> & {
  getRowKey: GetRowKey
  tableRef: React.RefObject<HTMLDivElement>
  getColumnOptions: ReturnType<typeof useDatatableOptions<T>>
  state: State<T>
  rowHeight: number
  dispatch: React.Dispatch<Action<T>>
  columns: UseDatatableColumns<T>
  data: T[]
  dndRows: UseDraggingRows
  dataFilteredAndSorted: T[]
  dataFilteredExceptBy: (key: KeyOf<T>) => T[]
  cellSelection: UseCellSelection
}

const Context = createContext<DatatableContext>({} as any)

export const useCtx = <Selected extends any>(selector: (_: DatatableContext) => Selected): Selected => {
  return useContextSelector(Context, selector)
}

export const Provider = <T extends Row>({
  getRowKey,
  ...props
}: Omit<Props<T>, 'rowHeight' | 'data'> & {
  rowHeight: number
  data: T[]
  children: ReactNode
  tableRef: React.MutableRefObject<HTMLDivElement>
}) => {
  const {module} = props
  const [state, _dispatch] = useReducer(datatableReducer<T>(), initialState<T>())

  useEffectFn(module?.columnsToggle?.hidden, hiddenColumns => {
    _dispatch({type: 'SET_HIDDEN_COLUMNS', hiddenColumns})
  })

  useEffectFn(props.defaultFilters, _ => {
    if (_) _dispatch({type: 'FILTER', value: _})
  })

  const dispatch: React.Dispatch<Action<T>> = useCallback(
    _ => {
      _dispatch(_)
      props.onEvent?.(_)
    },
    [_dispatch, props.onEvent],
  )

  const columns = useDatatableColumns({
    colHidden: state.colHidden,
    colWidths: state.colWidths,
    showRowIndex: props.showRowIndex,
    baseColumns: props.columns,
  })

  const {filteredAndSortedData, filterExceptBy} = useData<T>({
    data: props.data,
    filters: state.filters,
    sortBy: state.sortBy,
    colIndex: columns.indexMap,
    showRowIndex: props.showRowIndex,
  })

  const getColumnOptions: any /** TODO */ = useDatatableOptions<T>({
    dataFilteredAndSorted: filteredAndSortedData,
    dataFilteredExceptBy: filterExceptBy as any, //TODO
    columns: columns.visible,
    columnsIndex: columns.indexMap,
    filters: state.filters,
  })

  const cellSelection = useCellSelection({
    dispatch,
    visibleColumns: columns.visible,
    filteredAndSortedData,
    getRowKey: getRowKey as GetRowKey,
    selectedColumnIds: state.selectedColumnIds,
    selectedRowIds: state.selectedRowIds,
    tableRef: props.tableRef,
    mode: module?.cellSelection?.mode ?? (module?.rowsDragging?.enabled ? 'row' : undefined),
    disabled: module?.cellSelection?.enabled !== true,
  })

  const dndRows = useDraggingRows({
    selectedRowIdsRef: cellSelection.selectedRowIdsRef,
    selecting: cellSelection.selecting,
    disabled: module?.rowsDragging?.enabled !== true,
    dispatch,
    overIndex: state.draggingRow.overIndex,
    selectedRowIds: state.selectedRowIds,
    rowHeight: props.rowHeight,
  })

  return (
    <Context.Provider
      value={{
        ...props,
        getRowKey: getRowKey as GetRowKey,
        columns,
        getColumnOptions,
        dataFilteredAndSorted: filteredAndSortedData,
        dataFilteredExceptBy: filterExceptBy as any, //TODO
        state,
        dispatch,
        dndRows,
        cellSelection: cellSelection,
      }}
    >
      {props.children}
    </Context.Provider>
  )
}
