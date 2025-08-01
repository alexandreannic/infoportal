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
    byWorkspaceId: (workspaceId: Ip.WorkspaceId) => ['permission', 'workspace', workspaceId],
    byFormId: (workspaceId: Ip.WorkspaceId, formId: Ip.FormId) => ['permission', 'form', workspaceId, formId],
  },
  workspaceInvitation: (workspaceId?: Ip.WorkspaceId | 'me') => concat('workspace', 'invitation', workspaceId),
  workspaces: () => ['workspace'],
  originalEmail: () => ['originalEmail'],
  koboForm: (serverId?: Ip.ServerId) => concat('koboForm', serverId),
  servers: (workspaceId?: Ip.WorkspaceId) => concat('servers', workspaceId),
  server: (workspaceId?: Ip.WorkspaceId, serverId?: Ip.ServerId) => concat('server', workspaceId, serverId),
  formAccess: (workspaceId?: Ip.WorkspaceId, formId?: Ip.FormId) => concat('formAccess', workspaceId, formId),
  user: (workspaceId?: Ip.WorkspaceId) => concat('user', workspaceId),
  version: (workspaceId?: Ip.WorkspaceId, formId?: Ip.FormId) => concat('version', workspaceId, formId),
  schemaByVersion: (workspaceId?: Ip.WorkspaceId, formId?: Ip.FormId, versionId?: Ip.Form.VersionId) =>
    concat('schema', workspaceId, formId, versionId),
  schema: (workspaceId?: Ip.WorkspaceId, formId?: Ip.FormId) => concat('schema', workspaceId, formId),
  form: (workspaceId: Ip.WorkspaceId, formId?: Ip.FormId) => concat('form', workspaceId, formId),
  group: (workspaceId?: Ip.WorkspaceId, args?: Omit<ApiSdk['group']['search'], 'workspaceId'>) =>
    concat('group', workspaceId, args ? Utils.stableStringify(args) : undefined),
  answers: (formId?: Ip.FormId) => concat('answers', formId),
  metrics: (
    workspaceId?: Ip.WorkspaceId,
    ressource?: string,
    aggregation?: string,
    params?: Ip.Metrics.Payload.Filter,
  ) => [...concat('metrics', workspaceId, ressource, aggregation), params],
}
