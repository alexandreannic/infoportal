import {bool, defaultValue, env, required} from '@axanc/ts-utils'

enum Env {
  VITE_SENTRY_DNS = 'VITE_SENTRY_DNS',
  VITE_BASE_URL = 'VITE_BASE_URL',
  VITE_GOOGLE_MAPS_API_KEY = 'VITE_GOOGLE_MAPS_API_KEY',
  VITE_GOOGLE_MAPS_ID = 'VITE_GOOGLE_MAPS_ID',
  VITE_GOOGLE_CLIENT_ID = 'VITE_GOOGLE_CLIENT_ID',
  VITE_API_BASE_URL = 'VITE_API_BASE_URL',
  VITE_API_WS_URL = 'VITE_API_WS_URL',
  VITE_MS_BEARER_TOKEN = 'VITE_MS_BEARER_TOKEN',
  VITE_MS_CLIENT_ID = 'VITE_MS_CLIENT_ID',
  VITE_MS_AUTHORITY = 'VITE_MS_AUTHORITY',
  VITE_APP_OFF = 'VITE_APP_OFF',
  VITE_MUI_PRO_LICENSE_KEY = 'VITE_MUI_PRO_LICENSE_KEY',
  VITE_CHATGPT_APIKEY = 'VITE_CHATGPT_APIKEY',
  VITE_BUDGETHOLDER_GROUPNAME = 'VITE_BUDGETHOLDER_GROUPNAME',
}

const e = env(import.meta.env)

export const appConfig = {
  /** @deprecated not working*/
  production: e(_ => _?.toLowerCase() === 'production', defaultValue(true))('NODE_ENV'),
  muiProLicenseKey: e()(Env.VITE_MUI_PRO_LICENSE_KEY),
  koboServerUrl: 'https://kobo.drc.ngo',
  contact: 'alexandre.annic@drc.ngo',
  apiURL: e(defaultValue('https://infoportal-ua-api.drc.ngo'))(Env.VITE_API_BASE_URL),
  apiWsURL: e(defaultValue('ws://infoportal-ua-api.drc.ngo/ws'))(Env.VITE_API_WS_URL),
  baseURL: e(defaultValue('https://infoportal-ua.drc.ngo/'))(Env.VITE_BASE_URL),
  sentry: {
    dsn: e()(Env.VITE_SENTRY_DNS),
  },
  gooogle: {
    clientId: e(required)(Env.VITE_GOOGLE_CLIENT_ID),
    apiKey: e(required)(Env.VITE_GOOGLE_MAPS_API_KEY),
    mapId: e(required)(Env.VITE_GOOGLE_MAPS_ID),
  },
  microsoft: {
    // To find it go to https://developer.microsoft.com/en-us/graph/graph-explorer,
    // Login and inspect Network
    bearerToken: e(required)(Env.VITE_MS_BEARER_TOKEN),
    clientId: e(required)(Env.VITE_MS_CLIENT_ID),
    authority: e(required)(Env.VITE_MS_AUTHORITY),
  },
  chatGptApiKey: e()(Env.VITE_CHATGPT_APIKEY),
  appOff: e(bool, defaultValue(false))(Env.VITE_APP_OFF),
  icons: {
    koboAppLogo: 'select_check_box',
    koboForm: 'fact_check',
    workspace: 'workspaces',
    submission: 'send',
    database: 'data_table',
    project: 'inventory_2',
    users: 'group',
    openFormLink: 'file_open',
    koboFormLink: 'fact_check',
    dataTable: 'data_table',
    // dashboard: 'stacked_bar_chart',
    dashboard: 'monitoring',
  },
  iconStatus: {
    error: 'error',
    warning: 'warning',
    success: 'check_circle',
    info: 'info',
    disabled: 'disabled',
  },
}

export type AppConfig = typeof appConfig
