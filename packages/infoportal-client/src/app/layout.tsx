'use client'
import {Inter} from 'next/font/google'
import MuiXLicense from '@/core/MuiXLicense'
import React, {ReactNode} from 'react'
import {CacheProvider} from '@emotion/react'
import {CssBaseline, ThemeProvider} from '@mui/material'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import Head from 'next/head'
import {Provide} from '@/shared/Provide'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {ApiClient} from '@/core/sdk/server/ApiClient'
import {getMsalInstance} from '@/core/msal'
import {appConfig} from '@/conf/AppConfig'
import {ToastProvider} from '@/shared/Toast'
import {I18nProvider} from '@/core/i18n'
import {MsalProvider} from '@azure/msal-react'
import {AppSettingsProvider, useAppSettings} from '@/core/context/ConfigContext'
import {KoboSchemaProvider} from '@/features/KoboSchema/KoboSchemaContext'
import {KoboEditAnswersProvider} from '@/core/context/KoboEditAnswersContext'
import {KoboAnswersProvider} from '@/core/context/KoboAnswers'
import {KoboEditTagsProvider} from '@/core/context/KoboEditTagsContext'
import {ModalProvider} from '@/shared/Modal/ModalProvider'
import {SessionProvider} from '@/core/Session/SessionContext'
import createEmotionCache from '@/core/createEmotionCache'
import {LicenseInfo} from '@mui/x-license-pro'

const inter = Inter({subsets: ['latin']})

LicenseInfo.setLicenseKey(appConfig.muiProLicenseKey ?? '')

const api = new ApiSdk(
  new ApiClient({baseUrl: appConfig.apiURL})
)

const clientSideEmotionCache = createEmotionCache()

const RootLayout = ({children}: {children: ReactNode}) => {
  return (
    <html lang="en">
    <Head>
      <meta name="viewport" content="initial-scale=1, width=device-width"/>
      <link rel="preconnect" href="https://fonts.gstatic.com"/>
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />
      <link rel="icon" type="image/x-icon" href="/static/favicon.svg"/>
    </Head>
    <body className={inter.className}>
    <AppSettingsProvider api={api}>
      <Body>{children}</Body>
    </AppSettingsProvider>
    <MuiXLicense/>
    </body>
    </html>
  )
}

export const Body = ({children}: {children: ReactNode}) => {
  const settings = useAppSettings()
  return (
    <Provide providers={[
      _ => <CacheProvider value={clientSideEmotionCache} children={_}/>,
      _ => <LocalizationProvider dateAdapter={AdapterDateFns} children={_}/>,
      _ => <ToastProvider children={_}/>,
      _ => <ThemeProvider theme={settings.theme.theme} children={_}/>,
      _ => <CssBaseline children={_}/>,
      _ => <I18nProvider children={_}/>,
      _ => <MsalProvider instance={getMsalInstance(settings.conf)} children={_}/>,
      // ...(!isServerSidee ? [(_: ReactNode) => <HashRouter children={_}/>] : []),
      _ => <KoboSchemaProvider children={_}/>,
      _ => <KoboAnswersProvider children={_}/>,
      _ => <KoboEditAnswersProvider children={_}/>,
      _ => <KoboEditTagsProvider children={_}/>,
      _ => <ModalProvider children={_}/>,
      _ => <SessionProvider children={_}/>,
    ]}>
      {children}
    </Provide>
  )
}

export default RootLayout
