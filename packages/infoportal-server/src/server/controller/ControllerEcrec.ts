import type {PrismaClient} from '@prisma/client'
import type {Request, Response} from 'express'

import {EcrecDbService} from '../../feature/ecrec/EcrecDbService'
import {EcrecCachedDb} from '../../feature/ecrec/EcrecCachedDb'

export class ControllerEcrec {
  constructor(
    private prisma: PrismaClient,
    private cache: EcrecCachedDb = EcrecCachedDb.constructSingleton(prisma),
    private service: EcrecDbService = new EcrecDbService(prisma),
  ) {}

  readonly refresh = async (_request: Request, response: Response) => {
    await this.cache.refresh()
    response.send()
  }

  readonly search = async (req: Request, res: Response) => {
    const data = await this.service.search()

    res.send(data)
  }
}
