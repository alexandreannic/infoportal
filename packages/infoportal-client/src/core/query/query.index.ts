import {Kobo} from 'kobo-sdk'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {Utils} from '@/utils/utils'
import {Ip} from 'infoportal-api-sdk'

const concat = (...args: (string | undefined)[]) => {
  return args.filter(_ => !!_)
}

export const queryKeys = {
  session: () => ['session'],
  workspaces: () => ['workspaces'],
  originalEmail: () => ['originalEmail'],
  koboForm: (workspaceId?: Ip.Uuid) => concat('koboForm', workspaceId),
  server: (workspaceId?: Ip.Uuid, serverId?: Ip.Uuid) => concat('server', workspaceId, serverId),
  access: (workspaceId?: Ip.Uuid) => concat('access', workspaceId),
  user: (workspaceId?: Ip.Uuid) => concat('user', workspaceId),
  koboSchema: (formId: Kobo.FormId) => ['koboSchema', formId],
  version: (workspaceId?: Ip.Uuid, formId?: Kobo.FormId) => concat('version', workspaceId, formId),
  schemaByVersion: (workspaceId?: Ip.Uuid, formId?: Kobo.FormId, versionId?: Ip.Uuid) =>
    concat('schema', workspaceId, formId, versionId),
  schema: (workspaceId?: Ip.Uuid, formId?: Kobo.FormId) => concat('schema', workspaceId, formId),
  form: (workspaceId: Ip.Uuid, formId?: Kobo.FormId) => concat('form', workspaceId, formId),
  group: (workspaceId?: Ip.Uuid, args?: Omit<ApiSdk['group']['search'], 'workspaceId'>) =>
    concat('group', workspaceId, args ? Utils.stableStringify(args) : undefined),
  answers: (formId?: Kobo.FormId) => concat('answers', formId),
}
