import {Datatable} from '@/shared/Datatable3/state/types.js'
import {DatatableColumn} from '@/shared/Datatable/util/datatableType.js'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils.js'
import {useMemo} from 'react'
import {seq} from '@axanc/ts-utils'

export type UseDatatableColumns<T extends Datatable.Row> = ReturnType<typeof useDatatableColumns<T>>

export const useDatatableColumns = <T extends Datatable.Row>({
  baseColumns,
  showRowIndex,
  colWidths,
  colVisibility,
}: {
  colWidths: Datatable.State<T>['colWidths']
  colVisibility: Datatable.State<T>['colVisibility']
  baseColumns: Datatable.Column.Props<T>[]
  showRowIndex?: boolean
}) => {
  const mappedColumns = useMemo(() => {
    return baseColumns.map(toInnerColumn).map(harmonizeColRenderValue)
  }, [baseColumns])

  const all = useMemo(() => {
    if (showRowIndex)
      mappedColumns.unshift({
        group: {label: 'Meta', id: 'meta'},
        id: 'index',
        className: 'td-index',
        head: '#',
        width: 50,
        render: (_: any) => ({
          value: _?.index,
          label: _?.index,
        }),
      })
    return mappedColumns
  }, [mappedColumns, showRowIndex])

  const visible = useMemo(() => {
    return all.filter(c => !colVisibility.has(c.id))
  }, [all, colVisibility])

  const widths = useMemo(() => {
    return seq(visible).reduceObject<Record<string, number>>(c => [
      c.id,
      Math.max(colWidths[c.id] ?? c.width ?? 120, 20),
    ])
  }, [colWidths, visible])

  const indexMap = useMemo(
    () => seq(all).reduceObject<Record<string, Datatable.Column.InnerProps<T>>>(_ => [_.id, _]),
    [all],
  )

  const cssGridTemplate = useMemo(
    () => visible.map(c => (widths[c.id] ?? c.width ?? 120) + 'px').join(' '),
    [visible, widths],
  )

  return {
    all,
    widths,
    indexMap,
    cssGridTemplate,
    visible,
  }
}

function toInnerColumn<T extends Datatable.Row>(col: Datatable.Column.Props<T>): Datatable.Column.InnerProps<T> {
  if (Datatable.Column.isInner(col)) {
    return col
  }
  if (Datatable.Column.isQuick(col)) {
    if (col.type === undefined) {
      ;(col as unknown as DatatableColumn.InnerProps<T>).render = (_: T) => {
        const value = col.renderQuick(_) ?? (DatatableUtils.blank as any)
        return {label: value, value: undefined}
      }
    } else {
      ;(col as unknown as DatatableColumn.InnerProps<T>).render = (_: T) => {
        const value = col.renderQuick(_) ?? (DatatableUtils.blank as any)
        return {
          label: value,
          tooltip: value,
          option: value,
          value,
        }
      }
    }
  }
  return col as unknown as Datatable.Column.InnerProps<T>
}

function harmonizeColRenderValue<T extends Datatable.Row>(
  col: Datatable.Column.InnerProps<T>,
): Datatable.Column.InnerProps<T> {
  const baseRender = col.render

  const newRender = (row: T) => {
    const rendered = baseRender(row)

    let value = rendered.value

    if (col.type === 'select_multiple') {
      if (!Array.isArray(value)) {
        value = [value as string]
      }
      if (value.length === 0) {
        value = [DatatableUtils.blank]
      }
      value = value.map(v => v ?? DatatableUtils.blank)
    } else if (value === undefined || value === null) {
      value = DatatableUtils.blank
    }
    return {
      ...rendered,
      value,
      option: rendered.option ?? rendered.label,
    }
  }

  return {
    ...col,
    render: newRender as any,
  }
}
