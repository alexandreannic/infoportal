import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useAppSettings} from '../context/ConfigContext'
import {useIpToast} from '../useToast'
import {queryKeys} from './query.index'
import {Ip} from 'infoportal-api-sdk'

export const useQueryUser = {
  getAll,
  create,
}

function getAll(workspaceId: Ip.WorkspaceId) {
  const {api} = useAppSettings()
  const {toastAndThrowHttpError} = useIpToast()

  return useQuery({
    queryKey: queryKeys.user(workspaceId),
    queryFn: () => api.user.search({workspaceId}).catch(toastAndThrowHttpError),
  })
}

function create(workspaceId: Ip.WorkspaceId) {
  const {apiv2} = useAppSettings()
  // const {toastHttpError} = useIpToast()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (_: Omit<Ip.Workspace.Access.Payload.Create, 'workspaceId'>) => {
      return apiv2.workspace.access.create({..._, workspaceId})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.user(workspaceId)})
      queryClient.invalidateQueries({queryKey: queryKeys.workspaceInvitation(workspaceId)})
    },
    // onError: toastHttpError,
  })
}
