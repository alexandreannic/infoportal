import React, {useEffect, useMemo, useReducer} from 'react'
import {useStyles} from '@/shared/Datatable2/datatableStyles.js'
import {datatableReducer, DatatableState} from '@/shared/Datatable2/datatableReducer.js'
import {DatatableRow2} from '@/shared/Datatable2/DatatableRow.js'
import {DatatableColumn, DatatableTableProps} from '@/shared/Datatable/util/datatableType.js'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils.js'

export type Column<T> = {
  id: keyof T & string
  label: string
  width?: number
  hidden?: boolean
  render?: (row: T, rowId: string) => React.ReactNode
}

export function DataTable2<T extends Record<string, any>>({
  data,
  columns: outerColumns,
  getRenderRowKey = (_, i) => '' + i,
}: DatatableTableProps<T>) {
  const {classes} = useStyles()

  const columns: DatatableColumn.InnerProps<T>[] = useMemo(() => {
    return outerColumns.map(col => {
      // 1. Build base render object only once
      const baseRender: DatatableColumn.InnerProps<T>['render'] = row => {
        const raw = DatatableColumn.isQuick(col)
          ? {label: col.renderQuick!(row) ?? DatatableUtils.blank, value: col.renderQuick!(row)}
          : (col as DatatableColumn.InnerProps<T>).render!(row)

        // unify missing / null / array logic
        let {label, value, tooltip, option} = raw as any
        option = option ?? label
        tooltip = tooltip ?? label
        value =
          col.type === 'select_multiple'
            ? Array.isArray(value)
              ? value.length
                ? value
                : [DatatableUtils.blank]
              : [value ?? DatatableUtils.blank]
            : (value ?? DatatableUtils.blank)

        return {label, value, option, tooltip}
      }

      return {
        ...col,
        render: baseRender,
      } as any
    })
  }, [outerColumns])

  const initialMap = useMemo(() => {
    const map: Record<string, T> = {}
    data?.forEach((row, i) => {
      const id = getRenderRowKey(row, i)
      map[id] = row
    })
    return map
  }, [data, getRenderRowKey])

  const initial: DatatableState<T> = useMemo(
    () => ({
      dataMap: initialMap,
      rowOrder: Object.keys(initialMap),
      selected: new Set(),
      sortBy: null,
      filterFn: () => true,
      colWidths: Object.fromEntries(columns.map(c => [c.id, c.width ?? 150] as [string, number])),
      visibleCols: new Set(columns.filter(c => !c.hidden).map(c => c.id)),
    }),
    [initialMap, columns],
  )

  const [state, dispatch] = useReducer(datatableReducer<T>(), initial)

  // sync on data change
  useEffect(() => {
    const map: Record<string, T> = {}
    data?.forEach((row, i) => {
      map[getRenderRowKey(row, i)] = row
    })
    dispatch({type: 'SET_DATA', dataMap: map})
  }, [data, getRenderRowKey])

  const template = useMemo(
    () =>
      columns
        .filter(c => state.visibleCols.has(c.id))
        .map(c => state.colWidths[c.id] + 'px')
        .join(' '),
    [columns, state.colWidths, state.visibleCols],
  )

  return (
    <div className={classes.container}>
      <div className={classes.table} style={{gridTemplateColumns: template}}>
        {/* Header */}
        {columns.map(col => {
          if (!state.visibleCols.has(col.id)) return null
          return (
            <div
              key={col.id}
              className={classes.headerCell}
              style={{width: state.colWidths[col.id]}}
              onClick={() => dispatch({type: 'SORT', col: col.id})}
            >
              {col.head}
              <div
                className={classes.resizer}
                onMouseDown={e => {
                  const startX = e.clientX
                  const startW = state.colWidths[col.id]
                  const onMove = (mv: MouseEvent) => {
                    dispatch({type: 'RESIZE', col: col.id, width: startW + (mv.clientX - startX)})
                  }
                  const onUp = () => {
                    window.removeEventListener('mousemove', onMove)
                    window.removeEventListener('mouseup', onUp)
                  }
                  window.addEventListener('mousemove', onMove)
                  window.addEventListener('mouseup', onUp)
                }}
              />
            </div>
          )
        })}
        {/* Rows */}
        {state.rowOrder.splice(0, 100).map((rowId, idx) => (
          <DatatableRow2<T>
            key={rowId}
            idx={idx}
            rowId={rowId}
            columns={columns}
            state={state}
            dispatch={dispatch}
            classes={classes}
          />
        ))}
      </div>
    </div>
  )
}
