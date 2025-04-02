import {PrismaClient} from '@prisma/client'
import {KoboMetaParams, KoboMetaService} from '../../feature/kobo/meta/KoboMetaService.js'
import {NextFunction, Request, Response} from 'express'
import {app, AppCacheKey} from '../../index.js'
import {ApiPaginateHelper} from 'infoportal-common'

export class ControllerKoboMeta {
  constructor(
    private prisma: PrismaClient,
    private service = new KoboMetaService(prisma),
    private cache = app.cache,
  ) {}

  readonly search = async (req: Request, res: Response, next: NextFunction) => {
    const body = await KoboMetaParams.schemaSearchFilter.validate(req.body)
    const data = await this.service.search(body)
    res.send(ApiPaginateHelper.wrap()(data))
  }

  readonly sync = async (req: Request, res: Response, next: NextFunction) => {
    await this.service.syncAll()
    res.send()
  }

  readonly killCache = async (req: Request, res: Response, next: NextFunction) => {
    this.cache.clear(AppCacheKey.Meta)
    res.send()
  }
}
