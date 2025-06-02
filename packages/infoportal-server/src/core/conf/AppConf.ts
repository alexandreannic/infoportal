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
  production: e(_ => _?.toLowerCase() === 'production', defaultValue(true))('NODE_ENV'),
  port: e(int, defaultValue(80))('PORT'),
  ownerEmail: e(defaultValue('alexandre.annic@drc.ngo'))('OWNER_EMAIL'),
  cors: {
    allowOrigin: e(defaultValue(`http://localhost:5174`))('CORS_ALLOW_ORIGIN'),
  },
  sentry: {
    dns: e()('SENTRY_DNS'),
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
  email: {
    address: e(required)('EMAIL_ADDRESS'),
    user: e(required)('EMAIL_USER'),
    password: e(required)('EMAIL_PASSWORD'),
    host: e(required)('EMAIL_HOST'),
    port: e(required, int)('EMAIL_PORT'),
  },
}

export type AppConf = typeof appConf
