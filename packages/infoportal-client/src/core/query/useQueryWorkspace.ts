import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useAppSettings} from '@/core/context/ConfigContext'
import {queryKeys} from '@/core/query/query.index'
import {duration} from '@axanc/ts-utils'
import {HttpError} from 'infoportal-api-sdk'

export const useQueryWorkspace = {
  get,
  create,
  update,
  remove,
}

function get() {
  const {apiv2} = useAppSettings()
  return useQuery({
    staleTime: duration(20, 'minute'),
    queryKey: queryKeys.workspaces(),
    queryFn: () => apiv2.workspace.getMine(),
    retry: (failureCount, error) => {
      if (error instanceof HttpError.Forbidden) return false
      return failureCount < 5
    },
  })
}

function create() {
  const {apiv2} = useAppSettings()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiv2.workspace.create,
    onSuccess: res => {
      queryClient.invalidateQueries({queryKey: queryKeys.workspaces()})
    },
  })
}

function update() {
  const {apiv2} = useAppSettings()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiv2.workspace.update,
    onSuccess: res => {
      queryClient.invalidateQueries({queryKey: queryKeys.workspaces()})
    },
  })
}

function remove() {
  const {apiv2} = useAppSettings()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiv2.workspace.remove,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: queryKeys.workspaces()})
    },
  })
}
