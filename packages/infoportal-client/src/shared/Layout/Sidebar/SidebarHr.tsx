import * as React from 'react'
import {Box, BoxProps} from '@mui/material'

export interface SidebarHrProps extends Omit<BoxProps, 'margin'> {
  margin?: boolean
}

export const SidebarHr = ({sx, margin, ...props}: SidebarHrProps) => {
  return (
    <Box
      sx={{
        maxHeight: '1px',
        minHeight: '1px',
        height: '1px',
        background: t => t.palette.divider,
        ...(margin && {
          my: 1,
        }),
        '& + &': {
          display: 'none',
        },
        ...props,
      }}
    />
  )
}
