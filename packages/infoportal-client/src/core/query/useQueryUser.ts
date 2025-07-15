import {duration} from '@axanc/ts-utils'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useAppSettings} from '../context/ConfigContext'
import {useIpToast} from '../useToast'
import {queryKeys} from './query.index'
import {UUID} from 'infoportal-common'
import {Ip} from 'infoportal-api-sdk'

export const useQueryUser = (workspaceId: UUID) => {
  const {api} = useAppSettings()
  const {toastAndThrowHttpError} = useIpToast()
  const {toastHttpError} = useIpToast()
  const queryClient = useQueryClient()

  const get = useQuery({
    queryKey: queryKeys.user(workspaceId),
    queryFn: () => api.user.search({workspaceId}).catch(toastAndThrowHttpError),
    staleTime: duration(10, 'minute'),
  })

  const create = useMutation({
    mutationFn: async (_: {email: string; level: Ip.Workspace.AccessLevel}) => {
      return api.workspaceAccess.create({..._, workspaceId})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.user(workspaceId)})
    },
    onError: toastHttpError,
  })
  return {create, get}
}
