import {AppHeader} from '@/core/layout/AppHeader'
import {AppSidebar} from '@/core/layout/AppSidebar'
import {ProtectRoute} from '@/core/Session/SessionContext'
import {createRoute, Outlet} from '@tanstack/react-router'
import React, {createContext, useContext} from 'react'
import {rootRoute} from '@/Router'
import {Layout} from '@/shared/Layout/Layout'
import {Ip} from 'infoportal-api-sdk'
import {UseQueryWorkspace} from '@/core/query/useQueryWorkspace'
import {UseQueryPermission} from '@/core/query/useQueryPermission'
import {PageNotFound} from '@/shared/PageNotFound'

export const workspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$workspaceId',
  component: Workspace,
})

export type WorkspaceContext = {
  workspaceId: Ip.WorkspaceId
  workspace: Ip.Workspace
  permission: Ip.Permission.Workspace
}

const Context = createContext<WorkspaceContext>({} as any)
export const useWorkspaceContext = () => useContext<WorkspaceContext>(Context)

function Workspace() {
  const {workspaceId} = workspaceRoute.useParams() as {workspaceId: Ip.WorkspaceId}
  const queryWorkspaceGet = UseQueryWorkspace.get()
  const queryPermission = UseQueryPermission.workspace({workspaceId})
  const workspace = queryWorkspaceGet.data?.find(_ => _.id === workspaceId)

  return (
    <ProtectRoute>
      <Layout
        header={<AppHeader workspaceId={workspaceId} />}
        sidebar={workspace && <AppSidebar workspaceId={workspace.id} />}
      >
        {workspace ? (
          queryPermission.data && (
            <Context.Provider
              value={{
                workspaceId: workspace.id,
                workspace,
                permission: queryPermission.data,
              }}
            >
              <Outlet />
            </Context.Provider>
          )
        ) : (
          <PageNotFound />
        )}
      </Layout>
    </ProtectRoute>
  )
}
