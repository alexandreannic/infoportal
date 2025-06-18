import {NextFunction, Request, Response} from 'express'
import {PrismaClient} from '@prisma/client'
import {WorkspaceService} from '../../feature/workspace/WorkspaceService.js'
import {isAuthenticated} from '../Routes.js'
import {AppError} from '../../helper/Errors.js'

export class ControllerWorkspace {
  constructor(
    private prisma: PrismaClient,
    private service = new WorkspaceService(prisma),
  ) {}

  readonly getMe = async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticated(req)) throw new AppError.Forbidden()
    const data = await this.service.getMe({user: req.session.app?.user, workspaceId: req.params.workspaceId})
    res.send(data)
  }

  readonly checkSlug = async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticated(req)) throw new AppError.Forbidden()
    const {slug} = await WorkspaceService.schema.slug.validate(req.body)
    const suggestedSlug = await this.service.getUniqSlug(slug)
    res.send({
      isFree: slug === suggestedSlug,
      suggestedSlug,
    })
  }

  readonly create = async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticated(req)) throw new AppError.Forbidden()
    const body = await WorkspaceService.schema.create.validate(req.body)
    const connectedUser = req.session.app.user
    const data = await this.service.create(body, connectedUser)
    res.send(data)
  }

  readonly update = async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticated(req)) throw new AppError.Forbidden()
    const {id} = await WorkspaceService.schema.id.validate(req.params)
    const body = await WorkspaceService.schema.update.validate(req.body)
    const data = await this.service.update(id, body)
    res.send(data)
  }

  readonly remove = async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticated(req)) throw new AppError.Forbidden()
    const {id} = await WorkspaceService.schema.id.validate(req.params)
    await this.service.remove(id)
    res.send()
  }
}
