import {AppConf, appConf} from './core/conf/AppConf.js'
import {Server} from './server/Server.js'
import {PrismaClient} from '@prisma/client'
import {ScheduledTask} from './scheduledTask/ScheduledTask.js'
import {MpcaCachedDb} from './feature/mpca/MpcaCachedDb.js'
import {KoboMetaService} from './feature/kobo/meta/KoboMetaService.js'
import {IpCache, IpCacheApp} from 'infoportal-common'
import {duration} from '@axanc/ts-utils'
import * as winston from 'winston'
import {format, Logger as WinstonLogger} from 'winston'
import {Syslog} from 'winston-syslog'
import {EmailService} from './feature/email/EmailService.js'
import {DbInit} from './core/DbInit.js'
import * as os from 'os'

export type AppLogger = WinstonLogger

export enum AppCacheKey {
  Users = 'Users',
  Meta = 'Meta',
  KoboAnswers = 'KoboAnswers',
  KoboSchema = 'KoboSchema',
  KoboServerIndex = 'KoboServerIndex',
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
        format.printf((props) => `${props.timestamp} [${props.label}] ${props.level}: ${props.message}`),
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
  return {logger, cache}
}

export const app = App()
const startApp = async (conf: AppConf) => {
  // await new BuildKoboType().build('safety_incident')
  // await ActivityInfoBuildType.fslc()
  // await KoboMigrateHHS2({
  //   prisma,
  //   serverId: koboServerId.prod,
  //   oldFormId: KoboIndex.byName('protectionHh_2').id,
  //   newFormId: KoboIndex.byName('protectionHh_2_1').id,
  // }).run()
  // const legalAidSdk = new LegalaidSdk(new ApiClient({
  //   baseUrl: 'https://api.lau-crm.org.ua',
  //   headers: {
  //     'x-auth-token': appConf.legalAid.apiToken,
  //   }
  // }))

  const log = app.logger('')
  log.info(`Logger level: ${appConf.logLevel}`)
  const prisma = new PrismaClient({
    // log: ['query']
  })
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
    new KoboMetaService(prisma).start()
    new EmailService().initializeListeners()
    // await new KoboSyncServer(prisma).syncApiAnswersToDbAll()
    if (conf.production) {
      new ScheduledTask(prisma).start()
      MpcaCachedDb.constructSingleton(prisma).warmUp()
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
    process.on('uncaughtException', (err) => {
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
