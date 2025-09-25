import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {Ip} from 'infoportal-api-sdk'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {ApiError} from '@/core/sdk/server/ApiClient'
import {useMemo} from 'react'
import {usePendingMutation} from '@/core/query/usePendingMutation'

export class UseQueryDashboardWidget {
  static getByDashboard = (params: {dashboardId: Ip.DashboardId; workspaceId: Ip.WorkspaceId}) => {
    const {apiv2} = useAppSettings()
    const {toastAndThrowHttpError} = useIpToast()
    return useQuery({
      queryFn: () => apiv2.dashboard.widget.getByDashboard(params).catch(toastAndThrowHttpError),
      queryKey: queryKeys.dashboardWidget(params.workspaceId, params.dashboardId),
    })
  }

  static create = ({workspaceId, dashboardId}: {workspaceId: Ip.WorkspaceId; dashboardId: Ip.DashboardId}) => {
    const {apiv2} = useAppSettings()
    const {toastHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return useMutation<
      Ip.Dashboard.Widget,
      ApiError,
      Omit<Ip.Dashboard.Widget.Payload.Create, 'workspaceId' | 'dashboardId'>
    >({
      mutationFn: args => apiv2.dashboard.widget.create({workspaceId, dashboardId, ...args}),
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.dashboardWidget(workspaceId, dashboardId)}),
      onError: toastHttpError,
    })
  }

  static update = ({workspaceId, dashboardId}: {workspaceId: Ip.WorkspaceId; dashboardId: Ip.DashboardId}) => {
    const {apiv2} = useAppSettings()
    const {toastHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return usePendingMutation<
      Ip.Dashboard.Widget,
      ApiError,
      Omit<Ip.Dashboard.Widget.Payload.Update, 'workspaceId' | 'dashboardId'>
    >({
      getId: _ => _.widgetId,
      mutationFn: variables => {
        const query = apiv2.dashboard.widget.update({workspaceId, dashboardId, ...variables})
        const key = queryKeys.dashboardWidget(workspaceId, dashboardId)
        queryClient.setQueryData<Ip.Dashboard.Widget[]>(key, old => {
          return old?.map(_ => {
            if (_.id === variables.widgetId) return {..._, ...variables}
            return _
          })
        })
        return query
      },
      onSuccess: (data, variables, context) => {
      },
      onError: e => {
        toastHttpError(e)
        queryClient.invalidateQueries({queryKey: queryKeys.dashboardWidget(workspaceId, dashboardId)})
      },
    })
  }

  static remove = ({workspaceId, dashboardId}: {workspaceId: Ip.WorkspaceId; dashboardId: Ip.DashboardId}) => {
    const {apiv2} = useAppSettings()
    const {toastHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return usePendingMutation<void, ApiError, {widgetId: Ip.Dashboard.WidgetId}>({
      getId: _ => _.widgetId,
      mutationFn: args => apiv2.dashboard.widget.remove({workspaceId, dashboardId, ...args}),
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.dashboardWidget(workspaceId, dashboardId)}),
      onError: toastHttpError,
    })
  }
}
