import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useAppSettings} from '@/core/context/ConfigContext'
import {queryKeys} from '@/core/query/query.index'
import {duration} from '@axanc/ts-utils'
import {HttpError} from 'infoportal-api-sdk'

export class UseQueryWorkspace {
  static get() {
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

  static create() {
    const {apiv2} = useAppSettings()
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: apiv2.workspace.create,
      onSuccess: res => {
        queryClient.invalidateQueries({queryKey: queryKeys.workspaces()})
      },
    })
  }

  static update() {
    const {apiv2} = useAppSettings()
    const queryClient = useQueryClient()

    return useMutation({
      mutationFn: apiv2.workspace.update,
      onSuccess: res => {
        queryClient.invalidateQueries({queryKey: queryKeys.workspaces()})
      },
    })
  }

  static remove() {
    const {apiv2} = useAppSettings()
    const queryClient = useQueryClient()

    return useMutation({
      mutationFn: apiv2.workspace.remove,
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({queryKey: queryKeys.workspaces()})
      },
    })
  }
}
