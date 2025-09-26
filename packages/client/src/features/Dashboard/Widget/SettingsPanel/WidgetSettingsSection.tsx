import React, {ReactNode, useState} from 'react'
import {Box, Collapse} from '@mui/material'
import {Core} from '@/shared'

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
  return (
    <Box>
      <Box sx={{fontWeight: '700', mb: 1, display: 'flex', alignItems: 'center'}}>
        <Core.IconBtn
          sx={{mr: 0.5}}
          children={open ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
          onClick={() => setOpen(_ => !_)}
        />
        {title}
        {action && <Box sx={{marginLeft: 'auto'}}>{action}</Box>}
      </Box>
      <Collapse in={open}>
        <Box sx={{mb: 2}}>{children}</Box>
      </Collapse>
    </Box>
  )
}
