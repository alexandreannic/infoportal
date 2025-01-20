import {Request, Response, NextFunction} from 'express'
import {AppError} from '../../../helper/Errors'
import {ImportService} from '../../../feature/kobo/ImportService'
import {PrismaClient} from '@prisma/client'
import {yup} from '../../../helper/Utils'

export class ControllerKoboApiXlsImport {
  constructor(
    private prisma: PrismaClient,
    private service = new ImportService(prisma),
  ) {}

  static readonly schema = {
    upload: yup.object({
      action: yup.string().oneOf(['create', 'update']).required(),
    }),
  }

  readonly handleFileUpload = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next(new AppError.NoFileUploaded('No file was uploaded'))
    }
    const action = await ControllerKoboApiXlsImport.schema.upload.validate(req.query)
    const formId: string = req.params.formId
    // const action = req.query.action
    if (action === 'create') {
      await this.service.processData(formId, req.file.path, 'create')
    } else {
      await this.service.processData(formId, req.file.path, 'update')
    }
    res.send({})
  }
}
