import {fnSwitch, map} from '@alexandreannic/ts-utils'
import {Checkbox, IconProps} from '@mui/material'
import React from 'react'
import {TableIcon, TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import {DatatableContext} from '@/shared/Datatable/context/DatatableContext'
import {DatatableColumn, DatatableRow} from '@/shared/Datatable/util/datatableType'
import {ResizableDiv} from '@/shared/Datatable/ResizableDiv'
import {DatabaseHeadCell} from '@/shared/Datatable/DatatableHeadCell'
import {TableHeadSectionCell} from '@/shared/Datatable/TableHeadSectionCell'
import {DatatableHeadCopyIds} from '@/shared/Datatable/DatatableHeadCopyIds'

export const DatatableHead = (() => {
  const Component = <T extends DatatableRow>({
    onOpenStats,
    data,
    selected,
    select,
    columns,
    filters,
    onResizeColumn,
    onHideColumns,
    search,
    onOpenFilter,
  }: {
    onOpenFilter: (columnId: string, event: any) => void
    onOpenStats: (columnId: string, event: any) => void
  } & Pick<DatatableContext<T>, 'onResizeColumn' | 'selected' | 'columns' | 'columnsIndex' | 'select'> & {
      data?: T[]
      onHideColumns: (_: string[]) => void
      search: DatatableContext<T>['data']['search']
      filters: DatatableContext<T>['data']['filters']
    }) => {
    return (
      <thead>
        <TableHeadSectionCell hasCheckboxColumn={!!select?.getId} columns={columns} onHideColumns={onHideColumns} />
        <tr className="tr">
          {map(select?.getId, (getId) => (
            <th className="td th td-center td-width0 td-sticky-start">
              <Checkbox
                size="small"
                checked={selected.size === data?.length}
                indeterminate={selected.size !== data?.length && selected.size !== 0}
                onChange={() => {
                  if (!data) return
                  if (selected.size === 0) selected.add(data.map(getId))
                  else selected.clear()
                }}
              />
            </th>
          ))}
          {columns.map((c, i) => {
            const sortedByThis = search?.sortBy === c.id
            const active = sortedByThis || filters[c.id]
            return (
              <th
                style={c.styleHead}
                key={c.id}
                title={c.head}
                // onClick={() => onSortBy(c.id)}
                className={[
                  c.classHead ?? '',
                  'td th',
                  c.width ? 'th-width-fit-content' : '',
                  c.stickyEnd ? 'td-sticky-end' : '',
                  active ? 'th-active' : '',
                  fnSwitch(
                    c.align!,
                    {
                      center: 'td-center',
                      right: 'td-right',
                    },
                    (_) => '',
                  ),
                ].join(' ')}
              >
                <ResizableDiv id={c.id} initialWidth={c.width} onResize={onResizeColumn}>
                  <DatabaseHeadCell onClick={() => onHideColumns([c.id])}>{c.head}</DatabaseHeadCell>
                </ResizableDiv>
              </th>
            )
          })}
        </tr>
        <tr>
          {select?.getId && <td className="td-sticky-start td" />}
          {columns.map((c) => {
            const sortedByThis = search.sortBy === c.id
            const active = sortedByThis || !!filters[c.id]
            return (
              <td
                key={c.id}
                style={c.styleHead}
                className={['td', 'td-sub-head', c.stickyEnd ? 'td-sticky-end' : ''].join(' ')}
              >
                <DatatableHeadTdBody
                  column={c}
                  active={active}
                  onOpenStats={(e) => onOpenStats(c.id, e)}
                  onOpenFilter={(e) => onOpenFilter(c.id, e)}
                />
              </td>
            )
          })}
        </tr>
      </thead>
    )
  }
  return React.memo(Component) as typeof Component
})()

export const DatatableHeadIcon = (
  props: {
    tooltip: string
    children: string
  } & Pick<IconProps, 'sx' | 'color'>,
) => {
  return <TableIcon className="table-head-type-icon" fontSize="small" color="disabled" {...props} />
}

export const DatatableHeadIconByType = ({
  type,
}: {
  type: DatatableColumn.Props<any>['type']
} & Pick<IconProps, 'sx' | 'color'>) => {
  switch (type) {
    case 'date':
      return <DatatableHeadIcon children="event" tooltip={type} />
    case 'select_multiple':
      return <DatatableHeadIcon children="check_box" tooltip={type} />
    case 'select_one':
      return <DatatableHeadIcon children="radio_button_checked" tooltip={type} />
    case 'number':
      return <DatatableHeadIcon children="tag" tooltip={type} />
    case 'id':
      return <DatatableHeadIcon children="key" tooltip={type} color="info" />
    case 'string':
      return <DatatableHeadIcon children="short_text" tooltip={type} />
    default:
      return
  }
}

const DatatableHeadTdBody = ({
  active,
  column,
  onOpenFilter,
  onOpenStats,
}: {
  column: DatatableColumn.InnerProps<any>
  onOpenFilter: (e: any) => void
  onOpenStats: (e: any) => void
  active?: boolean
}) => {
  return (
    <span style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
      {column.typeIcon}
      {column.subHeader}
      {(() => {
        switch (column.type) {
          case 'select_one':
          case 'select_multiple':
          case 'date':
          case 'number':
            return <TableIconBtn children="bar_chart" onClick={(e) => onOpenStats(e)} />
          case 'id':
            return <DatatableHeadCopyIds column={column} />
        }
      })()}
      {column.type && (
        <TableIconBtn color={active ? 'primary' : undefined} children="filter_alt" onClick={(e) => onOpenFilter(e)} />
      )}
    </span>
  )
}
