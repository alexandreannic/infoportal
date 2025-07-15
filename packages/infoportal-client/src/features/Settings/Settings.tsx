import {useI18n} from '@/core/i18n'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {Icon, Tab, Tabs} from '@mui/material'
import {useEffect} from 'react'
import {createRoute, Link, Outlet, useMatches} from '@tanstack/react-router'
import {Page} from '@/shared'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {settingsGroupsRoute} from '@/features/Settings/SettingsGroups'
import {settingsProxyRoute} from '@/features/Settings/SettingsProxy'
import {settingsUsersRoute} from '@/features/Settings/SettingsUsers'
import {settingsCacheRoute} from '@/features/Settings/SettingsCache'

export const settingsRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: 'settings',
  component: Settings,
})

function Settings() {
  const {m} = useI18n()
  const match = useMatches().slice(-1)[0]
  const {setTitle} = useLayoutContext()

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
        <Tab
          icon={<Icon>group</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={settingsUsersRoute.fullPath}
          to={settingsUsersRoute.fullPath}
          label={m.users}
        />
        <Tab
          icon={<Icon>groups</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={settingsGroupsRoute.fullPath}
          to={settingsGroupsRoute.fullPath}
          label={m.group}
        />
        <Tab
          icon={<Icon>settings_input_antenna</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={settingsProxyRoute.fullPath}
          to={settingsProxyRoute.fullPath}
          label={m.proxy}
        />
        <Tab
          icon={<Icon>memory</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={settingsCacheRoute.fullPath}
          to={settingsCacheRoute.fullPath}
          label={m.serverCache}
        />
      </Tabs>
      <Outlet />
    </Page>
  )
}
