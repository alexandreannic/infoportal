import React, {ReactNode, useReducer} from 'react'
import {Action, datatableReducer, initialState, State} from '@/core/reducer'
import {KeyOf} from '@axanc/ts-utils'
import {useDatatableData} from '@/core/useDatatableData'
import {createContext, useContextSelector} from 'use-context-selector'
import {useDatatableOptions} from '@/core/useDatatableOptions'
import {UseDatatableColumns, useDatatableColumns} from '@/core/useColumns'
import {UseCellSelection, useCellSelectionEngine} from '@/core/useCellSelectionEngine'
import {UseCellSelectionComputed, useCellSelectionComputed} from '@/core/useCellSelectionComputed'
import {Column, Option, Props, Row} from '@/core/types'

export type DatatableContext<T extends Row = any> = {
  getColumnOptions: (_: KeyOf<T>) => Option[] | undefined
  state: State<T>
  dispatch: React.Dispatch<Action<T>>
  columns: UseDatatableColumns<T>
  data: T[]
  dataFilteredAndSorted: T[]
  getRowKey: Props<T>['getRowKey']
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

export const useDatatableContext = <Selected extends any>(selector: (_: DatatableContext) => Selected): Selected => {
  return useContextSelector(Context, selector)
}

export const DatatableProvider = <T extends Row>({
  data,
  children,
  columns: baseColumns,
  getRowKey,
  showRowIndex,
  tableRef,
}: {
  tableRef: React.MutableRefObject<HTMLDivElement>
  showRowIndex?: boolean
  getRowKey: Props<T>['getRowKey']
  columns: Column.Props<T>[]
  children: ReactNode
  data: T[]
}) => {
  const [state, dispatch] = useReducer(datatableReducer<T>(), initialState<T>())

  const columns = useDatatableColumns({
    colHidden: state.colHidden,
    colWidths: state.colWidths,
    showRowIndex,
    baseColumns: baseColumns,
  })

  const {filteredAndSortedData, filterExceptBy} = useDatatableData<T>({
    data,
    filters: state.filters,
    sortBy: state.sortBy,
    colIndex: columns.indexMap,
    showRowIndex,
  })

  const getColumnOptions: any /** TODO */ = useDatatableOptions<T>({
    dataFilteredAndSorted: filteredAndSortedData,
    dataFilteredExceptBy: filterExceptBy as any, //TODO
    columns: columns.visible,
    columnsIndex: columns.indexMap,
    filters: state.filters,
  })

  const cellSelectionEngine = useCellSelectionEngine({tableRef})
  const cellSectionComputed = useCellSelectionComputed({
    filteredAndSortedData,
    columnsIndex: columns.indexMap,
    visibleColumns: columns.visible,
    cellSelectionEngine,
  })

  return (
    <Context.Provider
      value={{
        data,
        getRowKey,
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
      {children}
    </Context.Provider>
  )
}
