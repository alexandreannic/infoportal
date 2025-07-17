import {PrismaClient} from '@prisma/client'
import {yup} from '../../helper/Utils.js'
import {Obj} from '@axanc/ts-utils'
import {UUID} from 'infoportal-common'
import {InferType} from 'yup'
import {Ip} from 'infoportal-api-sdk'

export type GroupItemCreateParams = InferType<typeof GroupItemService.schema.create>
export type GroupItemUpdateParams = InferType<typeof GroupItemService.schema.update>

export class GroupItemService {
  constructor(private prisma: PrismaClient) {}

  static readonly schema = {
    create: yup.object({
      level: yup.mixed<Ip.AccessLevel>().oneOf(Obj.values(Ip.AccessLevel)).required(),
      job: yup.array().of(yup.string()).nullable(),
      location: yup.string().nullable(),
      email: yup.string().nullable(),
    }),

    update: yup.object({
      level: yup.mixed<Ip.AccessLevel>().oneOf(Obj.values(Ip.AccessLevel)),
      job: yup.string().optional().nullable(),
      location: yup.string().optional().nullable(),
      email: yup.string().optional().nullable(),
    }),
  }

  readonly create = (groupId: UUID, body: GroupItemCreateParams) => {
    return Promise.all(
      (body.job ?? [undefined]).map(drcJob =>
        this.prisma.groupItem.create({
          data: {
            level: body.level,
            drcJob,
            drcOffice: body.location,
            email: body.email,
            groupId,
          },
        }),
      ),
    )
  }

  readonly update = (id: UUID, body: GroupItemUpdateParams) => {
    return this.prisma.groupItem.update({
      where: {id},
      data: {
        level: body.level,
        drcOffice: body.location,
        drcJob: body.job,
        email: body.email,
      },
    })
  }

  readonly remove = (id: UUID) => {
    return this.prisma.groupItem.delete({
      where: {
        id,
      },
    })
  }

  readonly getAll = ({groupId}: {groupId: UUID}) => {
    return this.prisma.groupItem.findMany({
      where: {
        groupId,
      },
    })
  }
}
