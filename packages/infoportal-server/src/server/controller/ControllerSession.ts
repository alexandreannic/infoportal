import {Controller} from './Controller.js'
import {NextFunction, Request, Response} from 'express'
import * as yup from 'yup'
import {PrismaClient} from '@prisma/client'
import {SessionService} from '../../feature/session/SessionService.js'
import {AppError} from '../../helper/Errors.js'
import {UserSession} from '../../feature/session/UserSession.js'
import {appConf} from '../../core/conf/AppConf.js'
import {SessionError} from '../../feature/session/SessionErrors.js'

export class ControllerSession extends Controller {
  constructor(
    private prisma: PrismaClient,
    private service = new SessionService(prisma),
    private conf = appConf,
  ) {
    super({errorKey: 'session'})
  }

  readonly get = async (req: Request, res: Response, next: NextFunction) => {
    if (this.conf.production && req.hostname === 'localhost') {
      const user = await this.prisma.user.findFirstOrThrow({where: {email: this.conf.ownerEmail}})
      req.session.user = UserSession.fromUser(user)
    }
    res.send(req.session.user)
  }

  readonly logout = async (req: Request, res: Response, next: NextFunction) => {
    req.session.user = undefined
    res.send()
  }

  readonly login = async (req: Request, res: Response, next: NextFunction) => {
    const user = await yup
      .object({
        name: yup.string().required(),
        username: yup.string().required(),
        accessToken: yup.string().required(),
      })
      .validate(req.body)
    const connectedUser = await this.service.login(user)
    ;(req.session.user = UserSession.fromUser(connectedUser)), res.send(req.session.user)
  }

  readonly revertConnectAs = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user?.originalEmail) {
      throw new AppError.Forbidden('')
    }
    const user = await this.prisma.user.findFirstOrThrow({where: {email: req.session.user?.originalEmail}})
    req.session.user = UserSession.fromUser(user)
    res.send(req.session.user)
  }

  readonly connectAs = async (req: Request, res: Response, next: NextFunction) => {
    const body = await yup
      .object({
        email: yup.string().required(),
      })
      .validate(req.body)

    const user = await this.prisma.user.findFirstOrThrow({where: {email: body.email}})
    if (user.email === this.conf.ownerEmail) throw new SessionError.UserNoAccess()
    req.session.user = {
      ...UserSession.fromUser(user),
      originalEmail: req.session.user?.email,
    }
    res.send(req.session.user)
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
