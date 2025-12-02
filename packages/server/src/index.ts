import {AppConf, appConf} from './core/AppConf.js'
import {Server} from './server/Server.js'
import {prisma} from '@infoportal/prisma'
import {ScheduledTask} from './scheduledTask/ScheduledTask.js'
import {IpCache, IpCacheApp, IpEventClient} from '@infoportal/common'
import {duration} from '@axanc/ts-utils'
import * as winston from 'winston'
import {format, Logger as WinstonLogger} from 'winston'
import {Syslog} from 'winston-syslog'
import {EmailService} from './feature/email/EmailService.js'
import {DbInit} from './core/DbInit.js'
import * as os from 'os'
import {FormActionRunner} from './feature/form/action/executor/FormActionRunner.js'

export type AppLogger = WinstonLogger

export enum AppCacheKey {
  AllowedFormIds = 'AllowedFormIds',
  Users = 'Users',
  Meta = 'Meta',
  KoboAnswers = 'KoboAnswers',
  KoboSchema = 'KoboSchema',
  FormAction = 'FromAction',
  KoboServerIndex = 'KoboServerIndex',
  KoboFormIndex = 'KoboFormIndex',
  KoboClient = 'KoboClient',
  Proxy = 'Proxy',
  WfpDeduplication = 'WfpDeduplication',
}

export const App = (config: AppConf = appConf) => {
  const logger = (label?: string) => {
    return winston.createLogger({
      level: config.logLevel,
      format: winston.format.combine(
        format.label({label}),
        winston.format.timestamp({
          format: 'YYYY-MM-DD hh:mm:ss',
        }),
        winston.format.colorize(),
        winston.format.simple(),
        format.printf(props => `${props.timestamp} [${props.label}] ${props.level}: ${props.message}`),
      ),
      transports: [
        ...(config.production && !config.cors.allowOrigin.includes('localhost')
          ? [
              new Syslog({
                host: 'logs.papertrailapp.com',
                port: 32079,
                protocol: 'tls4',
                localhost: os.hostname(),
                eol: '\n',
              }),
            ]
          : []),
        new winston.transports.Console({
          level: appConf.logLevel,
        }),
      ],
    })
  }

  const cache = new IpCacheApp(
    new IpCache<Record<string, any>>({
      ttlMs: duration(20, 'day').toMs,
      cleaningCheckupInterval: duration(20, 'day'),
    }),
    logger('GlobalCache'),
  )
  const event = new IpEventClient(logger('Event'))
  return {logger, cache, event}
}

export const app = App()
const startApp = async (conf: AppConf) => {
  const log = app.logger('')
  log.info(`Logger level: ${appConf.logLevel}`)
  const init = async () => {
    const log = app.logger('')
    log.info(`Starting... v5.0`)

    log.info(`Initialize database ${conf.db.url.split('@')[1]}...`)
    await new DbInit(conf, prisma).initializeDatabase()
    log.info(`Database initialized.`)

    // console.log(`Master ${process.pid} is running`)
    // const core = conf.production ? os.cpus().length : 1
    // for (let i = 0; i < core; i++) {
    //   cluster.fork()
    // }
    // cluster.on('exit', (worker, code, signal) => {
    //   console.log(`Worker ${worker.process.pid} died`)
    // })
    new EmailService(prisma).initializeListeners()
    new FormActionRunner(prisma).startListening()
    // await new KoboSyncServer(prisma).syncApiAnswersToDbAll()
    if (conf.production) {
      new ScheduledTask(prisma).start()
    } else {
      // await new BuildKoboType().buildAll()
    }
  }

  const start = () => {
    new Server(conf, prisma).start()
  }
  // if (cluster.isPrimary) {
  init()
  // } else {
  start()
  if (appConf.production) {
    process.on('uncaughtException', err => {
      log.error('Uncaught Exception:', err)
      process.exit(1)
    })
    process.on('unhandledRejection', (reason, promise) => {
      console.log(reason, promise)
      log.error('>>> Unhandled Rejection at:', promise, 'reason:', reason)
      // process.exit(1)
    })
  }
}

startApp(appConf)
