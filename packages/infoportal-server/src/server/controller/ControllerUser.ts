import {NextFunction, Request, Response} from 'express'
import * as yup from 'yup'
import {PrismaClient} from '@prisma/client'
import {UserService} from '../../feature/user/UserService.js'
import {DrcOffice} from 'infoportal-common'
import {Obj} from '@axanc/ts-utils'
import {SessionError} from '../../feature/session/SessionErrors.js'
import {Util} from '../../helper/Utils.js'

export class ControllerUser {
  constructor(
    private pgClient: PrismaClient,
    private service = UserService.getInstance(pgClient),
  ) {}

  readonly search = async (req: Request, res: Response, next: NextFunction) => {
    const data = await this.service.getAll()
    res.send(data)
  }

  readonly avatar = async (req: Request, res: Response, next: NextFunction) => {
    const {email} = await yup
      .object({
        email: yup.string().optional(),
      })
      .validate(req.params)
    const avatar = await this.service.getUserAvatarByEmail(email ?? req.session.user?.email!)
    if (!avatar) {
      res.send()
      // throw new AppError.NotFound('user_not_found')
    } else {
      res.setHeader('Content-Type', 'image/jpeg')
      res.send(avatar)
    }
  }

  readonly updateMe = async (req: Request, res: Response, next: NextFunction) => {
    const user = await yup
      .object({
        drcOffice: yup.mixed<DrcOffice>().oneOf(Obj.values(DrcOffice)),
      })
      .validate(req.body)

    const email = req.session.user?.email
    if (!email) {
      throw new SessionError.UserNotConnected()
    }
    const data = await this.service.update({email, ...user})
    req.session.user = {
      ...req.session.user,
      ...(Util.removeUndefined(data) as any),
    }
    res.send(data)
  }

  readonly getDrcJobs = async (req: Request, res: Response, next: NextFunction) => {
    const drcJobs = await this.service.getDistinctDrcJobs()
    res.send(drcJobs)
  }
}
