import {useI18n} from '@/core/i18n'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {Icon, Tab, Tabs} from '@mui/material'
import {useEffect} from 'react'
import {Link, Outlet, useMatches} from '@tanstack/react-router'
import {Page} from '@/shared'
import {appRoutes} from '@/Router'

export const Settings = () => {
  const {m} = useI18n()
  const match = useMatches().slice(-1)[0]
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
        value={match}
        sx={{
          borderBottom: t => `1px solid ${t.palette.divider}`,
        }}
      >
        <Tab
          icon={<Icon>group</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={appRoutes.workspace.settings.users.fullPath}
          to={appRoutes.workspace.settings.users.fullPath}
          // to={
          //   tsRouter.buildLocation({
          //     to: '/$workspaceId/settings/users',
          //     params: {workspaceId},
          //   }).pathname
          // }
          label={m.users}
        />
        <Tab
          icon={<Icon>groups</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={appRoutes.workspace.settings.group.fullPath}
          to={appRoutes.workspace.settings.group.fullPath}
          label={m.group}
        />
        <Tab
          icon={<Icon>settings_input_antenna</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={appRoutes.workspace.settings.proxy.fullPath}
          to={appRoutes.workspace.settings.proxy.fullPath}
          label={m.proxy}
        />
        <Tab
          icon={<Icon>memory</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={Link}
          value={appRoutes.workspace.settings.cache.fullPath}
          to={appRoutes.workspace.settings.cache.fullPath}
          label={m.serverCache}
        />
      </Tabs>
      <Outlet />
    </Page>
  )
}
