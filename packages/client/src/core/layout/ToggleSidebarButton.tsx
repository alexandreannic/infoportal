import React from 'react'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {Core} from '@/shared'
import {useTheme} from '@mui/material'

export const ToggleSidebarButton = ({sx, ...props}: Pick<Core.IconBtnProps, 'sx'>) => {
  const {sidebarOpen, showSidebarButton, setSidebarOpen, title} = useLayoutContext()
  const t = useTheme()
  return (
    <Core.IconBtn
      size="small"
      sx={{
        mr: 1,
        border: `2px solid ${t.vars.palette.primary.main}`,
        background: sidebarOpen ? 'none' : Core.alphaVar(t.vars.palette.primary.main, 0.1),
        color: t.vars.palette.primary.main,
        '&:hover': {
          background: Core.alphaVar(t.vars.palette.primary.main, 0.1),
        },
        ...sx,
      }}
      onClick={() => setSidebarOpen(_ => !_)}
      children="menu"
      {...props}
    />
  )
}
