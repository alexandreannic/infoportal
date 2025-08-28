import React from 'react'
import {Core, Datatable} from '@/shared'

export const TableEditCellBtn = (props: Omit<Core.IconBtnProps, 'children'>) => {
  return (
    <Datatable.IconBtn
      size="small"
      color="primary"
      style={{
        animation: 'shake .75s ease-in-out',
      }}
      {...props}
    >
      edit
    </Datatable.IconBtn>
  )
}
