import {z} from 'zod'
import {initContract} from '@ts-rest/core'
import {Api} from '../Api'

const createZodEnumFromObject = <T extends Record<string, string>>(obj: T) => {
  const values = Object.values(obj)
  return z.enum(values as [T[keyof T], ...T[keyof T][]])
}

export type Meta = {
  access?: Api.Permission.Requirements
}

export const makeMeta = (_: Meta) => _

export const schema = (() => {
  const c = initContract()
  return {
    widgetId: z.string() as unknown as z.ZodType<Api.Dashboard.WidgetId>,
    dashboardId: z.string() as unknown as z.ZodType<Api.DashboardId>,
    sectionId: z.string() as unknown as z.ZodType<Api.Dashboard.SectionId>,
    workspaceId: z.string() as unknown as z.ZodType<Api.WorkspaceId>,
    workspaceInvitationId: z.string() as unknown as z.ZodType<Api.Workspace.InvitationId>,
    uuid: z.string() as unknown as z.ZodType<Api.Uuid>,
    formId: z.string() as unknown as z.ZodType<Api.FormId>,
    versionId: z.string() as unknown as z.ZodType<Api.Form.VersionId>,
    groupId: z.string() as unknown as z.ZodType<Api.GroupId>,
    groupItemId: z.string() as unknown as z.ZodType<Api.Group.ItemId>,
    serverId: z.string() as unknown as z.ZodType<Api.ServerId>,
    formAccessId: z.string() as unknown as z.ZodType<Api.AccessId>,
    submissionId: z.string() as unknown as z.ZodType<Api.SubmissionId>,
    userEmail: z.string() as unknown as z.ZodType<Api.User.Email>,
    formActionId: z.string() as unknown as z.ZodType<Api.Form.ActionId>,
    emptyResult: c.type<void>(),
    emptyBody: c.type<void>(),
  }
})()
