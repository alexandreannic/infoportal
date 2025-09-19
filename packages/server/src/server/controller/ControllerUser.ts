import {NextFunction, Request, Response} from 'express'
import * as yup from 'yup'
import {PrismaClient} from '@prisma/client'
import {UserService} from '../../feature/user/UserService.js'
import {Ip} from 'infoportal-api-sdk'

export class ControllerUser {
  constructor(
    private pgClient: PrismaClient,
    private service = UserService.getInstance(pgClient),
  ) {}

  readonly avatar = async (req: Request, res: Response, next: NextFunction) => {
    const {email} = await yup
      .object({
        email: yup.string().optional(),
      })
      .validate(req.params)
    const avatar = await this.service.getUserAvatarByEmail((email as Ip.User.Email) ?? req.session.app?.user.email!)
    if (!avatar) {
      res.send()
      // throw new AppError.NotFound('user_not_found')
    } else {
      res.setHeader('Content-Type', 'image/jpeg')
      res.send(avatar)
    }
  }
}
