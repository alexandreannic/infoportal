import {Kobo} from 'kobo-sdk'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {Utils} from '@/utils/utils'
import {Ip} from 'infoportal-api-sdk'

const concat = (...args: (string | undefined)[]) => {
  return args.filter(_ => !!_)
}

export const queryKeys = {
  session: () => ['session'],
  permission: {
    global: () => ['permission', 'global'],
    byWorkspaceId: (workspaceId: Ip.Uuid) => ['permission', 'workspace', workspaceId],
    byFormId: (workspaceId: Ip.Uuid, formId: Ip.FormId) => ['permission', 'form', workspaceId, formId],
  },
  workspaces: () => ['workspaces'],
  originalEmail: () => ['originalEmail'],
  koboForm: (workspaceId?: Ip.Uuid) => concat('koboForm', workspaceId),
  servers: (workspaceId?: Ip.Uuid) => concat('servers', workspaceId),
  server: (workspaceId?: Ip.Uuid, serverId?: Ip.Uuid) => concat('server', workspaceId, serverId),
  formAccess: (workspaceId?: Ip.Uuid, formId?: Ip.FormId) => concat('formAccess', workspaceId, formId),
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
