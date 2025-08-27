import {IconBtnProps} from '@infoportal/client-core'
import React from 'react'
import {TableIconBtn} from '@/ui/TableIcon.js'

export const TableEditCellBtn = (props: Omit<IconBtnProps, 'children'>) => {
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
