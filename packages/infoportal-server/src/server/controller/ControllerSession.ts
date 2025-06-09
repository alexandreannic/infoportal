import {Controller} from './Controller.js'
import {NextFunction, Request, Response} from 'express'
import * as yup from 'yup'
import {PrismaClient} from '@prisma/client'
import {SessionService} from '../../feature/session/SessionService.js'
import {AppError} from '../../helper/Errors.js'
import {appConf} from '../../core/conf/AppConf.js'
import {SessionError} from '../../feature/session/SessionErrors.js'
import {isAuthenticated} from '../Routes.js'

export class ControllerSession extends Controller {
  constructor(
    private prisma: PrismaClient,
    private service = new SessionService(prisma),
    private conf = appConf,
  ) {
    super({errorKey: 'session'})
  }

  readonly getMe = async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticated(req)) throw new AppError.Forbidden('No access.')
    if (this.conf.production && req.hostname === 'localhost') {
      const user = await this.prisma.user.findFirstOrThrow({where: {email: this.conf.ownerEmail}})
      req.session.app = await this.service.get(user)
    }
    const profile = await this.service.get(req.session.app.user)
    res.send(profile)
  }

  readonly logout = async (req: Request, res: Response, next: NextFunction) => {
    req.session.app = undefined
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
    req.session.app = {user: connectedUser}
    res.send(req.session.app)
  }

  readonly revertConnectAs = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.app?.originalEmail) {
      throw new AppError.Forbidden('')
    }
    const user = await this.prisma.user.findFirstOrThrow({where: {email: req.session?.app.originalEmail}})
    req.session.app = await this.service.get(user)
    res.send(req.session.app)
  }

  readonly connectAs = async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticated(req)) throw new AppError.Forbidden()
    const body = await yup
      .object({
        email: yup.string().required(),
      })
      .validate(req.body)
    const connectAsUser = await this.prisma.user.findFirstOrThrow({where: {email: body.email}})
    if (connectAsUser.id === req.session.app.user.id) throw new SessionError.UserNoAccess()
    req.session.app.user.id = connectAsUser.id
    req.session.app.originalEmail = req.session.app.user.email
    res.send(req.session.app)
  }

  readonly track = async (req: Request, res: Response, next: NextFunction) => {
    const body = await yup
      .object({
        detail: yup.string().optional(),
      })
      .validate(req.body)
    await this.service.saveActivity({email: req.session.app?.user.email ?? 'not_connected', detail: body.detail})
    res.send()
  }
}
