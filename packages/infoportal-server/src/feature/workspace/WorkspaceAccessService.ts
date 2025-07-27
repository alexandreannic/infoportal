import {PrismaClient, User} from '@prisma/client'
import {InferType} from 'yup'
import {idParamsSchema, yup} from '../../helper/Utils.js'
import {UserService} from '../user/UserService.js'
import {Ip} from 'infoportal-api-sdk'

export type WorkspaceAccessCreate = InferType<typeof WorkspaceAccessService.schema.create>

export class WorkspaceAccessService {
  constructor(
    private prisma: PrismaClient,
    private userService = UserService.getInstance(prisma),
  ) {}

  static readonly schema = {
    id: idParamsSchema,
    create: yup.object({
      workspaceId: yup.string().required(),
      email: yup.string().required(),
      level: yup.mixed<Ip.AccessLevel>().oneOf(Object.values(Ip.AccessLevel)).required(),
    }),
  }

  readonly create = async ({level, email, workspaceId}: WorkspaceAccessCreate, createdBy: Ip.User.Email) => {
    const maybeExistingUser = await this.userService.getByEmail(email as Ip.User.Email)
    if (maybeExistingUser) {
      return this.prisma.workspaceAccess.create({
        data: {
          level,
          userId: maybeExistingUser.id,
          workspaceId,
          createdBy,
        },
      })
    } else {
      // TODO
      throw new Error('TODO Implement invitation')
    }
  }

  readonly getByUser = async ({workspaceId, user}: {workspaceId: Ip.WorkspaceId; user: User}) => {
    return this.prisma.workspaceAccess.findFirst({
      where: {workspaceId, user: {email: user.email}},
    })
  }
}
