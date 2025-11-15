import {Column, FilterValue, Props, Row, SortBy} from './types.js'
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

export type MinMax = {min: number; max: number}

export type CachedCell = {
  // value: any
  label: ReactNode
  tooltip?: string
  style?: CSSProperties
  className?: string
}

export type CellSelectionCoord = {row: number; col: number}

export type Action<T extends Row> =
  | {
  type: 'INIT_VIEWPORT_CACHE'
  data: T[]
  limit: number
  offset: number
  columns: Column.InnerProps<T>[]
  getRowKey: Props<T>['getRowKey']
}
  | {
  type: 'APPEND_VIEWPORT_CACHE'
  data: T[]
  limit: number
  offset: number
  columns: Column.InnerProps<T>[]
  getRowKey: Props<T>['getRowKey']
}
  // | {type: 'DRAGGING_ROWS_SET_RANGE'; range: MinMax | null}
  | {type: 'DRAGGING_ROWS_SET_OVER_INDEX'; overIndex: number | null}
  | {type: 'CELL_SELECTION_SET_ROW_IDS'; rowIds: string[] | null}
  | {type: 'CELL_SELECTION_SET_COLUMN_IDS'; colIds: string[] | null}
  | {type: 'CELL_SELECTION_CLEAR'}
  | {type: 'REORDER_ROWS'; rowIds: string[]; index: number}
  | {type: 'CLOSE_POPUP'}
  | {type: 'OPEN_POPUP'; event: Popup.Event}
  | {type: 'SORT'; column: string; orderBy?: OrderBy}
  | {type: 'FILTER'; value: Record<KeyOf<T>, FilterValue>}
  | {type: 'FILTER_CLEAR'}
  | {type: 'UPDATE_CELL'; rowId: string; col: string; value: any}
  | {type: 'RESIZE'; col: string; width: number}
  | {type: 'SET_HIDDEN_COLUMNS'; hiddenColumns: string[]}

export type DatatableState<T extends Row> = {
  selectedColumnIds: Set<string> | null
  selectedRowIds: Set<string> | null
  draggingRow: {
    // range: MinMax | null
    overIndex: number | null
  }
  popup?: Popup.Event
  hasRenderedRowId: boolean[]
  cachedData: Record<string, Record<string, CachedCell>>
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

const buildCachedData = <T extends Row>({
  data,
  columns,
  dataIndexes,
  getRowKey,
}: {
  dataIndexes: number[]
  getRowKey: Props<T>['getRowKey']
  columns: Column.InnerProps<T>[]
  data: T[]
}): State<T>['cachedData'] => {
  const result: State<T>['cachedData'] = {}
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
    selectedColumnIds: null,
    selectedRowIds: null,
    draggingRow: {
      overIndex: null,
    },
    hasRenderedRowId: [],
    cachedData: {},
    filters: {},
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
    DRAGGING_ROWS_SET_OVER_INDEX: (state, {overIndex}) => {
      if (state.draggingRow.overIndex === overIndex) return state
      return {
        ...state,
        draggingRow: {
          ...state.draggingRow,
          overIndex,
        },
      }
    },

    CELL_SELECTION_CLEAR: state => {
      return {
        ...state,
        cellsSelection: {start: null, end: null},
        draggingRow: {range: null, overIndex: null},
      }
    },

    CELL_SELECTION_SET_ROW_IDS: (state, {rowIds}) => {
      return {
        ...state,
        draggingRow: {range: null, overIndex: null},
        selectedRowIds: new Set(rowIds),
      }
    },

    CELL_SELECTION_SET_COLUMN_IDS: (state, {colIds}) => {
      return {
        ...state,
        draggingRow: {range: null, overIndex: null},
        selectedColumnIds: new Set(colIds),
      }
    },

    INIT_VIEWPORT_CACHE: (state, {limit, data, columns, offset, getRowKey}) => {
      return {
        ...state,
        hasRenderedRowId: [],
        cachedData: buildCachedData({
          data,
          columns,
          getRowKey,
          dataIndexes: mapFor(Math.min(limit, data.length), i => offset + i),
        }),
      }
    },

    APPEND_VIEWPORT_CACHE: (state, {limit, offset, data, columns, getRowKey}) => {
      const missingIndexes: number[] = []
      for (let i = offset; i <= offset + limit; i++) {
        if (!state.hasRenderedRowId[i]) {
          state.hasRenderedRowId[i] = true
          missingIndexes.push(i)
        }
      }
      state.cachedData = {
        ...state.cachedData,
        ...buildCachedData({
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
        ...state.cachedData,
        [action.rowId]: {
          ...state.cachedData[action.rowId],
          [action.col]: action.value,
        },
      }

      return {
        ...state,
        cachedData: virtualTable,
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

    REORDER_ROWS: (state, {rowIds, index}) => {
      // Do nothing, let user handle reordering himself to keep a single source of truth.
      return state
    },
  }
}
