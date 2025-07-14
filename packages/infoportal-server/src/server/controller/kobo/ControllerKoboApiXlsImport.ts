import {NextFunction, Request, Response} from 'express'
import {AppError} from '../../../helper/Errors.js'
import {PrismaClient} from '@prisma/client'
import {FormAnswersImportService} from '../../../feature/form/answers/FormAnswersImportService.js'

export class ControllerKoboApiXlsImport {
  constructor(
    private prisma: PrismaClient,
    private service = new FormAnswersImportService(prisma),
  ) {}

  readonly handleFileUpload = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next(new AppError.NoFileUploaded('No file was uploaded'))
    }
    const formId: string = req.params.formId
    const action = req.query.action
    if (action === 'create') {
      await this.service.processData(formId, req.file.path, 'create')
    } else {
      await this.service.processData(formId, req.file.path, 'update')
    }
    res.send({})
  }
}
