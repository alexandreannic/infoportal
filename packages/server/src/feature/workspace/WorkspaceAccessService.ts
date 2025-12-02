import {PrismaClient} from '@infoportal/prisma'
import {InferType} from 'yup'
import {idParamsSchema, yup} from '../../helper/Utils.js'
import {UserService} from '../user/UserService.js'
import {HttpError, Api} from '@infoportal/api-sdk'
import {prismaMapper} from '../../core/prismaMapper/PrismaMapper.js'

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
      level: yup.mixed<Api.AccessLevel>().oneOf(Object.values(Api.AccessLevel)).required(),
    }),
  }

  readonly create = async (
    {level, email, workspaceId}: WorkspaceAccessCreate,
    createdBy: Api.User.Email,
  ): Promise<Api.Workspace.Access> => {
    const user = await this.userService.getByEmail(email as Api.User.Email)
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
      .then(prismaMapper.workspace.mapWorkspaceAccess)
  }

  readonly searchInvitations = async ({
    workspaceId,
  }: {
    workspaceId: Api.WorkspaceId
  }): Promise<Api.Workspace.Invitation[]> => {
    return this.prisma.workspaceInvitation
      .findMany({
        where: {workspaceId},
      })
      .then(_ => _.map(prismaMapper.workspace.mapWorkspaceInvitation))
  }

  readonly getByUser = async ({workspaceId, user}: {workspaceId: Api.WorkspaceId; user: Api.User}) => {
    return this.prisma.workspaceAccess.findFirst({
      where: {workspaceId, user: {email: user.email}},
    })
  }
}
