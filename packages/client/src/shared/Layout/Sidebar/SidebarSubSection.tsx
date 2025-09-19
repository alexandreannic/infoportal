import {Box, BoxProps, Collapse, Icon, useTheme} from '@mui/material'
import React, {ReactNode} from 'react'
import {Core} from '@/shared'
import {usePersistentState} from '@axanc/react-hooks'

export const SidebarSubSection = ({
  id,
  icon,
  title,
  children,
  dense,
  keepOpen,
  onClear,
  defaultOpen,
  sx,
  active,
  onClick,
  ...props
}: {
  active?: boolean
  icon?: string
  id?: string
  keepOpen?: boolean
  defaultOpen?: boolean
  dense?: boolean
  onClear?: () => void
  title: ReactNode
} & BoxProps) => {
  const t = useTheme()
  const [open, setOpen] = usePersistentState(defaultOpen ?? false, {
    storageKey: 'sidebar-section-' + (id ?? '') + title,
  })
  const margin = 1 / (dense ? 4 : 2)
  const hoverable = onClick || (children && !keepOpen)
  return (
    <Box
      sx={{
        my: 0.5,
        py: margin,
        transition: t.transitions.create('all'),
        borderRadius: t.vars.shape.borderRadius,
        background: Core.styleUtils(t).color.toolbar.default,
        color: t.vars.palette.text.secondary,
        overflow: 'hidden',
        ...(hoverable && {
          cursor: 'pointer',
          '&:hover': {
            background: t.vars.palette.action.focus,
            borderRadius: `calc(${t.vars.shape.borderRadius} * 1.5)`,
          },
        }),
        ...(active && {
          color: t.vars.palette.primary.main,
          background: t.vars.palette.action.focus,
        }),
        ...(sx as any),
      }}
      {...props}
    >
      <Box
        onClick={e => {
          onClick?.(e)
          if (children) setOpen(_ => !_)
        }}
        sx={{minHeight: dense ? 26 : 30, pl: keepOpen ? 1 : 0.5, mb: 0, display: 'flex', alignItems: 'center'}}
      >
        <Icon fontSize="small" sx={{visibility: icon ? 'inherit' : 'hidden', mr: 1}}>
          {icon}
        </Icon>
        <Core.Txt bold sx={{fontSize: '.825em', flex: 1}}>
          {title}
        </Core.Txt>
        <Box sx={{mr: 1}}>
          {onClear && (
            <Core.IconBtn onClick={Core.stopPropagation(onClear)} size="small">
              clear
            </Core.IconBtn>
          )}
          {hoverable && <Core.IconBtn size="small">{open ? 'expand_less' : 'expand_more'}</Core.IconBtn>}
        </Box>
      </Box>
      {children && <Collapse in={keepOpen || open}>{children}</Collapse>}
    </Box>
  )
}
