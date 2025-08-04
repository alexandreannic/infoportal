import {Datatable} from '@/shared/Datatable3/types.js'
import './DatatableHead.css'

export const DatatableHead = ({
  columns,
  // cssGridTemplate,
}: {
  // cssGridTemplate: string
  columns: Datatable.Column.InnerProps<any>[]
}) => {
  return (
    <div className="dthead">
      <div className="dtrh">
        {columns.map(column => (
          <div className="dth">{column.head}</div>
        ))}
      </div>
    </div>
  )
}
