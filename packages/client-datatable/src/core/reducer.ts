import {Column, FilterValue, Props, Row, SortBy} from './types'
import {KeyOf, mapFor} from '@axanc/ts-utils'
import {OrderBy} from '@axanc/react-hooks'
import {CSSProperties, ReactNode} from 'react'

export namespace Popup {
  export enum Name {
    FILTER = 'FILTER',
    STATS = 'STATS',
  }

  export type FilterAgs = {columnId: string; event: {target: any}} //React.MouseEvent<any>}
  export type StatsAgs = {columnId: string; event: {target: any}} //React.MouseEvent<any>}
  export type Event = ({name: Name.FILTER} & FilterAgs) | ({name: Name.STATS} & StatsAgs)
}

export type State<T extends Row> = DatatableState<T>

export type VirtualCell = {
  // value: any
  label: ReactNode
  tooltip?: string
  style?: CSSProperties
  className?: string
}

export type Action<T extends Row> =
  | {
  type: 'INIT_DATA'
  data: T[]
  limit: number
  offset: number
  columns: Column.InnerProps<T>[]
  getRowKey: Props<T>['getRowKey']
}
  | {
  type: 'SET_DATA'
  data: T[]
  limit: number
  offset: number
  columns: Column.InnerProps<T>[]
  getRowKey: Props<T>['getRowKey']
}
  | {type: 'CLOSE_POPUP'}
  | {type: 'OPEN_POPUP'; event: Popup.Event}
  | {type: 'SORT'; column: string; orderBy?: OrderBy}
  | {type: 'FILTER'; value: Record<KeyOf<T>, FilterValue>}
  | {type: 'FILTER_CLEAR'}
  | {type: 'UPDATE_CELL'; rowId: string; col: string; value: any}
  | {type: 'RESIZE'; col: string; width: number}
  | {type: 'SET_HIDDEN_COLUMNS'; hiddenColumns: string[]}

export type DatatableState<T extends Row> = {
  popup?: Popup.Event
  hasRenderedRowId: boolean[]
  virtualTable: Record<string, Record<string, VirtualCell>>
  selected: Set<string>
  sortBy?: SortBy
  filters: Partial<Record<KeyOf<T>, FilterValue>>
  colWidths: Record<string, number>
  colHidden: Set<string>
}

export function datatableReducer<T extends Row>() {
  const handlers = createHandlerMap<T>()
  return (state: State<T>, action: Action<T>): State<T> => {
    const handler = handlers[action.type] as (state: State<T>, action: Action<T>) => State<T>
    return handler(state, action)
  }
}

const buildVirtualTable = <T extends Row>({
  data,
  columns,
  dataIndexes,
  getRowKey,
}: {
  dataIndexes: number[]
  getRowKey: Props<T>['getRowKey']
  columns: Column.InnerProps<T>[]
  data: T[]
}): State<T>['virtualTable'] => {
  const result: State<T>['virtualTable'] = {}
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
      if (!row) return
      const rendered = col.render(row) // : {label: '?', value: '?'}
      const rowId = getRowKey(row)
      if (!rowId) return
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

export const initialState = <T extends Row>(): State<T> => {
  return {
    hasRenderedRowId: [],
    virtualTable: {},
    filters: {},
    selected: new Set(),
    sortBy: undefined,
    colWidths: {},
    colHidden: new Set(),
  }
}

type HandlerMap<T extends Row> = {
  [K in Action<T>['type']]: (state: State<T>, action: Extract<Action<T>, {type: K}>) => State<T>
}

function createHandlerMap<T extends Row>(): HandlerMap<T> {
  return {
    INIT_DATA: (state, {limit, data, columns, offset, getRowKey}) => {
      return {
        ...state,
        hasRenderedRowId: [],
        virtualTable: buildVirtualTable({
          data,
          columns,
          getRowKey,
          dataIndexes: mapFor(Math.min(limit, data.length), i => offset + i),
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

    RESIZE: (state, action) => {
      return {
        ...state,
        colWidths: {
          ...state.colWidths,
          [action.col]: action.width,
        },
      }
    },

    SET_HIDDEN_COLUMNS: (state, action) => {
      return {
        ...state,
        colHidden: new Set(action.hiddenColumns),
      }
    },
  }
}
