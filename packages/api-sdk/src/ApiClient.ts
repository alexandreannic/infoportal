import {HTTPStatusCode, initClient} from '@ts-rest/core'
import {apiContract} from './ApiContract.js'
import {formVersionClient} from './module/form/FormVersionContract.js'
import {formClient} from './module/form/FormContract.js'
import {serverClient} from './module/kobo/KoboAccountContract.js'
import {koboClient} from './module/kobo/KoboContract.js'
import {formAccessClient} from './module/form/access/FormAccessContract.js'
import {permissionClient} from './module/permission/PermissionContract.js'
import {workspaceClient} from './module/workspace/WorkspaceContract.js'
import {workspaceAccessClient} from './module/workspace/WorkspaceAccessContract.js'
import {submissionClient} from './module/submission/SubmissionContract.js'
import {HttpError} from './HttpError.js'
import {workspaceInvitationClient} from './module/workspace/WorkspaceInvitationContract.js'
import {metricsClient} from './module/metrics/MetricsContract.js'
import {userClient} from './module/user/UserContract.js'
import {groupClient} from './module/group/GroupContract.js'
import {formActionClient} from './module/form/action/FormActionContract.js'
import {formActionLogClient} from './module/form/action/FormActionLogContract.js'
import {formActionReportClient} from './module/form/action/FormActionReportContract.js'
import {dashboardClient} from './module/dashboard/DashboardContract.js'
import {widgetClient} from './module/dashboard/DashboardWidgetContract.js'
import {sectionClient} from './module/dashboard/DashboardSectionContract.js'

export type ApiClient = ReturnType<typeof buildApiClient>
export type TsRestClient = ReturnType<typeof buildClient>

const buildClient = (baseUrl: string) =>
  initClient(apiContract, {
    baseUrl,
    credentials: 'include',
  })

export const buildApiClient = (baseUrl: string) => {
  const client = buildClient(baseUrl)
  return {
    group: groupClient(client, baseUrl),
    workspace: {
      ...workspaceClient(client, baseUrl),
      access: workspaceAccessClient(client, baseUrl),
      invitation: workspaceInvitationClient(client, baseUrl),
    },
    dashboard: {
      ...dashboardClient(client),
      widget: widgetClient(client),
      section: sectionClient(client),
    },
    permission: permissionClient(client, baseUrl),
    server: serverClient(client, baseUrl),
    kobo: koboClient(client, baseUrl),
    submission: submissionClient(client, baseUrl),
    form: {
      ...formClient(client, baseUrl),
      access: formAccessClient(client, baseUrl),
      version: formVersionClient(client, baseUrl),
      action: {
        ...formActionClient(client),
        log: formActionLogClient(client),
        report: formActionReportClient(client),
      },
    },
    user: userClient(client, baseUrl),
    metrics: metricsClient(client, baseUrl),
  }
}

type TsRestResponse<S extends HTTPStatusCode, T> =
  | {
      status: S
      body: T
    }
  | {
      status: Exclude<HTTPStatusCode, S>
      body?: unknown
    }

const map = (res: any) => {
  if (res.status === 200) return res.body
  if (res.status === 204) return undefined
  if (res.status === 404) throw new HttpError.NotFound(res.body?.message)
  if (res.status === 403) throw new HttpError.Forbidden(res.body?.message)
  if (res.status === 409) throw new HttpError.Conflict(res.body?.message)
  if (res.status === 400) throw new HttpError.BadRequest(res.body?.message)
  if (res.status === 500) throw new HttpError.InternalServerError(res.body?.message)
  throw new HttpError.InternalServerError(res.body?.message)
}
export const map200 = <T>(res: TsRestResponse<200, T>): T => map(res)

export const map204 = <T>(res: TsRestResponse<204, T>): T => map(res)
