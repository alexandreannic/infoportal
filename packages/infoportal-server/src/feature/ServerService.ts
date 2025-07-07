import {PrismaClient} from '@prisma/client'
import {Ip} from 'infoportal-api-sdk'

export class ServerService {
  constructor(private prisma: PrismaClient) {}

  readonly get = ({id, workspaceId}: {id: Ip.Uuid; workspaceId: Ip.Uuid}) => {
    return this.prisma.koboServer.findFirst({where: {id, workspaceId}}).then(_ => _ ?? undefined)
  }

  readonly getAll = ({workspaceId}: {workspaceId: Ip.Uuid}) => {
    return this.prisma.koboServer.findMany({where: {workspaceId}})
  }

  readonly create = ({workspaceId, ...payload}: Omit<Ip.Server, 'id'>) => {
    return this.prisma.koboServer.create({
      data: {workspaceId: workspaceId, ...payload},
    })
  }

  readonly delete = async ({id}: {id: Ip.Uuid}) => {
    await this.prisma.koboServer.delete({
      where: {id},
    })
  }
}
