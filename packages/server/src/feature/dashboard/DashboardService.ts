import {PrismaClient} from '@prisma/client'
import {slugify} from 'infoportal-common'
import {genShortid} from '../../helper/Utils.js'
import {Ip} from 'infoportal-api-sdk'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'

export class DashboardService {
  constructor(private prisma: PrismaClient) {}

  readonly getById = async ({id}: {id: Ip.DashboardId}): Promise<Ip.Dashboard | undefined> => {
    return this.prisma.dashboard
      .findUnique({where: {id, deletedAt: null}})
      .then(_ => (_ ? prismaMapper.dashboard.mapDashboard(_) : undefined))
  }
  readonly getAll = async ({workspaceId}: {workspaceId: Ip.WorkspaceId}): Promise<Ip.Dashboard[]> => {
    return this.prisma.dashboard
      .findMany({
        where: {workspaceId, deletedAt: null},
      })
      .then(_ =>
        _.map(_ => {
          return prismaMapper.dashboard.mapDashboard({..._, isPublished: !!_.publishedId})
        }),
      )
  }

  readonly update = async ({id, workspaceId, filters, ...data}: Ip.Dashboard.Payload.Update): Promise<Ip.Dashboard> => {
    return this.prisma.dashboard
      .update({
        where: {id},
        data: {
          ...data,
          filters: filters as any,
        },
      })
      .then(prismaMapper.dashboard.mapDashboard)
  }

  readonly publish = async ({
    id,
    workspaceId,
    publishedBy,
  }: Ip.Dashboard.Payload.Publish & {publishedBy: Ip.User.Email}) => {
    const dashboard = await this.prisma.dashboard.findFirstOrThrow({where: {id}, select: {id: true, publishedId: true}})
    const snapshot = await this.prisma.dashboardSection.findMany({
      select: {title: true, description: true, widgets: true},
    })
    if (dashboard?.publishedId) await this.prisma.dashboardPublished.delete({where: {id: dashboard.publishedId}})
    await this.prisma.dashboardPublished.create({
      data: {snapshot, publishedBy, dashboard: {connect: {id: dashboard.id}}},
    })
  }

  readonly remove = async ({
    id,
    workspaceId,
    deletedBy,
  }: Ip.Dashboard.Payload.Delete & {deletedBy: Ip.User.Email}): Promise<void> => {
    await this.prisma.dashboard.update({
      where: {id},
      data: {
        deletedBy,
        deletedAt: new Date(),
      },
    })
  }

  readonly create = async (data: Ip.Dashboard.Payload.Create & {createdBy: Ip.User.Email}): Promise<Ip.Dashboard> => {
    return this.prisma.dashboard
      .create({
        data: {
          ...data,
          deploymentStatus: 'draft',
        },
      })
      .then(prismaMapper.dashboard.mapDashboard)
  }

  readonly checkSlug = async (name: string) => {
    const suggestedSlug = await this.getUniqSlug(name)
    return {
      isFree: name === suggestedSlug,
      suggestedSlug,
    }
  }

  private readonly getUniqSlug = async (name: string) => {
    const baseSlug = slugify(name)
    const existingSlugs = await this.prisma.workspace
      .findMany({
        select: {slug: true},
        where: {
          slug: {startsWith: baseSlug},
        },
      })
      .then(_ => _.map(_ => _.slug))

    let slug = baseSlug
    while (existingSlugs.includes(slug)) {
      slug = `${baseSlug}-${genShortid()}`
    }
    return slug
  }
}
