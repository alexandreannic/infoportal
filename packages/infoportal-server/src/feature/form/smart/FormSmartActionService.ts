import {PrismaClient} from '@prisma/client'
import {HttpError, Ip} from 'infoportal-api-sdk'
import {PrismaHelper} from '../../../core/PrismaHelper.js'

export class FormSmartActionService {
  constructor(private prisma: PrismaClient) {}

  readonly create = ({
    workspaceId,
    ...data
  }: Ip.Form.Smart.Payload.ActionCreate & {createdBy: Ip.User.Email}): Promise<Ip.Form.Smart.Action> => {
    if (data.smartId === (data.sourceFormId as unknown as Ip.Form.SmartId)) {
      throw new HttpError.BadRequest(`A Smart form cannot reference itself.`)
    }
    return this.prisma.formSmartAction
      .create({
        data,
      })
      .then(PrismaHelper.mapFormSmartAction)
  }

  readonly getByFormSmartId = ({smartId}: {smartId: Ip.Form.SmartId}): Promise<Ip.Form.Smart.Action[]> => {
    return this.prisma.formSmartAction.findMany({where: {smartId}}).then(_ => _.map(PrismaHelper.mapFormSmartAction))
  }
}
