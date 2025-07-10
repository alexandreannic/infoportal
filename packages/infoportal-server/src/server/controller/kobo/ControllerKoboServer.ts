import {NextFunction, Request, Response} from 'express'
import {PrismaClient} from '@prisma/client'
import {idParamsSchema, yup} from '../../../helper/Utils.js'
import {KoboService} from '../../../feature/kobo/KoboService.js'

export class ControllerKoboServer {
  constructor(
    private pgClient: PrismaClient,
    private service = new KoboService(pgClient),
  ) {}

  static readonly schema = {
    create: yup.object({
      name: yup.string().required(),
      url: yup.string().required(),
      urlV1: yup.string().required(),
      token: yup.string().required(),
    }),
    id: idParamsSchema,
  }

  readonly getAll = async (req: Request, res: Response, next: NextFunction) => {
    const servers = await this.pgClient.koboServer.findMany({where: {workspaceId: req.params.workspaceId}})
    res.send(servers)
  }

  readonly create = async (req: Request, res: Response, next: NextFunction) => {
    const payload = await ControllerKoboServer.schema.create.validate(req.body)
    const data = await this.pgClient.koboServer.create({
      data: {workspaceId: req.params.workspaceId, ...payload},
    })
    res.send(data)
  }

  readonly delete = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = await ControllerKoboServer.schema.id.validate(req.params)
    await this.pgClient.koboServer.delete({
      where: {id},
    })
    res.send()
  }
}
