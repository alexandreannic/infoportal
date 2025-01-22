import React from 'react'

import TableIconBtn from './Datatable/DatatableCellIconBtn'
import {IpIconBtnProps} from './IconBtn'

export const TableEditCellBtn = (props: Omit<IpIconBtnProps, 'children'>) => {
  return (
    <TableIconBtn
      size="small"
      color="primary"
      style={{
        animation: 'shake .75s ease-in-out',
      }}
      {...props}
    >
      edit
    </TableIconBtn>
  )
}
