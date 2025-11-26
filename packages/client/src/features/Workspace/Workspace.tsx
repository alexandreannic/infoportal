import {AppHeader} from '@/core/layout/AppHeader'
import {AppSidebar} from '@/core/layout/AppSidebar'
import {ProtectRoute} from '@/core/Session/SessionContext'
import {createRoute, Outlet} from '@tanstack/react-router'
import React, {createContext, useContext} from 'react'
import {rootRoute} from '@/Router'
import {Layout} from '@/shared/Layout/Layout'
import {Api} from '@infoportal/api-sdk'
import {UseQueryWorkspace} from '@/core/query/workspace/useQueryWorkspace'
import {UseQueryPermission} from '@/core/query/useQueryPermission'
import {PageError} from '@/shared/PageError'

export const workspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$workspaceId',
  component: Workspace,
})

export type WorkspaceContext = {
  workspaceId: Api.WorkspaceId
  workspace: Api.Workspace
  permission: Api.Permission.Workspace
}

const Context = createContext<WorkspaceContext>({} as any)
export const useWorkspaceContext = () => useContext<WorkspaceContext>(Context)

function Workspace() {
  const {workspaceId} = workspaceRoute.useParams() as {workspaceId: Api.WorkspaceId}
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
          <PageError />
        )}
      </Layout>
    </ProtectRoute>
  )
}
