import {initContract} from '@ts-rest/core'
import {Ip} from '../../type/index.js'
import {TsRestClient} from '../../core/Client.js'

const c = initContract()

export const workspaceAccessContract = c.router({})

export const mapWorkspaceAccess = (u: Ip.Workspace.Access): Ip.Workspace.Access => {
  return {
    ...u,
    createdAt: new Date(u.createdAt),
  }
}

export const workspaceAccessClient = (client: TsRestClient, baseUrl: string) => {
  return {}
}
