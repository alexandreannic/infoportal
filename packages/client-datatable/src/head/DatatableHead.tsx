import React, {DetailedReactHTMLElement, HTMLAttributes, ReactNode, useMemo, useRef} from 'react'
import {Resizable} from 'react-resizable'
import {BoxProps, IconProps} from '@mui/material'
import {useCtx} from '../core/DatatableContext'
import {DatatableHeadSections} from './DatatableHeadSections'
import {getColumnClassName, Popup} from '../core/reducer'
import {TableIcon, TableIconBtn} from '../ui/TableIcon'
import {Column} from '../core/types.js'

export const DatatableHead = (
  props: DetailedReactHTMLElement<HTMLAttributes<HTMLDivElement>, HTMLDivElement>['props'],
) => {
  const dispatch = useCtx(_ => _.dispatch)
  const columns = useCtx(_ => _.columns.visible)
  const moduleColumnsResize = useCtx(_ => _.module?.columnsResize ?? {enabled: true})
  const colWidths = useCtx(_ => _.columns.widths)
  const sortBy = useCtx(_ => _.state.sortBy)
  const filters = useCtx(_ => _.state.filters)
  const selectColumn = useCtx(_ => _.cellSelection.selectColumn)

  const Cell = useMemo(() => (moduleColumnsResize?.enabled ? ResizableCell : BasicCell), [moduleColumnsResize?.enabled])

  return (
    <div className="dthead" {...props}>
      <DatatableHeadSections
        columns={columns}
        onHideColumns={_ => dispatch({type: 'SET_HIDDEN_COLUMNS', hiddenColumns: _})}
      />
      <div className="dtrh">
        {columns.map((c, columnIndex) => (
          <Cell
            onClick={e => selectColumn(columnIndex, e)}
            title={c.head}
            style={{width: colWidths[c.id]}}
            className={'dth ' + getColumnClassName(c)}
            key={c.id}
            width={colWidths[c.id]}
            onResize={width => dispatch({type: 'RESIZE', col: c.id, width})}
          >
            {c.head}
          </Cell>
        ))}
      </div>
      <div className="dtrh">
        {columns.map(c => {
          const sortedByThis = sortBy?.column === c.id
          const active = sortedByThis || !!filters[c.id]
          return (
            <div
              key={c.id}
              style={c.styleHead}
              className={['dth', 'td-sub-head', c.stickyEnd ? 'td-sticky-end' : ''].join(' ')}
            >
              <DatatableHeadTdBody
                column={c}
                active={active}
                onOpenStats={e =>
                  dispatch({type: 'OPEN_POPUP', event: {name: Popup.Name.STATS, columnId: c.id, event: e}})
                }
                onOpenFilter={e =>
                  dispatch({type: 'OPEN_POPUP', event: {name: Popup.Name.FILTER, columnId: c.id, event: e}})
                }
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

const DatatableHeadTdBody = ({
  active,
  column,
  onOpenFilter,
  onOpenStats,
}: {
  column: Column.InnerProps<any>
  onOpenFilter: (e: React.MouseEvent) => void
  onOpenStats: (e: React.MouseEvent) => void
  active?: boolean
}) => {
  return (
    <span style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
      {column.typeIcon}
      {column.subHeader}
      {(() => {
        switch (column.type) {
          case 'select_one':
          case 'select_multiple':
          case 'date':
          case 'number':
            return <TableIconBtn children="bar_chart" onClick={e => onOpenStats(e)} />
        }
      })()}
      {column.type && (
        <TableIconBtn color={active ? 'primary' : undefined} children="filter_alt" onClick={e => onOpenFilter(e)} />
      )}
    </span>
  )
}

export const DatatableHeadIcon = (
  props: {
    tooltip?: string
    children: string
  } & Pick<IconProps, 'sx' | 'color'>,
) => {
  return <TableIcon className="table-head-type-icon" fontSize="small" color="disabled" {...props} />
}

export const DatatableHeadIconByType = ({
  type,
}: {
  type: Column.Props<any>['type']
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

type CellProps = Pick<BoxProps, 'className' | 'onClick' | 'title' | 'style' | 'key'> & {
  children: ReactNode
}

const BasicCell = (props: CellProps) => {
  return <div className="dth" {...props} />
}

const ResizableCell = ({
  onResize,
  width,
  children,
  ...props
}: CellProps & {
  width: number
  onResize: (_: number) => void
}) => {
  const resizingRef = useRef(false)
  return (
    <Resizable
      draggableOpts={{grid: [15, 15]}}
      className="dth"
      width={isNaN(width) ? 120 : width}
      axis="x"
      onResizeStart={() => {
        resizingRef.current = true
      }}
      onResizeStop={() => {
        // clear after the click event would normally fire to prevent cell click
        setTimeout(() => {
          resizingRef.current = false
        }, 0)
      }}
      onResize={(e, s) => {
        onResize(s.size.width)
      }}
      {...props}
    >
      <div
        onClick={e => {
          if (resizingRef.current) {
            e.preventDefault()
            e.stopPropagation()
          }
        }}
      >
        {children}
      </div>
    </Resizable>
  )
}
