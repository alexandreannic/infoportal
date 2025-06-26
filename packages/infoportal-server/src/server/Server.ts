import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import {getRoutes} from './Routes.js'
import {app} from '../index.js'
import {appConf, AppConf} from '../core/conf/AppConf.js'
import {genUUID} from '../helper/Utils.js'
import {HttpError} from './controller/Controller.js'
import {PrismaClient} from '@prisma/client'
import session from 'express-session'
import {AppError} from '../helper/Errors.js'
import {PrismaSessionStore} from '@quixo3/prisma-session-store'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import {duration} from '@axanc/ts-utils'
import * as console from 'console'
import {createExpressEndpoints} from '@ts-rest/express'
import {ipContract} from 'infoportal-api-sdk'
// import * as Sentry from '@sentry/node'
// import sessionFileStore from 'session-file-store'

export class Server {
  constructor(
    private conf: AppConf = appConf,
    private pgClient: PrismaClient,
    // private ecrecSdk: EcrecSdk,
    // private legalaidSdk: LegalaidSdk,
    private log = app.logger('Server'),
  ) {}

  readonly errorHandler = (err: HttpError, req: Request, res: Response, next: (err?: any) => void) => {
    const errorId = genUUID().split('-')[0]
    try {
      if (err instanceof AppError.Forbidden) {
        res.status(401).json({
          data: err.message,
          errorId,
        })
      } else if (err instanceof AppError.NotFound) {
        res.status(404).json({
          data: err.message,
          errorId,
        })
      }
      // console.error('[errorHandler()]', err)
      this.log.error(
        `[${errorId}] Error ${err.code}: ${err.message}\n${err.stack} on ${req.method} ${req.url} - ${JSON.stringify(req.body)}`,
      )
      console.log({data: err.code === 500 ? 'Something went wrong.' : err.message, errorId})
      res.status(500).json({
        data: err.message ?? 'Something went wrong.',
        errorId,
      })
    } catch (e) {
      res.status(500).json({
        data: 'Something went wrong.',
        errorId,
      })
    }
  }
  //
  // readonly corsHeader = (req: Request, res: Response, next: NextFunction) => {
  //   res.header('Access-Control-Allow-Origin', this.conf.cors.allowOrigin)
  //   res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept')
  //   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  //   res.header('Access-Control-Allow-Credentials', 'true')
  //   next()
  // }

  readonly start = () => {
    const app = express()
    // new IpSentry(this.conf, app,)
    // app.use(Sentry.Handlers.requestHandler())
    // app.use(Sentry.Handlers.tracingHandler())
    app.set('trust proxy', 1)
    // app.use(this.corsHeader)
    app.use(
      cors({
        credentials: true,
        origin: this.conf.cors.allowOrigin,
        optionsSuccessStatus: 200,
      }),
    )
    // const sessionstore = sessionFileStore(session)
    app.use(cookieParser())
    app.use(
      session({
        secret: appConf.sessionSecret,
        resave: false,
        saveUninitialized: false,
        name: 'infoportal-session2',
        // proxy: true,
        unset: 'destroy',
        store: new PrismaSessionStore(this.pgClient, {
          checkPeriod: duration(1, 'day').toMs,
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        }),
        cookie: {
          domain: undefined, //appConf.production ? '.drc.ngo' : undefined,
          secure: appConf.production,
          // httpOnly: true,
          sameSite: appConf.production ? 'none' : undefined,
          maxAge: duration(30, 'day').toMs,
        },
      }),
    )
    app.use(bodyParser.json({limit: '512mb'}))
    app.use(bodyParser.urlencoded({extended: false}))
    const {tsRestRoutes, rawRoutes} = getRoutes(this.pgClient)
    app.use(rawRoutes)
    createExpressEndpoints(ipContract, tsRestRoutes, app)
    // app.use(Sentry.Handlers.errorHandler())
    app.use(this.errorHandler)
    app.listen(this.conf.port, () => {
      this.log.info(`server start listening on port ${this.conf.port}`)
    })
  }
}
