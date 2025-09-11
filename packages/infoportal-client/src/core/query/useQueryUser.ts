import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useAppSettings} from '../context/ConfigContext'
import {useIpToast} from '../useToast'
import {queryKeys} from './query.index'
import {Ip} from 'infoportal-api-sdk'
import {useSetState} from '@axanc/react-hooks'
import {usePendingMutation} from '@/core/query/usePendingMutation.js'

export const useQueryUser = {
  getAll,
  getJobs,
  update,
}

function getAll(workspaceId: Ip.WorkspaceId) {
  const {apiv2} = useAppSettings()
  const {toastAndThrowHttpError} = useIpToast()

  return useQuery({
    queryKey: queryKeys.user(workspaceId),
    queryFn: () => apiv2.user.search({workspaceId}).catch(toastAndThrowHttpError),
  })
}

function getJobs(workspaceId: Ip.WorkspaceId) {
  const {apiv2} = useAppSettings()
  const {toastAndThrowHttpError} = useIpToast()

  return useQuery({
    queryKey: queryKeys.userJob(workspaceId),
    queryFn: () => apiv2.user.getJobs({workspaceId}).catch(toastAndThrowHttpError),
  })
}

function update(workspaceId: Ip.WorkspaceId) {
  const {apiv2} = useAppSettings()
  const {toastHttpError} = useIpToast()
  const queryClient = useQueryClient()
  return usePendingMutation({
    mutationFn: (params: Omit<Ip.User.Payload.Update, 'workspaceId'>) => apiv2.user.update({workspaceId, ...params}),
    getId: variables => variables.id,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.user(workspaceId)})
    },
    onError: toastHttpError,
  })
}
