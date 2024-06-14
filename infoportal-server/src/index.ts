import {AppConf, appConf} from './core/conf/AppConf'
import {Server} from './server/Server'
import {Services} from './server/services'
import {PrismaClient} from '@prisma/client'
import {MpcaPaymentService} from './feature/mpca/mpcaPayment/MpcaPaymentService'
import {DbInit} from './db/DbInit'
import {ScheduledTask} from './scheduledTask/ScheduledTask'
import {MpcaCachedDb} from './feature/mpca/db/MpcaCachedDb'
import {ShelterCachedDb} from './feature/shelter/db/ShelterCachedDb'
import {KoboMetaService} from './feature/kobo/meta/KoboMetaService'
import {GlobalCache, IpCache} from './helper/IpCache'
import {duration} from '@alexandreannic/ts-utils'
import * as winston from 'winston'
import {format, Logger as WinstonLogger} from 'winston'
import * as os from 'os'
import {Syslog} from 'winston-syslog'

export type AppLogger = WinstonLogger;

export const App = (config: AppConf = appConf) => {

  const logger = (label?: string) => {
    return winston.createLogger({
      level: appConf.logLevel ?? 'debug',
      format: winston.format.combine(
        format.label({label}),
        winston.format.timestamp({
          format: 'YYYY-MM-DD hh:mm:ss'
        }),
        winston.format.colorize(),
        winston.format.simple(),
        format.printf((props) => `${props.timestamp} [${props.label}] ${props.level}: ${props.message}`)
      ),
      transports: [
        ...(config.production && !config.cors.allowOrigin.includes('localhost')) ? [new Syslog({
          host: 'logs.papertrailapp.com',
          port: 32079,
          protocol: 'tls4',
          localhost: os.hostname(),
          eol: '\n',
        })] : [],
        new winston.transports.Console({
          level: (!config.production) ? 'debug' : undefined
        })
      ],
    })
  }

  const cache = new GlobalCache(
    new IpCache<IpCache<any>>({
      ttlMs: duration(20, 'day'),
      cleaningCheckupInterval: duration(20, 'day',)
    }),
    logger('GlobalCache')
  )
  return {logger, cache}
}

export const app = App()

const initServices = (
  // koboClient: v2,
  // ecrecSdk: EcrecSdk,
  // legalaidSdk: LegalaidSdk,
  prisma: PrismaClient
): Services => {
  // const ecrec = new ServiceEcrec(ecrecSdk)
  // const legalAid = new ServiceLegalAid(legalaidSdk)
  // const nfi = new ServiceNfi(koboClient)
  const mpcaPayment = new MpcaPaymentService(prisma)
  return {
    // ecrec,
    // legalAid,
    // nfi,
    mpcaPayment,
  }
}

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

  const prisma = new PrismaClient({
    // log: ['query']
  })
  const services = initServices(
    // koboSdk,
    // ecrecAppSdk,
    // legalAidSdk,
    prisma,
  )
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
    if (conf.production) {
      new ScheduledTask(prisma).start()
      MpcaCachedDb.constructSingleton(prisma).warmUp()
      ShelterCachedDb.constructSingleton(prisma).warmUp()
    }
  }

  const start = () => {
    new Server(
      conf,
      prisma,
      services,
    ).start()
  }
  // if (cluster.isPrimary) {
  init()
  // } else {
  start()
  // }
}

// runAi.washRMM()
startApp(appConf)
