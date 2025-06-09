import React, {Dispatch, ReactNode, SetStateAction, useCallback, useContext, useEffect} from 'react'
import {useEffectFn} from '@axanc/react-hooks'
import {useI18n} from '@/core/i18n'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Session} from '@/core/sdk/server/session/Session'
import {Box, LinearProgress} from '@mui/material'
import {useIpToast} from '@/core/useToast'
import {SessionLoginForm} from '@/core/Session/SessionLoginForm'
import {CenteredContent} from '@/shared/CenteredContent'
import {Fender} from '@/shared/Fender'
import {IpIconBtn} from '@/shared/IconBtn'
import {UseFetcher, useFetcher} from '@/shared/hook/useFetcher'
import {useAsync} from '@/shared/hook/useAsync'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {GoogleOAuthProvider} from '@react-oauth/google'
import {appConfig} from '@/conf/AppConfig'
import {WorkspaceCreate} from '@/features/Workspace/WorkspaceCreate'

export interface SessionContext {
  session: Session
  logout: () => void
  setSession: Dispatch<SetStateAction<Session | undefined>>
}

const Context = React.createContext(
  {} as {
    session?: SessionContext['session']
    logout: SessionContext['logout']
    setSession: SessionContext['setSession']
    loading?: boolean
    fetcherSession: UseFetcher<ApiSdk['session']['getMe']>
  },
)

const useSessionPending = () => useContext(Context)

export const useSession = (): SessionContext => {
  const ctx = useContext(Context)
  if (!ctx) {
    throw new Error('useSession must be used within ProtectRoute')
  }
  return {
    session: ctx.session!,
    logout: ctx.logout,
    setSession: ctx.setSession,
  }
}

export const SessionProvider = ({children}: {children: ReactNode}) => {
  const {api} = useAppSettings()
  const fetcherSession = useFetcher(api.session.getMe)
  const session = fetcherSession.get

  const logout = useCallback(() => {
    api.session.logout()
    fetcherSession.set(undefined)
  }, [])

  useEffect(() => {
    fetcherSession.fetch()
  }, [])

  return (
    <Context.Provider
      value={{
        fetcherSession,
        session,
        setSession: fetcherSession.set,
        logout,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const ProtectRoute = ({adminOnly, children}: {children: ReactNode; adminOnly?: boolean}) => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const {toastError} = useIpToast()
  const {fetcherSession, session, logout} = useSessionPending()
  useEffectFn(fetcherSession.error, () => toastError(m.youDontHaveAccess))

  const _revertConnectAs = useAsync<any>(async () => {
    const session = await api.session.revertConnectAs()
    fetcherSession.set(session)
  })

  if (fetcherSession.loading) {
    return (
      <CenteredContent>
        <LinearProgress sx={{mt: 2, width: 200}} />
      </CenteredContent>
    )
  }
  if (!session) {
    return (
      <CenteredContent>
        <GoogleOAuthProvider clientId={appConfig.gooogle.clientId}>
          <SessionLoginForm setSession={fetcherSession.set} />
        </GoogleOAuthProvider>
      </CenteredContent>
    )
  }
  if (adminOnly && !session.user.admin) {
    return (
      <CenteredContent>
        <Fender type="error" />
      </CenteredContent>
    )
  }
  if (session.workspaces.length === 0) {
    return <WorkspaceCreate />
  }
  return (
    <>
      {session.originalEmail && (
        <Box sx={{px: 2, py: 0.25, background: t => t.palette.background.paper}}>
          Connected as <b>{session.user.email}</b>. Go back as <b>{session.originalEmail}</b>
          <IpIconBtn loading={_revertConnectAs.loading} onClick={_revertConnectAs.call} color="primary">
            logout
          </IpIconBtn>
        </Box>
      )}
      {children}
    </>
  )
}
