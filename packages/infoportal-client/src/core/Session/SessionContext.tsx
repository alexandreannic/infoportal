import React, {Dispatch, ReactNode, SetStateAction, useCallback, useContext, useEffect} from 'react'
import {useEffectFn} from '@axanc/react-hooks'
import {useI18n} from '@/core/i18n'
import {useAppSettings} from '@/core/context/ConfigContext'
import {UserSession} from '@/core/sdk/server/session/Session'
import {Box, LinearProgress} from '@mui/material'
import {useIpToast} from '@/core/useToast'
import {Access} from '@/core/sdk/server/access/Access'
import {SessionLoginForm} from '@/core/Session/SessionLoginForm'
import {SessionInitForm} from '@/core/Session/SessionInitForm'
import {CenteredContent} from '@/shared/CenteredContent'
import {Fender} from '@/shared/Fender'
import {IpIconBtn} from '@/shared/IconBtn'
import {UseFetcher, useFetcher} from '@/shared/hook/useFetcher'
import {useAsync} from '@/shared/hook/useAsync'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {GoogleOAuthProvider} from '@react-oauth/google'
import {appConfig} from '@/conf/AppConfig'

export interface SessionContext {
  session: UserSession
  accesses: Access[]
  logout: () => void
  setSession: Dispatch<SetStateAction<UserSession | undefined>>
}

const Context = React.createContext(
  {} as {
    session?: SessionContext['session']
    accesses?: SessionContext['accesses']
    logout: SessionContext['logout']
    setSession: SessionContext['setSession']
    loading?: boolean
    fetcherSession: UseFetcher<ApiSdk['session']['get']>
    fetcherAccesses: UseFetcher<ApiSdk['access']['searchForConnectedUser']>
  },
)

const useSessionPending = () => useContext(Context)

export const useSession = (): SessionContext => {
  const ctx = useContext(Context)
  // if (!ctx.session || !ctx.accesses) {
  if (!ctx) {
    throw new Error('useSession must be used within ProtectRoute')
  }
  return {
    session: ctx.session!,
    accesses: ctx.accesses!,
    logout: ctx.logout,
    setSession: ctx.setSession,
  }
}

export const SessionProvider = ({children}: {children: ReactNode}) => {
  const {api} = useAppSettings()
  const fetcherSession = useFetcher(api.session.get)
  const fetcherAccesses = useFetcher<any>(api.access.searchForConnectedUser)
  const session = fetcherSession.get

  const logout = useCallback(() => {
    api.session.logout()
    fetcherSession.set(undefined)
  }, [])

  useEffect(() => {
    if (session?.email) fetcherAccesses.fetch({force: true, clean: true})
  }, [session?.email, session?.drcOffice, session?.drcJob])

  useEffect(() => {
    fetcherSession.fetch()
  }, [])

  return (
    <Context.Provider
      value={{
        fetcherSession,
        fetcherAccesses,
        session,
        setSession: fetcherSession.set,
        accesses: fetcherAccesses.get,
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
  const {fetcherSession, session, fetcherAccesses, logout} = useSessionPending()
  useEffectFn(fetcherSession.error, () => toastError(m.youDontHaveAccess))

  const _revertConnectAs = useAsync<any>(async () => {
    const session = await api.session.revertConnectAs()
    fetcherSession.set(session)
  })

  if (fetcherSession.loading || fetcherAccesses.loading) {
    return (
      <CenteredContent>
        <LinearProgress sx={{mt: 2, width: 200}} />
      </CenteredContent>
    )
  }
  if (!session || !fetcherAccesses.get) {
    return (
      <CenteredContent>
        <GoogleOAuthProvider clientId={appConfig.gooogle.clientId}>
          <SessionLoginForm setSession={fetcherSession.set} />
        </GoogleOAuthProvider>
      </CenteredContent>
    )
  }
  if (adminOnly && !session.admin) {
    return (
      <CenteredContent>
        <Fender type="error" />
      </CenteredContent>
    )
  }
  return (
    <>
      {session.originalEmail && (
        <Box sx={{px: 2, py: 0.25, background: t => t.palette.background.paper}}>
          Connected as <b>{session.email}</b>. Go back as <b>{session.originalEmail}</b>
          <IpIconBtn loading={_revertConnectAs.loading} onClick={_revertConnectAs.call} color="primary">
            logout
          </IpIconBtn>
        </Box>
      )}
      {children}
    </>
  )
}
