import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {Ip} from 'infoportal-api-sdk'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {ApiError} from '@/core/sdk/server/ApiClient'
import {usePendingMutation} from '@/core/query/usePendingMutation'

export class UseQueryDashboardSecion {
  static search = (params: Ip.Dashboard.Section.Payload.Search) => {
    const {apiv2} = useAppSettings()
    const {dashboardId, workspaceId} = params
    const {toastAndThrowHttpError} = useIpToast()
    return useQuery({
      queryFn: () => apiv2.dashboard.section.search(params).catch(toastAndThrowHttpError),
      queryKey: queryKeys.dashboardSection(workspaceId, dashboardId),
    })
  }

  static create = ({workspaceId, dashboardId}: {workspaceId: Ip.WorkspaceId; dashboardId: Ip.DashboardId}) => {
    const {apiv2} = useAppSettings()
    const {toastHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return useMutation<
      Ip.Dashboard.Section,
      ApiError,
      Omit<Ip.Dashboard.Section.Payload.Create, 'workspaceId' | 'dashboardId'>
    >({
      mutationFn: args => apiv2.dashboard.section.create({workspaceId, dashboardId, ...args}),
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.dashboardSection(workspaceId, dashboardId)}),
      onError: toastHttpError,
    })
  }

  static update = ({workspaceId, dashboardId}: {workspaceId: Ip.WorkspaceId; dashboardId: Ip.DashboardId}) => {
    const {apiv2} = useAppSettings()
    const {toastHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return usePendingMutation<Ip.Dashboard.Section, ApiError, Omit<Ip.Dashboard.Section.Payload.Update, 'workspaceId'>>(
      {
        getId: _ => _.id,
        mutationFn: variables => {
          const query = apiv2.dashboard.section.update({workspaceId, ...variables})
          const key = queryKeys.dashboardSection(workspaceId, dashboardId)
          queryClient.setQueryData<Ip.Dashboard.Section[]>(key, old => {
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
          queryClient.invalidateQueries({queryKey: queryKeys.dashboardSection(workspaceId, dashboardId)})
        },
      },
    )
  }

  static remove = ({workspaceId, dashboardId}: {workspaceId: Ip.WorkspaceId; dashboardId: Ip.DashboardId}) => {
    const {apiv2} = useAppSettings()
    const {toastHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return usePendingMutation<void, ApiError, {id: Ip.Dashboard.SectionId}>({
      getId: _ => _.id,
      mutationFn: args => apiv2.dashboard.section.remove({workspaceId, ...args}),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({queryKey: queryKeys.dashboardSection(workspaceId, dashboardId)})
      },
      onError: toastHttpError,
    })
  }
}
