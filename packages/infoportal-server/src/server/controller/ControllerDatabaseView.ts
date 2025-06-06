import {DatabaseViewColVisibility, DatabaseViewVisibility, PrismaClient} from '@prisma/client'
import {yup} from '../../helper/Utils.js'
import {NextFunction, Request, Response} from 'express'
import {DatabaseView} from '../../feature/databaseView/DatabaseView.js'

const schema = {
  id: yup.string().required(),
  view: {
    databaseId: yup.string().required(),
    name: yup.string().required(),
    visibility: yup.string<DatabaseViewVisibility>().default(DatabaseViewVisibility.Private),
  },
  viewCol: {
    name: yup.string().required(),
    width: yup.number().required(),
    visibility: yup.mixed<DatabaseViewColVisibility>(),
  },
}

export class ControllerDatabaseView {
  constructor(
    private prisma: PrismaClient,
    private service = new DatabaseView(prisma),
  ) {}

  readonly search = async (req: Request, res: Response, next: NextFunction) => {
    const body = await yup
      .object({
        databaseId: yup.string().optional(),
      })
      .validate(req.body)
    const data = await this.service.search({...body, email: req.session.user?.email})
    res.send(data)
  }

  readonly create = async (req: Request, res: Response, next: NextFunction) => {
    const body = await yup
      .object({
        name: schema.view.name,
        databaseId: schema.view.databaseId,
        visibility: schema.view.visibility,
      })
      .validate(req.body)
    const data = await this.service.create({
      createdBy: req.session.user?.email,
      createdAt: new Date(),
      ...body,
    })
    res.send(data)
  }

  readonly update = async (req: Request, res: Response, next: NextFunction) => {
    const id = await schema.id.validate(req.params.id)
    const body = await yup
      .object({
        visibility: schema.view.visibility,
      })
      .validate(req.body)
    const data = await this.service.update({id, ...body})
    res.send(data)
  }

  readonly delete = async (req: Request, res: Response, next: NextFunction) => {
    const id = await schema.id.validate(req.params.viewId)
    await this.service.delete(id)
    res.send()
  }

  readonly updateCol = async (req: Request, res: Response, next: NextFunction) => {
    const params = await yup
      .object({
        viewId: schema.id.required(),
        colName: schema.id.required(),
      })
      .validate(req.params)
    const body = await yup
      .object({
        width: schema.viewCol.width.optional(),
        visibility: schema.viewCol.visibility.optional(),
      })
      .validate(req.body)
    const data = await this.service.updateCol({
      viewId: params.viewId,
      updatedBy: req.session.user?.email,
      body: {...body, name: params.colName},
    })
    res.send(data)
  }
}
