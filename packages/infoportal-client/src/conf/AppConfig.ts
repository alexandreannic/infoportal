import {bool, defaultValue, env, required} from '@alexandreannic/ts-utils'
import {AppFeatureId, appFeaturesIndex} from '@/features/appFeatureId'

enum Env {
  NEXT_PUBLIC_SENTRY_DNS = 'NEXT_PUBLIC_SENTRY_DNS',
  NEXT_PUBLIC_BASE_URL = 'NEXT_PUBLIC_BASE_URL',
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  NEXT_PUBLIC_GOOGLE_MAPS_ID = 'NEXT_PUBLIC_GOOGLE_MAPS_ID',
  NEXT_PUBLIC_API_BASE_URL = 'NEXT_PUBLIC_API_BASE_URL',
  NEXT_PUBLIC_MS_BEARER_TOKEN = 'NEXT_PUBLIC_MS_BEARER_TOKEN',
  NEXT_PUBLIC_MS_CLIENT_ID = 'NEXT_PUBLIC_MS_CLIENT_ID',
  NEXT_PUBLIC_MS_AUTHORITY = 'NEXT_PUBLIC_MS_AUTHORITY',
  NEXT_PUBLIC_APP_OFF = 'NEXT_PUBLIC_APP_OFF',
  NEXT_PUBLIC_MUI_PRO_LICENSE_KEY = 'NEXT_PUBLIC_MUI_PRO_LICENSE_KEY',
  NEXT_PUBLIC_CHATGPT_APIKEY = 'NEXT_PUBLIC_CHATGPT_APIKEY',
  NEXT_PUBLIC_BUDGETHOLDER_GROUPNAME = 'NEXT_PUBLIC_BUDGETHOLDER_GROUPNAME',
}

const persistedTempEnvVariablesForFront: { [key in Env]: string | undefined } = {
  NEXT_PUBLIC_SENTRY_DNS: process.env.NEXT_PUBLIC_SENTRY_DNS,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  NEXT_PUBLIC_GOOGLE_MAPS_ID: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_MS_BEARER_TOKEN: process.env.NEXT_PUBLIC_MS_BEARER_TOKEN,
  NEXT_PUBLIC_MS_CLIENT_ID: process.env.NEXT_PUBLIC_MS_CLIENT_ID,
  NEXT_PUBLIC_MS_AUTHORITY: process.env.NEXT_PUBLIC_MS_AUTHORITY,
  NEXT_PUBLIC_APP_OFF: process.env.NEXT_PUBLIC_APP_OFF,
  NEXT_PUBLIC_MUI_PRO_LICENSE_KEY: process.env.NEXT_PUBLIC_MUI_PRO_LICENSE_KEY,
  NEXT_PUBLIC_CHATGPT_APIKEY: process.env.NEXT_PUBLIC_CHATGPT_APIKEY,
  NEXT_PUBLIC_BUDGETHOLDER_GROUPNAME: process.env.NEXT_PUBLIC_BUDGETHOLDER_GROUPNAME,
}

const e = env(persistedTempEnvVariablesForFront)

export const appConfig = {
  /** @deprecated not working*/
  production: e(_ => _?.toLowerCase() === 'production', defaultValue(true))('NODE_ENV'),
  uahToUsd: .027,
  muiProLicenseKey: e()(Env.NEXT_PUBLIC_MUI_PRO_LICENSE_KEY),
  linkToFeature: (feature: AppFeatureId, path: string) => {
    const featurePath = appFeaturesIndex[feature]?.path ?? feature
    return featurePath + '/#' + path
  },
  koboServerUrl: 'https://eu.kobotoolbox.org',
  contact: 'alexandre.annic@drc.ngo',
  apiURL: e(defaultValue('https://infoportal-ua-api.drc.ngo'))(Env.NEXT_PUBLIC_API_BASE_URL),
  baseURL: e(defaultValue('https://infoportal-ua.drc.ngo/'))(Env.NEXT_PUBLIC_BASE_URL),
  sentry: {
    dsn: e()(Env.NEXT_PUBLIC_SENTRY_DNS)
  },
  gooogle: {
    apiKey: e(required)(Env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY),
    mapId: e(required)(Env.NEXT_PUBLIC_GOOGLE_MAPS_ID),
  },
  microsoft: {
    // To find it go to https://developer.microsoft.com/en-us/graph/graph-explorer,
    // Login and inspect Network
    bearerToken: e(required)(Env.NEXT_PUBLIC_MS_BEARER_TOKEN),
    clientId: e(required)(Env.NEXT_PUBLIC_MS_CLIENT_ID),
    authority: e(required)(Env.NEXT_PUBLIC_MS_AUTHORITY),
  },
  chatGptApiKey: e()(Env.NEXT_PUBLIC_CHATGPT_APIKEY),
  appOff: e(bool, defaultValue(false))(Env.NEXT_PUBLIC_APP_OFF),
  externalLink: {
    mealReferralMatrix: 'https://drcngo.sharepoint.com/:x:/s/UKRPortal/EVjIQqcfHQVDggcGqObP2BwBXdYnRBk7kWe4mJuSqlAyGA?e=R7V8Wg',
    metaDashboardReadMe: 'https://drcngo.sharepoint.com/sites/UKRPortal/_layouts/15/doc.aspx?sourcedoc={4acb5576-3be2-4939-8f77-2364e048d321}',
    cocDashboard: 'https://app.powerbi.com/view?r=eyJrIjoiMjhkZDZjMjYtYTk4Ny00Yzg2LWE4YjctMmIyOGQzM2I0ZDM1IiwidCI6IjJhMjEyMjQxLTg5OWMtNDc1Mi1iZDMzLTUxZWFjM2M1ODJkNSIsImMiOjh9&pageName=ReportSection592c43ce6687c8de177c',
  },
  mpcaBudgetHolderGroupName: e(defaultValue('MPCA-BudgetHolder'))(Env.NEXT_PUBLIC_BUDGETHOLDER_GROUPNAME),
  icons: {
    sector: 'category',
    program: 'book',
    koboForm: appFeaturesIndex.kobo_database.materialIcons,
    donor: 'handshake',
    disability: 'assist_walker',
    project: 'inventory_2',
    oblast: 'location_on',
    matrix: 'hub',
    koboFormLink: appFeaturesIndex.kobo_database.materialIcons,
    office: 'business',
    displacementStatus: 'directions_run',
    dataTable: 'table_view',
    dashboard: 'stacked_bar_chart',
  },
  iconStatus: {
    error: 'error',
    warning: 'warning',
    success: 'check_circle',
    info: 'info',
    disabled: 'disabled'
  },
  other: {
    protection: {
      echoDuplicationEstimationPercent: 10,
      echoDisabilityEstimationPercent: 13,
    }
  }
}

export type AppConfig = typeof appConfig


