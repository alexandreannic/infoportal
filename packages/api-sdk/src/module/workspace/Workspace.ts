import type * as Prisma from '@prisma/client'
import {AccessLevel, Brand} from '../common/Common.js'
import {User} from '../user/User.js'

  export type WorkspaceId = Brand<string, 'workspaceId'>
  export type Workspace = Prisma.Workspace & {
    id: WorkspaceId
    level?: AccessLevel
  }
  export namespace Workspace {
    export const map = (u: Workspace): Workspace => {
      return {
        ...u,
        createdAt: new Date(u.createdAt),
      }
    }

    export type InvitationId = Brand<string, 'workspaceInvitation'>
    export type Invitation = Prisma.WorkspaceInvitation & {
      id: InvitationId
      createdBy: User.Email
      toEmail: User.Email
    }
    export type InvitationW_workspace = Prisma.WorkspaceInvitation & {
      id: InvitationId
      toEmail: User.Email
      createdBy: User.Email
      workspace: Workspace
    }
    export namespace Invitation {
      export namespace Payload {
        export type Create = {email: User.Email; level: AccessLevel; workspaceId: WorkspaceId}
      }
      export const map = (_: Workspace.Invitation): Workspace.Invitation => {
        _.createdAt = new Date(_.createdAt)
        return _
      }
      export const mapW_workspace = (_: Workspace.InvitationW_workspace): Workspace.InvitationW_workspace => {
        _.createdAt = new Date(_.createdAt)
        _.workspace = Workspace.map(_.workspace)
        return _
      }
    }

    export type Access = Prisma.WorkspaceAccess
    export type AccessId = Brand<string, 'workspaceAccessId'>
    export namespace Access {}

    export namespace Payload {
      export type Create = Omit<Workspace, 'id' | 'createdAt' | 'createdBy'>
      export type Update = {id: WorkspaceId} & Partial<Omit<Workspace, 'id' | 'createdAt' | 'createdBy'>>
    }
}
