import {NextFunction, Request, Response} from 'express'
import * as yup from 'yup'
import {ObjectSchema} from 'yup'
import {PrismaClient} from '@prisma/client'
import {FormAnswersService} from '../../../feature/form/answers/FormAnswersService.js'
import {Period} from 'infoportal-common'
import {validateApiPaginate} from '../../../core/Type.js'
import {Kobo} from 'kobo-sdk'
import {Obj} from '@axanc/ts-utils'
import {app} from '../../../index.js'
import {getWorkspaceId, isAuthenticated} from '../../Routes.js'
import {AppError} from '../../../helper/Errors.js'
import {Ip} from 'infoportal-api-sdk'

export interface KoboAnswersFilters extends Partial<Period> {
  ids?: Kobo.FormId[]
  filterBy?: {
    column: string
    value: (string | null | undefined)[]
    type?: 'array'
  }[]
}

const answersFiltersValidation: ObjectSchema<KoboAnswersFilters> = yup.object({
  start: yup.date().optional(),
  end: yup.date().optional(),
  ids: yup.array().of(yup.string().required()).optional(),
  filterBy: yup.array(
    yup.object({
      column: yup.string().required(),
      value: yup.array().of(yup.string().nullable().optional()).required(),
      type: yup.mixed<'array'>().oneOf(['array']).optional(),
    }),
  ),
})

export class ControllerKoboAnswer {
  constructor(
    private pgClient: PrismaClient,
    private log = app.logger('ControllerKoboAnswer'),
    private service = new FormAnswersService(pgClient),
  ) {}

  readonly updateAnswers = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.session.app?.user.email ?? 'unknown'
    const params = await yup
      .object({
        formId: yup.string().required(),
      })
      .validate(req.params)
    const body = await yup
      .object({
        answerIds: yup.array().of(yup.string().required()).required(),
        question: yup.string().required(),
        answer: yup.mixed<any>().nullable(),
      })
      .validate(req.body)
    const data = await this.service.updateAnswers({...params, ...body, authorEmail: email})
    res.send(data)
  }

  readonly updateValidation = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.session.app?.user.email ?? 'unknown'
    const params = await yup
      .object({
        formId: yup.string().required(),
      })
      .validate(req.params)
    const body = await yup
      .object({
        answerIds: yup.array().of(yup.string().required()).required(),
        status: yup.mixed<Ip.Submission.Validation>().oneOf(Obj.values(Ip.Submission.Validation)).required(),
      })
      .validate(req.body)
    const data = await this.service.updateValidation({...params, ...body, authorEmail: email})
    res.send()
  }

  readonly deleteAnswers = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.session.app?.user.email ?? 'unknown'
    const {formId} = await yup
      .object({
        formId: yup.string().required(),
      })
      .validate(req.params)
    const answerIds = await yup.array().of(yup.string().required()).required().validate(req.body.answerIds)
    await this.service.deleteAnswers({formId, answerIds, authorEmail: email})
    res.send()
  }

  readonly searchByUserAccess = async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticated(req)) throw new AppError.Forbidden()
    const workspaceId = getWorkspaceId(req)
    const {formId} = req.params
    const user = req.session.app.user
    const filters = await answersFiltersValidation.validate(req.body)
    const paginate = await validateApiPaginate.validate(req.body)
    const answers = await this.service.searchAnswersByUsersAccess({workspaceId, formId, filters, paginate, user})
    res.send(answers)
  }
}
