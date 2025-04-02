import {bool, defaultValue, env, int, required} from '@axanc/ts-utils'
import * as dotenv from 'dotenv'
import {fileURLToPath} from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const e = env(process.env)

export const appConf = {
  baseUrl: e(defaultValue('https://infoportal-ua-api.drc.ngo'))('BASE_URL'),
  frontEndBaseUrl: e(defaultValue(`https://infoportal-ua.drc.ngo`))('FRONTEND_BASE_URL'),
  logLevel: e(defaultValue('info'))('LOG_LEVEL'),
  rootProjectDir: e(defaultValue(__dirname))('ROOT_PROJECT_DIR'),
  disableScheduledTask: e(bool, defaultValue(false))('DISABLED_SCHEDULED_TASK'),
  production: e((_) => _?.toLowerCase() === 'production', defaultValue(true))('NODE_ENV'),
  port: e(int, defaultValue(80))('PORT'),
  ownerEmail: e(defaultValue('alexandre.annic@drc.ngo'))('OWNER_EMAIL'),
  cors: {
    allowOrigin: e(defaultValue(`http://localhost:3000`))('CORS_ALLOW_ORIGIN'),
  },
  sentry: {
    dns: e()('SENTRY_DNS'),
  },
  buildingBlockWfp: {
    otpURL: e(required)('BUILDINGBLOCK_WFP_OTP_URL'),
    login: e(required)('BUILDINGBLOCK_WFP_LOGIN'),
    password: e(required)('BUILDINGBLOCK_WFP_PASSWORD'),
  },
  dbAzureHdp: {
    host: e(defaultValue('hdp-ukr.database.windows.net'))('DBAZUREHDP_HOST'),
    user: e(defaultValue('alexandreannic'))('DBAZUREHDP_USER'),
    password: e(required)('DBAZUREHDP_PWD'),
    port: e(required, int)('DBAZUREHDP_PORT'),
    schema: 'hdp',
  },
  db: {
    maxPreparedStatementParams: 3e4,
    maxConcurrency: e(int, defaultValue(50))('DATABASE_MAX_CONCURRENCY'),
    url: e(required)('DATABASE_URL'),
  },
  //   host: e(required)('DB_HOST'),
  //   user: e(required)('DB_USER'),
  //   database: e(required)('DB_NAME'),
  //   password: e(required)('DB_PASSWORD'),
  //   port: e(int, defaultValue(5432))('DB_PORT')
  // },
  kobo: {
    url: e(defaultValue('https://kobo.humanitarianresponse.info'))('KOBO_URL'),
    token: e(required)('KOBO_TOKEN'),
  },
  legalAid: {
    apiToken: e(required)('LEGALAID_API_TOKEN'),
  },
  activityInfo: {
    apiToken: e(required)('ACTIVITY_INFO_API_TOKEN'),
  },
  params: {
    assistanceAmountUAH: (d: Date) => (d.getTime() > new Date(2023, 9, 1).getTime() ? 3600 : 2220),
  },
  email: {
    address: e(required)('EMAIL_ADDRESS'),
    user: e(required)('EMAIL_USER'),
    password: e(required)('EMAIL_PASSWORD'),
    host: e(required)('EMAIL_HOST'),
    port: e(required, int)('EMAIL_PORT'),
  },
}

export type AppConf = typeof appConf
