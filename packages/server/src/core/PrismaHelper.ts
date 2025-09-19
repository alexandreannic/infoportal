import {Ip} from 'infoportal-api-sdk'
import type * as Prisma from '@prisma/client'
import {Kobo} from 'kobo-sdk'

export type Defined<T> = {
  [K in keyof T as T[K] extends null | undefined ? never : K]: T[K]
}

export namespace PrismaHelper {
  type Bytes = Uint8Array<ArrayBufferLike>
  export const mapSubmission = <T extends {id: string}>(_: T): Defined<Omit<T, 'id'> & {id: Ip.SubmissionId}> =>
    _ as any

  export const mapForm = <
    T extends {
      kobo?: any | null
      category?: string | null
      deploymentStatus?: Ip.Form.DeploymentStatus | null
      serverId?: string | null
      id?: string
    },
  >(
    _: T,
  ): Defined<
    T & {
      id: Ip.FormId
      serverId?: Ip.ServerId
      category?: string
      deploymentStatus?: string
      kobo?: Ip.Form.KoboInfo
    }
  > => _ as any

  export const mapKoboInfo = <
    T extends {
      accountId: string | null
      koboId: string | null
    },
  >(
    _: T,
  ): Defined<T> & {
    accountId?: Ip.ServerId
    koboId?: Kobo.FormId
  } => _ as any

  export const mapFormActionReport = <T extends {startedBy: string}>(
    _: T,
  ): Defined<
    T & {
      startedBy: Ip.User.Email
    }
  > => _ as any

  export const mapFormAction = <
    T extends {
      id: string
      targetFormId: string
      formId: string
      type: Prisma.FormActionType
    },
  >(
    _: T,
  ): Defined<
    T & {
      id: Ip.Form.ActionId
      targetFormId: Ip.FormId
      formId: Ip.FormId
      type: Ip.Form.Action.Type
    }
  > => _ as any

  export const mapWorkspace = <T extends {id: string}>(_: T): T & {id: Ip.WorkspaceId} => _ as any
  export const mapWorkspaceAccess = <T extends {id: string}>(_: T): T & {id: Ip.Workspace.AccessId} => _ as any

  export const mapWorkspaceInvitationW_workspace = <
    T extends {workspace: any; createdBy: string; id: string; toEmail: string},
  >(
    _: T,
  ): T & {toEmail: Ip.User.Email; createdBy: Ip.User.Email; id: Ip.Workspace.InvitationId; workspace: Ip.Workspace} =>
    _ as any

  export const mapWorkspaceInvitation = <T extends {id: string; createdBy: string; toEmail: string}>(
    _: T,
  ): T & {toEmail: Ip.User.Email; createdBy: Ip.User.Email; id: Ip.Workspace.InvitationId} => _ as any

  export const mapVersion = <T extends {id: string; uploadedBy: string}>(
    _: T,
  ): T & {id: Ip.Form.VersionId; uploadedBy: Ip.User.Email} => _ as any

  export const mapUser = <
    T extends {
      id: string
      email: string
      lastConnectedAt: Date | null
      name: string | null
      location: string | null
      job: string | null
      avatar?: Bytes | null
    },
  >(
    _: T,
  ): T & {
    id: Ip.UserId
    email: Ip.User.Email
    lastConnectedAt?: Date
    name?: string
    location?: string
    job?: string
    avatar?: Bytes
  } => _ as any

  export const mapGroupItem = <T extends Record<keyof Ip.Group.Item, any>>(_: T): Ip.Group.Item => _ as any

  export const mapGroup = <T extends Record<keyof Ip.Group, any>>(
    _: T,
  ): Ip.Group & {
    workspaceId: Ip.WorkspaceId
    id: Ip.GroupId
    items: Ip.Group.Item[]
  } => _ as any

  export const mapServer = <T extends {id: string; workspaceId: string}>(
    _: T,
  ): T & {id: Ip.ServerId; workspaceId: Ip.WorkspaceId} => _ as any

  export const mapAccess = <T extends {id: string; filters: any}>(
    _: T,
  ): T & {id: Ip.Form.AccessId; filters: Record<string, any>} => _ as any

  export const mapFormActionLog = <
    T extends {submission: any | null; id: string; actionId: string | null; details: string | null},
  >(
    _: T,
  ): Defined<
    T & {submission?: Ip.Submission; actionId?: Ip.Form.ActionId; id: Ip.Form.Action.LogId; details?: string}
  > => _ as any
}
