import {useWorkspaceRouter} from '@/core/context/WorkspaceContext'
import {useI18n} from '@/core/i18n'
import {Page, PageTitle} from '@/shared'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {Icon, Tab, Tabs} from '@mui/material'
import {useEffect} from 'react'
import {Outlet, useLocation} from 'react-router'
import {NavLink} from 'react-router-dom'

export const Settings = () => {
  const {m} = useI18n()
  const {pathname} = useLocation()
  const {router} = useWorkspaceRouter()
  const {setTitle} = useLayoutContext()

  useEffect(() => {
    setTitle(m.settings)
  }, [])
  return (
    <>
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
          component={NavLink}
          value={router.settings.users}
          to={router.settings.users}
          label={m.users}
        />
        <Tab
          icon={<Icon>groups</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={NavLink}
          value={router.settings.group}
          to={router.settings.group}
          label={m.group}
        />
        <Tab
          icon={<Icon>settings_input_antenna</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={NavLink}
          value={router.settings.proxy}
          to={router.settings.proxy}
          label={m.proxy}
        />
        <Tab
          icon={<Icon>memory</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={NavLink}
          value={router.settings.cache}
          to={router.settings.cache}
          label={m.serverCache}
        />
      </Tabs>
      <Outlet />
    </>
  )
}
