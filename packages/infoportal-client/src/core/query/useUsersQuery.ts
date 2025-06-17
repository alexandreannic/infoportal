import {duration} from '@axanc/ts-utils'
import {WorkspaceAccessLevel} from '@prisma/client'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useAppSettings} from '../context/ConfigContext'
import {useIpToast} from '../useToast'
import {queryKeys} from './store'

export const useWorkspaceUsers = (workspaceId: string) => {
  const {api} = useAppSettings()
  const {toastAndThrowHttpError} = useIpToast()
  return useQuery({
    queryKey: queryKeys.workspaceUsers(workspaceId),
    queryFn: () => api.user.search({workspaceId}).catch(toastAndThrowHttpError),
    staleTime: duration(10, 'minute'),
  })
}

export const useCreateUser = (workspaceId: string) => {
  const queryClient = useQueryClient()
  const {api} = useAppSettings()
  const {toastHttpError} = useIpToast()

  return useMutation({
    mutationFn: async (_: {email: string; level: WorkspaceAccessLevel}) => {
      return api.workspaceAccess.create({..._, workspaceId})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [queryKeys.workspaceUsers, workspaceId]})
    },
    onError: toastHttpError,
  })
}
