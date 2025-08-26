import {Checkbox} from '@mui/material'
import React, {memo, ReactNode, useMemo} from 'react'
import {DatatableContext} from '@/shared/Datatable/context/DatatableContext'
import {DatatableRow, DatatableTableProps} from '@/shared/Datatable/util/datatableType'

const DatatableBody_ = <T extends DatatableRow>({
  data,
  select,
  columns,
  getRenderRowKey,
  rowStyle,
  selected,
  selectedColumnId,
  selectedRowIds,
  onClickRows,
  handlePointerDown,
  handlePointerEnter,
}: Pick<DatatableTableProps<any>, 'onClickRows'> &
  Pick<DatatableContext<T>, 'selected' | 'select' | 'columns' | 'rowStyle' | 'getRenderRowKey'> & {
    selectedColumnId?: string
    // selectedRowIdFirst?: string
    selectedRowIds: Set<string>
    // isSelecting: boolean
    handlePointerDown: (rowIndex: number, colIndex: string, e: React.PointerEvent) => void
    handlePointerEnter: (rowIndex: number, colIndex: string) => void
    // handlePointerUp: () => void
    data: T[]
  }) => {
  const {classNameTdIndex, classNameTr} = useMemo(() => {
    const classNameTdIndex: Record<string, string> = {}
    columns.forEach(_ => {
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
      {data.map((item, rowI) => {
        const rowId = getRenderRowKey ? getRenderRowKey(item, rowI) : rowI
        return (
          <tr style={rowStyle?.(item)} className={classNameTr} key={rowId} onClick={e => onClickRows?.(item, e)}>
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
                <Cell
                  rowIndex={rowI}
                  handlePointerDown={handlePointerDown}
                  handlePointerEnter={handlePointerEnter}
                  label={render.label}
                  // data-col-id={_.id}
                  // data-row-id={rowId}
                  // data-row-index={rowI}
                  tooltip={render.tooltip as any}
                  id={_.id}
                  style={_.style?.(item)}
                  // onClick={_.onClick ? () => _.onClick?.(item) : undefined}
                  className={
                    classNameTdIndex[_.id] +
                    ' ' +
                    (selectedColumnId === _.id && selectedRowIds.has(rowId as string) ? 'td-active' : '')
                  }
                />
              )
            })}
          </tr>
        )
      })}
    </>
  )
}

const Cell = memo(
  ({
    id,
    rowIndex,
    tooltip,
    style,
    className,
    label,
    handlePointerDown,
    handlePointerEnter,
  }: {
    id: string
    rowIndex: number
    tooltip: string
    style: any
    className: string
    label: ReactNode
    handlePointerDown: (rowIndex: number, colIndex: string, e: React.PointerEvent) => void
    handlePointerEnter: (rowIndex: number, colIndex: string) => void
  }) => {
    return (
      <td
        onPointerDown={e => handlePointerDown(rowIndex, id, e)}
        onPointerEnter={() => handlePointerEnter(rowIndex, id)}
        title={tooltip as any}
        style={style}
        // onClick={_.onClick ? () => _.onClick?.(item) : undefined}
        className={className}
      >
        {label}
      </td>
    )
  },
)

export const DatatableBody = React.memo(DatatableBody_) as typeof DatatableBody_
