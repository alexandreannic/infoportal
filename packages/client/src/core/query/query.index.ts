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

  dashboardBySlug: (workspaceSlug?: string, dashboardSlug?: string) =>
    concat('dashboardBySlug', workspaceSlug, dashboardSlug),
  dashboard: (workspaceId?: Ip.WorkspaceId, dashboardId?: Ip.DashboardId) =>
    concat(workspaceId, 'dashboard', dashboardId),
  dashboardSection: (workspaceId?: Ip.WorkspaceId, dashboardId?: Ip.DashboardId, sectionId?: Ip.Dashboard.SectionId) =>
    concat(workspaceId, 'dashboard', dashboardId, 'section', sectionId),
  dashboardWidget: (workspaceId?: Ip.WorkspaceId, dashboardId?: Ip.DashboardId) =>
    concat(workspaceId, 'dashboard', dashboardId, 'widget'),
  // dashboardWidget: (
  //   workspaceId?: Ip.WorkspaceId,
  //   dashboardId?: Ip.DashboardId,
  //   sectionId?: Ip.Dashboard.SectionId,
  //   widgetId?: Ip.Dashboard.WidgetId,
  // ) => concat(workspaceId, 'dashboard', dashboardId, 'section', sectionId, 'widget', widgetId),

  koboForm: (serverId?: Ip.ServerId) => concat('koboForm', serverId),
  servers: (workspaceId?: Ip.WorkspaceId) => concat('servers', workspaceId),
  server: (workspaceId?: Ip.WorkspaceId, serverId?: Ip.ServerId) => concat('server', workspaceId, serverId),
  form: (workspaceId: Ip.WorkspaceId, formId?: Ip.FormId) => concat('form', workspaceId, formId),
  formAccess: (workspaceId?: Ip.WorkspaceId, formId?: Ip.FormId) => concat('formAccess', workspaceId, formId),
  formAction: (workspaceId?: Ip.WorkspaceId, id?: Ip.FormId) => concat('form', workspaceId, 'action', id),
  formActionLog: (workspaceId?: Ip.WorkspaceId, search?: Ip.Form.Action.Log.Payload.Search) =>
    concat('form', workspaceId, 'action', 'log', JSON.stringify(search)),
  formActionReport: (workspaceId?: Ip.WorkspaceId, formId?: Ip.FormId, rest?: string) =>
    concat(workspaceId, 'form', formId, 'action', 'report', rest),
  submission: (formId?: Ip.FormId) => concat('submission', formId),
  schema: (workspaceId?: Ip.WorkspaceId, formId?: Ip.FormId) => concat('schema', workspaceId, formId),
  version: (workspaceId?: Ip.WorkspaceId, formId?: Ip.FormId) => concat('version', workspaceId, formId),
  user: (workspaceId?: Ip.WorkspaceId) => concat('user', workspaceId),
  userJob: (workspaceId?: Ip.WorkspaceId) => concat('userJob', workspaceId),
  schemaByVersion: (workspaceId?: Ip.WorkspaceId, formId?: Ip.FormId, versionId?: Ip.Form.VersionId) =>
    concat('schema', workspaceId, formId, versionId),
  group: (workspaceId?: Ip.WorkspaceId, args?: Omit<Ip.Group.Payload.Search, 'workspaceId'>) =>
    concat('group', workspaceId, args ? Core.stableStringify(args) : undefined),
  metrics: (
    workspaceId?: Ip.WorkspaceId,
    resource?: string,
    aggregation?: string,
    params?: Ip.Metrics.Payload.Filter,
  ) => [...concat('metrics', workspaceId, resource, aggregation), params],
}
