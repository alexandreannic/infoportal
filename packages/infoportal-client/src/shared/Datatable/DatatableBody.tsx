import {Checkbox} from '@mui/material'
import React, {useMemo} from 'react'
import {DatatableContext} from '@/shared/Datatable/context/DatatableContext'
import {DatatableRow, DatatableTableProps} from '@/shared/Datatable/util/datatableType'

const DatatableBody_ = <T extends DatatableRow>({
  data,
  select,
  columns,
  getRenderRowKey,
  rowStyle,
  selected,
  onClickRows,
}: Pick<DatatableTableProps<any>, 'onClickRows'> &
  Pick<DatatableContext<T>, 'selected' | 'select' | 'columns' | 'rowStyle' | 'getRenderRowKey'> & {
    data: T[]
  }) => {
  const {classNameTdIndex, classNameTr} = useMemo(() => {
    const classNameTdIndex: Record<string, string> = {}
    columns.forEach((_) => {
      let className = 'td ' + _.className
      if (_.stickyEnd) className += ' td-sticky-end'
      if (_.type === 'number') className += ' td-right'
      if (_.align) className += ' td-' + _.align
      classNameTdIndex[_.id] = className
    })
    return {
      classNameTr: 'tr' + (onClickRows ? ' tr-clickable' : ''),
      classNameTdIndex,
    }
  }, [columns])

  return (
    <>
      {data.map((item, rowI) => (
        <tr
          style={rowStyle?.(item)}
          className={classNameTr}
          key={getRenderRowKey ? getRenderRowKey(item, rowI) : rowI}
          onClick={(e) => onClickRows?.(item, e)}
        >
          {select && (
            <td className="td td-center td-sticky-start">
              <Checkbox
                size="small"
                checked={selected.has(select.getId(item))}
                onChange={() => selected.toggle(select.getId(item))}
              />
            </td>
          )}
          {columns.map((_, i) => {
            const render = _.render(item)
            return (
              <td
                title={render.tooltip as any}
                key={i}
                style={_.style?.(item)}
                onClick={_.onClick ? () => _.onClick?.(item) : undefined}
                className={classNameTdIndex[_.id]}
              >
                {render.label}
              </td>
            )
          })}
        </tr>
      ))}
    </>
  )
}
export const DatatableBody = React.memo(DatatableBody_) as typeof DatatableBody_
