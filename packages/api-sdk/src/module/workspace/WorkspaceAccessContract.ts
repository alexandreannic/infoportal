import {initContract} from '@ts-rest/core'
import {Api} from '../../Api.js'
import {TsRestClient} from '../../ApiClient.js'

const c = initContract()

export const workspaceAccessContract = c.router({})

export const mapWorkspaceAccess = (u: Api.Workspace.Access): Api.Workspace.Access => {
  return {
    ...u,
    createdAt: new Date(u.createdAt),
  }
}

export const workspaceAccessClient = (client: TsRestClient, baseUrl: string) => {
  return {}
}
