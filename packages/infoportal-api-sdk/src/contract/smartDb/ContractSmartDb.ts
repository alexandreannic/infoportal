import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {makeMeta, schema} from '../../core/Schema.js'
import {Ip} from '../../core/Types.js'
import {map200, TsRestClient} from '../../core/IpClient.js'

const c = initContract()

export const smartDbContract = c.router({
  create: {
    method: 'PUT',
    path: `/:workspaceId/smart-db`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    body: c.type<Omit<Ip.SmartDb.Payload.Create, 'workspaceId'>>(),
    responses: {
      200: c.type<Ip.SmartDb>(),
    },
    metadata: makeMeta({
      access: {
        workspace: ['form_canCreate'],
      },
    }),
  },
  getAll: {
    method: 'GET',
    path: `/:workspaceId/smart-db`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    responses: {
      200: c.type<Ip.SmartDb[]>(),
    },
  },
})

export const smartDbClient = (client: TsRestClient) => {
  return {
    getAll: ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
      return client.smartDb
        .getAll({
          params: {workspaceId},
        })
        .then(map200)
        .then(_ => _.map(Ip.SmartDb.map))
    },
    create: ({workspaceId, ...body}: Ip.SmartDb.Payload.Create) => {
      return client.smartDb
        .create({
          params: {workspaceId},
          body,
        })
        .then(map200)
        .then(Ip.SmartDb.map)
    },
  }
}
