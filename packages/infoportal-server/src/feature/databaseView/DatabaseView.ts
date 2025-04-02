import {DatabaseViewVisibility, Prisma, PrismaClient} from '@prisma/client'
import {UUID} from 'infoportal-common'
import {AppError} from '../../helper/Errors.js'

export class DatabaseView {
  constructor(private prisma: PrismaClient) {}

  readonly search = ({databaseId, email}: {email?: string; databaseId?: string}) => {
    return this.prisma.databaseView.findMany({
      include: {details: true},
      where: {
        databaseId,
        OR: [
          {
            visibility: {
              in: [DatabaseViewVisibility.Public, DatabaseViewVisibility.Sealed],
            },
          },
          {
            createdBy: email,
          },
        ],
      },
    })
  }

  readonly create = async (data: Prisma.DatabaseViewCreateInput) => {
    return this.prisma.databaseView.create({include: {details: true}, data: data})
  }

  readonly update = ({id, ...data}: Partial<Omit<Prisma.DatabaseViewCreateInput, 'details'>>) => {
    return this.prisma.databaseView.update({data: data, where: {id}})
  }

  readonly delete = async (id: UUID) => {
    await this.prisma.databaseView.delete({where: {id: id}})
  }

  readonly updateCol = async ({
    viewId,
    updatedBy = 'unknown',
    body,
  }: {
    viewId: UUID
    updatedBy?: string
    body: Pick<Prisma.DatabaseViewColCreateInput, 'name' | 'width' | 'visibility'>
  }) => {
    const view = await this.prisma.databaseView.findFirst({
      select: {visibility: true, createdBy: true},
      where: {id: viewId},
    })
    if (!view) throw new AppError.NotFound(`DatabaseView ${viewId}.`)
    if (view.visibility === DatabaseViewVisibility.Sealed && updatedBy !== view.createdBy)
      throw new AppError.Forbidden(`${updatedBy} cannot edit DatabaseView ${viewId}.`)

    await Promise.all([
      this.prisma.databaseView.update({
        data: {
          updatedAt: new Date(),
          updatedBy,
        },
        where: {
          id: viewId,
        },
      }),
      this.prisma.databaseViewCol.upsert({
        where: {
          name_viewId: {
            viewId,
            name: body.name,
          },
        },
        update: {
          width: body.width,
          visibility: body.visibility,
        },
        create: {
          viewId,
          name: body.name,
          width: body.width,
          visibility: body.visibility,
        },
      }),
    ])
    return this.prisma.databaseView.findFirstOrThrow({include: {details: true}, where: {id: viewId}})
  }
}
