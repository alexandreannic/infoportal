import {PrismaClient} from '@infoportal/prisma'
import {Api, HttpError} from '@infoportal/api-sdk'

export class DatabaseView {
  constructor(private prisma: PrismaClient) {}

  readonly search = ({databaseId, email}: Api.DatabaseView.Payload.Search) => {
    return this.prisma.databaseView.findMany({
      include: {details: true},
      where: {
        databaseId,
        OR: [
          {
            visibility: {
              in: [Api.DatabaseView.Visibility.Public, Api.DatabaseView.Visibility.Sealed],
            },
          },
          {
            createdBy: email,
          },
        ],
      },
    })
  }

  readonly create = async (data: Api.DatabaseView.Payload.Create) => {
    return this.prisma.databaseView.create({include: {details: true}, data: data})
  }

  readonly update = ({id, ...data}: Api.DatabaseView.Payload.Update) => {
    return this.prisma.databaseView.update({data: data, where: {id}})
  }

  readonly delete = async ({id}: {id: Api.DatabaseViewId}) => {
    await this.prisma.databaseView.delete({where: {id: id}})
  }

  readonly updateCol = async ({
    viewId,
    updatedBy = 'unknown' as Api.User.Email,
    name,
    width,
    visibility,
  }: Api.DatabaseView.Payload.UpdateCol & {updatedBy?: Api.User.Email}) => {
    const view = await this.prisma.databaseView.findFirst({
      select: {visibility: true, createdBy: true},
      where: {id: viewId},
    })
    if (!view) throw new HttpError.NotFound(`DatabaseView ${viewId}.`)
    if (view.visibility === Api.DatabaseView.Visibility.Sealed && updatedBy !== view.createdBy)
      throw new HttpError.Forbidden(`${updatedBy} cannot edit DatabaseView ${viewId}.`)

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
            name,
          },
        },
        update: {
          width,
          visibility,
        },
        create: {
          viewId,
          name,
          width,
          visibility,
        },
      }),
    ])
    return this.prisma.databaseView.findFirstOrThrow({include: {details: true}, where: {id: viewId}})
  }
}
