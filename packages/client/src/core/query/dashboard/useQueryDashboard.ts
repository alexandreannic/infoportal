import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {Ip} from 'infoportal-api-sdk'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {ApiError} from '@/core/sdk/server/ApiClient'
import {useMemo} from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {usePendingMutation} from '@/core/query/usePendingMutation'
import {UseQueryWorkspace} from '@/core/query/useQueryWorkspace'

export class UseQueryDashboard {
  static getAll = ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
    const {apiv2} = useAppSettings()
    const {toastAndThrowHttpError} = useIpToast()
    return useQuery({
      queryFn: () => apiv2.dashboard.search({workspaceId}).catch(toastAndThrowHttpError),
      queryKey: queryKeys.dashboard(workspaceId),
    })
  }

  static publish = ({workspaceId, id}: {workspaceId: Ip.WorkspaceId; id: Ip.DashboardId}) => {
    const {toastHttpError} = useIpToast()
    const {apiv2} = useAppSettings()
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: () => apiv2.dashboard.publish({workspaceId, id}),
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.dashboard(workspaceId)}),
      onError: toastHttpError,
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
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.dashboard(workspaceId)}),
      onError: toastHttpError,
    })
  }

  static update = ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
    const {m} = useI18n()
    const {apiv2} = useAppSettings()
    const {toastError} = useIpToast()
    const queryClient = useQueryClient()
    return usePendingMutation<Ip.Dashboard, ApiError, Omit<Ip.Dashboard.Payload.Update, 'workspaceId'>>({
      getId: _ => _.id,
      mutationFn: args => apiv2.dashboard.update({workspaceId, ...args}),
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.dashboard(workspaceId)}),
      onError: () => toastError(m.errorOnSave, {reloadBtn: true}),
    })
  }

  static remove = ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
    const {m} = useI18n()
    const {apiv2} = useAppSettings()
    const {toastError} = useIpToast()
    const queryClient = useQueryClient()
    return usePendingMutation<void, ApiError, Omit<Ip.Dashboard.Payload.Delete, 'workspaceId'>>({
      getId: _ => _.id,
      mutationFn: args => apiv2.dashboard.remove({workspaceId, ...args}),
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.dashboard(workspaceId)}),
      onError: () => toastError(m.errorOnSave, {reloadBtn: true}),
    })
  }
}
