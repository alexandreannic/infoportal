import {useQuery} from '@tanstack/react-query'
import {useAppSettings} from '../context/ConfigContext'
import {useIpToast} from '../useToast'
import {queryKeys} from './query.index'
import {Ip} from 'infoportal-api-sdk'

export const useQueryUser = {
  getAll,
  getJobs,
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
