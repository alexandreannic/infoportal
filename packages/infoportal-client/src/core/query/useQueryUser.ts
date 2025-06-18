import {duration} from '@axanc/ts-utils'
import {WorkspaceAccessLevel} from '@prisma/client'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useAppSettings} from '../context/ConfigContext'
import {useIpToast} from '../useToast'
import {queryKeys} from './store'
import {UUID} from 'infoportal-common'

export const useQueryUser = (workspaceId: UUID) => {
  const {api} = useAppSettings()
  const {toastAndThrowHttpError} = useIpToast()
  const {toastHttpError} = useIpToast()
  const queryClient = useQueryClient()

  const get = useQuery({
    queryKey: queryKeys.workspaceUsers(workspaceId),
    queryFn: () => api.user.search({workspaceId}).catch(toastAndThrowHttpError),
    staleTime: duration(10, 'minute'),
  })

  const create = useMutation({
    mutationFn: async (_: {email: string; level: WorkspaceAccessLevel}) => {
      return api.workspaceAccess.create({..._, workspaceId})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.workspaceUsers(workspaceId)})
    },
    onError: toastHttpError,
  })
  return {create, get}
}
