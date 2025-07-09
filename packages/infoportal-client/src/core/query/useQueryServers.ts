import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {duration} from '@axanc/ts-utils'
import {UUID} from 'infoportal-common'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {ApiError} from '@/core/sdk/server/ApiClient'
import {Ip} from 'infoportal-api-sdk'

type Params<T extends keyof ApiSdk['kobo']['server']> = Parameters<ApiSdk['kobo']['server'][T]>[0]

export const useQueryServers = (workspaceId: UUID) => {
  const {apiv2} = useAppSettings()
  const queryClient = useQueryClient()
  const {toastAndThrowHttpError, toastHttpError} = useIpToast()

  const getAll = useQuery({
    queryKey: queryKeys.server(workspaceId),
    queryFn: async () => {
      const servers = await apiv2.server.getAll({workspaceId}).catch(toastAndThrowHttpError)
      servers.forEach(s => {
        queryClient.setQueryData(queryKeys.server(workspaceId, s.id), s)
      })
      return servers
    },
    staleTime: duration(10, 'minute'),
  })

  const remove = useMutation({
    mutationFn: async (args: Omit<Params<'delete'>, 'workspaceId'>) => {
      return apiv2.server.delete({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.server(workspaceId)}),
    onError: toastHttpError,
  })

  const create = useMutation<Ip.Server, ApiError, Ip.Server.Payload.Create>({
    mutationFn: async args => {
      return apiv2.server.create({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.server(workspaceId)}),
    onError: toastHttpError,
  })

  return {getAll, create, remove}
}

export const useQueryServer = ({workspaceId, serverId}: {workspaceId: Ip.Uuid; serverId: Ip.Uuid}) => {
  const {apiv2} = useAppSettings()
  const {toastAndThrowHttpError} = useIpToast()

  return useQuery({
    queryKey: queryKeys.form(workspaceId, serverId),
    queryFn: () => apiv2.server.get({workspaceId, id: serverId}).catch(toastAndThrowHttpError),
    staleTime: duration(10, 'minute'),
  })
}
