import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {makeMeta, schema} from '../../core/Schema.js'
import {Ip} from '../../core/Types.js'
import {map200, TsRestClient} from '../../core/IpClient.js'

const c = initContract()

export const formActionContract = c.router({
  create: {
    method: 'PUT',
    path: `/:workspaceId/form/:formId/action`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    body: c.type<Omit<Ip.Form.Action.Payload.Create, 'formId' | 'workspaceId'>>(),
    responses: {
      200: c.type<Ip.Form.Action>(),
    },
    metadata: makeMeta({
      access: {
        workspace: ['form_canCreate'],
      },
    }),
  },
  getByDbId: {
    method: 'GET',
    path: `/:workspaceId/form/:formId/action`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    responses: {
      200: c.type<Ip.Form.Action[]>(),
    },
  },
})

export const formActionClient = (client: TsRestClient) => {
  return {
    getByDbId: ({workspaceId, formId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}): Promise<Ip.Form.Action[]> => {
      return client.form.action
        .getByDbId({
          params: {workspaceId, formId: formId},
        })
        .then(map200)
        .then(_ => _.map(Ip.Form.Action.map))
    },
    create: ({workspaceId, formId, ...body}: Ip.Form.Action.Payload.Create): Promise<Ip.Form.Action> => {
      return client.form.action
        .create({
          params: {workspaceId, formId},
          body,
        })
        .then(map200)
        .then(Ip.Form.Action.map)
    },
  }
}
