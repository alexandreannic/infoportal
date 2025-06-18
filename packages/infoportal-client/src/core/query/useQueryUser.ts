import {WorkspaceAccessLevel} from '@prisma/client'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useAppSettings} from '../context/ConfigContext'
import {useIpToast} from '../useToast'
import {queryKeys} from './store'

export const useQueryUser = (workspaceId: string) => {
  const queryClient = useQueryClient()
  const {api} = useAppSettings()
  const {toastHttpError} = useIpToast()

  const create = useMutation({
    mutationFn: async (_: {email: string; level: WorkspaceAccessLevel}) => {
      return api.workspaceAccess.create({..._, workspaceId})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.workspaceUsers(workspaceId)})
    },
    onError: toastHttpError,
  })
  return {create}
}
