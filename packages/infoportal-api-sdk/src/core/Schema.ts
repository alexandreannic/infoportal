import {z} from 'zod'
import {Ip} from './Types.js'
import {initContract} from '@ts-rest/core'

const createZodEnumFromObject = <T extends Record<string, string>>(obj: T) => {
  const values = Object.values(obj)
  return z.enum(values as [T[keyof T], ...T[keyof T][]])
}

export type Meta = {
  access?: Ip.Permission.Requirements
}

export const makeMeta = (_: Meta) => _

export const schema = (() => {
  const c = initContract()
  return {
    workspaceId: z.string() as unknown as z.ZodType<Ip.WorkspaceId>,
    workspaceInvitationId: z.string() as unknown as z.ZodType<Ip.Workspace.InvitationId>,
    uuid: z.string() as unknown as z.ZodType<Ip.Uuid>,
    formId: z.string() as unknown as z.ZodType<Ip.FormId>,
    versionId: z.string() as unknown as z.ZodType<Ip.Form.VersionId>,
    groupId: z.string() as unknown as z.ZodType<Ip.GroupId>,
    groupItemId: z.string() as unknown as z.ZodType<Ip.Group.ItemId>,
    serverId: z.string() as unknown as z.ZodType<Ip.ServerId>,
    formAccessId: z.string() as unknown as z.ZodType<Ip.Form.AccessId>,
    submissionId: z.string() as unknown as z.ZodType<Ip.SubmissionId>,
    userEmail: z.string() as unknown as z.ZodType<Ip.User.Email>,
    emptyResult: c.type<void>(),
    emptyBody: c.type<void>(),
  }
})()
