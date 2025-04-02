import {FeatureAccessLevel, PrismaClient} from '@prisma/client'
import {yup} from '../../helper/Utils.js'
import {Obj} from '@axanc/ts-utils'
import {UUID} from 'infoportal-common'
import {InferType} from 'yup'
import {AccessService} from '../access/AccessService.js'

export type GroupItemCreateParams = InferType<typeof GroupItemService.createSchema>
export type GroupItemUpdateParams = InferType<typeof GroupItemService.updateSchema>

export class GroupItemService {
  constructor(private prisma: PrismaClient) {}

  static readonly createSchema = yup.object({
    level: AccessService.levelSchema,
    drcJob: yup.array().of(AccessService.drcJobSchema).nullable(),
    drcOffice: AccessService.drcOfficeSchema.nullable(),
    email: yup.string().nullable(),
  })

  static readonly updateSchema = yup.object({
    level: yup.mixed<FeatureAccessLevel>().oneOf(Obj.values(FeatureAccessLevel)).optional(),
    drcJob: AccessService.drcJobSchema.optional().nullable(),
    drcOffice: AccessService.drcOfficeSchema.optional().nullable(),
    email: yup.string().optional().nullable(),
  })

  readonly create = (groupId: UUID, body: GroupItemCreateParams) => {
    return Promise.all(
      (body.drcJob ?? [undefined]).map((drcJob) =>
        this.prisma.groupItem.create({
          data: {
            level: body.level,
            drcJob,
            drcOffice: body.drcOffice,
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
        drcOffice: body.drcOffice,
        drcJob: body.drcJob,
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
