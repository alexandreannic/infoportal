import {PrismaClient} from '@prisma/client'
import {InferType} from 'yup'
import {idParamsSchema, yup} from '../../helper/Utils.js'
import {UserService} from '../user/UserService.js'
import {HttpError, Ip} from 'infoportal-api-sdk'
import {PrismaHelper} from '../../core/PrismaHelper.js'

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

  readonly create = async (
    {level, email, workspaceId}: WorkspaceAccessCreate,
    createdBy: Ip.User.Email,
  ): Promise<Ip.Workspace.Access> => {
    const user = await this.userService.getByEmail(email as Ip.User.Email)
    if (!user) throw new HttpError.NotFound('User not found')
    const exists = await this.prisma.workspaceAccess.findFirst({
      select: {id: true},
      where: {workspaceId, userId: user.id},
    })
    if (exists) throw new HttpError.Conflict('Access exists.')
    return this.prisma.workspaceAccess
      .create({
        data: {
          level,
          userId: user.id,
          workspaceId,
          createdBy,
        },
      })
      .then(PrismaHelper.mapWorkspaceAccess)
  }

  readonly searchInvitations = async ({
    workspaceId,
  }: {
    workspaceId: Ip.WorkspaceId
  }): Promise<Ip.Workspace.Invitation[]> => {
    return this.prisma.workspaceInvitation
      .findMany({
        where: {workspaceId},
      })
      .then(_ => _.map(PrismaHelper.mapWorkspaceInvitation))
  }

  readonly getByUser = async ({workspaceId, user}: {workspaceId: Ip.WorkspaceId; user: Ip.User}) => {
    return this.prisma.workspaceAccess.findFirst({
      where: {workspaceId, user: {email: user.email}},
    })
  }
}
