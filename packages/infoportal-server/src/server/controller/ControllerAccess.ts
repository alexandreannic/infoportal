import {NextFunction, Request, Response} from 'express'
import {PrismaClient} from '@prisma/client'
import {AccessService} from '../../feature/access/AccessService.js'
import {idParamsSchema} from '../../helper/Utils.js'
import {getWorkspaceId, isAuthenticated} from '../Routes.js'
import {AppError} from '../../helper/Errors.js'

export class ControllerAccess {
  constructor(
    private prisma: PrismaClient,
    private service = new AccessService(prisma),
  ) {}

  readonly create = async (req: Request, res: Response, next: NextFunction) => {
    const body = await AccessService.createSchema.validate({
      ...req.body,
      workspaceId: req.params.workspaceId,
    })
    const data = await this.service.create(body)
    res.send(data)
  }

  readonly update = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = await idParamsSchema.validate(req.params)
    const body = await AccessService.updateSchema.validate(req.body)
    const data = await this.service.update(id, body)
    res.send(data)
  }

  readonly remove = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = await idParamsSchema.validate(req.params)
    await this.service.remove(id)
    res.send()
  }

  readonly search = async (req: Request, res: Response, next: NextFunction) => {
    const workspaceId = getWorkspaceId(req)
    const qs = await AccessService.searchSchema.validate(req.query)
    const data = await this.service.searchForUser({workspaceId, ...qs})
    res.send(data)
  }

  readonly searchMine = async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticated(req)) throw new AppError.Forbidden()
    const workspaceId = getWorkspaceId(req)
    const qs = await AccessService.searchSchema.validate(req.query)
    const data = await this.service.searchForUser({
      workspaceId,
      ...qs,
      user: req.session.app.user,
    })
    res.send(data)
  }
}
