import React, {ReactNode, useReducer} from 'react'
import {KeyOf} from '@axanc/ts-utils'
import {createContext, useContextSelector} from 'use-context-selector'
import {useEffectFn} from '@axanc/react-hooks'
import {Option, Props, Row} from './types'
import {Action, datatableReducer, initialState, State} from './reducer'
import {useDatatableColumns, UseDatatableColumns} from './useColumns'
import {useCellSelectionComputed, UseCellSelectionComputed} from './useCellSelectionComputed'
import {UseCellSelection, useCellSelectionEngine} from './useCellSelectionEngine'
import {useData} from './useData'
import {useDatatableOptions} from './useOptions'

export type DatatableContext<T extends Row = any> = Omit<Props<T>, 'data' | 'columns'> & {
  tableRef: React.MutableRefObject<HTMLDivElement>
  getColumnOptions: (_: KeyOf<T>) => Option[] | undefined
  state: State<T>
  dispatch: React.Dispatch<Action<T>>
  columns: UseDatatableColumns<T>
  data: T[]
  dataFilteredAndSorted: T[]
  dataFilteredExceptBy: (key: KeyOf<T>) => T[]
  cellSelection: UseCellSelectionComputed & {
    engine: Pick<
      UseCellSelection,
      | 'isSelected'
      | 'isColumnSelected'
      | 'isRowSelected'
      | 'handleMouseDown'
      | 'handleMouseEnter'
      | 'handleMouseUp'
      | 'reset'
      | 'anchorEl'
    >
  }
}

const Context = createContext<DatatableContext>({} as any)

export const useCtx = <Selected extends any>(selector: (_: DatatableContext) => Selected): Selected => {
  return useContextSelector(Context, selector)
}

export const Provider = <T extends Row>(
  props: Omit<Props<T>, 'data'> & {
    data: T[]
    children: ReactNode
    tableRef: React.MutableRefObject<HTMLDivElement>
  },
) => {
  const {module} = props
  const [state, _dispatch] = useReducer(datatableReducer<T>(), initialState<T>())

  useEffectFn(module?.columnsToggle?.hidden, hiddenColumns => {
    _dispatch({type: 'SET_HIDDEN_COLUMNS', hiddenColumns})
  })

  useEffectFn(props.defaultFilters, _ => {
    if (_) _dispatch({type: 'FILTER', value: _})
  })

  const dispatch: React.Dispatch<Action<T>> = _ => {
    _dispatch(_)
    props.onEvent?.(_)
  }

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

  const cellSelectionEngine = useCellSelectionEngine({
    tableRef: props.tableRef,
    disabled: module?.cellSelection?.enabled !== true,
  })
  const cellSectionComputed = useCellSelectionComputed({
    getRowKey: props.getRowKey,
    filteredAndSortedData,
    columnsIndex: columns.indexMap,
    visibleColumns: columns.visible,
    cellSelectionEngine,
  })

  return (
    <Context.Provider
      value={{
        ...props,
        columns,
        getColumnOptions,
        dataFilteredAndSorted: filteredAndSortedData,
        dataFilteredExceptBy: filterExceptBy as any, //TODO
        state,
        dispatch,
        cellSelection: {
          engine: {
            handleMouseDown: cellSelectionEngine.handleMouseDown,
            handleMouseEnter: cellSelectionEngine.handleMouseEnter,
            handleMouseUp: cellSelectionEngine.handleMouseUp,
            reset: cellSelectionEngine.reset,
            anchorEl: cellSelectionEngine.anchorEl,
            isSelected: cellSelectionEngine.isSelected,
            isColumnSelected: cellSelectionEngine.isColumnSelected,
            isRowSelected: cellSelectionEngine.isRowSelected,
          },
          selectedCount: cellSectionComputed.selectedCount,
          areAllColumnsSelected: cellSectionComputed.areAllColumnsSelected,
          selectedRowIds: cellSectionComputed.selectedRowIds,
          selectedColumnsIds: cellSectionComputed.selectedColumnsIds,
          selectedColumnUniq: cellSectionComputed.selectedColumnUniq,
          selectColumn: cellSectionComputed.selectColumn,
        },
      }}
    >
      {props.children}
    </Context.Provider>
  )
}
