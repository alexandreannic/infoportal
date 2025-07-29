import {useQuery} from '@tanstack/react-query'
import {useAppSettings} from '../context/ConfigContext'
import {useIpToast} from '../useToast'
import {queryKeys} from './query.index'
import {Ip} from 'infoportal-api-sdk'

export const useQueryUser = {
  getAll,
}

function getAll(workspaceId: Ip.WorkspaceId) {
  const {api} = useAppSettings()
  const {toastAndThrowHttpError} = useIpToast()

  return useQuery({
    queryKey: queryKeys.user(workspaceId),
    queryFn: () => api.user.search({workspaceId}).catch(toastAndThrowHttpError),
  })
}
