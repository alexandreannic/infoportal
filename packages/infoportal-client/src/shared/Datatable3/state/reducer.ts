import {Datatable} from '@/shared/Datatable3/state/types.js'
import {KeyOf, mapFor} from '@axanc/ts-utils'
import DatatableFilterValue = Datatable.DatatableFilterValue
import {OrderBy} from '@axanc/react-hooks'
import React from 'react'

export namespace Popup {
  export enum Name {
    FILTER = 'FILTER',
    STATS = 'STATS',
  }

  export type FilterAgs = {columnId: string; event: {target: any}}//React.MouseEvent<any>}
  export type StatsAgs = {columnId: string; event: {target: any}}//React.MouseEvent<any>}

  export type Event = ({name: Name.FILTER} & FilterAgs) | ({name: Name.STATS} & StatsAgs)
}

export type DatatableAction<T extends Datatable.Row> =
  | {
      type: 'INIT_DATA'
      data: T[]
      limit: number
      columns: Datatable.Column.InnerProps<T>[]
      getRowKey: Datatable.Props<T>['getRowKey']
    }
  | {
      type: 'SET_DATA'
      data: T[]
      limit: number
      offset: number
      columns: Datatable.Column.InnerProps<T>[]
      getRowKey: Datatable.Props<T>['getRowKey']
    }
  | {type: 'CLOSE_POPUP'}
  | {type: 'OPEN_POPUP'; event: Popup.Event}
  | {type: 'SORT'; column: string; orderBy?: OrderBy}
  | {type: 'FILTER'; value: Record<KeyOf<T>, DatatableFilterValue>}
  | {type: 'FILTER_CLEAR'}
  | {type: 'UPDATE_CELL'; rowId: string; col: string; value: any}
  | {type: 'RESIZE'; col: string; width: number}
  | {type: 'TOGGLE_COL'; col: string}

export type DatatableState<T extends Datatable.Row> = {
  popup?: Popup.Event
  hasRenderedRowId: boolean[]
  // lastIndexRowVirtualized: number
  // paginate: {limit: number; offset: number}
  // virtualTable: Record<Key, VirtualCell>
  virtualTable: Record<string, Record<string, Datatable.VirtualCell>>
  // rowOrder: string[]
  selected: Set<string>
  sortBy?: Datatable.SortBy
  filters: Partial<Record<KeyOf<T>, DatatableFilterValue>>
  colWidths: Record<string, number>
  colVisibility: Set<string>
}

export function datatableReducer<T extends Datatable.Row>() {
  const handlers = createHandlerMap<T>()
  return (state: Datatable.State<T>, action: Datatable.Event<T>): Datatable.State<T> => {
    const handler = handlers[action.type] as (
      state: Datatable.State<T>,
      action: Datatable.Event<T>,
    ) => Datatable.State<T>
    return handler(state, action)
  }
}

// export const buildCellKey = (rowId: string, columnId)
const buildVirtualTable = <T extends Datatable.Row>({
  data,
  columns,
  dataIndexes,
  getRowKey,
}: {
  dataIndexes: number[]
  getRowKey: Datatable.Props<T>['getRowKey']
  columns: Datatable.Column.InnerProps<T>[]
  data: T[]
}): Datatable.State<T>['virtualTable'] => {
  const result: Datatable.State<T>['virtualTable'] = {}
  const classNameTdIndex: Record<string, string> = {}
  columns.forEach(col => {
    let className = typeof col.className === 'string' ? col.className : ' '
    if (col.stickyEnd) className += ' td-sticky-end'
    if (col.type === 'number') className += ' td-right'
    if (col.align) className += ' td-' + col.align
    classNameTdIndex[col.id] = className
  })
  dataIndexes.forEach(index => {
    const row = data[index]
    columns.forEach(col => {
      const rendered = row ? col.render(row) : {label: '?', value: '?'}
      // fix in case
      let rowId
      try {
        rowId = getRowKey(row)
      } catch (e) {
        // console.error('CATCH', col.id, (e as any).message)
      }
      if (!rowId) return
      // const key = Datatable.buildKey({getRowKey, row, colId: col.id})
      if (!result[rowId]) result[rowId] = {}
      result[rowId][col.id] = {
        label: rendered.label,
        // value: rendered.value,
        tooltip: rendered.tooltip ?? undefined,
        style: col.style?.(row),
        className:
          classNameTdIndex[col.id] + (typeof col.className === 'function' ? ' ' + col.className(row) + ' ' : ''),
      }
    })
  })
  return result
}

