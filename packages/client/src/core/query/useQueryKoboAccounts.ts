import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {ApiError} from '@/core/sdk/server/HttpClient'
import {Api} from '@infoportal/api-sdk'

export const useQueryKoboAccounts = (workspaceId: Api.WorkspaceId) => {
  const {apiv2} = useAppSettings()
  const queryClient = useQueryClient()
  const {toastAndThrowHttpError, toastHttpError} = useIpToast()

  const getAll = useQuery({
    queryKey: queryKeys.servers(workspaceId),
    queryFn: async () => {
      const servers = await apiv2.kobo.account.getAll({workspaceId}).catch(toastAndThrowHttpError)
      servers.forEach(s => {
        queryClient.setQueryData(queryKeys.server(workspaceId, s.id), s)
      })
      return servers
    },
  })

  const create = useMutation<Api.Kobo.Account, ApiError, Api.Kobo.Account.Payload.Create>({
    mutationFn: async args => {
      return apiv2.kobo.account.create({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.servers(workspaceId)}),
    onError: toastHttpError,
  })

  return {getAll, create}
}

export const useQueryKoboAccount = ({
  workspaceId,
  serverId,
}: {
  workspaceId: Api.WorkspaceId
  serverId: Api.Kobo.AccountId
}) => {
  const {apiv2} = useAppSettings()
  const {toastHttpError, toastAndThrowHttpError} = useIpToast()
  const queryClient = useQueryClient()

  const remove = useMutation({
    mutationFn: async () => {
      return apiv2.kobo.account.delete({id: serverId, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.server(workspaceId, serverId)}),
    onError: toastHttpError,
  })

  const get = useQuery({
    queryKey: queryKeys.server(workspaceId, serverId),
    queryFn: () => apiv2.kobo.account.get({workspaceId, id: serverId}).catch(toastAndThrowHttpError),
  })
  return {get, remove}
}
