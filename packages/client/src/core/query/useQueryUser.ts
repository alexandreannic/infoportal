import {useQuery, useQueryClient} from '@tanstack/react-query'
import {useAppSettings} from '../context/ConfigContext'
import {useIpToast} from '../useToast'
import {queryKeys} from './query.index'
import {Api} from '@infoportal/api-sdk'
import {usePendingMutation} from '@/core/query/usePendingMutation.js'

export class UseQueryUser {
  static getAll(workspaceId: Api.WorkspaceId) {
    const {apiv2} = useAppSettings()
    const {toastAndThrowHttpError} = useIpToast()

    return useQuery({
      queryKey: queryKeys.user(workspaceId),
      queryFn: () => apiv2.user.search({workspaceId}).catch(toastAndThrowHttpError),
    })
  }

  static getJobs(workspaceId: Api.WorkspaceId) {
    const {apiv2} = useAppSettings()
    const {toastAndThrowHttpError} = useIpToast()

    return useQuery({
      queryKey: queryKeys.userJob(workspaceId),
      queryFn: () => apiv2.user.getJobs({workspaceId}).catch(toastAndThrowHttpError),
    })
  }

  static update(workspaceId: Api.WorkspaceId) {
    const {apiv2} = useAppSettings()
    const {toastHttpError} = useIpToast()
    const queryClient = useQueryClient()
    return usePendingMutation({
      mutationFn: (params: Omit<Api.User.Payload.Update, 'workspaceId'>) => apiv2.user.update({workspaceId, ...params}),
      getId: variables => variables.id,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: queryKeys.user(workspaceId)})
      },
      onError: toastHttpError,
    })
  }
}
