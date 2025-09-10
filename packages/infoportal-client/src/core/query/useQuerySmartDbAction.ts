import {useAppSettings} from '@/core/context/ConfigContext'
import {Ip} from 'infoportal-api-sdk'
import {useIpToast} from '@/core/useToast'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {ApiError} from '@/core/sdk/server/ApiClient'

export class UseQuerySmartDbAction {
  static readonly create = (workspaceId: Ip.WorkspaceId, smartId: Ip.Form.SmartId) => {
    const {apiv2} = useAppSettings()
    const queryClient = useQueryClient()
    const {toastHttpError} = useIpToast()

    return useMutation<
      Ip.Form.Smart.Action,
      ApiError,
      Omit<Ip.Form.Smart.Payload.ActionCreate, 'smartId' | 'workspaceId'>
    >({
      mutationFn: async args => {
        return apiv2.form.smart.action.create({...args, smartId, workspaceId})
      },
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.smartDbFunction(workspaceId, smartId)}),
      onError: toastHttpError,
    })
  }

  static readonly getByDbId = (workspaceId: Ip.WorkspaceId, smartId: Ip.Form.SmartId) => {
    const {apiv2} = useAppSettings()
    const {toastAndThrowHttpError} = useIpToast()

    return useQuery({
      queryKey: queryKeys.smartDbFunction(workspaceId, smartId),
      queryFn: () => apiv2.form.smart.action.getByDbId({workspaceId, smartId}).catch(toastAndThrowHttpError),
    })
  }

  static readonly getById = (
    workspaceId: Ip.WorkspaceId,
    smartId: Ip.Form.SmartId,
    functionId: Ip.Form.Smart.ActionId,
  ) => {
    const all = this.getByDbId(workspaceId, smartId)
    return {
      ...all,
      data: all.data?.find(_ => _.id === functionId),
    }
  }
}
