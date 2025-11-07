import React, {ReactNode, useEffect, useReducer} from 'react'
import {KeyOf} from '@axanc/ts-utils'
import {createContext, useContextSelector} from 'use-context-selector'
import {useEffectFn} from '@axanc/react-hooks'
import {Option, Props, Row} from './types.js'
import {Action, datatableReducer, initialState, State} from './reducer'
import {useDatatableColumns, UseDatatableColumns} from './useColumns'
import {useCellSelectionComputed, UseCellSelectionComputed} from './useCellSelectionComputed'
import {UseCellSelection, useCellSelectionEngine} from './useCellSelectionEngine'
import {useData} from './useData'
import {useDatatableOptions} from './useOptions'
import {UseDraggingRows, useDraggingRows} from './useDraggingRows'

export type DatatableContext<T extends Row = any> = Omit<Props<T>, 'rowHeight' | 'data' | 'columns'> & {
  tableRef: React.MutableRefObject<HTMLDivElement>
  getColumnOptions: (_: KeyOf<T>) => Option[] | undefined
  state: State<T>
  rowHeight: number
  dispatch: React.Dispatch<Action<T>>
  columns: UseDatatableColumns<T>
  data: T[]
  dndRows: UseDraggingRows
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
  props: Omit<Props<T>, 'rowHeight' | 'data'> & {
    rowHeight: number
    data: T[]
    children: ReactNode
    tableRef: React.MutableRefObject<HTMLDivElement>
  },
) => {
  const {module} = props
  const [state, _dispatch] = useReducer(datatableReducer<T>(), initialState<T>())

  useEffect(() => {
    _dispatch({type: 'SET_SOURCE_DATA', data: props.data})
  }, [props.data])

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
    data: state.sourceData,
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
    dispatch,
    selectionStart: state.cellsSelection.start,
    selectionEnd: state.cellsSelection.end,
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

  const dndRows = useDraggingRows({
    dispatch,
    rowHeight: props.rowHeight,
    selecting: cellSelectionEngine.state.selecting,
    isRowSelected: cellSelectionEngine.isRowSelected,
    selectedRows: {
      min: cellSelectionEngine.state.rowMin,
      max: cellSelectionEngine.state.rowMax,
    },
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
        dndRows,
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
