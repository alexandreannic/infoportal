import {Box, Icon, IconButton, IconButtonProps, Tooltip} from '@mui/material'
import React, {ReactNode} from 'react'

export interface IconBtnProps extends IconButtonProps {
  loading?: boolean
  icon?: string
  children: string
  tooltip?: ReactNode
  href?: string
  target?: '_blank'
}

export const IconBtn = ({tooltip, size, children, ...props}: IconBtnProps) => {
  const content = (
    <IconButton {...props} size={size}>
      <Icon fontSize={size}>{children}</Icon>
    </IconButton>
  )
  return tooltip ? (
    <Tooltip title={tooltip}>{props.disabled ? <Box component="span">{content}</Box> : content}</Tooltip>
  ) : (
    content
  )
}
