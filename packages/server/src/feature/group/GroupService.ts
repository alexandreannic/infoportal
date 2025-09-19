import {PrismaClient} from '@prisma/client'
import {format} from 'date-fns'
import {Ip} from 'infoportal-api-sdk'
import {PrismaHelper} from '../../core/PrismaHelper.js'

export class GroupService {
  constructor(private prisma: PrismaClient) {}

  readonly create = (body: Ip.Group.Payload.Create): Promise<Ip.Group> => {
    return this.prisma.group
      .create({
        include: {items: true},
        data: {
          workspaceId: body.workspaceId,
          name: body.name ?? `New group ${format(new Date(), 'yyyy-MM-dd')}`,
          desc: body.desc,
        },
      })
      .then(PrismaHelper.mapGroup)
  }

  readonly update = async ({id, ...data}: Ip.Group.Payload.Update): Promise<Ip.Group | undefined> => {
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
      .then(PrismaHelper.mapGroup)
  }

  readonly remove = ({id}: {id: Ip.GroupId}) => {
    return this.prisma.group.delete({
      where: {
        id,
      },
    })
  }

  readonly search = ({featureId, workspaceId, name, user}: Ip.Group.Payload.Search) => {
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
      .then(_ => _.map(PrismaHelper.mapGroup))
  }
}
