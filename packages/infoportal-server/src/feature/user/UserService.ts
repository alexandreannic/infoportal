import {Prisma, PrismaClient} from '@prisma/client'
import {app, AppCacheKey, AppLogger} from '../../index.js'
import {DrcOffice} from 'infoportal-common'

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

  private async loadUsersCache(): Promise<Prisma.UserCreateInput[]> {
    if (!this.cache.get(AppCacheKey.Users)) {
      this.log.info('Load users from database')
      const request = this.prisma.user.findMany({
        orderBy: {lastConnectedAt: 'desc'},
        select: {
          id: true,
          accessToken: true,
          activities: false,
          admin: true,
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
      this.cache.set({key: AppCacheKey.Users, value: request})
      return request
    }
    return this.cache.get(AppCacheKey.Users) as any
  }

  readonly getAll = async () => {
    return this.loadUsersCache()
  }

  readonly getUserByEmail = async (email: string) => {
    const cache = await this.loadUsersCache()
    let user = cache.find((user) => user.email === email)
    if (!user) {
      user = await this.prisma.user.findUnique({where: {email}}).then((_) => _ ?? undefined)
      if (user) {
        cache.push(user!)
      }
    }
    return user
  }

  readonly getUserAvatarByEmail = async (email: string): Promise<Buffer | undefined> => {
    return this.getUserByEmail(email).then((_) => (_?.avatar ? Buffer.from(_.avatar) : undefined))
  }

  readonly update = async ({email, drcOffice}: {email: string; drcOffice?: DrcOffice}) => {
    const updatedUser = await this.prisma.user.update({
      where: {email},
      data: {drcOffice},
    })
    this.cache.set({
      key: AppCacheKey.Users,
      value: this.loadUsersCache().then((_) => _.map((_) => (_.email === email ? updatedUser : _))),
    })
    return updatedUser
  }

  readonly getDistinctDrcJobs = async (): Promise<string[]> => {
    const drcJobs = await this.prisma.user.findMany({
      select: {drcJob: true},
      distinct: ['drcJob'],
      where: {drcJob: {not: null}},
    })
    return drcJobs.map((job) => job.drcJob!)
  }
}
