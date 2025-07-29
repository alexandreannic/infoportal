import {PrismaClient} from '@prisma/client'
import {HttpError, Ip} from 'infoportal-api-sdk'
import {PrismaHelper} from '../../core/PrismaHelper.js'
import {WorkspaceAccessCreate, WorkspaceAccessService} from './WorkspaceAccessService.js'
import {UserService} from '../user/UserService.js'

export class WorkspaceInvitationService {
  constructor(
    private prisma: PrismaClient,
    private user = UserService.getInstance(prisma),
    private access = new WorkspaceAccessService(prisma),
  ) {}

  readonly getByUser = async ({user}: {user: Ip.User}): Promise<Ip.Workspace.InvitationW_workspace[]> => {
    return this.prisma.workspaceInvitation
      .findMany({
        include: {workspace: true},
        where: {
          toEmail: user.email,
        },
      })
      .then(_ => _.map(PrismaHelper.mapWorkspaceInvitationW_workspace))
  }

  readonly create = async (
    {level, email, workspaceId}: WorkspaceAccessCreate,
    createdBy: Ip.User.Email,
  ): Promise<Ip.Workspace.Invitation> => {
    const maybeExistingUser = await this.user.getByEmail(email as Ip.User.Email)
    if (maybeExistingUser) {
      // TODO Send email
      const [existsAccess, existsInvitation] = await Promise.all([
        this.prisma.workspaceAccess.findFirst({
          select: {id: true},
          where: {workspaceId, userId: maybeExistingUser.id},
        }),
        this.prisma.workspaceInvitation.findFirst({
          select: {id: true},
          where: {workspaceId, toEmail: email},
        }),
      ])
      if (existsAccess || existsInvitation) throw new HttpError.Conflict('Access exists.')
    }
    return this.prisma.workspaceInvitation
      .create({
        data: {
          workspaceId,
          createdBy,
          accessLevel: level,
          toEmail: email,
        },
      })
      .then(PrismaHelper.mapWorkspaceInvitation)
  }

  readonly accept = async ({id, accept}: {accept: boolean; id: Ip.Workspace.InvitationId}) => {
    const invitation = await this.prisma.workspaceInvitation
      .findFirst({where: {id}})
      .then(_ => (_ ? PrismaHelper.mapWorkspaceInvitation(_) : undefined))
    if (!invitation) throw new HttpError.NotFound()
    if (accept)
      await this.access.create(
        {
          workspaceId: invitation.workspaceId,
          email: invitation.toEmail,
          level: invitation.accessLevel,
        },
        invitation.createdBy,
      )
    await this.prisma.workspaceInvitation.delete({where: {id}})
  }

  readonly getByWorkspace = async ({
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
}
