import {NextFunction, Request, Response} from 'express'
import {PrismaClient} from '@prisma/client'
import {WorkspaceService} from '../../feature/workspace/WorkspaceService.js'

export class ControllerWorkspace {
  constructor(
    private prisma: PrismaClient,
    private service = new WorkspaceService(prisma),
  ) {}

  readonly create = async (req: Request, res: Response, next: NextFunction) => {
    const body = await WorkspaceService.schema.create.validate(req.body)
    const email = req.session.session?.email ?? 'unknown'
    const data = await this.service.create(body, email)
    res.send(data)
  }

  readonly update = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = await WorkspaceService.schema.id.validate(req.params)
    const body = await WorkspaceService.schema.update.validate(req.body)
    const data = await this.service.update(id, body)
    res.send(data)
  }

  readonly remove = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = await WorkspaceService.schema.id.validate(req.params)
    await this.service.remove(id)
    res.send()
  }
}
