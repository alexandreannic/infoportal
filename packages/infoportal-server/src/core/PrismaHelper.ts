import {Ip} from 'infoportal-api-sdk'

export namespace PrismaHelper {
  export const mapSubmission = <T extends {id: string}>(_: T): T & {id: Ip.SubmissionId} => _ as any

  export const mapForm = <T extends {kobo: any | null; serverId?: string | null; id: string}>(
    _: T,
  ): T & {id: Ip.FormId; serverId?: Ip.ServerId; kobo?: Ip.Form.KoboInfo} => _ as any

  export const mapWorkspace = <T extends {id: string}>(_: T): T & {id: Ip.WorkspaceId} => _ as any

  export const mapVersion = <T extends {id: string}>(_: T): T & {id: Ip.Form.VersionId} => _ as any

  export const mapServer = <T extends {id: string; workspaceId: string}>(
    _: T,
  ): T & {id: Ip.ServerId; workspaceId: Ip.WorkspaceId} => _ as any

  export const mapAccess = <T extends {id: string; filters: any}>(
    _: T,
  ): T & {id: Ip.Form.AccessId; filters: Record<string, any>} => _ as any
}
