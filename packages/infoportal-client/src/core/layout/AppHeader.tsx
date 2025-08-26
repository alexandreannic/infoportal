import {useQueryWorkspace} from '@/core/query/useQueryWorkspace'
import {useI18n} from '@/core/i18n'
import {AppHeaderContainer} from '@/core/layout/AppHeaderContainer'
import {AppHeaderMenu} from '@/core/layout/AppHeaderMenu'
import {alphaVar, styleUtils} from '@/core/theme'
import {Txt} from '@/shared'
import {IpIconBtn} from '../../../../infoportal-client-core/src/IconBtn.js'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {PopoverWrapper} from '../../../../infoportal-client-core/src/PopoverWrapper.js'
import {IpSelectSingle} from '../../../../infoportal-client-core/src/Select/SelectSingle'
import {Obj} from '@axanc/ts-utils'
import {alpha, Badge, BoxProps, Icon, MenuItem, Slide, useColorScheme, useTheme} from '@mui/material'
import {Link, useNavigate} from '@tanstack/react-router'
import {Ip} from 'infoportal-api-sdk'
import {useQueryWorkspaceInvitation} from '@/core/query/useQueryWorkspaceInvitation.js'
import {appConfig} from '@/conf/AppConfig.js'

interface Props extends BoxProps {
  workspaceId?: Ip.WorkspaceId
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
  const queryInvitation = useQueryWorkspaceInvitation.getMine()
  const queryWorkspaces = useQueryWorkspace.get()
  const {mode, setMode} = useColorScheme()

  return (
    <Slide direction="down" in={true}>
      <AppHeaderContainer
        component="header"
        sx={{
          minHeight: 44,
          px: 2,
          py: 0.5,
          display: 'flex',
          alignItems: 'center',
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
          {showSidebarButton && (
            <IpIconBtn
              size="small"
              sx={{
                mr: 1,
                border: t => `2px solid ${t.vars.palette.primary.main}`,
                background: t => (sidebarOpen ? 'none' : alphaVar(t.vars.palette.primary.main, 0.1)),
                color: t => t.vars.palette.primary.main,
                '&:hover': {
                  background: t => alphaVar(t.vars.palette.primary.main, 0.1),
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

        {workspaceId && (
          <IpSelectSingle
            startAdornment={
              <Icon color="disabled" sx={{mr: 1}}>
                {appConfig.icons.workspace}
              </Icon>
            }
            value={workspaceId}
            hideNullOption
            onChange={_ => navigate({to: '/$workspaceId/dashboard', params: {workspaceId: _}})}
            sx={{width: 200, mr: 0.5}}
            options={(queryWorkspaces.data ?? []).map(_ => ({
              value: _.id,
              children: (
                <>
                  <Txt bold>{_.name}</Txt>&nbsp;•&nbsp;<Txt color="hint">{_.slug}</Txt>
                </>
              ),
            }))}
          />
        )}
        <PopoverWrapper
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
          <IpIconBtn children={lightThemeIcons[mode ?? 'system']} />
        </PopoverWrapper>
        <Link to="/">
          <Badge
            color="error"
            overlap="circular"
            badgeContent={queryInvitation.data ? queryInvitation.data.length : undefined}
          >
            <IpIconBtn children="home" />
          </Badge>
        </Link>
        <AppHeaderMenu />
      </AppHeaderContainer>
    </Slide>
  )
}
