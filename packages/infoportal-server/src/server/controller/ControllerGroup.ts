import {NextFunction, Request, Response} from 'express'
import {PrismaClient} from '@prisma/client'
import {AccessService} from '../../feature/access/AccessService.js'
import {GroupItemService} from '../../feature/group/GroupItemService.js'
import {yup} from '../../helper/Utils.js'
import {GroupService} from '../../feature/group/GroupService.js'

export class ControllerGroup {
  constructor(
    private prisma: PrismaClient,
    private service = new GroupService(prisma),
    private itemService = new GroupItemService(prisma),
  ) {}

  static readonly idSchema = yup.object({
    id: yup.string().required(),
  })

  static readonly searchGroupSchema = yup.object({
    name: yup.string().optional(),
    featureId: yup.string().optional(),
  })

  readonly create = async (req: Request, res: Response, next: NextFunction) => {
    const body = await GroupService.createSchema.validate(req.body)
    const data = await this.service.create(body)
    res.send(data)
  }

  readonly update = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = await ControllerGroup.idSchema.validate(req.params)
    const body = await GroupService.updateSchema.validate(req.body)
    const data = await this.service.update(id, body)
    res.send(data)
  }

  readonly remove = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = await ControllerGroup.idSchema.validate(req.params)
    await this.service.remove(id)
    res.send()
  }

  readonly searchWithItems = async (req: Request, res: Response, next: NextFunction) => {
    const filters = await ControllerGroup.searchGroupSchema.validate(req.body)
    const data = await this.service.search(filters)
    res.send(data)
  }

  readonly getMine = async (req: Request, res: Response, next: NextFunction) => {
    const groups = await this.service.search({user: req.session.user})
    res.send(groups)
  }

  readonly createItem = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = await ControllerGroup.idSchema.validate(req.params)
    const body = await GroupItemService.createSchema.validate(req.body)
    const data = await this.itemService.create(id, body)
    res.send(data)
  }

  readonly updateItem = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = await ControllerGroup.idSchema.validate(req.params)
    const body = await GroupItemService.updateSchema.validate(req.body)
    const data = await this.itemService.update(id, body)
    res.send(data)
  }

  readonly removeItem = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = await ControllerGroup.idSchema.validate(req.params)
    await this.itemService.remove(id)
    res.send()
  }

  readonly getItems = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = await ControllerGroup.idSchema.validate(req.params)
    const qs = await AccessService.searchSchema.validate(req.query)
    const data = await this.itemService.getAll({groupId: id})
    res.send(data)
  }
}
