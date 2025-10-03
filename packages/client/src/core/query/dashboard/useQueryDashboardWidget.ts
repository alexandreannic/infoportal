import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {Ip} from 'infoportal-api-sdk'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {ApiError} from '@/core/sdk/server/ApiClient'
import {usePendingMutation} from '@/core/query/usePendingMutation'

export class UseQueryDashboardWidget {
  static search = (params: Omit<Ip.Dashboard.Widget.Payload.Search, 'sectionId'>) => {
    const {apiv2} = useAppSettings()
    const {dashboardId, workspaceId} = params
    const {toastAndThrowHttpError} = useIpToast()
    return useQuery({
      queryFn: () => apiv2.dashboard.widget.search(params).catch(toastAndThrowHttpError),
      queryKey: queryKeys.dashboardWidget(workspaceId, dashboardId),
    })
  }

  static create = ({
    workspaceId,
    dashboardId,
    sectionId,
  }: {
    workspaceId: Ip.WorkspaceId
    dashboardId: Ip.DashboardId
    sectionId: Ip.Dashboard.SectionId
  }) => {
    const {apiv2} = useAppSettings()
    const {toastHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return useMutation<
      Ip.Dashboard.Widget,
      ApiError,
      Omit<Ip.Dashboard.Widget.Payload.Create, 'workspaceId' | 'sectionId'>
    >({
      mutationFn: args => apiv2.dashboard.widget.create({workspaceId, sectionId, ...args}),
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.dashboardWidget(workspaceId, dashboardId)}),
      onError: toastHttpError,
    })
  }

  static update = ({
    workspaceId,
    dashboardId,
    sectionId,
  }: {
    workspaceId: Ip.WorkspaceId
    dashboardId: Ip.DashboardId
    sectionId: Ip.Dashboard.SectionId
  }) => {
    const {apiv2} = useAppSettings()
    const {toastHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return usePendingMutation<
      Ip.Dashboard.Widget,
      ApiError,
      Omit<Ip.Dashboard.Widget.Payload.Update, 'workspaceId' | 'sectionId'>
    >({
      getId: _ => _.id,
      mutationFn: variables => {
        const query = apiv2.dashboard.widget.update({workspaceId, sectionId, ...variables})
        const key = queryKeys.dashboardWidget(workspaceId, dashboardId)
        queryClient.setQueryData<Ip.Dashboard.Widget[]>(key, old => {
          return old?.map(_ => {
            if (_.id === variables.id) return {..._, ...variables}
            return _
          })
        })
        return query
      },
      onSuccess: (data, variables, context) => {},
      onError: e => {
        toastHttpError(e)
        queryClient.invalidateQueries({queryKey: queryKeys.dashboardWidget(workspaceId, dashboardId)})
      },
    })
  }

  static remove = ({
    workspaceId,
    sectionId,
    dashboardId,
  }: {
    workspaceId: Ip.WorkspaceId
    dashboardId: Ip.DashboardId
    sectionId: Ip.Dashboard.SectionId
  }) => {
    const {apiv2} = useAppSettings()
    const {toastHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return usePendingMutation<void, ApiError, {id: Ip.Dashboard.WidgetId}>({
      getId: _ => _.id,
      mutationFn: args => apiv2.dashboard.widget.remove({workspaceId, ...args}),
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.dashboardWidget(workspaceId, dashboardId)}),
      onError: toastHttpError,
    })
  }
}
