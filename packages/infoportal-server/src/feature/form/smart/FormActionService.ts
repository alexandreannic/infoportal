import {PrismaClient} from '@prisma/client'
import {HttpError, Ip} from 'infoportal-api-sdk'
import {PrismaHelper} from '../../../core/PrismaHelper.js'

export class FormActionService {
  constructor(private prisma: PrismaClient) {}

  readonly create = ({
    workspaceId,
    ...data
  }: Ip.Form.Action.Payload.Create & {createdBy: Ip.User.Email}): Promise<Ip.Form.Action> => {
    if (data.formId === data.sourceFormId) {
      throw new HttpError.BadRequest(`A form action cannot reference itself.`)
    }
    return this.prisma.formSmartAction
      .create({
        data,
      })
      .then(PrismaHelper.mapFormAction)
  }

  readonly getByFormSmartId = ({formId}: {formId: Ip.FormId}): Promise<Ip.Form.Action[]> => {
    return this.prisma.formSmartAction.findMany({where: {formId}}).then(_ => _.map(PrismaHelper.mapFormAction))
  }
}
