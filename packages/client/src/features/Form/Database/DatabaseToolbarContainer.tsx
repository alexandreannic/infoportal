import {ReactNode} from 'react'
import {Collapse} from '@mui/material'

export const DatabaseToolbarContainer = ({
  open,
  width,
  children,
}: {
  width?: number
  children?: ReactNode
  open?: boolean
}) => {
  return (
    <Collapse orientation="horizontal" in={open} sx={{flexShrink: 0}}>
      <div style={{width}}>{children}</div>
    </Collapse>
  )
}
