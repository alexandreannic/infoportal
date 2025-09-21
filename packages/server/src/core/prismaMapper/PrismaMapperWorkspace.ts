import {Ip} from 'infoportal-api-sdk'

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
