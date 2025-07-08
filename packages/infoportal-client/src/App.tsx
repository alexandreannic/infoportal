import {appConfig} from '@/conf/AppConfig'
import {AppSettingsProvider, useAppSettings} from '@/core/context/ConfigContext'
import {I18nProvider, useI18n} from '@/core/i18n'
import {getMsalInstance} from '@/core/msal'
import {ApiClient} from '@/core/sdk/server/ApiClient'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {ProtectRoute, SessionProvider} from '@/core/Session/SessionContext'
import {Router} from '@/Router'
import {CenteredContent, Txt} from '@/shared'
import {DRCLogo} from '@/shared/logo/logo'
import {Provide} from '@/shared/Provide'
import {ToastProvider} from '@/shared/Toast'
import {MsalProvider} from '@azure/msal-react'
import {ThemeProvider} from '@mui/material/styles'
import {Box, CssBaseline, Icon} from '@mui/material'
import {LocalizationProvider} from '@mui/x-date-pickers-pro'
import {AdapterDateFns} from '@mui/x-date-pickers-pro/AdapterDateFns'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {DialogsProvider} from '@toolpad/core'
import {useEffect, useMemo} from 'react'
import {HashRouter, useLocation} from 'react-router-dom'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {defaultTheme} from '@/core/theme'
import {buildIpClient, IpClient} from 'infoportal-api-sdk'

// LicenseInfo.setLicenseKey(appConfig.muiProLicenseKey ?? '')

const api = new ApiSdk(
  new ApiClient({
    baseUrl: appConfig.apiURL,
  }),
)

const apiv2: IpClient = buildIpClient(appConfig.apiURL)

export const queryClient = new QueryClient()

const App = () => {
  return (
    <AppSettingsProvider api={api} apiv2={apiv2}>
      <AppWithConfig />
    </AppSettingsProvider>
  )
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
        _ => <HashRouter children={_} />,
        _ => <QueryClientProvider client={queryClient} children={_} />,
        _ => <SessionProvider children={_} />,
        _ => <DialogsProvider children={_} />,
      ]}
    >
      <AppWithBaseContext />
      {!settings.conf.production && <ReactQueryDevtools initialIsOpen={false} />}
    </Provide>
  )
}

const AppWithBaseContext = () => {
  const settings = useAppSettings()
  const {m} = useI18n()
  const location = useLocation()
  useEffect(() => {
    // initSentry(appConfigConfig)
    api.session.track(location.pathname)
  }, [location.pathname])

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
          <DRCLogo sx={{display: 'block', mb: 2}} />
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
  return (
    <ProtectRoute>
      <Router />
    </ProtectRoute>
  )
}

export default App
