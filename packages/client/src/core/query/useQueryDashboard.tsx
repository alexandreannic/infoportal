import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {Ip} from 'infoportal-api-sdk'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {ApiError} from '@/core/sdk/server/ApiClient'
import {useMemo} from 'react'

export class UseQueryDashboard {
  static getAll = ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
    const {apiv2} = useAppSettings()
    const {toastAndThrowHttpError} = useIpToast()
    return useQuery({
      queryFn: () => apiv2.dashboard.getAll({workspaceId}).catch(toastAndThrowHttpError),
      queryKey: queryKeys.dashboards(workspaceId),
    })
  }

  static getById = ({workspaceId, id}: {workspaceId: Ip.WorkspaceId; id: Ip.DashboardId}) => {
    const query = this.getAll({workspaceId})
    const data = useMemo(() => {
      return query.data?.find(_ => _.id === id)
    }, [query.data])
    return {
      ...query,
      data,
    }
  }

  static create = ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
    const {apiv2} = useAppSettings()
    const {toastHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return useMutation<Ip.Dashboard, ApiError, Omit<Ip.Dashboard.Payload.Create, 'workspaceId'>>({
      mutationFn: args => apiv2.dashboard.create({workspaceId, ...args}),
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.dashboards(workspaceId)}),
      onError: toastHttpError,
    })
  }
}
