import {z} from 'zod'
import {Ip} from './Types'

const createZodEnumFromObject = <T extends Record<string, string>>(obj: T) => {
  const values = Object.values(obj)
  return z.enum(values as [T[keyof T], ...T[keyof T][]])
}

export type Meta = {
  access?: Ip.Permission.Requirements
}

export const makeMeta = (_: Meta) => _

export const schema = (() => {
  const workspaceId = z.string() as unknown as z.ZodType<Ip.WorkspaceId>
  const uuid = z.string() as unknown as z.ZodType<Ip.Uuid>
  const formId = z.string() as unknown as z.ZodType<Ip.FormId>
  const versionId = z.string() as unknown as z.ZodType<Ip.Form.VersionId>
  const serverId = z.string() as unknown as z.ZodType<Ip.ServerId>
  const formAccessId = z.string() as unknown as z.ZodType<Ip.Form.AccessId>
  const submissionId = z.string() as unknown as z.ZodType<Ip.SubmissionId>
  return {
    submissionId,
    workspaceId,
    uuid,
    formId,
    versionId,
    serverId,
    formAccessId,
  }
})()
