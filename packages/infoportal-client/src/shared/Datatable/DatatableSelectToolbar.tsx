import {Box, useTheme} from '@mui/material'
import React, {ReactNode} from 'react'
import {styleUtils} from '@/core/theme'

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
        ...styleUtils(t).color.backgroundActive,
        // backdropFilter: styleUtils(t).backdropFilter,
        // background: alpha(lighten(t.vars.palette.primary.light, 0.8), 0.6),
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
          border: `2px solid ${t.vars.palette.primary.main}`,
          // color: t.vars.palette.primary.main,
          fontWeight: t.typography.fontWeightBold,
          borderTopLeftRadius: t.vars.shape.borderRadius,
          borderTopRightRadius: t.vars.shape.borderRadius,
          px: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
