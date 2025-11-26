import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {schema} from '../../helper/Schema.js'
import {map200, TsRestClient} from '../../ApiClient.js'
import {Api} from '../../Api.js'

const c = initContract()

export const permissionContract = c.router({
  getMineGlobal: {
    method: 'GET',
    path: '/permission',
    responses: {
      200: c.type<Api.Permission.Global>(),
    },
  },

  getMineByWorkspace: {
    method: 'GET',
    path: '/permission/:workspaceId',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    responses: {
      200: c.type<Api.Permission.Workspace>(),
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
      200: c.type<Api.Permission.Form>(),
    },
  },
})

export const permissionClient = (client: TsRestClient, baseUrl: string) => {
  return {
    getMineGlobal: () => client.permission.getMineGlobal().then(map200),
    getMineByWorkspace: (params: {workspaceId: Api.WorkspaceId}) =>
      client.permission.getMineByWorkspace({params}).then(map200),
    getMineByForm: (params: {formId: Api.FormId; workspaceId: Api.WorkspaceId}) =>
      client.permission.getMineByForm({params}).then(map200),
  }
}
