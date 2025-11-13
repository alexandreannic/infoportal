import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {ApiError} from '@/core/sdk/server/ApiClient'
import {Ip} from '@infoportal/api-sdk'

export const useQueryServers = (workspaceId: Ip.WorkspaceId) => {
  const {apiv2} = useAppSettings()
  const queryClient = useQueryClient()
  const {toastAndThrowHttpError, toastHttpError} = useIpToast()

  const getAll = useQuery({
    queryKey: queryKeys.servers(workspaceId),
    queryFn: async () => {
      const servers = await apiv2.server.getAll({workspaceId}).catch(toastAndThrowHttpError)
      servers.forEach(s => {
        queryClient.setQueryData(queryKeys.server(workspaceId, s.id), s)
      })
      return servers
    },
  })

  const create = useMutation<Ip.Server, ApiError, Ip.Server.Payload.Create>({
    mutationFn: async args => {
      return apiv2.server.create({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.servers(workspaceId)}),
    onError: toastHttpError,
  })

  return {getAll, create}
}

export const useQueryServer = ({workspaceId, serverId}: {workspaceId: Ip.WorkspaceId; serverId: Ip.ServerId}) => {
  const {apiv2} = useAppSettings()
  const {toastHttpError, toastAndThrowHttpError} = useIpToast()
  const queryClient = useQueryClient()

  const remove = useMutation({
    mutationFn: async () => {
      return apiv2.server.delete({id: serverId, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.server(workspaceId, serverId)}),
    onError: toastHttpError,
  })

  const get = useQuery({
    queryKey: queryKeys.server(workspaceId, serverId),
    queryFn: () => apiv2.server.get({workspaceId, id: serverId}).catch(toastAndThrowHttpError),
  })
  return {get, remove}
}
