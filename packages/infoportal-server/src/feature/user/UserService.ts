import {PrismaClient} from '@prisma/client'
import {UUID} from 'infoportal-common'
import {app, AppLogger} from '../../index.js'

export class UserService {
  private static instance: UserService

  private constructor(
    private prisma: PrismaClient,
    private cache = app.cache,
    private log: AppLogger = app.logger('UserService'),
  ) {}

  public static getInstance(
    prisma: PrismaClient,
    cache = app.cache,
    log: AppLogger = app.logger('UserService'),
  ): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService(prisma, cache, log)
    }
    return UserService.instance
  }

  readonly getAll = async ({workspaceId}: {workspaceId: UUID}) => {
    return this.prisma.user.findMany({
      where: {
        workspaceAccess: {
          some: {workspaceId},
        },
      },
      orderBy: {lastConnectedAt: 'desc'},
      select: {
        id: true,
        accessToken: true,
        activities: false,
        accessLevel: true,
        avatar: false,
        createdBy: true,
        createdAt: true,
        drcOffice: true,
        drcJob: true,
        email: true,
        lastConnectedAt: true,
        name: true,
        officer: true,
      },
    })
  }

  readonly getUserByEmail = async (email: string) => {
    return this.prisma.user.findUnique({where: {email}}).then(_ => _ ?? undefined)
  }

  readonly getUserAvatarByEmail = async (email: string): Promise<Buffer | undefined> => {
    return this.getUserByEmail(email).then(_ => (_?.avatar ? Buffer.from(_.avatar) : undefined))
  }

  readonly update = async ({email, drcOffice}: {email: string; drcOffice?: string}) => {
    const updatedUser = await this.prisma.user.update({
      where: {email},
      data: {drcOffice},
    })
    return updatedUser
  }

  readonly getDistinctDrcJobs = async (): Promise<string[]> => {
    const drcJobs = await this.prisma.user.findMany({
      select: {drcJob: true},
      distinct: ['drcJob'],
      where: {drcJob: {not: null}},
    })
    return drcJobs.map(job => job.drcJob!)
  }
}
