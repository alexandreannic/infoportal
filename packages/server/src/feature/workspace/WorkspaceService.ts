import {PrismaClient} from '@prisma/client'
import {slugify, genShortid, UUID} from '@infoportal/common'
import {GroupService} from '../group/GroupService.js'
import {FormAccessService} from '../form/access/FormAccessService.js'
import {Ip} from '@infoportal/api-sdk'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'

export class WorkspaceService {
  constructor(
    private prisma: PrismaClient,
    private group = new GroupService(prisma),
    private access = new FormAccessService(prisma),
  ) {}

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

  readonly getByUser = async (email: Ip.User.Email) => {
    return this.prisma.workspaceAccess
      .findMany({
        where: {
          user: {
            email,
          },
        },
        select: {
          level: true,
          workspace: true,
        },
      })
      .then(_ => {
        return _.map(_ => {
          return {
            ..._.workspace,
            level: _.level,
          }
        })
      })
      .then(_ => _.map(prismaMapper.workspace.mapWorkspace))
  }

  readonly create = async (data: Ip.Workspace.Payload.Create, user: Ip.User) => {
    return this.prisma.workspace
      .create({
        data: {
          ...data,
          createdBy: user.email,
          access: {
            create: {
              createdBy: user.email,
              level: 'Admin',
              user: {
                connect: {
                  email: user.email,
                },
              },
            },
          },
        },
      })
      .then(prismaMapper.workspace.mapWorkspace)
  }

  readonly update = (id: UUID, data: Partial<Ip.Workspace.Payload.Update>) => {
    return this.prisma.workspace
      .update({
        where: {id},
        data: data,
      })
      .then(prismaMapper.workspace.mapWorkspace)
  }

  readonly remove = async (id: UUID) => {
    await this.prisma.workspace.delete({
      where: {id},
    })
  }
}
