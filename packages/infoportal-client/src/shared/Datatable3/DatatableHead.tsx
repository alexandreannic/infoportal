import {Datatable} from '@/shared/Datatable3/types.js'
import {DetailedReactHTMLElement, HTMLAttributes} from 'react'
import {Resizable} from 'react-resizable'
import {DatatableDispatch} from '@/shared/Datatable3/reducer.js'
import './DatatableHead.css'

export const DatatableHead = ({
  columns,
  dispatch,
  colWidths,
  ...props
}: {
  colWidths: Datatable.State<any>['colWidths']
  dispatch: DatatableDispatch<any>
  columns: Datatable.Column.InnerProps<any>[]
} & DetailedReactHTMLElement<HTMLAttributes<HTMLDivElement>, HTMLDivElement>['props']) => {
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
    </div>
  )
}
