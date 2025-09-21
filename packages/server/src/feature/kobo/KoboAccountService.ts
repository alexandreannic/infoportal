import {PrismaClient} from '@prisma/client'
import {Ip} from 'infoportal-api-sdk'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'

export class KoboAccountService {
  constructor(private prisma: PrismaClient) {}

  readonly get = ({id, workspaceId}: {id: Ip.ServerId; workspaceId: Ip.WorkspaceId}) => {
    return this.prisma.koboServer
      .findFirst({where: {id, workspaceId}})
      .then(_ => (_ ? prismaMapper.form.mapServer(_) : undefined))
  }

  readonly getAll = ({workspaceId}: {workspaceId: Ip.WorkspaceId}): Promise<Ip.Server[]> => {
    return this.prisma.koboServer.findMany({where: {workspaceId}}).then(_ => _.map(prismaMapper.form.mapServer))
  }

  readonly create = ({workspaceId, ...payload}: Omit<Ip.Server, 'id'>): Promise<Ip.Server> => {
    return this.prisma.koboServer
      .create({
        data: {workspaceId: workspaceId, ...payload},
      })
      .then(prismaMapper.form.mapServer)
  }

  readonly delete = async ({id}: {id: Ip.ServerId}) => {
    await this.prisma.koboServer.delete({
      where: {id},
    })
  }
}
