import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {makeMeta, schema} from '../../../core/Schema.js'
import {Ip} from '../../../core/Types.js'
import {map200, TsRestClient} from '../../../core/IpClient.js'

const c = initContract()

export const formSmartActionContract = c.router({
  create: {
    method: 'PUT',
    path: `/:workspaceId/form/smart/:smartId/action`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      smartId: schema.smartId,
    }),
    body: c.type<Omit<Ip.Form.Smart.Payload.ActionCreate, 'smartId' | 'workspaceId'>>(),
    responses: {
      200: c.type<Ip.Form.Smart.Action>(),
    },
    metadata: makeMeta({
      access: {
        workspace: ['form_canCreate'],
      },
    }),
  },
  getByDbId: {
    method: 'GET',
    path: `/:workspaceId/form/smart/:smartId/action`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      smartId: schema.smartId,
    }),
    responses: {
      200: c.type<Ip.Form.Smart.Action[]>(),
    },
  },
})

export const formSmartActionClient = (client: TsRestClient) => {
  return {
    getByDbId: ({
      workspaceId,
      smartId,
    }: {
      workspaceId: Ip.WorkspaceId
      smartId: Ip.Form.SmartId
    }): Promise<Ip.Form.Smart.Action[]> => {
      return client.form.smart.action
        .getByDbId({
          params: {workspaceId, smartId: smartId},
        })
        .then(map200)
        .then(_ => _.map(Ip.Form.Smart.Action.map))
    },
    create: ({workspaceId, smartId, ...body}: Ip.Form.Smart.Payload.ActionCreate): Promise<Ip.Form.Smart.Action> => {
      return client.form.smart.action
        .create({
          params: {workspaceId, smartId: smartId},
          body,
        })
        .then(map200)
        .then(Ip.Form.Smart.Action.map)
    },
  }
}
