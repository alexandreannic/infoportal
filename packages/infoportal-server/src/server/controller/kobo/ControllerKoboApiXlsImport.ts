import {Request, Response, NextFunction} from 'express'
import {AppError} from '../../../helper/Errors.js'
import {ImportService} from '../../../feature/kobo/ImportService.js'
import {PrismaClient} from '@prisma/client'

export class ControllerKoboApiXlsImport {
  constructor(
    private prisma: PrismaClient,
    private service = new ImportService(prisma),
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
