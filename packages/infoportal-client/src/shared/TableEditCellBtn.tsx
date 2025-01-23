import {TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import React from 'react'
import {IpIconBtnProps} from '@/shared/IconBtn'

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
