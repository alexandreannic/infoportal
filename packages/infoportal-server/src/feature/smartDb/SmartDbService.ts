import {PrismaClient} from '@prisma/client'
import {Ip} from 'infoportal-api-sdk'
import {PrismaHelper} from '../../core/PrismaHelper.js'

export class SmartDbService {
  constructor(private prisma: PrismaClient) {}

  readonly create = (data: Ip.SmartDb.Payload.Create & {createdBy: Ip.User.Email}): Promise<Ip.SmartDb> => {
    return this.prisma.smartDb
      .create({
        data,
      })
      .then(PrismaHelper.mapSmartDb)
  }

  readonly getAll = ({workspaceId}: {workspaceId: Ip.WorkspaceId}): Promise<Ip.SmartDb[]> => {
    return this.prisma.smartDb.findMany({where: {workspaceId}}).then(_ => _.map(PrismaHelper.mapSmartDb))
  }
}
