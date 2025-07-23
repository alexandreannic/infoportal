import {NextFunction, Request, Response} from 'express'
import {PrismaClient} from '@prisma/client'
import {SubmissionHistoryService} from '../../../feature/form/history/SubmissionHistoryService.js'
import {KoboAnswerHistoryHelper} from '../../../feature/form/history/SubmissionHistoryType.js'

export class ControllerKoboAnswerHistory {
  constructor(
    private prisma: PrismaClient,
    private service = new SubmissionHistoryService(prisma),
  ) {}

  readonly search = async (req: Request, res: Response, next: NextFunction) => {
    const body = await KoboAnswerHistoryHelper.validation.search.validate(req.body)
    const data = await this.service.search(body)
    res.send(data)
  }
}
