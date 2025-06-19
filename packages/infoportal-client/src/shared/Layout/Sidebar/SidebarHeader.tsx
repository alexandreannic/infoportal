import * as React from 'react'
import {Box, BoxProps} from '@mui/material'
import {useLayoutContext} from '../LayoutContext'
import {IpIconBtn} from '@/shared/IconBtn'

export interface SidebarHeaderProps extends BoxProps {
  hidden?: boolean
}

export const SidebarHeader = ({hidden, children, sx, ...props}: SidebarHeaderProps) => {
  const {setSidebarOpen} = useLayoutContext()
  return (
    <Box
      sx={{
        height: 44,
        opacity: 1,
        transition: t => t.transitions.create('all'),
        pt: 1,
        pb: 1,
        display: 'flex',
        alignItems: 'center',
        px: 2,
        borderBottom: t => '1px solid ' + t.palette.divider,
        ...(hidden && {
          height: 0,
          p: 0,
          border: 'none',
          opacity: 0,
        }),
        ...sx,
      }}
      {...props}
    >
      <IpIconBtn onClick={() => setSidebarOpen(false)} children="clear" />
    </Box>
  )
}
