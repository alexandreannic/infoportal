export type DatatableAction<T> =
  | {type: 'SET_DATA'; dataMap: Record<string, T>}
  | {type: 'SORT'; col: string}
  | {type: 'FILTER'; fn: (row: T) => boolean}
  | {type: 'SELECT_RANGE'; fromIdx: number; toIdx: number}
  | {type: 'UPDATE_CELL'; rowId: string; col: string; value: any}
  | {type: 'RESIZE'; col: string; width: number}
  | {type: 'TOGGLE_COL'; col: string}

export type DatatableState<T> = {
  dataMap: Record<string, T>
  rowOrder: string[]
  selected: Set<string>
  sortBy: {col: string; asc: boolean} | null
  filterFn: (row: T) => boolean
  colWidths: Record<string, number>
  visibleCols: Set<string>
}

export const datatableReducer =
  <T,>() =>
  (state: DatatableState<T>, action: DatatableAction<T>): DatatableState<T> => {
    switch (action.type) {
      case 'SET_DATA': {
        const rowOrder = Object.keys(action.dataMap)
        return {...state, dataMap: action.dataMap, rowOrder, selected: new Set()}
      }
      case 'SORT': {
        const asc = state.sortBy?.col === action.col ? !state.sortBy.asc : true
        const rowOrder = [...state.rowOrder].sort((a, b) => {
          const va = state.dataMap[a][action.col as keyof T]
          const vb = state.dataMap[b][action.col as keyof T]
          return asc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
        })
        return {...state, sortBy: {col: action.col, asc}, rowOrder}
      }
      case 'FILTER': {
        const rowOrder = Object.entries(state.dataMap)
          .filter(([, row]) => action.fn(row))
          .map(([id]) => id)
        return {...state, filterFn: action.fn, rowOrder}
      }
      case 'SELECT_RANGE': {
        const sel = new Set(state.selected)
        const [start, end] =
          action.fromIdx < action.toIdx ? [action.fromIdx, action.toIdx] : [action.toIdx, action.fromIdx]
        for (let i = start; i <= end; i++) sel.add(state.rowOrder[i])
        return {...state, selected: sel}
      }
      case 'UPDATE_CELL': {
        const dataMap = {...state.dataMap}
        dataMap[action.rowId] = {...dataMap[action.rowId], [action.col]: action.value}
        return {...state, dataMap}
      }
      case 'RESIZE':
        return {...state, colWidths: {...state.colWidths, [action.col]: action.width}}
      case 'TOGGLE_COL': {
        const vis = new Set(state.visibleCols)
        vis.has(action.col) ? vis.delete(action.col) : vis.add(action.col)
        return {...state, visibleCols: vis}
      }
      default:
        return state
    }
  }
