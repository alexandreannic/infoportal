import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {Api} from '@infoportal/api-sdk'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {ApiError} from '@/core/sdk/server/HttpClient'
import {usePendingMutation} from '@/core/query/usePendingMutation'

export class UseQueryDashboardSecion {
  static search = (params: Api.Dashboard.Section.Payload.Search) => {
    const {apiv2} = useAppSettings()
    const {dashboardId, workspaceId} = params
    const {toastAndThrowHttpError} = useIpToast()
    return useQuery({
      queryFn: () => apiv2.dashboard.section.search(params).catch(toastAndThrowHttpError),
      queryKey: queryKeys.dashboardSection(workspaceId, dashboardId),
    })
  }

  static create = ({workspaceId, dashboardId}: {workspaceId: Api.WorkspaceId; dashboardId: Api.DashboardId}) => {
    const {apiv2} = useAppSettings()
    const {toastHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return useMutation<
      Api.Dashboard.Section,
      ApiError,
      Omit<Api.Dashboard.Section.Payload.Create, 'workspaceId' | 'dashboardId'>
    >({
      mutationFn: args => apiv2.dashboard.section.create({workspaceId, dashboardId, ...args}),
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.dashboardSection(workspaceId, dashboardId)}),
      onError: toastHttpError,
    })
  }

  static update = ({workspaceId, dashboardId}: {workspaceId: Api.WorkspaceId; dashboardId: Api.DashboardId}) => {
    const {apiv2} = useAppSettings()
    const {toastHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return usePendingMutation<Api.Dashboard.Section, ApiError, Omit<Api.Dashboard.Section.Payload.Update, 'workspaceId'>>(
      {
        getId: _ => _.id,
        mutationFn: variables => {
          const query = apiv2.dashboard.section.update({workspaceId, ...variables})
          const key = queryKeys.dashboardSection(workspaceId, dashboardId)
          queryClient.setQueryData<Api.Dashboard.Section[]>(key, old => {
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

  static remove = ({workspaceId, dashboardId}: {workspaceId: Api.WorkspaceId; dashboardId: Api.DashboardId}) => {
    const {apiv2} = useAppSettings()
    const {toastHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return usePendingMutation<void, ApiError, {id: Api.Dashboard.SectionId}>({
      getId: _ => _.id,
      mutationFn: args => apiv2.dashboard.section.remove({workspaceId, ...args}),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({queryKey: queryKeys.dashboardSection(workspaceId, dashboardId)})
      },
      onError: toastHttpError,
    })
  }
}
