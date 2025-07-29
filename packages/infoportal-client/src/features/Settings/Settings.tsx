import {useI18n} from '@/core/i18n'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {Icon, Tab, Tabs} from '@mui/material'
import {useEffect} from 'react'
import {createRoute, Link, Outlet, useMatches, useNavigate, useRouterState} from '@tanstack/react-router'
import {Page} from '@/shared'
import {useWorkspaceContext, workspaceRoute} from '@/features/Workspace/Workspace'
import {settingsGroupsRoute} from '@/features/Settings/SettingsGroups'
import {settingsProxyRoute} from '@/features/Settings/SettingsProxy'
import {settingsUsersRoute} from '@/features/Settings/SettingsUsers'
import {settingsCacheRoute} from '@/features/Settings/SettingsCache'
import {useSession} from '@/core/Session/SessionContext'
import {Ip} from 'infoportal-api-sdk'

export const settingsRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: 'settings',
  component: Settings,
})

export const useDefaultTabRedirect = ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
  const navigate = useNavigate()
  const pathname = useRouterState({select: s => s.location.pathname})
  const currentFullPath = useMatches().slice(-1)[0].fullPath
  useEffect(() => {
    if (currentFullPath !== settingsRoute.fullPath) return
    navigate({to: '/$workspaceId/settings/users', params: {workspaceId}})
  }, [currentFullPath, pathname])
}

function Settings() {
  const {m} = useI18n()
  const {setTitle} = useLayoutContext()
  const match = useMatches().slice(-1)[0]
  const {permission} = useWorkspaceContext()
  const {globalPermission} = useSession()
  const workspaceId = settingsRoute.useParams().workspaceId as Ip.WorkspaceId

  useDefaultTabRedirect({workspaceId})

  useEffect(() => {
    setTitle(m.settings)
  }, [])

  return (
    <Page width="full">
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={match.fullPath}
        sx={{
          borderBottom: t => `1px solid ${t.palette.divider}`,
        }}
      >
        {permission.user_canRead && (
          <Tab
            icon={<Icon>group</Icon>}
            iconPosition="start"
            sx={{minHeight: 34, py: 1}}
            component={Link}
            value={settingsUsersRoute.fullPath}
            to={settingsUsersRoute.fullPath}
            label={m.users}
          />
        )}
        {permission.group_canRead && (
          <Tab
            icon={<Icon>groups</Icon>}
            iconPosition="start"
            sx={{minHeight: 34, py: 1}}
            component={Link}
            value={settingsGroupsRoute.fullPath}
            to={settingsGroupsRoute.fullPath}
            label={m.group}
          />
        )}
        {permission.proxy_canRead && (
          <Tab
            icon={<Icon>settings_input_antenna</Icon>}
            iconPosition="start"
            sx={{minHeight: 34, py: 1}}
            component={Link}
            value={settingsProxyRoute.fullPath}
            to={settingsProxyRoute.fullPath}
            label={m.proxy}
          />
        )}
        {globalPermission?.cache_manage && (
          <Tab
            icon={<Icon>memory</Icon>}
            iconPosition="start"
            sx={{minHeight: 34, py: 1}}
            component={Link}
            value={settingsCacheRoute.fullPath}
            to={settingsCacheRoute.fullPath}
            label={m.serverCache}
          />
        )}
      </Tabs>
      <Outlet />
    </Page>
  )
}
