import {alpha, BoxProps, Icon, MenuItem, useTheme} from '@mui/material'
import {Txt} from '@/shared'
import {layoutConfig} from '@/shared/Layout'
import React from 'react'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {AppHeaderMenu} from '@/core/layout/AppHeaderMenu'
import {IpIconBtn} from '@/shared/IconBtn'
import {AppHeaderContainer} from '@/core/layout/AppHeaderContainer'
import {PopoverWrapper} from '@/shared/PopoverWrapper'
import {useI18n} from '@/core/i18n'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Obj} from '@axanc/ts-utils'
import {styleUtils} from '@/core/theme'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'
import {useSession} from '@/core/Session/SessionContext'
import {useWorkspaceRouter} from '@/core/context/WorkspaceContext'
import {Link} from 'react-router-dom'
import {router} from '@/Router'

interface Props extends BoxProps {}

const lightThemeIcons = {
  light: 'light_mode',
  dark: 'dark_mode',
  auto: 'brightness_medium',
} as const

export const AppHeader = ({children, sx, id = 'aa-header-id', ...props}: Props) => {
  const {sidebarOpen, showSidebarButton, setSidebarOpen, title} = useLayoutContext()
  const {wsId, changeWorkspace} = useWorkspaceRouter()
  const {m} = useI18n()
  const {session} = useSession()
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
              border: t => `2px solid ${t.palette.primary.main}`,
              background: t => (sidebarOpen ? 'none' : alpha(t.palette.primary.main, 0.1)),
              color: t => t.palette.primary.main,
              '&:hover': {
                background: t => alpha(t.palette.primary.main, 0.1),
              },
            }}
            onClick={() => setSidebarOpen(_ => !_)}
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

      <IpSelectSingle
        value={wsId}
        onChange={_ => _ && changeWorkspace(_)}
        sx={{width: 200, mr: 0.5}}
        options={session.workspaces.map(_ => ({
          value: _.slug,
          children: (
            <>
              <Txt bold>{_.name}</Txt>&nbsp;•&nbsp;<Txt color="hint">{_.slug}</Txt>
            </>
          ),
        }))}
      />

      <PopoverWrapper
        content={close =>
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
      <Link to={router.root}>
        <IpIconBtn children="home" />
      </Link>
      <AppHeaderMenu />
    </AppHeaderContainer>
  )
}
