import React, {memo} from 'react'
import {DatatableAction, DatatableState} from '@/shared/Datatable2/datatableReducer.js'
import {DatatableColumn, DatatableRow} from '@/shared/Datatable/util/datatableType.js'

function Row<T extends DatatableRow = DatatableRow>({
  idx,
  rowId,
  columns,
  state,
  dispatch,
  classes,
}: {
  idx: number
  rowId: string
  columns: DatatableColumn.InnerProps<T>[]
  state: DatatableState<T>
  dispatch: React.Dispatch<DatatableAction<T>>
  classes: Record<string, string>
}) {
  return (
    <>
      {columns.map(col => {
        if (!state.visibleCols.has(col.id)) return null
        const isSelected = state.selected.has(rowId)
        const classNames = isSelected ? `${classes.cell} ${classes.selected}` : classes.cell
        const width = state.colWidths[col.id]
        const cellValue = state.dataMap[rowId][col.id]
        return (
          <div
            key={col.id}
            className={classNames}
            style={{width}}
            onClick={() => dispatch({type: 'SELECT_RANGE', fromIdx: idx, toIdx: idx})}
            onDoubleClick={() => {
              const val = prompt('Edit', String(cellValue))
              if (val !== null) dispatch({type: 'UPDATE_CELL', rowId, col: col.id, value: val})
            }}
          >
            {col.render(state.dataMap[rowId]).label}
          </div>
        )
      })}
    </>
  )
}

export const DatatableRow2 = memo(Row) as typeof Row
