import {PrismaClient} from '@prisma/client'
import {NextFunction, Request, Response} from 'express'
import {AppError} from '../../helper/Errors.js'
import {isAuthenticated} from '../Routes.js'
import {WorkspaceAccessService} from '../../feature/workspace/WorkspaceAccessService.js'

export class ControllerWorkspaceAccess {
  constructor(
    private prisma: PrismaClient,
    private service = new WorkspaceAccessService(prisma),
  ) {}

  readonly create = async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticated(req)) throw new AppError.Forbidden()
    const body = await WorkspaceAccessService.schema.create.validate(req.body)
    const data = await this.service.create(body, req.session.app.user.email)
    res.send(data)
  }
}
