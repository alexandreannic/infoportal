import {appConfig} from '@/conf/AppConfig'
import {AppSettingsProvider, useAppSettings} from '@/core/context/ConfigContext'
import {I18nProvider, useI18n} from '@infoportal/client-i18n'
import {getMsalInstance} from '@/core/msal'
import {ApiClient} from '@/core/sdk/server/ApiClient'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {SessionProvider} from '@/core/Session/SessionContext'
import {CenteredContent, Core, Datatable} from '@/shared'
import {IpLogo} from '@/shared/logo/logo'
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
import {buildIpClient, IpClient} from '@infoportal/api-sdk'
import {Outlet, useRouterState} from '@tanstack/react-router'
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools'
import {duration} from '@axanc/ts-utils'
import {LicenseInfo} from '@mui/x-license'

LicenseInfo.setLicenseKey(appConfig.muiProLicenseKey ?? '')

const api = new ApiSdk(
  new ApiClient({
    baseUrl: appConfig.apiURL,
  }),
)

const apiv2: IpClient = buildIpClient(appConfig.apiURL)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: duration(10, 'minute'),
    },
  },
})

export const App = () => {
  return (
    <AppSettingsProvider api={api} apiv2={apiv2}>
      <AppWithConfig/>
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
    <Core.Provide
      providers={[
        _ => <LocalizationProvider children={_} dateAdapter={AdapterDateFns}/>,
        _ => <ThemeProvider theme={defaultTheme} children={_}/>,
        _ => <Core.ToastProvider children={_}/>,
        _ => <CssBaseline children={_}/>,
        _ => <I18nProvider children={_}/>,
        _ => <MsalProvider children={_} instance={msal}/>,
        _ => <QueryClientProvider client={queryClient} children={_}/>,
        _ => <DialogsProvider children={_}/>,
        _ => <SessionProvider children={_}/>,
      ]}
    >
      <TrackLocation/>
      <AppWithBaseContext/>
      {!settings.conf.production && (
        <>
          <TanStackRouterDevtools/>
          <ReactQueryDevtools initialIsOpen={false}/>
        </>
      )}
    </Core.Provide>
  )
}

const AppWithBaseContext = () => {
  const settings = useAppSettings()
  const {formatLargeNumber, m} = useI18n()
  // useWebsocket()
  if (settings.conf.appOff) {
    return (
      <CenteredContent>
        <Box
          sx={{
            border: t => `1px solid ${t.vars.palette.divider}`,
            padding: 4,
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <IpLogo sx={{display: 'block', mb: 2}}/>
          <Core.Txt size="title" block>
            {m.title}
          </Core.Txt>
          <Core.Txt sx={{mb: 4}} size="big" color="hint" block>
            {m.appInMaintenance}
          </Core.Txt>
          <Icon sx={{fontSize: '90px !important', color: t => t.vars.palette.text.disabled}}>engineering</Icon>
        </Box>
      </CenteredContent>
    )
  }

  return (
    <Core.Provide
      providers={[
        _ => (
          <Datatable.Config
            children={_}
            defaultProps={{
              renderEmptyState: <Core.Fender type="empty" size="normal" children={m.noDataAtm} sx={{my: 1}}/>,
              rowHeight: 38,
              module: {
                columnsResize: {enabled: false},
              },
            }}
            formatLargeNumber={formatLargeNumber}
            m={{
              globalError: m.globalError,
              clearFilter: m.clearFilter,
              type: m.type,
              remove: m.remove,
              add: m.add,
              save: m.save,
              hidden: m.hidden,
              visible: m.visible,
              copied: m.copied,
              group: m.group,
              question: m.question,
              sort: m.sort,
              idFilterInfo: m._datatable.idFilterInfo,
              idFilterPlaceholder: m._datatable.idFilterPlaceholder,
              selectAll: m.selectAll,
              close: m.close,
              filterPlaceholder: m.filterPlaceholder,
              filterBlanks: m.filterBlanks,
              count: m.count,
              includeColumns: m.includeColumns,
              sum: m.sum,
              average: m.average,
              min: m.min,
              max: m.max,
              currentlyDisplayed: m._datatable.currentlyDisplayed,
              filter: m.filter,
              refresh: m.refresh,
              hardRefresh: m.hardRefresh,
            }}
          />
        ),
      ]}
    >
      <Outlet/>
    </Core.Provide>
  )
}
