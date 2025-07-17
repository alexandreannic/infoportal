import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useAppSettings} from '@/core/context/ConfigContext'
import {queryKeys} from '@/core/query/query.index'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {duration} from '@axanc/ts-utils'

export const useQueryWorkspace = {
  get,
  create,
  update,
  remove,
}

function get() {
  const {api} = useAppSettings()
  return useQuery({
    staleTime: duration(20, 'minute'),
    queryKey: queryKeys.workspaces(),
    queryFn: () => api.workspace.getMine(),
  })
}

function create() {
  const {api} = useAppSettings()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.workspace.create,
    onSuccess: res => {
      queryClient.invalidateQueries({queryKey: queryKeys.workspaces()})
    },
  })
}

function update() {
  const {api} = useAppSettings()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (args: Parameters<ApiSdk['workspace']['update']>) => {
      return api.workspace.update(...args)
    },
    onSuccess: res => {
      queryClient.invalidateQueries({queryKey: queryKeys.workspaces()})
    },
  })
}

function remove() {
  const {api} = useAppSettings()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.workspace.delete,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: queryKeys.workspaces()})
    },
  })
}
