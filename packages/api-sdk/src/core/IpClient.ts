import {HTTPStatusCode, initClient} from '@ts-rest/core'
import {ipContract} from '../contract/Contract.js'
import {formVersionClient} from '../contract/form/ContractFormVersion.js'
import {formClient} from '../contract/form/ContractForm.js'
import {serverClient} from '../contract/ContractServer.js'
import {koboClient} from '../contract/kobo/ContractKobo.js'
import {formAccessClient} from '../contract/form/ContractFormAccess.js'
import {permissionClient} from '../contract/ContractPermission.js'
import {workspaceClient} from '../contract/workspace/ContractWorkspace.js'
import {workspaceAccessClient} from '../contract/workspace/ContractWorkspaceAccess.js'
import {formSubmissionClient} from '../contract/form/ContractFormSubmission.js'
import {HttpError} from './HttpError.js'
import {workspaceInvitationClient} from '../contract/workspace/ContractWorkspaceInvitation.js'
import {metricsClient} from '../contract/ContractMetrics.js'
import {userClient} from '../contract/ContractUser.js'
import {groupClient} from '../contract/ContractGroup.js'
import {formActionClient} from '../contract/form/action/ContractFormAction.js'
import {formActionLogClient} from '../contract/form/action/ContractFormActionLog.js'
import {formActionReportClient} from '../contract/form/action/ContractFormActionReport.js'
import {dashboardClient} from '../contract/dashboard/ContractDashboard.js'
import {widgetClient} from '../contract/dashboard/ContractWidget.js'

export type IpClient = ReturnType<typeof buildIpClient>
export type TsRestClient = ReturnType<typeof buildClient>

const buildClient = (baseUrl: string) =>
  initClient(ipContract, {
    baseUrl,
    credentials: 'include',
  })

export const buildIpClient = (baseUrl: string) => {
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
    },
    permission: permissionClient(client, baseUrl),
    server: serverClient(client, baseUrl),
    kobo: koboClient(client, baseUrl),
    submission: formSubmissionClient(client, baseUrl),
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
