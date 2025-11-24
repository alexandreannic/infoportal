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

export const IconBtn = ({tooltip, color, size, children, ...props}: IconBtnProps) => {
  const content = (
    <IconButton {...props} color={color} size={size}>
      <Icon fontSize={size} sx={{color: 'inherit'}}>
        {children}
      </Icon>
    </IconButton>
  )
  return tooltip ? (
    <Tooltip title={tooltip}>{props.disabled ? <Box component="span">{content}</Box> : content}</Tooltip>
  ) : (
    content
  )
}
