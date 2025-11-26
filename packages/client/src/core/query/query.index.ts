import {Core} from '@/shared'
import {Api} from '@infoportal/api-sdk'

const concat = (...args: (string | undefined)[]) => {
  return args.filter(_ => !!_)
}

export const queryKeys = {
  session: () => ['session'],
  permission: {
    global: () => ['permission', 'global'],
    byWorkspaceId: (workspaceId: Api.WorkspaceId) => ['permission', 'workspace', workspaceId],
    byFormId: (workspaceId: Api.WorkspaceId, formId: Api.FormId) => ['permission', 'form', workspaceId, formId],
  },
  workspaceInvitation: (workspaceId?: Api.WorkspaceId | 'me') => concat('workspace', 'invitation', workspaceId),
  workspaces: () => ['workspace'],
  originalEmail: () => ['originalEmail'],

  dasboardProtectedSubmission: (workspaceSlug?: string, dashboardSlug?: string) =>
    concat('dasboardProtectedSubmission', workspaceSlug, dashboardSlug),
  dashboardBySlug: (workspaceSlug?: string, dashboardSlug?: string) =>
    concat('dashboardBySlug', workspaceSlug, dashboardSlug),
  dashboard: (workspaceId?: Api.WorkspaceId, dashboardId?: Api.DashboardId) =>
    concat(workspaceId, 'dashboard', dashboardId),
  dashboardSection: (workspaceId?: Api.WorkspaceId, dashboardId?: Api.DashboardId, sectionId?: Api.Dashboard.SectionId) =>
    concat(workspaceId, 'dashboard', dashboardId, 'section', sectionId),
  dashboardWidget: (workspaceId?: Api.WorkspaceId, dashboardId?: Api.DashboardId) =>
    concat(workspaceId, 'dashboard', dashboardId, 'widget'),
  // dashboardWidget: (
  //   workspaceId?: Api.WorkspaceId,
  //   dashboardId?: Api.DashboardId,
  //   sectionId?: Api.Dashboard.SectionId,
  //   widgetId?: Api.Dashboard.WidgetId,
  // ) => concat(workspaceId, 'dashboard', dashboardId, 'section', sectionId, 'widget', widgetId),

  koboForm: (serverId?: Api.ServerId) => concat('koboForm', serverId),
  servers: (workspaceId?: Api.WorkspaceId) => concat('servers', workspaceId),
  server: (workspaceId?: Api.WorkspaceId, serverId?: Api.ServerId) => concat('server', workspaceId, serverId),
  form: (workspaceId: Api.WorkspaceId, formId?: Api.FormId) => concat('form', workspaceId, formId),
  formAccess: (workspaceId?: Api.WorkspaceId, formId?: Api.FormId) => concat('formAccess', workspaceId, formId),
  formAction: (workspaceId?: Api.WorkspaceId, id?: Api.FormId) => concat('form', workspaceId, 'action', id),
  formActionLog: (workspaceId?: Api.WorkspaceId, search?: Api.Form.Action.Log.Payload.Search) =>
    concat('form', workspaceId, 'action', 'log', JSON.stringify(search)),
  formActionReport: (workspaceId?: Api.WorkspaceId, formId?: Api.FormId, rest?: string) =>
    concat(workspaceId, 'form', formId, 'action', 'report', rest),
  submission: (formId?: Api.FormId) => concat('submission', formId),
  schema: (workspaceId?: Api.WorkspaceId, formId?: Api.FormId) => concat('schema', workspaceId, formId),
  schemaByVersion: (workspaceId?: Api.WorkspaceId, formId?: Api.FormId, versionId?: Api.Form.VersionId) =>
    concat('schema', workspaceId, formId, 'version', versionId),
  version: (workspaceId?: Api.WorkspaceId, formId?: Api.FormId) => concat('version', workspaceId, formId),
  user: (workspaceId?: Api.WorkspaceId) => concat('user', workspaceId),
  userJob: (workspaceId?: Api.WorkspaceId) => concat('userJob', workspaceId),
  group: (workspaceId?: Api.WorkspaceId, args?: Omit<Api.Group.Payload.Search, 'workspaceId'>) =>
    concat('group', workspaceId, args ? Core.stableStringify(args) : undefined),
  metrics: (
    workspaceId?: Api.WorkspaceId,
    resource?: string,
    aggregation?: string,
    params?: Api.Metrics.Payload.Filter,
  ) => [...concat('metrics', workspaceId, resource, aggregation), params],
}
