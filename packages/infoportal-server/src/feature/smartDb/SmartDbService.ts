import {PrismaClient} from '@prisma/client'
import {Ip} from 'infoportal-api-sdk'
import {PrismaHelper} from '../../core/PrismaHelper.js'

export class SmartDbService {
  constructor(private prisma: PrismaClient) {}

  readonly create = ({name, workspaceId, category}: Ip.SmartDb.Payload.Create): Promise<Ip.SmartDb> => {
    return this.prisma.smartDb
      .create({
        data: {
          name,
          workspaceId,
          category,
        },
      })
      .then(PrismaHelper.mapSmartDb)
  }

  readonly getAll = ({workspaceId}: {workspaceId: Ip.WorkspaceId}): Promise<Ip.SmartDb[]> => {
    return this.prisma.smartDb.findMany({where: {workspaceId}}).then(_ => _.map(PrismaHelper.mapSmartDb))
  }
}
