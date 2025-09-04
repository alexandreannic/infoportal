import {PrismaClient} from '@prisma/client'
import {Ip} from 'infoportal-api-sdk'

export class SmartDbService {
  constructor(private prisma: PrismaClient) {}

  readonly create = ({name, workspaceId, category}: Ip.SmartDb.Payload.Create): Promise<Ip.SmartDb> => {
    return this.prisma.smartDb.create({
      data: {
        name,
        workspaceId,
        category,
      },
    })
  }

  readonly getAll = ({workspaceId}: {workspaceId: Ip.WorkspaceId}): Promise<Ip.SmartDb[]> => {
    return this.prisma.smartDb.findMany({where: {workspaceId}})
  }
}
