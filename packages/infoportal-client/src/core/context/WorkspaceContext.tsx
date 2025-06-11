import React, {ReactNode, useContext, useMemo} from 'react'
import {ApiSdk} from '../sdk/server/ApiSdk'
import {useSession} from '@/core/Session/SessionContext'
import {useAsync} from '@/shared/hook/useAsync'
import {produce} from 'immer'
import {UseAsyncSimple} from '@axanc/react-hooks'
import {useLocation, useNavigate} from 'react-router-dom'
import {router} from '@/Router'

export interface WorkspaceContext {
  asyncCreate: UseAsyncSimple<ApiSdk['workspace']['create']>
  asyncUpdate: UseAsyncSimple<ApiSdk['workspace']['update']>
  asyncDelete: UseAsyncSimple<ApiSdk['workspace']['delete']>
}

export const _WorkspaceContext = React.createContext({} as WorkspaceContext)

export const useWorkspace = () => useContext(_WorkspaceContext)

export const useMaybeWorkspaceRouter = () => {
  const navigate = useNavigate()
  const location = useLocation()
  return useMemo(() => {
    return {
      changeWorkspace: (wsId: string) => navigate(router.ws(wsId).root),
      workspaceId: location.pathname.match(/^\/([^/]+)/)?.[1],
    }
  }, [navigate, location])
}

export const useWorkspaceRouter = () => {
  const maybe = useMaybeWorkspaceRouter()
  return useMemo(() => {
    if (!maybe.workspaceId) throw new Error(`Missing workspaceId in URI '${location.pathname}'`)
    return {
      workspaceId: maybe.workspaceId,
      router: router.ws(maybe.workspaceId),
      changeWorkspace: maybe.changeWorkspace,
    }
  }, [maybe])
}

export const WorkspaceProvider = ({api, children}: {api: ApiSdk; children: ReactNode}) => {
  const {setSession} = useSession()
  const asyncCreate = useAsync(async (...args: Parameters<typeof api.workspace.create>) => {
    const res = await api.workspace.create(...args)
    setSession(prev =>
      produce(prev, draft => {
        draft?.workspaces.push(res)
      }),
    )
    return res
  })
  const asyncUpdate = useAsync(async (...args: Parameters<typeof api.workspace.update>) => {
    const res = await api.workspace.update(...args)
    setSession(prev =>
      produce(prev, draft => {
        if (!draft) return
        const index = draft.workspaces.findIndex(w => w.id === res.id)
        if (index !== -1) draft.workspaces[index] = res
      }),
    )
    return res
  })

  const asyncDelete = useAsync(async (...args: Parameters<typeof api.workspace.delete>) => {
    const res = await api.workspace.delete(...args)
    setSession(prev =>
      produce(prev, draft => {
        if (!draft) return
        const index = draft.workspaces.findIndex(w => w.id === args[0])
        draft.workspaces.splice(index, 1)
      }),
    )
  })

  return (
    <_WorkspaceContext.Provider
      value={{
        asyncCreate,
        asyncUpdate,
        asyncDelete,
      }}
    >
      {children}
    </_WorkspaceContext.Provider>
  )
}
