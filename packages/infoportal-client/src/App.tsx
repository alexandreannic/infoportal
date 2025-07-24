import {appConfig} from '@/conf/AppConfig'
import {AppSettingsProvider, useAppSettings} from '@/core/context/ConfigContext'
import {I18nProvider, useI18n} from '@/core/i18n'
import {getMsalInstance} from '@/core/msal'
import {ApiClient} from '@/core/sdk/server/ApiClient'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {SessionProvider} from '@/core/Session/SessionContext'
import {CenteredContent, Txt} from '@/shared'
import {IpLogo} from '@/shared/logo/logo'
import {Provide} from '@/shared/Provide'
import {ToastProvider} from '@/shared/Toast'
import {MsalProvider} from '@azure/msal-react'
import {ThemeProvider} from '@mui/material/styles'
import {Box, CssBaseline, Icon} from '@mui/material'
import {LocalizationProvider} from '@mui/x-date-pickers-pro'
import {AdapterDateFns} from '@mui/x-date-pickers-pro/AdapterDateFns'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {DialogsProvider} from '@toolpad/core'
import React, {useEffect, useMemo} from 'react'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {defaultTheme} from '@/core/theme'
import {buildIpClient, IpClient} from 'infoportal-api-sdk'
import {Outlet, useRouterState} from '@tanstack/react-router'
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools'

// LicenseInfo.setLicenseKey(appConfig.muiProLicenseKey ?? '')

const api = new ApiSdk(
  new ApiClient({
    baseUrl: appConfig.apiURL,
  }),
)

const apiv2: IpClient = buildIpClient(appConfig.apiURL)

export const queryClient = new QueryClient()

export const App = () => {
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5001/ws')
    console.log(socket)
    socket.onmessage = e => {
      const msg = JSON.parse(e.data)
      console.log(msg)
    }
  }, [])
  return (
    <AppSettingsProvider api={api} apiv2={apiv2}>
      <AppWithConfig />
    </AppSettingsProvider>
  )
}

const TrackLocation = () => {
  const location = useRouterState({select: s => s.location})
  useEffect(() => {
    api.session.track(location.pathname)
  }, [location.pathname])
  return null
}

const AppWithConfig = () => {
  const settings = useAppSettings()
  const msal = useMemo(() => getMsalInstance(settings.conf), [settings.conf])

  return (
    <Provide
      providers={[
        _ => <LocalizationProvider children={_} dateAdapter={AdapterDateFns} />,
        _ => <ToastProvider children={_} />,
        _ => <ThemeProvider theme={defaultTheme} children={_} />,
        _ => <CssBaseline children={_} />,
        _ => <I18nProvider children={_} />,
        _ => <MsalProvider children={_} instance={msal} />,
        _ => <QueryClientProvider client={queryClient} children={_} />,
        _ => <DialogsProvider children={_} />,
        _ => <SessionProvider children={_} />,
      ]}
    >
      <TrackLocation />
      <AppWithBaseContext />
      {!settings.conf.production && (
        <>
          <TanStackRouterDevtools />
          <ReactQueryDevtools initialIsOpen={false} />
        </>
      )}
    </Provide>
  )
}

const AppWithBaseContext = () => {
  const settings = useAppSettings()
  const {m} = useI18n()
  if (settings.conf.appOff) {
    return (
      <CenteredContent>
        <Box
          sx={{
            border: t => `1px solid ${t.palette.divider}`,
            padding: 4,
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <IpLogo sx={{display: 'block', mb: 2}} />
          <Txt size="title" block>
            {m.title}
          </Txt>
          <Txt sx={{mb: 4}} size="big" color="hint" block>
            {m.appInMaintenance}
          </Txt>
          <Icon sx={{fontSize: '90px !important', color: t => t.palette.text.disabled}}>engineering</Icon>
        </Box>
      </CenteredContent>
    )
  }

  return <Outlet />
}
