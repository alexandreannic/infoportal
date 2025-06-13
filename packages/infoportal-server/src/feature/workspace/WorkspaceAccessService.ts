import {PrismaClient, WorkspaceAccessLevel} from '@prisma/client'
import {InferType} from 'yup'
import {idParamsSchema, yup} from '../../helper/Utils.js'
import {UserService} from '../user/UserService.js'

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
      level: yup.mixed<WorkspaceAccessLevel>().oneOf(Object.values(WorkspaceAccessLevel)).required(),
    }),
  }

  readonly create = async ({level, email, workspaceId}: WorkspaceAccessCreate, createdBy: string) => {
    const maybeExistingUser = await this.userService.getUserByEmail(email)
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
}
