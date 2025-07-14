import {useI18n} from '@/core/i18n'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {Icon, Tab, Tabs} from '@mui/material'
import {useEffect} from 'react'
import {Outlet, Link, useRouterState} from '@tanstack/react-router'
import {Page} from '@/shared'
import {appRoutes, tsRouter} from '@/TanstackRouter'

export const Settings = () => {
  const {m} = useI18n()
  const {workspaceId} = appRoutes.app.workspace.settings.root.useParams()
  const pathname = useRouterState({select: s => s.location.pathname})
  const {setTitle} = useLayoutContext()

  useEffect(() => {
    setTitle(m.settings)
  }, [])

  return (
    <Page width="full">
      {/* <PageTitle>{m.settings}</PageTitle> */}
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={pathname}
        sx={{
          borderBottom: t => `1px solid ${t.palette.divider}`,
        }}
      >
        <Tab
          icon={<Icon>group</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={appRoutes.app.workspace.settings.users.fullPath}
          to={
            tsRouter.buildLocation({
              to: '/app/$workspaceId/settings/users',
              params: {workspaceId},
            }).pathname
          }
          label={m.users}
        />
        <Tab
          icon={<Icon>groups</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={appRoutes.app.workspace.settings.group.fullPath}
          to={
            tsRouter.buildLocation({
              to: '/app/$workspaceId/settings/group',
              params: {workspaceId},
            }).pathname
          }
          label={m.group}
        />
        <Tab
          icon={<Icon>settings_input_antenna</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={appRoutes.app.workspace.settings.proxy.fullPath}
          to={
            tsRouter.buildLocation({
              to: '/app/$workspaceId/settings/proxy',
              params: {workspaceId},
            }).pathname
          }
          label={m.proxy}
        />
        <Tab
          icon={<Icon>memory</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={appRoutes.app.workspace.settings.cache.fullPath}
          to={
            tsRouter.buildLocation({
              to: '/app/$workspaceId/settings/cache',
              params: {workspaceId},
            }).pathname
          }
          label={m.serverCache}
        />
      </Tabs>
      <Outlet />
    </Page>
  )
}
