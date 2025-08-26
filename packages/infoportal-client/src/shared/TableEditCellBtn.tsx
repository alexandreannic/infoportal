import {TableIconBtn} from '@/shared/TableIcon'
import React from 'react'
import {IpIconBtnProps} from '../../../infoportal-client-core/src/IconBtn.js'

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
