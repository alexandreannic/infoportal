import {Api} from '@infoportal/api-sdk'

export const mapWorkspace = <T extends {id: string}>(_: T): T & {id: Api.WorkspaceId} => _ as any
export const mapWorkspaceAccess = <T extends {id: string}>(_: T): T & {id: Api.Workspace.AccessId} => _ as any

export const mapWorkspaceInvitationW_workspace = <
  T extends {workspace: any; createdBy: string; id: string; toEmail: string},
>(
  _: T,
): T & {toEmail: Api.User.Email; createdBy: Api.User.Email; id: Api.Workspace.InvitationId; workspace: Api.Workspace} =>
  _ as any

export const mapWorkspaceInvitation = <T extends {id: string; createdBy: string; toEmail: string}>(
  _: T,
): T & {toEmail: Api.User.Email; createdBy: Api.User.Email; id: Api.Workspace.InvitationId} => _ as any
