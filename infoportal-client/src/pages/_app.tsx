import React, {useEffect, useMemo} from 'react'
import type {AppProps} from 'next/app'
import {Provide} from '@/shared/Provide'
import {Box, CssBaseline, Icon, ThemeProvider} from '@mui/material'
import {muiTheme} from '@/core/theme'
import {I18nProvider, useI18n} from '@/core/i18n'
import {ToastProvider, Txt} from 'mui-extension'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {ApiClient} from '@/core/sdk/server/ApiClient'
import {AppSettingsProvider, useAppSettings} from '@/core/context/ConfigContext'
import {appConfig} from '@/conf/AppConfig'
import {MsalProvider} from '@azure/msal-react'
import {getMsalInstance} from '@/core/msal'
import {DRCLogo} from '@/shared/logo/logo'
import {CacheProvider, EmotionCache} from '@emotion/react'
import {CenteredContent} from '@/shared/CenteredContent'
import {ModalProvider} from '@/shared/Modal/ModalProvider'
import createEmotionCache from '@/core/createEmotionCache'
import Head from 'next/head'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import {LicenseInfo} from '@mui/x-license-pro'
import {useRouter} from 'next/router'
import {initSentry} from '@/plugins/Sentry'
import {KoboSchemaProvider} from '@/features/KoboSchema/KoboSchemaContext'
import {darkTheme} from '@/features/Ecrec/EcrecDashboard'

LicenseInfo.setLicenseKey(appConfig.muiProLicenseKey ?? '')

const api = new ApiSdk(new ApiClient({
  baseUrl: appConfig.apiURL,
}))

const clientSideEmotionCache = createEmotionCache()

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

const App = ({
  emotionCache = clientSideEmotionCache,
  ...props
}: MyAppProps) => {

  const router = useRouter()
  useEffect(() => {
    initSentry(appConfig)
    api.session.track(router.pathname)
  }, [router])

  return (
    <Provide providers={[
      _ => <CacheProvider value={emotionCache} children={_}/>,
      _ => <AppSettingsProvider api={api} children={_}/>,
    ]}>
      <>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width"/>
          {/*<meta name="viewport" content="width=device-width, initial-scale=1"/>*/}
        </Head>
        <AppWithConfig {...props}/>
      </>
    </Provide>
  )
}

const AppWithConfig = (props: AppProps) => {
  const settings = useAppSettings()
  const msal = useMemo(() => getMsalInstance(settings.conf), [settings.conf])
  return (
    <Provide providers={[
      // _ => <StyledEngineProvider injectFirst children={_}/>,
      _ => <LocalizationProvider children={_} dateAdapter={AdapterDateFns}/>,
      _ => <ToastProvider children={_}/>,
      _ => <ThemeProvider theme={muiTheme({dark: darkTheme})} children={_}/>,
      _ => <CssBaseline children={_}/>,
      _ => <I18nProvider children={_}/>,
      _ => <MsalProvider children={_} instance={msal}/>,
      _ => <KoboSchemaProvider children={_}/>,
      _ => <ModalProvider children={_}/>,
    ]}>
      <AppWithBaseContext {...props}/>
    </Provide>
  )
}

const AppWithBaseContext = ({Component, pageProps}: AppProps) => {
  const settings = useAppSettings()
  const {m} = useI18n()
  if (settings.conf.appOff) {
    return (
      <CenteredContent>
        <Box sx={{
          border: t => `1px solid ${t.palette.divider}`,
          padding: 4,
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <DRCLogo sx={{display: 'block', mb: 2}}/>
          <Txt size="title" block>{m.title}</Txt>
          <Txt sx={{mb: 4}} size="big" color="hint" block>{m.appInMaintenance}</Txt>
          <Icon sx={{fontSize: '90px !important', color: t => t.palette.text.disabled}}>
            engineering
          </Icon>
          <Box>
          </Box>
        </Box>
      </CenteredContent>
    )
  }
  return (
    <Component {...pageProps} />
  )
}

export default App
