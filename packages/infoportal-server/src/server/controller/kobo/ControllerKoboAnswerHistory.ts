import {NextFunction, Request, Response} from 'express'
import {PrismaClient} from '@prisma/client'
import {FormAnswerHistoryService} from '../../../feature/form/history/FormAnswerHistoryService.js'
import {KoboAnswerHistoryHelper} from '../../../feature/form/history/FormAnswerHistoryType.js'

export class ControllerKoboAnswerHistory {
  constructor(
    private prisma: PrismaClient,
    private service = new FormAnswerHistoryService(prisma),
  ) {}

  readonly search = async (req: Request, res: Response, next: NextFunction) => {
    const body = await KoboAnswerHistoryHelper.validation.search.validate(req.body)
    const data = await this.service.search(body)
    res.send(data)
  }
}
