import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {duration} from '@axanc/ts-utils'
import {UUID} from 'infoportal-common'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {KoboServer} from '@/core/sdk/server/kobo/KoboMapper'
import {ApiError} from '@/core/sdk/server/ApiClient'

type Params<T extends keyof ApiSdk['kobo']['server']> = Parameters<ApiSdk['kobo']['server'][T]>[0]

export const useQueryServer = (workspaceId: UUID) => {
  const {api} = useAppSettings()
  const queryClient = useQueryClient()
  const {toastAndThrowHttpError, toastHttpError} = useIpToast()

  const getAll = useQuery({
    queryKey: queryKeys.server(workspaceId),
    queryFn: async () => {
      return api.kobo.server.getAll({workspaceId}).catch(toastAndThrowHttpError)
    },
    staleTime: duration(10, 'minute'),
  })

  const remove = useMutation({
    mutationFn: async (args: Omit<Params<'delete'>, 'workspaceId'>) => {
      return api.kobo.server.delete({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.server(workspaceId)}),
    onError: toastHttpError,
  })

  const create = useMutation<KoboServer, ApiError, Omit<Params<'create'>, 'workspaceId'>>({
    mutationFn: async args => {
      return api.kobo.server.create({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.server(workspaceId)}),
    onError: toastHttpError,
  })

  return {getAll, create, remove}
}
