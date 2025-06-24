import {NextFunction, Request, Response} from 'express'
import {PrismaClient} from '@prisma/client'
import {app} from '../../../index.js'
import {AppError} from '../../../helper/Errors.js'
import {FormVersionService} from '../../../feature/kobo/FormVersionService.js'
import {isAuthenticated} from '../../Routes.js'
import {XlsFormParser} from '../../../feature/kobo/XlsFormParser.js'

export class ControllerFormVersion {
  constructor(
    private prisma: PrismaClient,
    private service = new FormVersionService(prisma),
    private log = app.logger('ControllerSchema'),
  ) {}

  readonly validateXlsForm = async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticated(req)) throw new AppError.Forbidden()
    if (!req.file) {
      return next(new AppError.NoFileUploaded('No file was uploaded'))
    }
    const data = await XlsFormParser.validateAndParse(req.file.path)
    res.send(data)
  }

  readonly uploadXlsForm = async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticated(req)) throw new AppError.Forbidden()
    const {formId} = await FormVersionService.schema.formId.validate(req.params)
    const data = await this.service.upload({uploadedBy: req.session.app.user.email, formId, file: req.file})
    res.send(data)
  }

  readonly updateVersion = async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticated(req)) throw new AppError.Forbidden()
  }

  readonly getByFormId = async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticated(req)) throw new AppError.Forbidden()
    const {formId} = await FormVersionService.schema.formId.validate(req.params)
    const data = await this.service.getVersions({formId})
    res.send(data)
  }

  readonly getSchema = async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticated(req)) throw new AppError.Forbidden()
    const {formId, versionId} = await FormVersionService.schema.versionId.validate(req.params)
    const data = await this.service.getSchema({formId, versionId})
    res.send(data)
  }
}
