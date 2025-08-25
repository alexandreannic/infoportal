import React, {ReactNode, useReducer} from 'react'
import {Datatable} from '@/shared/Datatable3/state/types.js'
import {datatableReducer, initialState} from '@/shared/Datatable3/state/reducer.js'
import {KeyOf} from '@axanc/ts-utils'
import {useDatatableData} from '@/shared/Datatable3/state/useDatatableData.js'
import {createContext, useContextSelector} from 'use-context-selector'
import {useDatatableOptions3} from '@/shared/Datatable3/state/useDatatableOptions3.js'
import {DatatableOptions} from '@/shared/Datatable/util/datatableType.js'
import {UseDatatableColumns, useDatatableColumns} from '@/shared/Datatable3/state/useColumns.js'
import {UseCellSelection, useCellSelectionEngine} from '@/shared/Datatable3/state/useCellSelectionEngine.js'
import {UseCellSelectionComputed, useCellSelectionComputed} from '@/shared/Datatable3/state/useCellSelectionComputed.js'

export type DatatableContext<T extends Datatable.Row = any> = {
  getColumnOptions: (_: KeyOf<T>) => DatatableOptions[] | undefined
  state: Datatable.State<T>
  dispatch: React.Dispatch<Datatable.Event<T>>
  columns: UseDatatableColumns<T>
  data: T[]
  dataFilteredAndSorted: T[]
  getRowKey: Datatable.Props<T>['getRowKey']
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

export const useDatatable3Context = <Selected extends any>(selector: (_: DatatableContext) => Selected): Selected => {
  return useContextSelector(Context, selector)
}

export const Datatable3Provider = <T extends Datatable.Row>({
  data,
  children,
  columns: baseColumns,
  getRowKey,
  showRowIndex,
  tableRef,
}: {
  tableRef: React.MutableRefObject<HTMLDivElement>
  showRowIndex?: boolean
  getRowKey: Datatable.Props<T>['getRowKey']
  columns: Datatable.Column.Props<T>[]
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

  const getColumnOptions: any /** TODO */ = useDatatableOptions3<T>({
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
