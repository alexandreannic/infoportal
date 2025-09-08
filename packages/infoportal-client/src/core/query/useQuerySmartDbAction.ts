import {useAppSettings} from '@/core/context/ConfigContext'
import {Ip} from 'infoportal-api-sdk'
import {useIpToast} from '@/core/useToast'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {ApiError} from '@/core/sdk/server/ApiClient'

export class UseQuerySmartDbAction {
  static readonly create = (workspaceId: Ip.WorkspaceId, smartDbId: Ip.SmartDbId) => {
    const {apiv2} = useAppSettings()
    const queryClient = useQueryClient()
    const {toastHttpError} = useIpToast()

    return useMutation<Ip.SmartDb.Action, ApiError, Omit<Ip.SmartDb.Payload.ActionCreate, 'smartDbId' | 'workspaceId'>>(
      {
        mutationFn: async args => {
          return apiv2.smartDb.action.create({...args, smartDbId, workspaceId})
        },
        onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.smartDbFunction(workspaceId, smartDbId)}),
        onError: toastHttpError,
      },
    )
  }

  static readonly getByDbId = (workspaceId: Ip.WorkspaceId, smartDbId: Ip.SmartDbId) => {
    const {apiv2} = useAppSettings()
    const {toastAndThrowHttpError} = useIpToast()

    return useQuery({
      queryKey: queryKeys.smartDbFunction(workspaceId, smartDbId),
      queryFn: () => apiv2.smartDb.action.getByDbId({workspaceId, smartDbId}).catch(toastAndThrowHttpError),
    })
  }

  static readonly getById = (workspaceId: Ip.WorkspaceId, smartDbId: Ip.SmartDbId, functionId: Ip.SmartDb.ActionId) => {
    const all = this.getByDbId(workspaceId, smartDbId)
    return {
      ...all,
      data: all.data?.find(_ => _.id === functionId),
    }
  }
}
