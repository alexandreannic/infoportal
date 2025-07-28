import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {schema} from '../core/Schema.js'
import {map200, TsRestClient} from '../core/IpClient.js'
import {Ip} from '../core/Types.js'

const c = initContract()

export const permissionContract = c.router({
  getMineGlobal: {
    method: 'GET',
    path: '/permission',
    responses: {
      200: c.type<Ip.Permission.Global>(),
    },
  },

  getMineByWorkspace: {
    method: 'GET',
    path: '/permission/:workspaceId',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    responses: {
      200: c.type<Ip.Permission.Workspace>(),
    },
  },

  getMineByForm: {
    method: 'GET',
    path: '/permission/:workspaceId/:formId',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    responses: {
      200: c.type<Ip.Permission.Form>(),
    },
  },
})

export const permissionClient = (client: TsRestClient) => {
  return {
    getMineGlobal: () => client.permission.getMineGlobal().then(map200),
    getMineByWorkspace: (params: {workspaceId: Ip.WorkspaceId}) =>
      client.permission.getMineByWorkspace({params}).then(map200),
    getMineByForm: (params: {formId: Ip.FormId; workspaceId: Ip.WorkspaceId}) =>
      client.permission.getMineByForm({params}).then(map200),
  }
}
