import {Icon, IconProps, Tooltip} from '@mui/material'
import React, {ReactNode} from 'react'
import {IpIconBtn, IpIconBtnProps} from '@/shared/IconBtn'

export interface TableIconProps extends IconProps {
  tooltip?: ReactNode
  children: string
}

export const TableIcon = ({tooltip, children, sx, ...props}: TableIconProps) => {
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

export const TableIconBtn = ({sx, color, size = 'small', ...props}: IpIconBtnProps) => {
  return (
    <IpIconBtn
      color={color}
      size={size}
      sx={{
        verticalAlign: 'middle',
        // fontSize: '20px !important',
        ...sx,
      }}
      {...props}
    />
  )
}
