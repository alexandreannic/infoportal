import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useAppSettings} from '@/core/context/ConfigContext'
import {queryKeys} from '@/core/query/query.index'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {useLocation, useNavigate} from 'react-router-dom'
import {useMemo} from 'react'
import {router} from '@/Router'

export const useQueryWorkspace = () => {
  const {api} = useAppSettings()
  const queryClient = useQueryClient()

  const get = useQuery({
    queryKey: queryKeys.workspaces(),
    queryFn: () => api.workspace.getMine(),
  })

  const create = useMutation({
    mutationFn: api.workspace.create,
    onSuccess: res => {
      queryClient.invalidateQueries({queryKey: queryKeys.workspaces()})
    },
  })

  const update = useMutation({
    mutationFn: async (args: Parameters<ApiSdk['workspace']['update']>) => {
      return api.workspace.update(...args)
    },
    onSuccess: res => {
      queryClient.invalidateQueries({queryKey: queryKeys.workspaces()})
    },
  })

  const remove = useMutation({
    mutationFn: api.workspace.delete,
    onSuccess: (_, id) => {
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

export const useWorkspaceRouterMaybe = () => {
  const navigate = useNavigate()
  const location = useLocation()
  return useMemo(() => {
    const workspaceId = location.pathname.match(/^\/([^/]+)/)?.[1]
    // if (!workspaceId) throw new Error(`Missing workspaceId in URI '${location.pathname}'`)
    return {
      router: router.ws(workspaceId),
      changeWorkspace: (wsId: string) => navigate(router.ws(wsId).root),
      workspaceId,
    }
  }, [navigate, location])
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
