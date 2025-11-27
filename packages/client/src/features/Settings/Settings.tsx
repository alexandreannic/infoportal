import {useI18n} from '@infoportal/client-i18n'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {Icon} from '@mui/material'
import {useEffect} from 'react'
import {createRoute, Outlet} from '@tanstack/react-router'
import {Page} from '@/shared'
import {useWorkspaceContext, workspaceRoute} from '@/features/Workspace/Workspace'
import {settingsGroupsRoute} from '@/features/Settings/SettingsGroups'
import {settingsUsersRoute} from '@/features/Settings/SettingsUsers'
import {settingsCacheRoute} from '@/features/Settings/SettingsCache'
import {useSession} from '@/core/Session/SessionContext'
import {TabLink, TabsLayout} from '@/shared/Tab/Tabs'

export const settingsRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: 'settings',
  component: Settings,
})

function Settings() {
  const {m} = useI18n()
  const {setTitle} = useLayoutContext()
  const {permission} = useWorkspaceContext()
  const {globalPermission} = useSession()

  useEffect(() => {
    setTitle(m.settings)
  }, [])

  return (
    <Page width="full">
      <TabsLayout>
        {permission.user_canRead && (
          <TabLink
            icon={<Icon>group</Icon>}
            sx={{minHeight: 34, py: 1}}
            to={settingsUsersRoute.fullPath}
            label={m.users}
          />
        )}
        {permission.group_canRead && (
          <TabLink
            icon={<Icon>groups</Icon>}
            sx={{minHeight: 34, py: 1}}
            to={settingsGroupsRoute.fullPath}
            label={m.group}
          />
        )}
        {globalPermission?.cache_manage && (
          <TabLink
            icon={<Icon>memory</Icon>}
            sx={{minHeight: 34, py: 1}}
            to={settingsCacheRoute.fullPath}
            label={m.serverCache}
          />
        )}
      </TabsLayout>
      <Outlet />
    </Page>
  )
}
