import {Controller} from './Controller.js'
import {NextFunction, Request, Response} from 'express'
import * as yup from 'yup'
import {PrismaClient} from '@prisma/client'
import {SessionService} from '../../feature/session/SessionService.js'
import {AppError} from '../../helper/Errors.js'
import {AppSession} from '../../feature/session/AppSession.js'
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

  readonly getMe = async (req: Request, res: Response, next: NextFunction) => {
    if (this.conf.production && req.hostname === 'localhost') {
      const user = await this.prisma.user.findFirstOrThrow({where: {email: this.conf.ownerEmail}})
      req.session.session = await this.service.get(user)
    }
    const user = req.session.session!
    if (!user) throw new AppError.Forbidden('No access.')
    res.send(user)
  }

  readonly logout = async (req: Request, res: Response, next: NextFunction) => {
    req.session.session = undefined
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
    req.session.session = await this.service.get(connectedUser)
    res.send(req.session.session)
  }

  readonly revertConnectAs = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.session?.originalEmail) {
      throw new AppError.Forbidden('')
    }
    const user = await this.prisma.user.findFirstOrThrow({where: {email: req.session.session?.originalEmail}})
    const session = await this.service.get(user)
    res.send(session)
  }

  readonly connectAs = async (req: Request, res: Response, next: NextFunction) => {
    const connectedUser = req.session.session!.user
    const body = await yup
      .object({
        email: yup.string().required(),
      })
      .validate(req.body)
    const user = await this.prisma.user.findFirstOrThrow({where: {email: body.email}})
    if (user.email === connectedUser.email) throw new SessionError.UserNoAccess()
    const session = await this.service.get(user)
    session.originalEmail = connectedUser.email
    res.send(session)
  }

  readonly track = async (req: Request, res: Response, next: NextFunction) => {
    const body = await yup
      .object({
        detail: yup.string().optional(),
      })
      .validate(req.body)
    await this.service.saveActivity({email: req.session.session?.user.email, detail: body.detail})
    res.send()
  }
}
