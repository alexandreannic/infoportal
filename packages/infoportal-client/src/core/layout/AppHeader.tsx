import {router} from '@/Router'
import {useQueryWorkspace, useWorkspaceRouterMaybe} from '@/core/query/useQueryWorkspace'
import {useI18n} from '@/core/i18n'
import {AppHeaderContainer} from '@/core/layout/AppHeaderContainer'
import {AppHeaderMenu} from '@/core/layout/AppHeaderMenu'
import {styleUtils} from '@/core/theme'
import {Txt} from '@/shared'
import {IpIconBtn} from '@/shared/IconBtn'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {PopoverWrapper} from '@/shared/PopoverWrapper'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'
import {Obj} from '@axanc/ts-utils'
import {alpha, BoxProps, Icon, MenuItem, Slide, useColorScheme, useTheme} from '@mui/material'
import {Link} from 'react-router-dom'

interface Props extends BoxProps {}

const lightThemeIcons = {
  light: 'light_mode',
  dark: 'dark_mode',
  system: 'brightness_medium',
} as const

export const AppHeader = ({children, sx, id = 'aa-header-id', ...props}: Props) => {
  const {m} = useI18n()
  const t = useTheme()

  const {sidebarOpen, showSidebarButton, setSidebarOpen, title} = useLayoutContext()
  const {workspaceId, changeWorkspace} = useWorkspaceRouterMaybe()

  const queryWorkspaces = useQueryWorkspace()
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

        {workspaceId && (
          <IpSelectSingle
            startAdornment={
              <Icon color="disabled" sx={{mr: 1}}>
                workspaces
              </Icon>
            }
            value={workspaceId}
            hideNullOption
            onChange={_ => _ && changeWorkspace(_)}
            sx={{width: 200, mr: 0.5}}
            options={(queryWorkspaces.get.data ?? []).map(_ => ({
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
        <Link to={router.root}>
          <IpIconBtn children="home" />
        </Link>
        <AppHeaderMenu />
      </AppHeaderContainer>
    </Slide>
  )
}
