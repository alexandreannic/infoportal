import {Ip} from 'infoportal-api-sdk'

// Seems not working but need further trys.
// type PickNullable<T> = {
//   [P in keyof T as null extends T[P] ? P : never]: T[P]
// }
//
// type PickNotNullable<T> = {
//   [P in keyof T as null extends T[P] ? never : P]: T[P]
// }
//
// type OptionalNullable<T> = {
//   [K in keyof PickNullable<T>]?: Exclude<T[K], null>
// } & {
//   [K in keyof PickNotNullable<T>]: T[K]
// }

export namespace PrismaHelper {
  type Bytes = Uint8Array<ArrayBufferLike>
  export const mapSubmission = <T extends {id: string}>(_: T): T & {id: Ip.SubmissionId} => _ as any

  export const mapForm = <T extends {kobo?: any | null; serverId?: string | null; id: string}>(
    _: T,
  ): T & {id: Ip.FormId; serverId?: Ip.ServerId; kobo?: Ip.Form.KoboInfo} => _ as any

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
      drcJob: string | null
      drcOffice: string | null
      location: string | null
      job: string | null
      avatar: Bytes | null
    },
  >(
    _: T,
  ): T & {
    id: Ip.UserId
    email: Ip.User.Email
    lastConnectedAt?: Date
    name?: string
    drcJob?: string
    drcOffice?: string
    location?: string
    job?: string
    avatar?: Bytes
  } => _ as any

  export const mapServer = <T extends {id: string; workspaceId: string}>(
    _: T,
  ): T & {id: Ip.ServerId; workspaceId: Ip.WorkspaceId} => _ as any

  export const mapAccess = <T extends {id: string; filters: any}>(
    _: T,
  ): T & {id: Ip.Form.AccessId; filters: Record<string, any>} => _ as any
}