export const initialState = <T extends Datatable.Row>(): Datatable.State<T> => {
  return {
    hasRenderedRowId: [],
    virtualTable: {},
    filters: {},
    selected: new Set(),
    sortBy: undefined,
    colWidths: {},
    colVisibility: new Set(),
  }
}

type HandlerMap<T extends Datatable.Row> = {
  [K in Datatable.Event<T>['type']]: (
    state: Datatable.State<T>,
    action: Extract<Datatable.Event<T>, {type: K}>,
  ) => Datatable.State<T>
}

function createHandlerMap<T extends Datatable.Row>(): HandlerMap<T> {
  return {
    INIT_DATA: (state, {limit, data, columns, getRowKey}) => {
      return {
        ...state,
        hasRenderedRowId: [],
        virtualTable: buildVirtualTable({
          data,
          columns,
          getRowKey,
          dataIndexes: mapFor(limit, i => i),
        }),
      }
    },

    SET_DATA: (state, {limit, offset, data, columns, getRowKey}) => {
      const missingIndexes: number[] = []
      for (let i = offset; i <= offset + limit; i++) {
        if (!state.hasRenderedRowId[i]) {
          state.hasRenderedRowId[i] = true
          missingIndexes.push(i)
        }
      }
      state.virtualTable = {
        ...state.virtualTable,
        ...buildVirtualTable({
          dataIndexes: missingIndexes,
          data,
          columns,
          getRowKey,
        }),
      }
      return state
    },

    SORT: (state, action) => {
      const orderBy = action.orderBy ?? 'desc'
      return {
        ...state,
        sortBy: {
          column: action.column,
          orderBy,
        },
      }
      // const asc = state.sortBy?.col === action.col ? !state.sortBy.asc : true
      // const rowOrder = [...state.rowOrder].sort((a, b) => {
      //   return 1
      //   // const va = state.virtualTable[a][action.col as keyof T]
      //   // const vb = state.virtualTable[b][action.col as keyof T]
      //   // return asc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
      // })
      // return {
      //   ...state,
      //   sortBy: {col: action.col, asc},
      //   rowOrder,
      // }
    },

    FILTER: (state, action) => {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.value,
        },
      }
    },

    FILTER_CLEAR: state => {
      return {
        ...state,
        filters: {},
      }
    },

    // SELECT_RANGE: (state, action) => {
    //   const selected = new Set(state.selected)
    //   const [start, end] =
    //     action.fromIdx < action.toIdx ? [action.fromIdx, action.toIdx] : [action.toIdx, action.fromIdx]
    //
    //   for (let i = start; i <= end; i++) {
    //     const id = state.rowOrder[i]
    //     if (id) selected.add(id)
    //   }
    //
    //   return {
    //     ...state,
    //     selected,
    //   }
    // },

    CLOSE_POPUP: (state, action) => {
      return {
        ...state,
        popup: undefined,
      }
    },

    OPEN_POPUP: (state, action) => {
      return {
        ...state,
        popup: action.event as any,
      }
    },

    UPDATE_CELL: (state, action) => {
      const virtualTable = {
        ...state.virtualTable,
        [action.rowId]: {
          ...state.virtualTable[action.rowId],
          [action.col]: action.value,
        },
      }

      return {
        ...state,
        virtualTable,
      }
    },

    RESIZE: (state, action) => ({
      ...state,
      colWidths: {
        ...state.colWidths,
        [action.col]: action.width,
      },
    }),

    TOGGLE_COL: (state, action) => {
      const colVisibility = new Set(state.colVisibility)
      if (colVisibility.has(action.col)) {
        colVisibility.delete(action.col)
      } else {
        colVisibility.add(action.col)
      }
      return {
        ...state,
        colVisibility,
      }
    },
  }
}
