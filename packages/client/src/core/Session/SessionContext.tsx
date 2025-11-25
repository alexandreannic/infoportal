import React, {ReactNode, useContext} from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {Box, LinearProgress} from '@mui/material'
import {SessionLoginForm} from '@/core/Session/SessionLoginForm'
import {CenteredContent} from '@/shared/CenteredContent'
import {GoogleOAuthProvider} from '@react-oauth/google'
import {appConfig} from '@/conf/AppConfig'
import {Core} from '@/shared'
import {useQuerySession} from '@/core/query/useQuerySession'
import {useQueryClient} from '@tanstack/react-query'
import {queryKeys} from '@/core/query/query.index'
import {UseQueryWorkspace} from '@/core/query/workspace/useQueryWorkspace'
import {useNavigate} from '@tanstack/react-router'
import {Ip} from '@infoportal/api-sdk'
import {UseQueryPermission} from '@/core/query/useQueryPermission'

export interface SessionContext {
  originalEmail?: string
  user: Ip.User
  globalPermission: Ip.Permission.Global
  logout: () => Promise<void>
  connectAs: ReturnType<typeof useQuerySession>['connectAs']
  revertConnectAs: ReturnType<typeof useQuerySession>['revertConnectAs']
  setUser: (_: Ip.User) => void
}

const Context = React.createContext(
  {} as {
    globalPermission?: SessionContext['globalPermission']
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
    globalPermission: ctx.globalPermission!,
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
  const queryPermission = UseQueryPermission.global()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return (
    <Context.Provider
      value={{
        globalPermission: queryPermission.data,
        originalEmail: querySession.originalEmail,
        revertConnectAs: querySession.revertConnectAs,
        connectAs: querySession.connectAs,
        user: user,
        setUser: (_: Ip.User) => queryClient.setQueryData(queryKeys.session(), _),
        logout: async () => {
          await querySession.logout.mutateAsync()
          await navigate({to: '/'})
        },
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const ProtectRoute = ({children}: {children: ReactNode}) => {
  const {m} = useI18n()
  const queryPermission = UseQueryPermission.global()
  const querySession = useQuerySession()
  const queryWorkspace = UseQueryWorkspace.get()
  const {user, originalEmail, revertConnectAs, setUser, logout} = useSessionPending()

  if (queryWorkspace.isLoading || querySession.getMe.isPending || queryPermission.isPending) {
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
  // if (queryWorkspace.data?.length === 0) {
  //
  // }
  // if (queryWorkspace.data?.length === 0) {
  //   return (
  //     <Page sx={{maxWidth: 400}}>
  //       <CenteredContent>
  //         <div>
  //           {/* <Core.Txt>{session.user.email}</Core.Txt> */}
  //           <Core.Btn onClick={logout} icon="arrow_back" sx={{mb: 2}}>
  //             {user.email}
  //           </Core.Btn>
  //           <PageTitle>{m.onboardingTitle}</PageTitle>
  //           <WorkspaceCreate />
  //         </div>
  //       </CenteredContent>
  //     </Page>
  //   )
  // }
  return (
    <>
      {originalEmail && (
        <Box sx={{px: 2, py: 0.25, background: t => t.vars.palette.background.paper}}>
          Connected as <b>{user.email}</b>. Go back as <b>{originalEmail}</b>
          <Core.Btn
            sx={{ml: 1}}
            loading={revertConnectAs.isPending}
            onClick={() => revertConnectAs.mutate()}
            variant="contained"
            icon="logout"
            size="small"
          >
            {m.return}
          </Core.Btn>
        </Box>
      )}
      {children}
    </>
  )
}
