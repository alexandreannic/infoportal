import {PrismaClient} from '@prisma/client'
import {Api} from '@infoportal/api-sdk'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'

export class GroupItemService {
  constructor(private prisma: PrismaClient) {}

  readonly create = ({
    groupId,
    email,
    location,
    jobs,
    level,
  }: Api.Group.Payload.ItemCreate): Promise<Api.Group.Item[]> => {
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

  readonly update = async ({job, email, location, id, level}: Api.Group.Payload.ItemUpdate) => {
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

  readonly remove = ({id}: {id: Api.Group.ItemId}) => {
    return this.prisma.groupItem.delete({
      where: {
        id,
      },
    })
  }

  readonly getAll = ({groupId}: {groupId: Api.GroupId}) => {
    return this.prisma.groupItem.findMany({
      where: {
        groupId,
      },
    })
  }
}
