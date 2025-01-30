import type {PrismaClient} from '@prisma/client'
import type {Request, Response} from 'express'

import {EcrecDbService} from '../../feature/ecrec/EcrecDbService'
import {app, AppCacheKey} from '../../index'

export class ControllerEcrec {
  constructor(
    private prisma: PrismaClient,
    private cache = app.cache,
    private service: EcrecDbService = new EcrecDbService(prisma),
  ) {}

  readonly search = async (req: Request, res: Response) => {
    const data = await this.service.search()

    res.send(data)
  }
}
