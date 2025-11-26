import {PrismaClient} from '@prisma/client'
import {format} from 'date-fns'
import {Api} from '@infoportal/api-sdk'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'

export class GroupService {
  constructor(private prisma: PrismaClient) {}

  readonly create = (body: Api.Group.Payload.Create): Promise<Api.Group> => {
    return this.prisma.group
      .create({
        include: {items: true},
        data: {
          workspaceId: body.workspaceId,
          name: body.name ?? `New group ${format(new Date(), 'yyyy-MM-dd')}`,
          desc: body.desc,
        },
      })
      .then(prismaMapper.access.mapGroup)
  }

  readonly update = async ({id, ...data}: Api.Group.Payload.Update): Promise<Api.Group | undefined> => {
    const exists = await this.prisma.group.findFirst({select: {id: true}, where: {id}})
    if (!exists) return
    return this.prisma.group
      .update({
        include: {items: true},
        where: {
          id,
        },
        data,
      })
      .then(prismaMapper.access.mapGroup)
  }

  readonly remove = ({id}: {id: Api.GroupId}) => {
    return this.prisma.group.delete({
      where: {
        id,
      },
    })
  }

  readonly search = ({featureId, workspaceId, name, user}: Api.Group.Payload.Search) => {
    return this.prisma.group
      .findMany({
        include: {
          items: true,
        },
        where: {
          name,
          workspaceId,
          ...(user
            ? {
                items: {
                  some: {
                    OR: [
                      {email: {equals: user.email, mode: 'insensitive' as const}},
                      {
                        OR: [{location: user.location}, {location: null}, {location: ''}],
                        job: {
                          equals: user.job,
                          mode: 'insensitive' as const,
                        },
                      },
                    ],
                  },
                },
              }
            : {}),
        },
        orderBy: {createdAt: 'desc'},
      })
      .then(_ => _.map(prismaMapper.access.mapGroup))
  }
}
