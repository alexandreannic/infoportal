import {NextFunction, Request, Response} from 'express'
import * as yup from 'yup'
import {PrismaClient} from '@prisma/client'
import {UserService} from '../../feature/user/UserService'
import {DrcOffice} from '@infoportal-common'
import {Enum} from '@alexandreannic/ts-utils'
import {SessionError} from '../../feature/session/SessionErrors'
import {Util} from '../../helper/Utils'
import {AppError} from '../../helper/Errors'

export class ControllerUser {

  constructor(
    private pgClient: PrismaClient,
    private service = new UserService(pgClient)
  ) {
  }

  readonly search = async (req: Request, res: Response, next: NextFunction) => {
    const data = await this.service.getAll()
    res.send(data)
  }

  readonly avatar = async (req: Request, res: Response, next: NextFunction) => {
    const {email} = await yup.object({
      email: yup.string().optional()
    }).validate(req.params)
    const avatar = await this.service.getUserByEmail(email ?? req.session.user?.email!).then(_ => _?.avatar ?? undefined)
    if (!avatar) {
      throw new AppError.NotFound('user_not_found')
    } else {
      res.setHeader('Content-Type', 'image/jpeg')
      res.send(avatar)
    }
  }

  readonly updateMe = async (req: Request, res: Response, next: NextFunction) => {
    const user = await yup.object({
      drcOffice: yup.mixed<DrcOffice>().oneOf(Enum.values(DrcOffice)),
    }).validate(req.body)

    const email = req.session.user?.email
    if (!email) {
      throw new SessionError.UserNotConnected()
    }
    const data = await this.service.update({email, ...user})
    req.session.user = {
      ...req.session.user,
      ...Util.removeUndefined(data) as any,
    }
    res.send(data)
  }
}