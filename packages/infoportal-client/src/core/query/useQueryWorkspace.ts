import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {produce} from 'immer'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useSession} from '@/core/Session/SessionContext'
import {queryKeys} from '@/core/query/query.index'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {useLocation, useNavigate} from 'react-router-dom'
import {useMemo} from 'react'
import {router} from '@/Router'
import {Workspace} from '@/core/sdk/server/workspace/Workspace'

export const useQueryWorkspace = () => {
  const {api} = useAppSettings()
  const {setSession} = useSession()
  const queryClient = useQueryClient()

  const get = useQuery({
    queryKey: queryKeys.workspaces(),
    queryFn: () => Promise.resolve([] as Workspace[]), // Assigned by sesion.getMe
    enabled: false,
  })

  const create = useMutation({
    mutationFn: api.workspace.create,
    onSuccess: res => {
      setSession(prev =>
        produce(prev, draft => {
          draft?.workspaces.push(res)
        }),
      )
      queryClient.invalidateQueries({queryKey: queryKeys.workspaces()})
    },
  })

  const update = useMutation({
    mutationFn: async (args: Parameters<ApiSdk['workspace']['update']>) => {
      return api.workspace.update(...args)
    },
    onSuccess: res => {
      setSession(prev =>
        produce(prev, draft => {
          const i = draft?.workspaces.findIndex(w => w.id === res.id)
          if (i !== undefined && i !== -1) draft!.workspaces[i] = res
        }),
      )
      queryClient.invalidateQueries({queryKey: queryKeys.workspaces()})
    },
  })

  const remove = useMutation({
    mutationFn: api.workspace.delete,
    onSuccess: (_, id) => {
      setSession(prev =>
        produce(prev, draft => {
          const i = draft?.workspaces.findIndex(w => w.id === id)
          if (i !== undefined && i !== -1) draft!.workspaces.splice(i, 1)
        }),
      )
      queryClient.invalidateQueries({queryKey: queryKeys.workspaces()})
    },
  })

  return {
    get,
    remove,
    create,
    update,
  }
}

export const useWorkspaceRouter = () => {
  const navigate = useNavigate()
  const location = useLocation()
  return useMemo(() => {
    const workspaceId = location.pathname.match(/^\/([^/]+)/)?.[1]
    if (!workspaceId) throw new Error(`Missing workspaceId in URI '${location.pathname}'`)
    return {
      router: router.ws(workspaceId),
      changeWorkspace: (wsId: string) => navigate(router.ws(wsId).root),
      workspaceId,
    }
  }, [navigate, location])
}
