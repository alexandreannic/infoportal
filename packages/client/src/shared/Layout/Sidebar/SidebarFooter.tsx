import * as React from 'react'
import {Box, BoxProps} from '@mui/material'

export interface SidebarFooterProps extends BoxProps {}

export const SidebarFooter = ({children, sx, ...props}: SidebarFooterProps) => {
  return (
    <Box
      sx={{
        py: 0,
        // pl: 1,
        borderTop: t => '1px solid ' + t.vars.palette.divider,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}
