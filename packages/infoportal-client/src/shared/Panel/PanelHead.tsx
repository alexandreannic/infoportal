import * as React from 'react'
import {ReactNode} from 'react'
import {Box, BoxProps, Icon} from '@mui/material'
import {PanelTitle, PanelTitleProps} from './PanelTitle'

interface Props extends BoxProps {
  className?: string
  children: ReactNode
  action?: ReactNode
  icon?: string
  PanelTitleProps?: PanelTitleProps
}

export const PanelHead = ({icon, children, action, sx, PanelTitleProps, ...other}: Props) => {
  return (
    <Box
      {...other}
      sx={{
        p: 2,
        pb: 0,
        m: 0,
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}
    >
      <PanelTitle {...PanelTitleProps}>
        {icon && <Icon sx={{color: (t) => t.palette.text.disabled, mr: 1}}>{icon}</Icon>}
        <div style={{flex: 1}}>{children}</div>
      </PanelTitle>
      <Box sx={{marginLeft: 'auto'}}>{action}</Box>
    </Box>
  )
}
