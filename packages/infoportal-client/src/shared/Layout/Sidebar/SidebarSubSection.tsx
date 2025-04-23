import {Box, BoxProps, Collapse, Icon, useTheme} from '@mui/material'
import React, {ReactNode} from 'react'
import {Txt} from '@/shared/Txt'
import {IpIconBtn} from '@/shared/IconBtn'
import {usePersistentState} from '@/shared/hook/usePersistantState'
import {styleUtils} from '@/core/theme'
import {Utils} from '@/utils/utils'
import stopPropagation = Utils.stopPropagation

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
        borderRadius: t.shape.borderRadius + 'px',
        background: styleUtils(t).color.toolbar,
        color: t.palette.text.secondary,
        overflow: 'hidden',
        ...(hoverable && {
          cursor: 'pointer',
          '&:hover': {
            background: t.palette.action.focus,
            borderRadius: t.shape.borderRadius * 1.5 + 'px',
          },
        }),
        ...(active && {
          color: t.palette.primary.main,
          background: t.palette.action.focus,
        }),
        ...sx,
      }}
      {...props}
    >
      <Box
        onClick={(e) => {
          onClick?.(e)
          if (children) setOpen((_) => !_)
        }}
        sx={{minHeight: dense ? 26 : 30, pl: keepOpen ? 1 : 0.5, mb: 0, display: 'flex', alignItems: 'center'}}
      >
        <Icon fontSize="small" sx={{visibility: icon ? 'inherit' : 'hidden', mr: 1}}>
          {icon}
        </Icon>
        <Txt bold sx={{fontSize: '.825em', flex: 1}}>
          {title}
        </Txt>
        <Box sx={{mr: 1}}>
          {onClear && (
            <IpIconBtn onClick={stopPropagation(onClear)} size="small">
              clear
            </IpIconBtn>
          )}
          {hoverable && <IpIconBtn size="small">{open ? 'expand_less' : 'expand_more'}</IpIconBtn>}
        </Box>
      </Box>
      {children && <Collapse in={keepOpen || open}>{children}</Collapse>}
    </Box>
  )
}
