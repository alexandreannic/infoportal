import {PrismaClient, User} from '@prisma/client'
import {genShortid, idParamsSchema, yup} from '../../helper/Utils.js'
import {InferType} from 'yup'
import {slugify, UUID} from 'infoportal-common'
import {GroupService} from '../group/GroupService.js'
import {AccessService} from '../access/AccessService.js'

export type WorkspaceCreate = InferType<typeof WorkspaceService.schema.create>

export class WorkspaceService {
  constructor(
    private prisma: PrismaClient,
    private group = new GroupService(prisma),
    private access = new AccessService(prisma),
  ) {}

  static readonly schema = {
    id: idParamsSchema,
    slug: yup.object({
      slug: yup.string().required(),
    }),
    create: yup.object({
      slug: yup.string().required(),
      name: yup.string().required(),
    }),
    update: yup.object({
      name: yup.string().required(),
    }),
  }

  readonly getMe = async ({workspaceId, user}: {workspaceId: UUID; user: User}) => {
    const [accesses, groups] = await Promise.all([
      this.access.searchForUser({workspaceId, user}),
      this.group.search({workspaceId, user}),
    ])
    return {
      accesses,
      groups,
    }
  }

  readonly getUniqSlug = async (name: string) => {
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

  readonly getByUser = async (email: string) => {
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
  }

  readonly create = async (data: WorkspaceCreate, user: User) => {
    return this.prisma.workspace.create({
      data: {
        ...data,
        createdBy: user.email,
        workspaceAccess: {
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
  }

  readonly update = (id: UUID, data: Partial<WorkspaceCreate>) => {
    return this.prisma.workspace.update({
      where: {id},
      data: data,
    })
  }

  readonly remove = (id: UUID) => {
    return this.prisma.workspace.delete({
      where: {id},
    })
  }
}
