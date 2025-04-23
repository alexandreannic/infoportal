import {NavLink, Route, Routes} from 'react-router-dom'
import React from 'react'
import {AdminUsers} from '@/features/Admin/AdminUsers'
import {AppHeader} from '@/shared/Layout/Header/AppHeader'
import {Sidebar, SidebarBody, SidebarItem} from '@/shared/Layout/Sidebar'
import {useI18n} from '@/core/i18n'
import {Layout} from '@/shared/Layout'
import {AdminProxy} from '@/features/Admin/AdminProxy'
import {AdminGroups} from '@/features/Admin/AdminGroups'
import {appFeaturesIndex} from '@/features/appFeatureId'
import {AdminCache} from '@/features/Admin/AdminCache'
import {useReactRouterDefaultRoute} from '@/core/useReactRouterDefaultRoute'

export const adminModule = {
  basePath: '/admin',
  siteMap: {
    users: '/users',
    proxy: '/proxy',
    group: '/group',
    cache: '/cache',
  },
}

const AdminSidebar = () => {
  const path = (page: string) => '' + page
  const {m} = useI18n()
  return (
    <Sidebar>
      <SidebarBody>
        <NavLink to={path(adminModule.siteMap.users)}>
          {({isActive}) => (
            <SidebarItem icon="group" active={isActive}>
              {m.users}
            </SidebarItem>
          )}
        </NavLink>
        <NavLink to={path(adminModule.siteMap.group)}>
          {({isActive}) => (
            <SidebarItem icon="groups" active={isActive}>
              {m.group}
            </SidebarItem>
          )}
        </NavLink>
        <NavLink to={path(adminModule.siteMap.proxy)}>
          {({isActive}) => (
            <SidebarItem icon="settings_input_antenna" active={isActive}>
              {m.proxy}
            </SidebarItem>
          )}
        </NavLink>
        <NavLink to={path(adminModule.siteMap.cache)}>
          {({isActive}) => (
            <SidebarItem icon="memory" active={isActive}>
              {m.serverCache}
            </SidebarItem>
          )}
        </NavLink>
      </SidebarBody>
    </Sidebar>
  )
}

export const Admin = () => {
  useReactRouterDefaultRoute(adminModule.siteMap.users)
  return (
    <Layout title={appFeaturesIndex.admin.name} sidebar={<AdminSidebar />} header={<AppHeader id="app-header" />}>
      <Routes>
        <Route path={adminModule.siteMap.users} element={<AdminUsers />} />
        <Route path={adminModule.siteMap.proxy} element={<AdminProxy />} />
        <Route path={adminModule.siteMap.group} element={<AdminGroups />} />
        <Route path={adminModule.siteMap.cache} element={<AdminCache />} />
      </Routes>
    </Layout>
  )
}
