import {NextFunction, Request, Response} from 'express'
import {PrismaClient} from '@prisma/client'
import {KoboFormService} from '../../../feature/kobo/KoboFormService.js'
import * as yup from 'yup'

export class ControllerKoboForm {
  constructor(
    private pgClient: PrismaClient,
    private service = new KoboFormService(pgClient),
  ) {}

  readonly add = async (req: Request, res: Response, next: NextFunction) => {
    const body = await yup
      .object({
        uid: yup.string().required(),
        serverId: yup.string().required(),
      })
      .validate(req.body)
    const data = await this.service.add({
      ...body,
      uploadedBy: req.session.user?.email!,
    })
    res.send(data)
  }

  readonly refreshAll = async (req: Request, res: Response, next: NextFunction) => {
    await this.service.refreshAll({
      uploadedBy: req.session.user?.email!,
    })
    res.send()
  }

  readonly getAll = async (req: Request, res: Response, next: NextFunction) => {
    const data = await this.service.getAll()
    res.send(data)
  }

  readonly get = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = await yup
      .object({
        id: yup.string().required(),
      })
      .validate(req.params)
    const data = await this.service.get(id)
    res.send(data)
  }
}
