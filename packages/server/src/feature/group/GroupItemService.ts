import {PrismaClient} from '@prisma/client'
import {Ip} from 'infoportal-api-sdk'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'

export class GroupItemService {
  constructor(private prisma: PrismaClient) {}

  readonly create = ({
    groupId,
    email,
    location,
    jobs,
    level,
  }: Ip.Group.Payload.ItemCreate): Promise<Ip.Group.Item[]> => {
    return Promise.all(
      (jobs ?? [undefined]).map(job =>
        this.prisma.groupItem.create({
          data: {
            level: level,
            job: job,
            location: location,
            email: email,
            groupId,
          },
        }),
      ),
    ).then(_ => _.map(prismaMapper.access.mapGroupItem))
  }

  readonly update = async ({job, email, location, id, level}: Ip.Group.Payload.ItemUpdate) => {
    const exists = await this.prisma.groupItem.findFirst({select: {id: true}, where: {id}})
    if (!exists) return
    return this.prisma.groupItem
      .update({
        where: {id},
        data: {
          level: level,
          location: location,
          job: job,
          email: email,
        },
      })
      .then(prismaMapper.access.mapGroupItem)
  }

  readonly remove = ({id}: {id: Ip.Group.ItemId}) => {
    return this.prisma.groupItem.delete({
      where: {
        id,
      },
    })
  }

  readonly getAll = ({groupId}: {groupId: Ip.GroupId}) => {
    return this.prisma.groupItem.findMany({
      where: {
        groupId,
      },
    })
  }
}
