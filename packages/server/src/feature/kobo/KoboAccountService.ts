import {PrismaClient} from '@infoportal/prisma'
import {Api} from '@infoportal/api-sdk'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'

export class KoboAccountService {
  constructor(private prisma: PrismaClient) {}

  readonly get = ({id, workspaceId}: {id: Api.ServerId; workspaceId: Api.WorkspaceId}) => {
    return this.prisma.koboServer
      .findFirst({where: {id, workspaceId}})
      .then(_ => (_ ? prismaMapper.form.mapServer(_) : undefined))
  }

  readonly getAll = ({workspaceId}: {workspaceId: Api.WorkspaceId}): Promise<Api.Server[]> => {
    return this.prisma.koboServer.findMany({where: {workspaceId}}).then(_ => _.map(prismaMapper.form.mapServer))
  }

  readonly create = ({workspaceId, ...payload}: Omit<Api.Server, 'id'>): Promise<Api.Server> => {
    return this.prisma.koboServer
      .create({
        data: {workspaceId: workspaceId, ...payload},
      })
      .then(prismaMapper.form.mapServer)
  }

  readonly delete = async ({id}: {id: Api.ServerId}) => {
    await this.prisma.koboServer.delete({
      where: {id},
    })
  }
}
