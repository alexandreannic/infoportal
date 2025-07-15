import {AppHeader} from '@/core/layout/AppHeader'
import {AppSidebar} from '@/core/layout/AppSidebar'
import {ProtectRoute} from '@/core/Session/SessionContext'
import {createRoute, Outlet} from '@tanstack/react-router'
import React from 'react'
import {rootRoute} from '@/Router'
import {Layout} from '@/shared/Layout/Layout'

export const workspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$workspaceId',
  component: Workspace,
})

function Workspace() {
  const {workspaceId} = workspaceRoute.useParams()
  return (
    <ProtectRoute>
      <Layout header={<AppHeader workspaceId={workspaceId} />} sidebar={<AppSidebar workspaceId={workspaceId} />}>
        <Outlet />
      </Layout>
    </ProtectRoute>
  )
}
