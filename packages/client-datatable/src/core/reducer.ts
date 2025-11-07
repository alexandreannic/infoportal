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

export type VirtualCell = {
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
  | {type: 'DRAGGING_ROWS_SET_RANGE'; range: MinMax | null}
  | {type: 'DRAGGING_ROWS_SET_OVER_INDEX'; overIndex: number | null}
  | {type: 'CELL_SELECTION_SET_START'; coord: Partial<CellSelectionCoord> | null}
  | {type: 'CELL_SELECTION_SET_END'; coord: Partial<CellSelectionCoord> | null}
  | {type: 'CELL_SELECTION_CLEAR'}
  | {type: 'SET_SOURCE_DATA'; data: T[]}
  | {type: 'REORDER_ROWS'; range: {min: number; max: number}; index: number}
  | {type: 'CLOSE_POPUP'}
  | {type: 'OPEN_POPUP'; event: Popup.Event}
  | {type: 'SORT'; column: string; orderBy?: OrderBy}
  | {type: 'FILTER'; value: Record<KeyOf<T>, FilterValue>}
  | {type: 'FILTER_CLEAR'}
  | {type: 'UPDATE_CELL'; rowId: string; col: string; value: any}
  | {type: 'RESIZE'; col: string; width: number}
  | {type: 'SET_HIDDEN_COLUMNS'; hiddenColumns: string[]}

export type DatatableState<T extends Row> = {
  cellsSelection: {
    start: CellSelectionCoord | null
    end: CellSelectionCoord | null
  }
  draggingRow: {
    range: MinMax | null
    overIndex: number | null
  }
  sourceData: T[]
  popup?: Popup.Event
  hasRenderedRowId: boolean[]
  virtualTable: Record<string, Record<string, VirtualCell>>
  // selected: Set<string>
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
    cellsSelection: {
      start: null,
      end: null,
    },
    draggingRow: {
      range: null,
      overIndex: null,
    },
    sourceData: [],
    hasRenderedRowId: [],
    virtualTable: {},
    filters: {},
    // selected: new Set(),
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
      return {
        ...state,
        draggingRow: {
          ...state.draggingRow,
          overIndex,
        },
      }
    },

    DRAGGING_ROWS_SET_RANGE: (state, {range}) => {
      return {
        ...state,
        draggingRow: {
          ...state.draggingRow,
          range,
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

    CELL_SELECTION_SET_START: (state, {coord}) => {
      return {
        ...state,
        cellsSelection: {
          ...state.cellsSelection,
          start: {...state.cellsSelection.start, ...(coord as CellSelectionCoord)},
        },
      }
    },

    CELL_SELECTION_SET_END: (state, {coord}) => {
      return {
        ...state,
        cellsSelection: {...state.cellsSelection, end: {...state.cellsSelection.end, ...(coord as CellSelectionCoord)}},
      }
    },

    SET_SOURCE_DATA: (state, {data}) => {
      return {
        ...state,
        sourceData: data,
      }
    },

    INIT_VIEWPORT_CACHE: (state, {limit, data, columns, offset, getRowKey}) => {
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

    APPEND_VIEWPORT_CACHE: (state, {limit, offset, data, columns, getRowKey}) => {
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

    REORDER_ROWS: (state, {range, index}) => {
      const rows = [...state.sourceData]
      const moved = rows.splice(range.min, range.max - range.min + 1)
      const target = index > range.max ? index - moved.length : index
      rows.splice(target, 0, ...moved)

      // Update cell selection by shifting row indexes
      const shiftRow = (r: number | null): number => {
        if (r == null) return -1
        if (r < range.min && r >= target) return r + (range.max - range.min + 1)
        if (r > range.max && r < target) return r - (range.max - range.min + 1)
        if (r >= range.min && r <= range.max) return target + (r - range.min)
        return r
      }

      const {start, end} = state.cellsSelection

      return {
        ...state,
        sourceData: rows,
        cellsSelection: {
          start: start ? {...start, row: shiftRow(start.row)} : null,
          end: end ? {...end, row: shiftRow(end.row)} : null,
        },
      }
    },
  }
}
