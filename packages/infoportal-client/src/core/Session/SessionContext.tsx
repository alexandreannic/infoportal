import React, {ReactNode, useContext} from 'react'
import {useI18n} from '@/core/i18n'
import {Box, LinearProgress} from '@mui/material'
import {SessionLoginForm} from '@/core/Session/SessionLoginForm'
import {CenteredContent} from '@/shared/CenteredContent'
import {Fender} from '@/shared/Fender'
import {IpIconBtn} from '@/shared/IconBtn'
import {GoogleOAuthProvider} from '@react-oauth/google'
import {appConfig} from '@/conf/AppConfig'
import {WorkspaceCreate} from '@/features/Workspace/WorkspaceCreate'
import {IpBtn, Page, PageTitle} from '@/shared'
import {useQuerySession} from '@/core/query/useQuerySession'
import {useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {User} from '@/core/sdk/server/user/User'
import {useQueryWorkspace} from '@/core/query/useQueryWorkspace'

export interface SessionContext {
  originalEmail?: string
  user: User
  logout: ReturnType<typeof useQuerySession>['logout']
  connectAs: ReturnType<typeof useQuerySession>['connectAs']
  revertConnectAs: ReturnType<typeof useQuerySession>['revertConnectAs']
  setUser: (_: User) => void
}

const Context = React.createContext(
  {} as {
    originalEmail?: SessionContext['originalEmail']
    user?: SessionContext['user']
    logout: SessionContext['logout']
    connectAs: SessionContext['connectAs']
    revertConnectAs: SessionContext['revertConnectAs']
    setUser: SessionContext['setUser']
    loading?: boolean
  },
)

const useSessionPending = () => useContext(Context)

export const useSession = (): SessionContext => {
  const ctx = useContext(Context)
  if (!ctx) {
    throw new Error('useSession must be used within ProtectRoute')
  }
  return {
    revertConnectAs: ctx.revertConnectAs!,
    originalEmail: ctx.originalEmail,
    connectAs: ctx.connectAs!,
    user: ctx.user!,
    logout: ctx.logout,
    setUser: ctx.setUser,
  }
}

export const SessionProvider = ({children}: {children: ReactNode}) => {
  const querySession = useQuerySession()
  const user = querySession.getMe.data
  const queryClient = useQueryClient()

  return (
    <Context.Provider
      value={{
        originalEmail: querySession.originalEmail,
        revertConnectAs: querySession.revertConnectAs,
        connectAs: querySession.connectAs,
        user: user,
        setUser: (_: User) => queryClient.setQueryData(queryKeys.session(), _),
        logout: querySession.logout,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const ProtectRoute = ({adminOnly, children}: {children: ReactNode; adminOnly?: boolean}) => {
  const {m} = useI18n()
  const querySession = useQuerySession()
  const queryWorkspace = useQueryWorkspace()
  const {user, originalEmail, revertConnectAs, setUser, logout} = useSessionPending()

  if (querySession.getMe.isPending) {
    return (
      <CenteredContent>
        <LinearProgress sx={{mt: 2, width: 200}} />
      </CenteredContent>
    )
  }
  if (!user) {
    return (
      <CenteredContent>
        <GoogleOAuthProvider clientId={appConfig.gooogle.clientId}>
          <SessionLoginForm setSession={setUser} />
        </GoogleOAuthProvider>
      </CenteredContent>
    )
  }
  if (adminOnly && !user.admin) {
    return (
      <CenteredContent>
        <Fender type="error" />
      </CenteredContent>
    )
  }
  if (queryWorkspace.get.data?.length === 0) {
    return (
      <Page sx={{maxWidth: 400}}>
        <CenteredContent>
          <div>
            {/* <Txt>{session.user.email}</Txt> */}
            <IpBtn onClick={() => logout.mutate()} icon="arrow_back" sx={{mb: 2}}>
              {user.email}
            </IpBtn>
            <PageTitle>{m.onboardingTitle}</PageTitle>
            <WorkspaceCreate />
          </div>
        </CenteredContent>
      </Page>
    )
  }
  return (
    <>
      {originalEmail && (
        <Box sx={{px: 2, py: 0.25, background: t => t.palette.background.paper}}>
          Connected as <b>{user.email}</b>. Go back as <b>{originalEmail}</b>
          <IpBtn
            sx={{ml: 1}}
            loading={revertConnectAs.isPending}
            onClick={() => revertConnectAs.mutate()}
            variant="contained"
            icon="logout"
            size="small"
          >
            {m.return}
          </IpBtn>
        </Box>
      )}
      {children}
    </>
  )
}
