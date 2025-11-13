import {NextFunction, Request, Response} from 'express'
import * as yup from 'yup'
import {PrismaClient} from '@prisma/client'
import {SessionService} from '../../feature/session/SessionService.js'
import {HttpError, Ip} from '@infoportal/api-sdk'
import {isAuthenticated} from '../Routes.js'
import {appConf} from '../../core/conf/AppConf.js'

export class ControllerSession {
  constructor(
    private prisma: PrismaClient,
    private service = new SessionService(prisma),
    private conf = appConf,
  ) {}

  readonly getMe = async (req: Request, res: Response, next: NextFunction) => {
    // if (req.hostname.startsWith('localhost') || req.hostname.startsWith('192')) {
    //   const user = await this.prisma.user.findFirstOrThrow({where: {email: this.conf.ownerEmail}})
    //   req.session.app = {user: user as any}
    // }
    // if (!isAuthenticated(req)) throw new HttpError.Forbidden('No access.')
    const profile = await this.service.get(req.session.app!.user)
    res.send({...profile, ...req.session.app})
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
    const session = await this.service.login(user)
    req.session.app = {user: session.user}
    res.send(session)
  }

  readonly revertConnectAs = async (req: Request, res: Response, next: NextFunction) => {
    const data = await this.service.revertConnectAs(req.session.app?.originalEmail)
    res.send(data)
  }

  readonly connectAs = async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticated(req)) throw new HttpError.Forbidden()
    const body = await yup
      .object({
        email: yup.string().required(),
      })
      .validate(req.body)
    const spyUser = await this.service.connectAs({
      spyEmail: body.email as Ip.User.Email,
      connectedUser: req.session.app.user,
    })
    req.session.app = spyUser
    req.session.app.originalEmail = req.session.app.user.email
    res.send(spyUser)
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
