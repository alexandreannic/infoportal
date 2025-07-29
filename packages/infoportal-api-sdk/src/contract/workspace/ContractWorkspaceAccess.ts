import {initContract} from '@ts-rest/core'
import {Ip} from '../../core/Types.js'
import {map200, TsRestClient} from '../../core/IpClient.js'
import {makeMeta, schema} from '../../core/Schema.js'
import {z} from 'zod'

const c = initContract()

export const workspaceAccessContract = c.router({

})

export const mapWorkspaceAccess = (u: Ip.Workspace.Access): Ip.Workspace.Access => {
  return {
    ...u,
    createdAt: new Date(u.createdAt),
  }
}

export const workspaceAccessClient = (client: TsRestClient) => {
  return {

  }
}
