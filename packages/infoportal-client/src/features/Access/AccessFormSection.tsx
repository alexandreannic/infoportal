import {Box, Icon, SxProps, useTheme} from '@mui/material'
import {Txt, TxtProps} from '@/shared/Txt'
import React, {ReactNode} from 'react'

export const Label = (props: TxtProps) => {
  return <Txt block uppercase bold color="hint" fontSize="small" {...props} />
}

export const AccessFormSection = ({
  label,
  icon,
  children,
  sxContent,
}: {
  sxContent?: SxProps
  icon?: string
  children: ReactNode
  label: string
}) => {
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
            background: t.vars.palette.divider,
            borderRadius: '200px',
            height: 26,
            width: 26,
            color: t.vars.palette.text.secondary,
            lineHeight: 1,
          }}
        >
          <Icon fontSize="small">{icon ?? 'check_circle'}</Icon>
        </Box>
        <Label>{label}</Label>
      </Box>
      <Box
        sx={{
          borderLeft: `1px solid ${t.vars.palette.divider}`,
          ml: '11px',
          pl: 2,
          pb: 2,
          mb: 1,
          ...sxContent,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
