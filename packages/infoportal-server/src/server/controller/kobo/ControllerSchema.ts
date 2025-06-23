import {NextFunction, Request, Response} from 'express'
import {PrismaClient} from '@prisma/client'
import {app} from '../../../index.js'
import {AppError} from '../../../helper/Errors.js'
import {SchemaService} from '../../../feature/kobo/SchemaService.js'
import {isAuthenticated} from '../../Routes.js'
import {SchemaParser} from '../../../feature/kobo/SchemaParser.js'

export class ControllerSchema {
  constructor(
    private prisma: PrismaClient,
    private service = new SchemaService(prisma),
    private log = app.logger('ControllerSchema'),
  ) {}

  readonly validateXlsForm = async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticated(req)) throw new AppError.Forbidden()
    if (!req.file) {
      return next(new AppError.NoFileUploaded('No file was uploaded'))
    }
    const data = await SchemaParser.validateXls(req.file.path)
    res.send(data)
  }

  readonly uploadXlsForm = async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticated(req)) throw new AppError.Forbidden()
    if (!req.file) {
      return next(new AppError.NoFileUploaded('No file was uploaded'))
    }
    const {formId} = await SchemaService.schema.formId.validate(req.params)
    const data = await this.service.upload({uploadedBy: req.session.app.user.email, formId, file: req.file})
    res.send(data)
  }

  readonly updateVersion = async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticated(req)) throw new AppError.Forbidden()
  }

  readonly get = async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticated(req)) throw new AppError.Forbidden()
    const {formId} = await SchemaService.schema.formId.validate(req.params)
    const data = await this.service.get({formId})
    res.send(data)
  }
}
