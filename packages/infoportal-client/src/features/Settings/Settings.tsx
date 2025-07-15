import {useI18n} from '@/core/i18n'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {Icon, Tab, Tabs} from '@mui/material'
import {useEffect} from 'react'
import {createRoute, Link, Outlet, useMatches} from '@tanstack/react-router'
import {Page} from '@/shared'
import {workspaceRoute} from '@/features/Workspace/Workspace'
import {adminGroupsRoute} from '@/features/Admin/AdminGroups'
import {adminProxyRoute} from '@/features/Admin/AdminProxy'
import {adminUsersRoute} from '@/features/Admin/AdminUsers'
import {adminCacheRoute} from '@/features/Admin/AdminCache'

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
          value={adminUsersRoute.fullPath}
          to={adminUsersRoute.fullPath}
          label={m.users}
        />
        <Tab
          icon={<Icon>groups</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={adminGroupsRoute.fullPath}
          to={adminGroupsRoute.fullPath}
          label={m.group}
        />
        <Tab
          icon={<Icon>settings_input_antenna</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={adminProxyRoute.fullPath}
          to={adminProxyRoute.fullPath}
          label={m.proxy}
        />
        <Tab
          icon={<Icon>memory</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={adminCacheRoute.fullPath}
          to={adminCacheRoute.fullPath}
          label={m.serverCache}
        />
      </Tabs>
      <Outlet />
    </Page>
  )
}
