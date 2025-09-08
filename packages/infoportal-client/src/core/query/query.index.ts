import {Core} from '@/shared'
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
  smartDb: (workspaceId?: Ip.WorkspaceId) => concat('smartDb', workspaceId),
  smartDbFunction: (workspaceId?: Ip.WorkspaceId, id?: Ip.SmartDbId) => concat('smartDb', workspaceId, 'function', id),
  servers: (workspaceId?: Ip.WorkspaceId) => concat('servers', workspaceId),
  server: (workspaceId?: Ip.WorkspaceId, serverId?: Ip.ServerId) => concat('server', workspaceId, serverId),
  formAccess: (workspaceId?: Ip.WorkspaceId, formId?: Ip.FormId) => concat('formAccess', workspaceId, formId),
  user: (workspaceId?: Ip.WorkspaceId) => concat('user', workspaceId),
  userJob: (workspaceId?: Ip.WorkspaceId) => concat('userJob', workspaceId),
  version: (workspaceId?: Ip.WorkspaceId, formId?: Ip.FormId) => concat('version', workspaceId, formId),
  schemaByVersion: (workspaceId?: Ip.WorkspaceId, formId?: Ip.FormId, versionId?: Ip.Form.VersionId) =>
    concat('schema', workspaceId, formId, versionId),
  schema: (workspaceId?: Ip.WorkspaceId, formId?: Ip.FormId) => concat('schema', workspaceId, formId),
  form: (workspaceId: Ip.WorkspaceId, formId?: Ip.FormId) => concat('form', workspaceId, formId),
  group: (workspaceId?: Ip.WorkspaceId, args?: Omit<Ip.Group.Payload.Search, 'workspaceId'>) =>
    concat('group', workspaceId, args ? Core.stableStringify(args) : undefined),
  answers: (formId?: Ip.FormId) => concat('answers', formId),
  metrics: (
    workspaceId?: Ip.WorkspaceId,
    resource?: string,
    aggregation?: string,
    params?: Ip.Metrics.Payload.Filter,
  ) => [...concat('metrics', workspaceId, resource, aggregation), params],
}
