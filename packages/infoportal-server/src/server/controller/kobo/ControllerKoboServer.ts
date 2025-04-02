import {NextFunction, Request, Response} from 'express'
import {PrismaClient} from '@prisma/client'
import {KoboService} from '../../../feature/kobo/KoboService.js'

export class ControllerKoboServer {
  constructor(
    private pgClient: PrismaClient,
    private service = new KoboService(pgClient),
  ) {}

  readonly getServers = async (req: Request, res: Response, next: NextFunction) => {
    const servers = await this.pgClient.koboServer.findMany()
    res.send(servers)
  }
}
