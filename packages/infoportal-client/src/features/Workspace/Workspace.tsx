import {AppHeader} from '@/core/layout/AppHeader'
import {AppSidebar} from '@/core/layout/AppSidebar'
import {ProtectRoute} from '@/core/Session/SessionContext'
import {Outlet} from '@tanstack/react-router'
import React from 'react'
import {appRoutes} from '@/Router'
import {Layout} from '@/shared/Layout/Layout'

export const Workspace = () => {
  const {workspaceId} = appRoutes.workspace.root.useParams()
  return (
    <ProtectRoute>
      <Layout header={<AppHeader workspaceId={workspaceId} />} sidebar={<AppSidebar workspaceId={workspaceId} />}>
        <Outlet />
      </Layout>
    </ProtectRoute>
  )
}
