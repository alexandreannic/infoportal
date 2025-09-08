import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {makeMeta, schema} from '../../core/Schema.js'
import {Ip} from '../../core/Types.js'
import {map200, TsRestClient} from '../../core/IpClient.js'

const c = initContract()

export const smartDbActionContract = c.router({
  create: {
    method: 'PUT',
    path: `/:workspaceId/smart-db/:smartDbId/action`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      smartDbId: schema.smartDbId,
    }),
    body: c.type<Omit<Ip.SmartDb.Payload.ActionCreate, 'smartDbId' | 'workspaceId'>>(),
    responses: {
      200: c.type<Ip.SmartDb.Action>(),
    },
    metadata: makeMeta({
      access: {
        workspace: ['form_canCreate'],
      },
    }),
  },
  getByDbId: {
    method: 'GET',
    path: `/:workspaceId/smart-db/:smartDbId/action`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      smartDbId: schema.smartDbId,
    }),
    responses: {
      200: c.type<Ip.SmartDb.Action[]>(),
    },
  },
})

export const smartDbActionClient = (client: TsRestClient) => {
  return {
    getByDbId: ({
      workspaceId,
      smartDbId,
    }: {
      workspaceId: Ip.WorkspaceId
      smartDbId: Ip.SmartDbId
    }): Promise<Ip.SmartDb.Action[]> => {
      return client.smartDb.action
        .getByDbId({
          params: {workspaceId, smartDbId},
        })
        .then(map200)
        .then(_ => _.map(Ip.SmartDb.Action.map))
    },
    create: ({workspaceId, smartDbId, ...body}: Ip.SmartDb.Payload.ActionCreate): Promise<Ip.SmartDb.Action> => {
      return client.smartDb.action
        .create({
          params: {workspaceId, smartDbId},
          body,
        })
        .then(map200)
        .then(Ip.SmartDb.Action.map)
    },
  }
}
