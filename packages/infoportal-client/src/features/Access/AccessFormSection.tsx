import {Box, Icon, useTheme} from '@mui/material'
import {Txt} from '@/shared/Txt'
import React, {ReactNode} from 'react'

export const AccessFormSection = ({label, icon, children}: {icon?: string; children: ReactNode; label: string}) => {
  const t = useTheme()
  return (
    <Box sx={{ml: -0.5}}>
      <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 1,
            background: t.palette.divider,
            borderRadius: '200px',
            height: 26,
            width: 26,
            color: t.palette.text.secondary,
            lineHeight: 1,
          }}
        >
          <Icon fontSize="small">{icon ?? 'check_circle'}</Icon>
        </Box>
        <Txt block uppercase bold color="hint" fontSize="small">
          {label}
        </Txt>
      </Box>
      <Box
        sx={{
          borderLeft: `1px solid ${t.palette.divider}`,
          ml: '11px',
          pl: 2,
          pb: 2,
          mb: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
