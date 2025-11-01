import {Ip} from 'infoportal-api-sdk'
import {UseQueryWorkspace} from '@/core/query/useQueryWorkspace'
import {UseQueryDashboard} from '@/core/query/dashboard/useQueryDashboard'
import {useAppSettings} from '@/core/context/ConfigContext'

export const useGetDashboardLink = ({
  workspaceId,
  dashboardId,
}: {
  workspaceId: Ip.WorkspaceId
  dashboardId: Ip.DashboardId
}) => {
  const {conf} = useAppSettings()
  const queryWorkspace = UseQueryWorkspace.getById(workspaceId)
  const queryDashboard = UseQueryDashboard.getById({workspaceId, id: dashboardId})

  if (!queryWorkspace.data || !queryDashboard.data) return {absolute: undefined, relative: undefined}
  const relative = Ip.Dashboard.buildPath(queryWorkspace.data, queryDashboard.data)
  const absolute = new URL(relative, conf.baseURL).toString()
  return {
    relative,
    absolute,
  }
}
