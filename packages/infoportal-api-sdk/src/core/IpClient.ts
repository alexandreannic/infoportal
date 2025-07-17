import {HTTPStatusCode, initClient} from '@ts-rest/core'
import {ipContract} from '../contract/Contract'
import {formVersionClient} from '../contract/form/ContractFormVersion'
import {formClient} from '../contract/form/ContractForm'
import {serverClient} from '../contract/ContractServer'
import {koboClient} from '../contract/kobo/ContractKobo'
import {formAccessClient} from '../contract/form/ContractFormAccess'
import {permissionClient, permissionContract} from '../contract/ContractPermission'
import {workspaceClient} from '../contract/workspace/ContractWorkspace'
import {workspaceAccessClient} from '../contract/workspace/ContractWorkspaceAccess'

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
