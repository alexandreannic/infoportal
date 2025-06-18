import {UUID} from 'infoportal-common'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {duration, seq} from '@axanc/ts-utils'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useIpToast} from '@/core/useToast'
import {useMemo} from 'react'
import {Access} from '@/core/sdk/server/access/Access'
import {AppFeatureId} from '@/features/appFeatureId'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'

type Params<T extends keyof ApiSdk['access']> = Parameters<ApiSdk['access'][T]>[0]

export const useQueryAccess = (workspaceId: UUID) => {
  const {api} = useAppSettings()
  const {toastAndThrowHttpError, toastHttpError} = useIpToast()
  const queryClient = useQueryClient()

  const getAll = useQuery({
    queryKey: queryKeys.access(workspaceId),
    queryFn: async () => {
      return api.access.search({workspaceId}).catch(toastAndThrowHttpError)
    },
    staleTime: duration(10, 'minute'),
  })

  const getKoboAccess = useMemo(() => {
    return getAll.data
      ?.filter(Access.filterByFeature(AppFeatureId.kobo_database))
      .filter(_ => _.params?.koboFormId !== undefined)
  }, [getAll.data])

  const accessesByFormIdMap = useMemo(() => {
    return seq(getKoboAccess).groupBy(_ => _.params!.koboFormId)
  }, [getKoboAccess])

  const remove = useMutation({
    mutationFn: async (args: Omit<Params<'remove'>, 'workspaceId'>) => {
      return api.access.remove({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.group(workspaceId)}),
    onError: toastHttpError,
  })

  const update = useMutation({
    mutationFn: async (args: Omit<Params<'update'>, 'workspaceId'>) => {
      return api.access.update({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.group(workspaceId)}),
    onError: toastHttpError,
  })
  const create = useMutation({
    mutationFn: async (args: Omit<Params<'create'>, 'workspaceId'>) => {
      return api.access.create({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.group(workspaceId)}),
    onError: toastHttpError,
  })

  return {
    create,
    update,
    remove,
    getAll,
    getKoboAccess,
    accessesByFormIdMap,
  }
}
