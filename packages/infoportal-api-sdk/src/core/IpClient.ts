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

type TsRestResponse<T> =
  | {
      status: 200
      body: T
    }
  | {
      status: Exclude<HTTPStatusCode, 200>
      body?: unknown
    }

export const mapClientResponse = <T>(res: TsRestResponse<T>): T => {
  if (res.status !== 200) throw new Error('Unknown error')
  return res.body as T
}
