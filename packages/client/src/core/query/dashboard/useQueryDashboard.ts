import {useAppSettings} from '@/core/context/ConfigContext'
import {queryKeys} from '@/core/query/query.index'
import {usePendingMutation} from '@/core/query/usePendingMutation'
import {ApiError} from '@/core/sdk/server/HttpClient'
import {useIpToast} from '@/core/useToast'
import {useI18n} from '@infoportal/client-i18n'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {Api} from '@infoportal/api-sdk'
import {useMemo} from 'react'

export class UseQueryDashboard {
  static getAll = ({workspaceId}: {workspaceId: Api.WorkspaceId}) => {
    const {apiv2} = useAppSettings()
    const {toastAndThrowHttpError} = useIpToast()
    return useQuery({
      queryFn: () => apiv2.dashboard.search({workspaceId}).catch(toastAndThrowHttpError),
      queryKey: queryKeys.dashboard(workspaceId),
    })
  }

  static publish = ({workspaceId, id}: {workspaceId: Api.WorkspaceId; id: Api.DashboardId}) => {
    const {toastHttpError, toastSuccess} = useIpToast()
    const {apiv2} = useAppSettings()
    return useMutation({
      mutationFn: () => apiv2.dashboard.publish({workspaceId, id}),
      onSuccess: () => {
        // queryClient.invalidateQueries({queryKey: queryKeys.dashboard(workspaceId)})
      },
      onError: toastHttpError,
    })
  }

  static restorePublishedVersion = ({workspaceId, id}: {workspaceId: Api.WorkspaceId; id: Api.DashboardId}) => {
    const {toastHttpError} = useIpToast()
    const {apiv2} = useAppSettings()
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: () => apiv2.dashboard.restorePublishedVersion({workspaceId, id}),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: queryKeys.dashboard(workspaceId, id)})
      },
      onError: toastHttpError,
    })
  }

  static getProtectedSubmission = ({workspaceSlug, dashboardSlug}: {workspaceSlug: string; dashboardSlug: string}) => {
    const {apiv2} = useAppSettings()
    return useQuery({
      queryKey: queryKeys.dasboardProtectedSubmission(workspaceSlug, dashboardSlug),
      queryFn: async () => {
        return apiv2.dashboard.getProtectedSubmission({workspaceSlug, dashboardSlug})
      },
    })
  }

  static getPublished = ({workspaceSlug, dashboardSlug}: {workspaceSlug: string; dashboardSlug: string}) => {
    const {apiv2} = useAppSettings()
    return useQuery({
      queryKey: queryKeys.dashboardBySlug(workspaceSlug, dashboardSlug),
      queryFn: async () => {
        return apiv2.dashboard.getBySlug({workspaceSlug, dashboardSlug})
      },
    })
  }

  static getById = ({workspaceId, id}: {workspaceId: Api.WorkspaceId; id: Api.DashboardId}) => {
    const query = this.getAll({workspaceId})
    const data = useMemo(() => {
      return query.data?.find(_ => _.id === id)
    }, [query.data])
    return {
      ...query,
      data,
    }
  }

  static create = ({workspaceId}: {workspaceId: Api.WorkspaceId}) => {
    const {apiv2} = useAppSettings()
    const {toastHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return useMutation<Api.Dashboard, ApiError, Omit<Api.Dashboard.Payload.Create, 'workspaceId'>>({
      mutationFn: args => apiv2.dashboard.create({workspaceId, ...args}),
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.dashboard(workspaceId)}),
      onError: toastHttpError,
    })
  }

  static update = ({workspaceId}: {workspaceId: Api.WorkspaceId}) => {
    const {m} = useI18n()
    const {apiv2} = useAppSettings()
    const {toastError} = useIpToast()
    const queryClient = useQueryClient()
    return usePendingMutation<Api.Dashboard, ApiError, Omit<Api.Dashboard.Payload.Update, 'workspaceId'>>({
      getId: _ => _.id,
      mutationFn: args => apiv2.dashboard.update({workspaceId, ...args}),
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.dashboard(workspaceId)}),
      onError: () => toastError(m.errorOnSave, {reloadBtn: true}),
    })
  }

  static remove = ({workspaceId}: {workspaceId: Api.WorkspaceId}) => {
    const {m} = useI18n()
    const {apiv2} = useAppSettings()
    const {toastError} = useIpToast()
    const queryClient = useQueryClient()
    return usePendingMutation<void, ApiError, Omit<Api.Dashboard.Payload.Delete, 'workspaceId'>>({
      getId: _ => _.id,
      mutationFn: args => apiv2.dashboard.remove({workspaceId, ...args}),
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.dashboard(workspaceId)}),
      onError: () => toastError(m.errorOnSave, {reloadBtn: true}),
    })
  }
}
