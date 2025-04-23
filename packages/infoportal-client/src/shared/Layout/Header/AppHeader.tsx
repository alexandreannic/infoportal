import {alpha, BoxProps, Icon, MenuItem, useTheme} from '@mui/material'
import {Txt} from '@/shared'
import {layoutConfig} from '../index'
import React from 'react'
import {useLayoutContext} from '../LayoutContext'
import {AppHeaderMenu} from '@/shared/Layout/Header/AppHeaderMenu'
import {AppHeaderFeatures} from '@/shared/Layout/Header/AppHeaderFeatures'
import {IpIconBtn} from '@/shared/IconBtn'
import Link from 'next/link'
import {AppHeaderContainer} from '@/shared/Layout/Header/AppHeaderContainer'
import {PopoverWrapper} from '@/shared/PopoverWrapper'
import {useI18n} from '@/core/i18n'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Obj} from '@axanc/ts-utils'
import {styleUtils} from '@/core/theme'

interface Props extends BoxProps {}

const lightThemeIcons = {
  light: 'light_mode',
  dark: 'dark_mode',
  auto: 'brightness_medium',
} as const

export const AppHeader = ({children, sx, id = 'aa-header-id', ...props}: Props) => {
  const {sidebarOpen, showSidebarButton, setSidebarOpen, title} = useLayoutContext()
  const {m} = useI18n()
  const t = useTheme()
  const {
    theme: {brightness, setBrightness},
  } = useAppSettings()
  return (
    <AppHeaderContainer
      component="header"
      sx={{
        minHeight: layoutConfig.headerHeight,
        px: layoutConfig.headerPx,
        py: 0.5,
        display: 'flex',
        alignItems: 'center',
        // position: 'fixed',
        // top: 0,
        // right: 0,
        // left: 0,
        // boxShadow: t => t.shadows[3],
        // background: t => t.palette.background.paper,
        // borderBottom: t => '1px solid ' + t.palette.divider,
        ...sx,
      }}
      id={id}
      {...props}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {showSidebarButton && (
          <IpIconBtn
            size="small"
            sx={{
              mr: 1,
              border: (t) => `2px solid ${t.palette.primary.main}`,
              background: (t) => (sidebarOpen ? 'none' : alpha(t.palette.primary.main, 0.1)),
              color: (t) => t.palette.primary.main,
              '&:hover': {
                background: (t) => alpha(t.palette.primary.main, 0.1),
              },
            }}
            onClick={() => setSidebarOpen((_) => !_)}
            children="menu"
          />
        )}
        <Txt
          sx={{ml: 1, ...styleUtils(t).truncate}}
          size="title"
          bold
          dangerouslySetInnerHTML={{__html: title ?? ''}}
        />
        {children}
      </div>
      <PopoverWrapper
        content={(close) =>
          Obj.entries(lightThemeIcons).map(([theme, icon]) => (
            <MenuItem
              key={theme}
              selected={brightness === theme}
              onClick={() => {
                setBrightness(theme)
                close()
              }}
            >
              <Icon sx={{mr: 1}}>{icon}</Icon>
              {m.lightTheme[theme]}
            </MenuItem>
          ))
        }
      >
        <IpIconBtn children={lightThemeIcons[brightness ?? 'auto']} />
      </PopoverWrapper>
      <Link href="/">
        <IpIconBtn children="home" />
      </Link>
      <AppHeaderFeatures sx={{mr: 1}} />
      <AppHeaderMenu />
    </AppHeaderContainer>
  )
}
