import {PrismaClient} from '@prisma/client'
import {Ip} from 'infoportal-api-sdk'
import {PrismaHelper} from '../../core/PrismaHelper.js'

export class SmartDbActionService {
  constructor(private prisma: PrismaClient) {}

  readonly create = ({
    workspaceId,
    ...data
  }: Ip.SmartDb.Payload.ActionCreate & {createdBy: Ip.User.Email}): Promise<Ip.SmartDb.Action> => {
    return this.prisma.smartDbAction
      .create({
        data,
      })
      .then(PrismaHelper.mapSmartDbAction)
  }

  readonly getByDatabaseId = ({smartDbId}: {smartDbId: Ip.SmartDbId}): Promise<Ip.SmartDb.Action[]> => {
    return this.prisma.smartDbAction.findMany({where: {smartDbId}}).then(_ => _.map(PrismaHelper.mapSmartDbAction))
  }
}
