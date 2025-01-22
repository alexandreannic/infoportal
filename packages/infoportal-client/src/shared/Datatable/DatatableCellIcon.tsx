import {Icon, IconProps, Tooltip} from '@mui/material'
import React, {ReactNode} from 'react'

export interface TableIconProps extends IconProps {
  tooltip?: ReactNode
  children: string
}

const DatatableCellIcon = ({tooltip, children, sx, ...props}: TableIconProps) => {
  const body = (
    <Icon
      sx={{
        verticalAlign: 'middle',
        // fontSize: '20px !important',
        ...sx,
      }}
      fontSize="medium"
      {...props}
    >
      {children}
    </Icon>
  )
  return tooltip ? <Tooltip title={tooltip}>{body}</Tooltip> : body
}

export default DatatableCellIcon
