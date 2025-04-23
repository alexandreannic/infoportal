import {Txt} from '@/shared/Txt'
import {Box, BoxProps, Icon, useTheme} from '@mui/material'
import React, {ReactNode} from 'react'

export const IpListItem = ({
  title,
  desc,
  action,
  icon,
  children,
  sx,
  ...props
}: {
  title?: ReactNode
  desc?: ReactNode
  action?: ReactNode
  icon: string
} & BoxProps) => {
  const t = useTheme()
  return (
    <Box sx={{display: 'flex', '&:not(:last-of-type)': {mb: 1.5}, ...sx}}>
      <Icon sx={{mr: 1, mt: 0.25, color: t.palette.text.secondary}}>{icon}</Icon>
      <Box sx={{flex: 1}}>
        {title && <Txt block>{title}</Txt>}
        {desc && (
          <Txt block size="small" color="hint">
            {desc}
          </Txt>
        )}
        {children}
      </Box>
      {action}
    </Box>
  )
}
