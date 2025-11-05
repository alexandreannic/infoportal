import {Box, BoxProps, Icon, useTheme} from '@mui/material'
import React, {ReactNode} from 'react'
import {Txt} from './Txt.js'
export const ListItem = ({
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
  icon: string | ReactNode
} & BoxProps) => {
  const t = useTheme()
  return (
    <Box sx={{display: 'flex', '&:not(:last-of-type)': {mb: 1.5}, ...sx}}>
      <Box sx={{mr: 1, mt: 0}}>
        {typeof icon === 'string' ? <Icon sx={{color: t.vars.palette.text.secondary}}>{icon}</Icon> : icon}
      </Box>
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
