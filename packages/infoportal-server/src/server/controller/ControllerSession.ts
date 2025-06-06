import {Controller} from './Controller.js'
import {NextFunction, Request, Response} from 'express'
import * as yup from 'yup'
import {PrismaClient} from '@prisma/client'
import {SessionService} from '../../feature/session/SessionService.js'
import {AppError} from '../../helper/Errors.js'
import {appConf} from '../../core/conf/AppConf.js'
import {SessionError} from '../../feature/session/SessionErrors.js'
import {AuthRequest} from '../../typings'
import {AppSession} from '../../feature/session/AppSession.js'
import {isAuthenticated} from '../Routes.js'

export class ControllerSession extends Controller {
  constructor(
    private prisma: PrismaClient,
    private service = new SessionService(prisma),
    private conf = appConf,
  ) {
    super({errorKey: 'session'})
  }

  static readonly assignSession = (req: Request, session: AppSession): AuthRequest => {
    req.session.user = session.user
    req.session.groups = session.groups
    req.session.accesses = session.accesses
    req.session.workspaces = session.workspaces
    req.session.originalEmail = session.originalEmail
    return req as AuthRequest
  }

  static readonly clearSession = (req: Request) => {
    delete req.session.user
    delete req.session.groups
    delete req.session.accesses
    delete req.session.workspaces
    delete req.session.originalEmail
  }

  readonly getMe = async (req: Request, res: Response, next: NextFunction) => {
    if (this.conf.production && req.hostname === 'localhost') {
      const user = await this.prisma.user.findFirstOrThrow({where: {email: this.conf.ownerEmail}})
      const session = await this.service.get(user)
      ControllerSession.assignSession(req, session)
    }
    const user = req.session!
    if (!user) throw new AppError.Forbidden('No access.')
    res.send(user)
  }

  readonly logout = async (req: Request, res: Response, next: NextFunction) => {
    ControllerSession.clearSession(req)
    res.send()
  }

  readonly login = async (req: Request, res: Response, next: NextFunction) => {
    const user = await yup
      .object({
        name: yup.string().required(),
        username: yup.string().required(),
        accessToken: yup.string().required(),
        provider: yup.string().oneOf(['google', 'microsoft']).required(),
      })
      .validate(req.body)
    const connectedUser = await this.service.login(user)
    const session = await this.service.get(connectedUser)
    ControllerSession.assignSession(req, session)
    res.send(session)
  }

  readonly revertConnectAs = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.originalEmail) {
      throw new AppError.Forbidden('')
    }
    const user = await this.prisma.user.findFirstOrThrow({where: {email: req.session?.originalEmail}})
    const session = await this.service.get(user)
    ControllerSession.assignSession(req, session)
    res.send(session)
  }

  readonly connectAs = async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticated(req)) throw new AppError.Forbidden()
    const connectedUser = req.session.user
    const body = await yup
      .object({
        email: yup.string().required(),
      })
      .validate(req.body)
    const user = await this.prisma.user.findFirstOrThrow({where: {email: body.email}})
    if (user.email === connectedUser.email) throw new SessionError.UserNoAccess()
    const session = await this.service.get(user)
    session.originalEmail = connectedUser.email
    ControllerSession.assignSession(req, session)
    res.send(session)
  }

  readonly track = async (req: Request, res: Response, next: NextFunction) => {
    const body = await yup
      .object({
        detail: yup.string().optional(),
      })
      .validate(req.body)
    await this.service.saveActivity({email: req.session.user?.email, detail: body.detail})
    res.send()
  }
}
