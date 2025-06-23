import {duration} from '@axanc/ts-utils'
import {WorkspaceAccessLevel} from '@prisma/client'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useAppSettings} from '../context/ConfigContext'
import {useIpToast} from '../useToast'
import {queryKeys} from './query.index'
import {UUID} from 'infoportal-common'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {Group} from '@/core/sdk/server/group/GroupItem'

type Params<T extends keyof ApiSdk['group']> = Parameters<ApiSdk['group'][T]>[0]

export const useQueryGroup = (workspaceId: UUID) => {
  const {api} = useAppSettings()
  const {toastHttpError, toastAndThrowHttpError} = useIpToast()
  const queryClient = useQueryClient()

  const getAll = useQuery({
    staleTime: duration(10, 'minute'),
    queryKey: queryKeys.group(workspaceId),
    queryFn: () => {
      return api.group.search({workspaceId}).catch(toastAndThrowHttpError)
    },
  })

  const create = useMutation({
    mutationFn: async (args: Omit<Params<'create'>, 'workspaceId'>) => {
      return api.group.create({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.group(workspaceId)}),
    onError: toastHttpError,
  })

  const update = useMutation({
    mutationFn: async (args: Omit<Params<'update'>, 'workspaceId'>) => {
      return api.group.update({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.group(workspaceId)}),
    onError: toastHttpError,
  })

  const remove = useMutation({
    mutationFn: async (args: Omit<Params<'remove'>, 'workspaceId'>) => {
      return api.group.remove({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.group(workspaceId)}),
    onError: toastHttpError,
  })

  const createItem = useMutation({
    mutationFn: async (args: Omit<Params<'createItem'>, 'workspaceId'>) => {
      return api.group.createItem({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.group(workspaceId)}),
    onError: toastHttpError,
  })

  const deleteItem = useMutation({
    mutationFn: async (args: Omit<Params<'deleteItem'>, 'workspaceId'>) => {
      return api.group.deleteItem({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.group(workspaceId)}),
    onError: toastHttpError,
  })

  const updateItem = useMutation({
    mutationFn: async (args: Omit<Params<'updateItem'>, 'workspaceId'>) => {
      return api.group.updateItem({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.group(workspaceId)}),
    onError: toastHttpError,
  })

  const duplicate = useMutation({
    mutationFn: async (g: Group) => {
      const {id, items, createdAt, name, ...params} = g
      const newGroup = await create.mutateAsync({
        name: `${name} (copy)`,
        ...params,
      })
      await Promise.all(
        items.map(item => {
          return createItem.mutateAsync({
            groupId: newGroup.id,
            ...item,
            drcJob: item.drcJob ? [item.drcJob] : undefined,
          })
        }),
      )
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.group(workspaceId)}),
    onError: toastHttpError,
  })

  return {
    create,
    getAll,
    remove,
    update,
    createItem,
    deleteItem,
    updateItem,
    duplicate,
  }
}

export const useQueryGroupSearch = (params: Params<'search'>) => {
  const {workspaceId, ...args} = params
  const {api} = useAppSettings()
  const {toastHttpError, toastAndThrowHttpError} = useIpToast()
  return useQuery({
    refetchOnWindowFocus: false,
    queryKey: queryKeys.group(workspaceId, args),
    queryFn: () => {
      return api.group.search(params).catch(toastAndThrowHttpError)
    },
  })
}
