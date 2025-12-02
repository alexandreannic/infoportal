import express, {NextFunction, Request, Response} from 'express'
import bodyParser from 'body-parser'
import {getRoutes} from './Routes.js'
import {app} from '../index.js'
import {appConf, AppConf} from '../core/AppConf.js'
import {genUUID} from '@infoportal/common'
import {apiContract, HttpError} from '@infoportal/api-sdk'
import session from 'express-session'
import {PrismaSessionStore} from '@quixo3/prisma-session-store'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import {duration} from '@axanc/ts-utils'
import {createExpressEndpoints} from '@ts-rest/express'
// import * as Sentry from '@sentry/node'
// import sessionFileStore from 'session-file-store'
import {Server as SocketIOServer} from 'socket.io'
import {PermissionService} from '../feature/PermissionService.js'
import {Socket} from './Socket.js'
import {PrismaClient} from '@infoportal/prisma'

export class Server {
  constructor(
    private conf: AppConf = appConf,
    private pgClient: PrismaClient,
    private server = express(),
    // private httpServer = createServer(this.server),
    private log = app.logger('Server'),
  ) {}

  readonly errorHandler = (err: HttpError, req: Request, res: Response, next: (err?: any) => void) => {
    const errorId = genUUID().split('-')[0]
    try {
      if (err instanceof HttpError.Forbidden) {
        res.status(401).json({
          data: err.message,
          errorId,
        })
      } else if (err instanceof HttpError.NotFound) {
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

  readonly start = () => {
    // new IpSentry(this.conf, app,)
    // this.server.use(Sentry.Handlers.requestHandler())
    // this.server.use(Sentry.Handlers.tracingHandler())

    const sessionMiddleware = session({
      secret: this.conf.sessionSecret,
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
        secure: this.conf.production,
        // httpOnly: true,
        sameSite: this.conf.production ? 'none' : undefined,
        maxAge: duration(30, 'day').toMs,
      },
    })

    this.server.set('trust proxy', 1)
    // this.server.use(this.corsHeader)
    this.server.use(
      cors({
        credentials: true,
        origin: this.conf.cors.allowOrigin,
        optionsSuccessStatus: 200,
      }),
    )
    // const sessionstore = sessionFileStore(session)
    this.server.use(cookieParser())
    this.server.use(sessionMiddleware)
    this.server.use(bodyParser.json({limit: '512mb'}))
    this.server.use(bodyParser.urlencoded({extended: false}))
    if (!this.conf.production)
      this.server.use((req, res, next) => {
        const delay = 50 + Math.random() * 200
        setTimeout(next, delay)
      })
    const {tsRestRoutes, rawRoutes} = getRoutes(this.pgClient)
    this.server.use(rawRoutes)
    createExpressEndpoints(apiContract, tsRestRoutes, this.server, {logInitialization: false})
    // this.server.use(Sentry.Handlers.errorHandler())
    this.server.use(this.errorHandler)
    const httpServer = this.server.listen(
      this.conf.port,
      /*'0.0.0.0',*/ () => {
        this.log.info(`server start listening on port ${this.conf.port}`)
      },
    )
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: this.conf.cors.allowOrigin,
        credentials: true,
      },
    })
    io.use((socket, next) => {
      return sessionMiddleware(socket.request as Request, {} as Response, next as NextFunction)
    })
    io.use(async (socket, next) => {
      try {
        const req = socket.request as express.Request
        const permission = new PermissionService(this.pgClient)
        if (await permission.checkUserConnected(req)) next()
      } catch (err: any) {
        next(err)
      }
    })
    new Socket(io)
    // new AppWebsocket(httpServer).init()
  }
}
