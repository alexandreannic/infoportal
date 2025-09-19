import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useAppSettings} from '@/core/context/ConfigContext'
import {queryKeys} from '@/core/query/query.index'
import {duration} from '@axanc/ts-utils'
import {HttpError, Ip} from 'infoportal-api-sdk'
import {useMemo} from 'react'

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
  static getById(id: Ip.WorkspaceId) {
    const {apiv2} = useAppSettings()
    const query = this.get()
    const workspace = useMemo(() => {
      return query.data?.find(_ => _.id === id)
    }, [id, query.data])
    return {
      ...query,
      data: workspace,
    }
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
