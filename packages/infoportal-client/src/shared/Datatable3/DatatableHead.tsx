import {Datatable} from '@/shared/Datatable3/types.js'
import React, {DetailedReactHTMLElement, HTMLAttributes} from 'react'
import {Resizable} from 'react-resizable'
import './DatatableHead.css'
import {TableIconBtn} from '@/shared/TableIcon.js'
import {useDatatable3Context} from '@/shared/Datatable3/DatatableContext.js'
import {PopupName} from '@/shared/Datatable3/reducer.js'

export const DatatableHead = (
  props: DetailedReactHTMLElement<HTMLAttributes<HTMLDivElement>, HTMLDivElement>['props'],
) => {
  const columns = useDatatable3Context(_ => _.columns)
  const dispatch = useDatatable3Context(_ => _.dispatch)
  const colWidths = useDatatable3Context(_ => _.state.colWidths)
  const sortBy = useDatatable3Context(_ => _.state.sortBy)
  const filters = useDatatable3Context(_ => _.state.filters)

  return (
    <div className="dthead" {...props}>
      <div className="dtrh">
        {columns.map(col => (
          <Resizable
            key={col.id}
            draggableOpts={{grid: [10, 10]}}
            className="dth"
            width={colWidths[col.id] ?? 120}
            axis="x"
            onResize={(e, s) => dispatch({type: 'RESIZE', col: col.id, width: s.size.width})}
          >
            <div>{col.head}</div>
          </Resizable>
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
                  dispatch({type: 'OPEN_POPUP', event: {name: PopupName.STATS as const, columnId: c.id, event: e}})
                }
                onOpenFilter={e =>
                  dispatch({type: 'OPEN_POPUP', event: {name: PopupName.FILTER, columnId: c.id, event: e}})
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
  column: Datatable.Column.InnerProps<any>
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
            return <TableIconBtn children="bar_chart" onClick={e => onOpenStats(e)} />
          case 'id':
          // return <DatatableHeadCopyIds column={column} />
        }
      })()}
      {column.type && (
        <TableIconBtn color={active ? 'primary' : undefined} children="filter_alt" onClick={e => onOpenFilter(e)} />
      )}
    </span>
  )
}
