import {PrismaClient} from '@prisma/client'
import {UUID} from 'infoportal-common'
import {app, AppLogger} from '../../index.js'
import {Ip} from 'infoportal-api-sdk'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'

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
    return this.prisma.user
      .findMany({
        where: {
          workspaceAccess: {
            some: {workspaceId},
          },
        },
        orderBy: {lastConnectedAt: 'desc'},
        select: {
          id: true,
          accessLevel: true,
          createdAt: true,
          email: true,
          lastConnectedAt: true,
          name: true,
          location: true,
          job: true,
          accessToken: false,
          activities: false,
          avatar: false,
        },
      })
      .then(_ => _.map(prismaMapper.access.mapUser))
  }

  readonly getUserByEmail = async (email: Ip.User.Email) => {
    return this.prisma.user.findUnique({where: {email}}).then(_ => _ ?? undefined)
  }

  readonly getUserAvatarByEmail = async (email: Ip.User.Email): Promise<Buffer | undefined> => {
    return this.getByEmail(email).then(_ => (_?.avatar ? Buffer.from(_.avatar) : undefined))
  }

  readonly updateByEmail = ({
    email,
    ...data
  }: Omit<Ip.User.Payload.Update, 'id' | 'workspaceId'> & {email: Ip.User.Email}) => {
    return this.prisma.user
      .update({
        where: {email},
        data: data,
      })
      .then(prismaMapper.access.mapUser)
  }

  readonly updateByUserId = ({workspaceId, id, ...data}: Ip.User.Payload.Update) => {
    return this.prisma.user
      .update({
        where: {id},
        data: data,
      })
      .then(prismaMapper.access.mapUser)
  }

  readonly getDistinctJobs = async ({workspaceId}: {workspaceId: Ip.WorkspaceId}): Promise<string[]> => {
    const jobs = await this.prisma.user.findMany({
      select: {job: true},
      distinct: ['job'],
      where: {workspaceAccess: {some: {workspaceId}}, job: {not: null}},
    })
    return jobs.map(job => job.job!)
  }

  readonly getByEmail = (email: Ip.User.Email): Promise<Ip.User | undefined> => {
    return this.prisma.user.findFirst({where: {email}}).then(_ => (_ ? prismaMapper.access.mapUser(_) : undefined))
  }
}
