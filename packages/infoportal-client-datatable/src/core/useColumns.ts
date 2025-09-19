import {useMemo} from 'react'
import {seq} from '@axanc/ts-utils'
import {State} from './reducer'
import {Column, Row} from './types'
import {Utils} from '../helper/utils'

export type UseDatatableColumns<T extends Row> = ReturnType<typeof useDatatableColumns<T>>

type ColumnWidth = string | number

const minWidth = 20

const parseColumnWidth = (w: ColumnWidth) => {
  if (!isNaN(w as any)) {
    return Math.max(w as number, minWidth)
  }
  if (typeof w === 'string') {
    if (w.includes('fr')) {
      return `minmax(${minWidth}px, ${w})`
    }
  }
  return '1fr'
}

export const useDatatableColumns = <T extends Row>({
  baseColumns,
  showRowIndex,
  colWidths,
  colHidden,
}: {
  colWidths: State<T>['colWidths']
  colHidden: State<T>['colHidden']
  baseColumns: Column.Props<T>[]
  showRowIndex?: boolean
}) => {
  const mappedColumns: Column.InnerProps<T>[] = useMemo(() => {
    return baseColumns.map(toInnerColumn).map(harmonizeColRenderValue)
  }, [baseColumns])

  const all: Column.InnerProps<T>[] = useMemo(() => {
    if (showRowIndex)
      return [
        {
          group: {label: 'Meta', id: 'meta'},
          id: 'index',
          className: 'td-index',
          head: '#',
          width: 50,
          render: (_: any) => ({
            value: _?.index,
            label: _?.index,
            export: _?.index,
          }),
        },
        ...mappedColumns,
      ]
    return mappedColumns
  }, [mappedColumns, showRowIndex])

  const visible = useMemo(() => {
    return all.filter(c => !colHidden.has(c.id))
  }, [all, colHidden])

  const widths = useMemo(() => {
    return seq(visible).reduceObject<Record<string, any>>(c => [c.id, parseColumnWidth(colWidths[c.id] ?? c.width)])
  }, [colWidths, visible])

  const indexMap = useMemo(() => seq(all).reduceObject<Record<string, Column.InnerProps<T>>>(_ => [_.id, _]), [all])

  const cssGridTemplate = useMemo(
    () =>
      visible
        .map(c => {
          return isNaN(widths[c.id]) ? widths[c.id] : widths[c.id] + 'px'
        })
        .join(' '),
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

function toInnerColumn<T extends Row>(col: Column.Props<T>): Column.InnerProps<T> {
  if (Column.isInner(col)) {
    return col
  }
  if (Column.isQuick(col)) {
    if (col.type === undefined) {
      ;(col as unknown as Column.InnerProps<T>).render = (_: T) => {
        const value = col.renderQuick(_) ?? (Utils.blank as any)
        return {label: value, export: value, value: undefined}
      }
    } else {
      ;(col as unknown as Column.InnerProps<T>).render = (_: T) => {
        const value = col.renderQuick(_) ?? (Utils.blank as any)
        return {
          label: value,
          tooltip: value,
          option: value,
          export: value,
          value,
        }
      }
    }
  }
  return col as unknown as Column.InnerProps<T>
}

function harmonizeColRenderValue<T extends Row>(col: Column.InnerProps<T>): Column.InnerProps<T> {
  const baseRender = col.render

  const newRender = (row: T) => {
    const rendered = baseRender(row)

    let value = rendered.value

    if (col.type === 'select_multiple') {
      if (!Array.isArray(value)) {
        value = [value as string]
      }
      if (value.length === 0) {
        value = [Utils.blank]
      }
      value = value.map(v => v ?? Utils.blank)
    } else if (value === undefined || value === null) {
      value = Utils.blank
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
