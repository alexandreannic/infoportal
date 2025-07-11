import {PrismaClient, User} from '@prisma/client'
import {idParamsSchema, yup} from '../../helper/Utils.js'
import {InferType} from 'yup'
import {UUID} from 'infoportal-common'
import {format} from 'date-fns'

export type GroupCreateParams = InferType<typeof GroupService.schema.create>
export type GroupUpdateParams = InferType<typeof GroupService.schema.update>

export class GroupService {
  constructor(private prisma: PrismaClient) {}

  static readonly schema = {
    create: yup.object({
      workspaceId: yup.string().required(),
      name: yup.string().optional(),
      desc: yup.string().optional(),
    }),
    update: yup.object({
      name: yup.string().required(),
    }),
    search: yup.object({
      workspaceId: yup.string().required(),
      name: yup.string().optional(),
      featureId: yup.string().optional(),
    }),
    id: idParamsSchema,
  }

  readonly create = (body: GroupCreateParams) => {
    return this.prisma.group.create({
      data: {
        workspaceId: body.workspaceId,
        name: body.name ?? `New group ${format(new Date(), 'yyyy-MM-dd')}`,
        desc: body.desc,
      },
    })
  }

  readonly update = (id: UUID, body: GroupUpdateParams) => {
    return this.prisma.group.update({
      where: {
        id,
      },
      data: body,
    })
  }

  readonly remove = (id: UUID) => {
    return this.prisma.group.delete({
      where: {
        id,
      },
    })
  }

  readonly search = ({
    featureId,
    workspaceId,
    name,
    user,
  }: {
    workspaceId: UUID
    user?: User
    name?: string
    featureId?: UUID
  }) => {
    return this.prisma.group.findMany({
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
                      OR: [{drcOffice: user.drcOffice}, {drcOffice: null}, {drcOffice: ''}],
                      drcJob: {
                        equals: user.drcJob,
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
  }
}
