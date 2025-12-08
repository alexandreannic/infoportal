import {PrismaClient} from '@infoportal/prisma'
import {Api} from '@infoportal/api-sdk'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'

export class KoboAccountService {
  constructor(private prisma: PrismaClient) {}

  readonly get = ({id, workspaceId}: {id: Api.Kobo.AccountId; workspaceId: Api.WorkspaceId}) => {
    return this.prisma.koboAccount
      .findFirst({where: {id, workspaceId}})
      .then(_ => (_ ? prismaMapper.form.mapServer(_) : undefined))
  }

  readonly getAll = ({workspaceId}: {workspaceId: Api.WorkspaceId}): Promise<Api.Kobo.Account[]> => {
    return this.prisma.koboAccount.findMany({where: {workspaceId}}).then(_ => _.map(prismaMapper.form.mapServer))
  }

  readonly create = ({workspaceId, ...payload}: Omit<Api.Kobo.Account, 'id'>): Promise<Api.Kobo.Account> => {
    return this.prisma.koboAccount
      .create({
        data: {workspaceId: workspaceId, ...payload},
      })
      .then(prismaMapper.form.mapServer)
  }

  readonly delete = async ({id}: {id: Api.Kobo.AccountId}) => {
    await this.prisma.koboAccount.delete({
      where: {id},
    })
  }
}
