import {duration} from '@axanc/ts-utils'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useAppSettings} from '../context/ConfigContext'
import {useIpToast} from '../useToast'
import {queryKeys} from './query.index'
import {UUID} from 'infoportal-common'
import {Ip} from 'infoportal-api-sdk'

export const useQueryUser = {
  getAll,
  create,
}

function getAll(workspaceId: UUID) {
  const {api} = useAppSettings()
  const {toastAndThrowHttpError} = useIpToast()

  return useQuery({
    queryKey: queryKeys.user(workspaceId),
    queryFn: () => api.user.search({workspaceId}).catch(toastAndThrowHttpError),
    staleTime: duration(10, 'minute'),
  })
}

function create(workspaceId: UUID) {
  const {api} = useAppSettings()
  const {toastHttpError} = useIpToast()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (_: {email: string; level: Ip.AccessLevel}) => {
      return api.workspaceAccess.create({..._, workspaceId})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.user(workspaceId)})
    },
    onError: toastHttpError,
  })
}
