import React, {ReactNode, useState} from 'react'
import {Box, useTheme, Collapse} from '@mui/material'
import {Core} from '@/shared'
import {IconBtn, styleUtils} from '@infoportal/client-core'

export function WidgetSettingsSection({
  children,
  action,
  title,
}: {
  action?: ReactNode
  title: ReactNode
  children: ReactNode
}) {
  const [open, setOpen] = useState(true)
  const t = useTheme()
  return (
    <Box>
      <Box
        sx={{
          p: 1,
          transition: t.transitions.create('background'),
          '&:hover': {
            background: styleUtils(t).color.toolbar.hover.background,
          },
          cursor: 'pointer',
          fontWeight: '700',
          // mb: 1.5,
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={() => setOpen(_ => !_)}
      >
        <Core.IconBtn size="small" sx={{mr: 0.5}} children={open ? 'keyboard_arrow_down' : 'keyboard_arrow_right'} />
        {title}
        {action && <Box sx={{marginLeft: 'auto'}}>{action}</Box>}
      </Box>
      <Collapse in={open}>
        <Box sx={{mb: 1, mt: 1, p: 1}}>{children}</Box>
      </Collapse>
    </Box>
  )
}
