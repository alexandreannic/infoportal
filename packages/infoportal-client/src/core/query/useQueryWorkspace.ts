import {useMutation, useQueryClient} from '@tanstack/react-query'
import {produce} from 'immer'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useSession} from '@/core/Session/SessionContext'
import {queryKeys} from '@/core/query/store'

export const useCreateWorkspace = () => {
  const {api} = useAppSettings()
  const {setSession} = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.workspace.create,
    onSuccess: res => {
      setSession(prev =>
        produce(prev, draft => {
          draft?.workspaces.push(res)
        }),
      )
      queryClient.invalidateQueries({queryKey: ['workspaces']})
    },
  })
}

export const useUpdateWorkspace = () => {
  const {api} = useAppSettings()
  const {setSession} = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.workspace.update,
    onSuccess: res => {
      setSession(prev =>
        produce(prev, draft => {
          const i = draft?.workspaces.findIndex(w => w.id === res.id)
          if (i !== undefined && i !== -1) draft!.workspaces[i] = res
        }),
      )
      queryClient.invalidateQueries({queryKey: queryKeys.workpaces()})
    },
  })
}

export const useDeleteWorkspace = () => {
  const {api} = useAppSettings()
  const {setSession} = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.workspace.delete,
    onSuccess: (_, id) => {
      setSession(prev =>
        produce(prev, draft => {
          const i = draft?.workspaces.findIndex(w => w.id === id)
          if (i !== undefined && i !== -1) draft!.workspaces.splice(i, 1)
        }),
      )
      queryClient.invalidateQueries({queryKey: ['workspaces']})
    },
  })
}
