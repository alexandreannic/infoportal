import {Box} from '@mui/material'
import React, {ReactNode} from 'react'

export const DatatableSelectToolbar = ({children}: {children?: ReactNode}) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        background: (t) => t.palette.background.paper,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -1,
          right: -1,
          left: -1,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          border: (t) => `2px solid ${t.palette.primary.main}`,
          color: (t) => t.palette.primary.main,
          fontWeight: (t) => t.typography.fontWeightBold,
          background: (t) => t.palette.action.focus,
          borderTopLeftRadius: (t) => t.shape.borderRadius + 'px',
          borderTopRightRadius: (t) => t.shape.borderRadius + 'px',
          px: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
