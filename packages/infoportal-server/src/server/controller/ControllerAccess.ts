import {NextFunction, Request, Response} from 'express'
import {FeatureAccessLevel, PrismaClient} from '@prisma/client'
import {AccessService} from '../../feature/access/AccessService'
import {controllerSchema} from './Controller'
import {yup} from '../../helper/Utils'
import {DrcOffice} from 'infoportal-common'
import {Obj} from '@alexandreannic/ts-utils'
import {AppFeatureId} from '../../feature/access/AccessType'

export class ControllerAccess {
  constructor(
    private prisma: PrismaClient,
    private service = new AccessService(prisma),
  ) {}

  static readonly schema = (() => {
    const drcOffice = yup.mixed<DrcOffice>().oneOf(Obj.values(DrcOffice))
    const drcJob = yup.string().required() //yup.mixed<DrcJob>().oneOf(Obj.values(DrcJob)),
    const level = yup.mixed<FeatureAccessLevel>().oneOf(Obj.values(FeatureAccessLevel)).required()
    const featureId = yup.mixed<AppFeatureId>().oneOf(Obj.values(AppFeatureId))
    return {
      drcOffice,
      drcJob,
      level,
      featureId,
      create: yup.object({
        featureId: featureId,
        level: level,
        drcOffice: drcOffice.optional().nullable(),
        drcJob: yup.array().of(drcJob).optional().nullable(),
        email: yup.string().optional().nullable(),
        groupId: yup.string().optional().nullable(),
        params: yup.mixed().optional().nullable(),
      }),
      update: yup.object({
        level: yup.mixed<FeatureAccessLevel>().oneOf(Obj.values(FeatureAccessLevel)),
        drcJob: yup.string(), //yup.mixed<DrcJob>().oneOf(Obj.values(DrcJob)),
        drcOffice: yup.mixed<DrcOffice>().oneOf(Obj.values(DrcOffice)),
      }),
      search: yup.object({
        featureId: yup.mixed<AppFeatureId>().oneOf(Obj.values(AppFeatureId)),
      }),
    }
  })()

  readonly create = async (req: Request, res: Response, next: NextFunction) => {
    const body = await ControllerAccess.schema.create.validate(req.body)
    const data = await this.service.create(body)
    res.send(data)
  }

  readonly update = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = await controllerSchema.id.validate(req.params)
    const body = await ControllerAccess.schema.update.validate(req.body)
    const data = await this.service.update(id, body)
    res.send(data)
  }

  readonly remove = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = await controllerSchema.id.validate(req.params)
    await this.service.remove(id)
    res.send()
  }

  readonly search = async (req: Request, res: Response, next: NextFunction) => {
    const qs = await ControllerAccess.schema.search.validate(req.query)
    const data = await this.service.searchForUser(qs)
    res.send(data)
  }

  readonly searchMine = async (req: Request, res: Response, next: NextFunction) => {
    const qs = await ControllerAccess.schema.search.validate(req.query)
    const data = await this.service.searchForUser({...qs, user: req.session.user})
    res.send(data)
  }
}
