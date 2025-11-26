import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useAppSettings} from '../context/ConfigContext'
import {useIpToast} from '../useToast'
import {queryKeys} from './query.index'
import {Api} from '@infoportal/api-sdk'

export const useQueryGroup = (workspaceId: Api.WorkspaceId) => {
  const {apiv2: api} = useAppSettings()
  const {toastHttpError, toastAndThrowHttpError} = useIpToast()
  const queryClient = useQueryClient()

  const getAll = useQuery({
    queryKey: queryKeys.group(workspaceId),
    queryFn: () => {
      return api.group.search({workspaceId}).catch(toastAndThrowHttpError)
    },
  })

  const create = useMutation({
    mutationFn: async (args: Omit<Api.Group.Payload.Create, 'workspaceId'>) => {
      return api.group.create({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.group(workspaceId)}),
    onError: toastHttpError,
  })

  const update = useMutation({
    mutationFn: async (args: Omit<Api.Group.Payload.Update, 'workspaceId'>) => {
      return api.group.update({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.group(workspaceId)}),
    onError: toastHttpError,
  })

  const remove = useMutation({
    mutationFn: async (args: {id: Api.GroupId}) => {
      return api.group.remove({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.group(workspaceId)}),
    onError: toastHttpError,
  })

  const createItem = useMutation({
    mutationFn: async (args: Omit<Api.Group.Payload.ItemCreate, 'workspaceId'>) => {
      return api.group.createItem({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.group(workspaceId)}),
    onError: toastHttpError,
  })

  const deleteItem = useMutation({
    mutationFn: async (args: {id: Api.Group.ItemId}) => {
      return api.group.deleteItem({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.group(workspaceId)}),
    onError: toastHttpError,
  })

  const updateItem = useMutation({
    mutationFn: async (args: Omit<Api.Group.Payload.ItemUpdate, 'workspaceId'>) => {
      return api.group.updateItem({...args, workspaceId})
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: queryKeys.group(workspaceId)}),
    onError: toastHttpError,
  })

  const duplicate = useMutation({
    mutationFn: async (g: Api.Group) => {
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
            jobs: item.job ? [item.job] : undefined,
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
