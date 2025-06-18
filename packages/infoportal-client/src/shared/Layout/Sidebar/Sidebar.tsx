import * as React from 'react'
import {useEffect, useState} from 'react'
import {alpha, Box, BoxProps, Slide, SwipeableDrawer, Switch, useTheme} from '@mui/material'
import {useLayoutContext} from '../LayoutContext'
import {layoutConfig} from '../index'
import {SidebarFooter} from './SidebarFooter'
import {SidebarItem} from './SidebarItem'
import {SidebarBody} from './SidebarBody'
import {SidebarHeader} from './SidebarHeader'
import {useI18n} from '../../../core/i18n'
import {Utils} from '@/utils/utils'
import {useAppSettings} from '@/core/context/ConfigContext'
import stopPropagation = Utils.stopPropagation

let sidebar: HTMLElement | null = null
let header: HTMLElement | null = null

/**
 * Don't do it the React way to improve perfs
 */
const stickSidebarToHeader = (sidebarId: string, headerId: string) => {
  if (!sidebar) {
    sidebar = document.getElementById(sidebarId)
  }
  if (!header) {
    header = document.getElementById(headerId)
  }
  // setTimeout(() => {
  if (sidebar && header) {
    sidebar.style.top = header.getBoundingClientRect().y + header.getBoundingClientRect().height + 'px'
    //Math.max(header.offsetHeight < window.scrollY ? header.offsetHeight : header.offsetHeight - window.scrollY, 0) + 'px'
  }
  // }, 0)
}

export const Sidebar = ({
  children,
  showThemeToggle,
  sx,
  id = 'app-sidebar-id',
  headerId = 'app-header',
  ...props
}: BoxProps & {
  showThemeToggle?: boolean
  headerId?: string
}) => {
  const app = useAppSettings()
  const {isMobileWidth, sidebarOpen, setSidebarOpen, sidebarPinned, setSidebarPinned} = useLayoutContext()
  const {m} = useI18n()
  const t = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Element has been re-created by SwipeableDrawer, thus variable point to nothing.
    sidebar = null
    header = null
    if (headerId) stickSidebarToHeader(id, headerId)
    setSidebarOpen(_ => !isMobileWidth)
  }, [isMobileWidth, sidebarPinned])

  useEffect(() => {
    setMounted(true)
    if (headerId) {
      stickSidebarToHeader(id, headerId)
      window.addEventListener('scroll', () => stickSidebarToHeader(id, headerId), {
        capture: true,
        passive: true,
      })
    }
  }, [mounted])

  const isTemporary = isMobileWidth || !sidebarPinned

  if (!mounted) return
  return (
    <SwipeableDrawer
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
          mr: 2,
          top: layoutConfig.headerHeight,
          background: 'transparent',
          boxShadow: 'none',
          position: 'fixed',
          border: 'none',
          bottom: 0,
          height: 'auto',
          ...(isTemporary && {
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
            m: 1,
            borderRadius: t.shape.borderRadius + 'px',
            boxShadow: t.shadows[1],
            backdropFilter: 'blur(8px)',
            background: alpha(t.palette.background.paper, 0.8),
            // background: isTemporary ? t => t.palette.background.default : undefined,
            width: layoutConfig.sidebarWith,
            height: '100%',
            transition: t => t.transitions.create('width'),
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            // borderRadius: 0,
            ...sx,
          }}
          {...props}
        >
          <SidebarHeader hidden={!isTemporary} />
          <SidebarBody>{children}</SidebarBody>
          <SidebarFooter>
            {showThemeToggle && (
              <SidebarItem
                onClick={stopPropagation(() => app.theme.setBrightness(_ => (_ === 'dark' ? 'light' : 'dark')))}
                icon="dark_mode"
                sx={{mr: 0, pr: 0}}
              >
                {m.theme}
                <Switch color="primary" sx={{ml: 'auto'}} checked={app.theme.brightness === 'dark'} />
              </SidebarItem>
            )}
            {!isMobileWidth && (
              <SidebarItem
                onClick={stopPropagation(() => setSidebarPinned(_ => !_))}
                icon="push_pin"
                sx={{mr: 0, pr: 0}}
              >
                {m.pin}
                <Switch color="primary" sx={{ml: 'auto'}} checked={sidebarPinned} />
              </SidebarItem>
            )}
          </SidebarFooter>
        </Box>
      </Slide>
    </SwipeableDrawer>
  )
}
