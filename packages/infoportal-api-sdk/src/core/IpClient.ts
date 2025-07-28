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
    workspace: {
      ...workspaceClient(client),
      access: workspaceAccessClient(client),
    },
    permission: permissionClient(client),
    server: serverClient(client),
    kobo: koboClient(client),
    submission: formSubmissionClient(client),
    form: {
      ...formClient(client),
      access: formAccessClient(client),
      version: formVersionClient(client),
    },
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
  if (res.status === 500) throw new HttpError.InternalServerError(res.body?.message)
  if (res.status === 403) throw new HttpError.Forbidden(res.body?.message)
  if (res.status === 400) throw new HttpError.BadRequest(res.body?.message)
}
export const map200 = <T>(res: TsRestResponse<200, T>): T => map(res)

export const map204 = <T>(res: TsRestResponse<204, T>): T => map(res)
