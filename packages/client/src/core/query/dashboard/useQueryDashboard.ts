import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {Ip} from 'infoportal-api-sdk'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {ApiError} from '@/core/sdk/server/ApiClient'
import {useMemo} from 'react'
import {useI18n} from '@infoportal/client-i18n'

export class UseQueryDashboard {
  static getAll = ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
    const {apiv2} = useAppSettings()
    const {toastAndThrowHttpError} = useIpToast()
    return useQuery({
      queryFn: () => apiv2.dashboard.search({workspaceId}).catch(toastAndThrowHttpError),
      queryKey: queryKeys.dashboard(workspaceId),
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
    return useMutation<Ip.Dashboard, ApiError, Omit<Ip.Dashboard.Payload.Update, 'workspaceId'>>({
      mutationFn: args => apiv2.dashboard.update({workspaceId, ...args}),
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.dashboard(workspaceId)}),
      onError: () => toastError(m.errorOnSave, {reloadBtn: true}),
    })
  }
}
