import {UseQueryWorkspace} from '@/core/query/workspace/useQueryWorkspace'
import {useI18n} from '@infoportal/client-i18n'
import {AppHeaderContainer} from '@/core/layout/AppHeaderContainer'
import {AppHeaderMenu} from '@/core/layout/AppHeaderMenu'
import {Core} from '@/shared'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {Obj} from '@axanc/ts-utils'
import {Badge, Box, BoxProps, Icon, MenuItem, Slide, useColorScheme, useTheme} from '@mui/material'
import {Link, useNavigate} from '@tanstack/react-router'
import {Api} from '@infoportal/api-sdk'
import {UseQueryWorkspaceInvitation} from '@/core/query/workspace/useQueryWorkspaceInvitation.js'
import {appConfig} from '@/conf/AppConfig.js'
import React from 'react'
import {height} from '@mui/system'
import {IpLogo} from '@/shared/logo/logo'
import {ToggleSidebarButton} from '@/core/layout/ToggleSidebarButton'

interface Props extends BoxProps {
  workspaceId?: Api.WorkspaceId
}

const lightThemeIcons = {
  light: 'light_mode',
  dark: 'dark_mode',
  system: 'brightness_medium',
} as const

export const AppHeader = ({workspaceId, children, sx, id = 'aa-header-id', ...props}: Props) => {
  const {m} = useI18n()
  const t = useTheme()

  const navigate = useNavigate()
  const {sidebarOpen, showSidebarButton, setSidebarOpen, title} = useLayoutContext()
  const queryInvitation = UseQueryWorkspaceInvitation.getMine()
  const queryWorkspaces = UseQueryWorkspace.get()
  const {mode, setMode} = useColorScheme()

  return (
    <Slide direction="down" in={true}>
      <AppHeaderContainer
        component="header"
        sx={{
          minHeight: 39,
          px: 1,
          display: 'flex',
          alignItems: 'center',
          background: Core.alphaVar(t.vars.palette.background.paper, 0.35),
          // position: 'fixed',
          // top: 0,
          // right: 0,
          // left: 0,
          // boxShadow: t => t.vars.shadows[3],
          // background: t => t.vars.palette.background.paper,
          // borderBottom: t => '1px solid ' + t.vars.palette.divider,
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
          {showSidebarButton && <ToggleSidebarButton />}
          <IpLogo height={26} />
          {/*<Box component="img" src="/ip-logo.svg" height={30} alt="InfoPortal Logo" {...props} />*/}
          <Core.Txt
            sx={{ml: 1, ...Core.styleUtils(t).truncate}}
            size="title"
            bold
            dangerouslySetInnerHTML={{__html: title ?? ''}}
          />
          {children}
        </div>

        {workspaceId && (
          <Core.SelectSingle
            startAdornment={
              <Icon color="disabled" sx={{mr: 1}}>
                {appConfig.icons.workspace}
              </Icon>
            }
            value={workspaceId}
            hideNullOption
            onChange={_ => navigate({to: '/$workspaceId/overview', params: {workspaceId: _}})}
            sx={{
              width: 200,
              mr: 0.5,
              mt: '-1px',
              height: 32,
              '& .MuiSelect-select': {
                paddingTop: '6px',
                paddingBottom: '6px',
              },
            }}
            options={(queryWorkspaces.data ?? []).map(_ => ({
              value: _.id,
              children: (
                <>
                  <Core.Txt bold>{_.name}</Core.Txt>&nbsp;•&nbsp;<Core.Txt color="hint">{_.slug}</Core.Txt>
                </>
              ),
            }))}
          />
        )}
        <Core.PopoverWrapper
          content={close =>
            Obj.entries(lightThemeIcons).map(([theme, icon]) => (
              <MenuItem
                key={theme}
                selected={mode === theme}
                onClick={() => {
                  setMode(theme)
                  close()
                }}
              >
                <Icon sx={{mr: 1}}>{icon}</Icon>
                {m.lightTheme[theme]}
              </MenuItem>
            ))
          }
        >
          <Core.IconBtn children={lightThemeIcons[mode ?? 'system']} />
        </Core.PopoverWrapper>
        <Link to="/">
          <Badge
            color="error"
            overlap="circular"
            badgeContent={queryInvitation.data ? queryInvitation.data.length : undefined}
          >
            <Core.IconBtn children="home" />
          </Badge>
        </Link>
        <AppHeaderMenu workspaceId={workspaceId} />
      </AppHeaderContainer>
    </Slide>
  )
}
