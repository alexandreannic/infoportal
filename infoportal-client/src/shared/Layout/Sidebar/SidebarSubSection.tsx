import {Box, Collapse, Icon, useTheme} from '@mui/material'
import React, {ReactNode, useEffect} from 'react'
import {Txt} from 'mui-extension'
import {IpIconBtn} from '@/shared/IconBtn'
import {usePersistentState} from '@/shared/hook/usePersistantState'
import {styleUtils} from '@/core/theme'

export const SidebarSubSection = ({
  id,
  icon,
  title,
  children,
  dense,
  keepOpen,
  defaultOpen,
  isCollapsed,
}: {
  icon?: string
  id?: string
  keepOpen?: boolean
  defaultOpen?: boolean
  dense?: boolean
  title: ReactNode
  children: ReactNode
  isCollapsed?: boolean
}) => {
  const t = useTheme()
  const [open, setOpen] = usePersistentState(defaultOpen ?? false, {storageKey: 'sidebar-section-' + (id ?? '') + title})
  const margin = 1 / (dense ? 4 : 2)

  useEffect(() => {
    if (isCollapsed !== undefined) {
      setOpen(!isCollapsed)
    }
  }, [isCollapsed])

  return (
    <Box sx={{
      my: margin,
      py: margin,
      borderRadius: t.shape.borderRadius + 'px',
      background: styleUtils(t).color.toolbar,
      overflow: 'hidden',
    }}>
      <Box sx={{pl: keepOpen ? 1 : .5, mb: 0, display: 'flex', alignItems: 'center'}}>
        <Icon fontSize="small" sx={{visibility: icon ? 'inherit' : 'hidden', color: t.palette.text.secondary, mr: 1}}>{icon}</Icon>
        <Txt bold color="hint" sx={{fontSize: '.825em', flex: 1}}>{title}</Txt>
        {!keepOpen && (
          <IpIconBtn onClick={() => setOpen(_ => !_)} size="small" sx={{mr: 1}}>
            {open ? 'expand_less' : 'expand_more'}
          </IpIconBtn>
        )}
      </Box>
      <Collapse in={keepOpen || open}>
        {children}
      </Collapse>
    </Box>
  )
}