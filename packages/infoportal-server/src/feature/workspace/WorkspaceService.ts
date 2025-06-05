import {PrismaClient} from '@prisma/client'
import {idParamsSchema, yup} from '../../helper/Utils.js'
import {InferType} from 'yup'
import {slugify, UUID} from 'infoportal-common'

export type WorkspaceCreate = InferType<typeof WorkspaceService.schema.create>

export class WorkspaceService {
  constructor(private prisma: PrismaClient) {}

  static readonly schema = {
    id: idParamsSchema,
    create: yup.object({
      name: yup.string().required(),
    }),
    update: yup.object({
      name: yup.string().required(),
    }),
  }

  private readonly getUniqSlug = async (baseSlug: string) => {
    const existingSlugs = await this.prisma.workspace
      .findMany({
        select: {slug: true},
        where: {
          slug: {startsWith: baseSlug},
        },
      })
      .then(_ => _.map(_ => _.slug))

    let slug = baseSlug
    let counter = 1
    while (existingSlugs.includes(slug)) {
      slug = `${baseSlug}-${counter++}`
    }
    return slug
  }

  readonly getByUser = async (email: string) => {
    return this.prisma.workspace.findMany({
      where: {
        Users: {
          some: {
            email,
          },
        },
      },
    })
  }

  readonly create = async (data: WorkspaceCreate, createdBy: string) => {
    const slug = await this.getUniqSlug(slugify(data.name))
    return this.prisma.workspace.create({
      data: {
        ...data,
        slug,
        createdBy,
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
