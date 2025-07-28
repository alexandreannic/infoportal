import {alpha, Box, styled, useTheme} from '@mui/material'
import React, {ReactNode} from 'react'
import {styleUtils} from '@/core/theme'
import {lighten} from '@mui/system/colorManipulator'

export const DatatableSelectToolbar = ({children}: {children?: ReactNode}) => {
  const t = useTheme()
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backdropFilter: styleUtils(t).backdropFilter,
        background: alpha(lighten(t.palette.primary.light, 0.8), 0.6),
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          border: `2px solid ${t.palette.primary.main}`,
          backdropFilter: styleUtils(t).backdropFilter,
          color: t.palette.primary.main,
          fontWeight: t.typography.fontWeightBold,
          borderTopLeftRadius: t.shape.borderRadius + 'px',
          borderTopRightRadius: t.shape.borderRadius + 'px',
          px: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
