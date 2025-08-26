import {TableIconBtn} from '@/shared/TableIcon'
import React from 'react'

export const TableEditCellBtn = (props: Omit<Core.IconBtnProps, 'children'>) => {
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
