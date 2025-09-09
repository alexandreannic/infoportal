import {useAppSettings} from '@/core/context/ConfigContext'
import {Ip} from 'infoportal-api-sdk'
import {useIpToast} from '@/core/useToast'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {ApiError} from '@/core/sdk/server/ApiClient'

export class UseQuerySmartDb {
  static readonly create = (workspaceId: Ip.WorkspaceId) => {
    const {apiv2} = useAppSettings()
    const queryClient = useQueryClient()
    const {toastAndThrowHttpError, toastHttpError} = useIpToast()

    return useMutation<Ip.SmartDb, ApiError, Omit<Ip.SmartDb.Payload.Create, 'workspaceId'>>({
      mutationFn: async args => {
        return apiv2.smartDb.create({...args, workspaceId})
      },
      onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.smartDb(workspaceId)}),
      onError: toastHttpError,
    })
  }

  static readonly getAll = (workspaceId: Ip.WorkspaceId) => {
    const {apiv2} = useAppSettings()
    const {toastAndThrowHttpError} = useIpToast()

    return useQuery({
      queryKey: queryKeys.smartDb(workspaceId),
      queryFn: () => apiv2.smartDb.getAll({workspaceId}).catch(toastAndThrowHttpError),
    })
  }

  static readonly getById = (workspaceId: Ip.WorkspaceId, dbId: Ip.SmartDbId) => {
    const all = this.getAll(workspaceId)
    return {
      ...all,
      data: all.data?.find(_ => _.id === dbId),
    }
  }
}
