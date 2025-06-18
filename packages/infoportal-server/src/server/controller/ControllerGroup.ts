import {NextFunction, Request, Response} from 'express'
import {PrismaClient} from '@prisma/client'
import {AccessService} from '../../feature/access/AccessService.js'
import {GroupItemService} from '../../feature/group/GroupItemService.js'
import {idParamsSchema, yup} from '../../helper/Utils.js'
import {GroupService} from '../../feature/group/GroupService.js'

export class ControllerGroup {
  constructor(
    private prisma: PrismaClient,
    private service = new GroupService(prisma),
    private itemService = new GroupItemService(prisma),
  ) {}

  readonly create = async (req: Request, res: Response, next: NextFunction) => {
    const body = await GroupService.schema.create.validate({
      ...req.body,
      workspaceId: req.params.workspaceId,
    })
    const data = await this.service.create(body)
    res.send(data)
  }

  readonly update = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = await GroupService.schema.id.validate(req.params)
    const body = await GroupService.schema.update.validate(req.body)
    const data = await this.service.update(id, body)
    res.send(data)
  }

  readonly remove = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = await GroupService.schema.id.validate(req.params)
    await this.service.remove(id)
    res.send()
  }

  readonly searchWithItems = async (req: Request, res: Response, next: NextFunction) => {
    const filters = await GroupService.schema.search.validate({
      ...req.body,
      workspaceId: req.params.workspaceId,
    })
    const data = await this.service.search(filters)
    res.send(data)
  }

  readonly createItem = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = await GroupService.schema.id.validate(req.params)
    const body = await GroupItemService.schema.create.validate(req.body)
    const data = await this.itemService.create(id, body)
    res.send(data)
  }

  readonly updateItem = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = await GroupService.schema.id.validate(req.params)
    const body = await GroupItemService.schema.update.validate(req.body)
    const data = await this.itemService.update(id, body)
    res.send(data)
  }

  readonly removeItem = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = await GroupService.schema.id.validate(req.params)
    await this.itemService.remove(id)
    res.send()
  }

  readonly getItems = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = await GroupService.schema.id.validate(req.params)
    const qs = await AccessService.searchSchema.validate(req.query)
    const data = await this.itemService.getAll({groupId: id})
    res.send(data)
  }
}
