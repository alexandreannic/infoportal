import * as React from 'react'
import {Box, BoxProps, Slide, SwipeableDrawer, Switch, useTheme} from '@mui/material'
import {useLayoutContext} from '../LayoutContext'
import {SidebarFooter} from './SidebarFooter'
import {SidebarItem} from './SidebarItem'
import {SidebarBody} from './SidebarBody'
import {SidebarHeader} from './SidebarHeader'
import {useI18n} from '@infoportal/client-i18n'
import {Core} from '@/shared'

const sidebarWidth = 260

export const Sidebar = ({
  children,
  showThemeToggle,
  sx,
  id = 'app-sidebar-id',
  elevation = 5,
  headerId = 'app-header',
  stickyOffset,
  ...props
}: BoxProps & {
  stickyOffset?: number
  elevation?: number | null
  showThemeToggle?: boolean
  headerId?: string
}) => {
  const {isMobileWidth, sidebarOpen, setSidebarOpen, sidebarPinned, setSidebarPinned} = useLayoutContext()
  const {m} = useI18n()
  const t = useTheme()
  const isTemporary = isMobileWidth || !sidebarPinned
  return (
    <SwipeableDrawer
      sx={{
        display: 'flex',
        maxHeight: '100%',
        width: sidebarOpen ? `calc(${sidebarWidth}px + ${t.vars.spacing})` : '0px',
        transition: t.transitions.create('all') + ' !important',
        position: stickyOffset ? 'sticky' : undefined,
        top: stickyOffset,
      }}
      ModalProps={{
        // hideBackdrop: true,
        disableScrollLock: true,
        BackdropProps: {
          sx: {
            backgroundColor: 'transparent', // makes it invisible
          },
        },
      }}
      PaperProps={{
        id,
        sx: {
          boxShadow: elevation ? t.vars.shadows[elevation] : undefined,
          width: sidebarOpen ? sidebarWidth : '0px',
          transition: t.transitions.create('all') + ' !important',
          m: 1,
          mr: 0,
          ml: 0,
          position: 'static',
          background: 'transparent',
          borderTopRightRadius: t.vars.shape.borderRadius,
          borderBottomRightRadius: t.vars.shape.borderRadius,
          border: 'none',
          bottom: 0,
          height: 'auto',
          ...(isTemporary && {
            position: 'fixed',
            top: '0 !important',
          }),
        },
      }}
      open={sidebarOpen}
      onOpen={() => setSidebarOpen(true)}
      onClose={() => setSidebarOpen(false)}
      variant={isTemporary ? 'temporary' : 'persistent'}
    >
      <Slide direction="right" in={true}>
        <Box
          sx={{
            background: isTemporary ? t => t.vars.palette.background.default : t.vars.palette.background.paper,
            height: '100%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            ...sx,
          }}
          {...props}
        >
          <SidebarHeader hidden={!isTemporary} />
          <SidebarBody>{children}</SidebarBody>
          <SidebarFooter>
            {!isMobileWidth && (
              <SidebarItem
                size="small"
                onClick={Core.stopPropagation(() => setSidebarPinned(_ => !_))}
                icon="push_pin"
                sx={{mr: 0, pr: 0}}
              >
                {m.pin}
                <Switch size="small" color="primary" sx={{ml: 'auto'}} checked={sidebarPinned} />
              </SidebarItem>
            )}
          </SidebarFooter>
        </Box>
      </Slide>
    </SwipeableDrawer>
  )
}
