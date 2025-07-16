import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {makeMeta, schema} from '../core/Schema'
import {Ip} from '../core/Types'
import {mapClientResponse, TsRestClient} from '../core/IpClient'

const c = initContract()

export const serverContract = c.router({
  get: {
    method: 'GET',
    path: `/:workspaceId/kobo/server/:id`,
    pathParams: z.object({
      workspaceId: schema.uuid,
      id: schema.uuid,
    }),
    responses: {
      200: z.any() as z.ZodType<Ip.Server | undefined>,
    },
    metadata: makeMeta({
      access: {
        workspace: ['server_canGet'],
      },
    }),
  },

  getAll: {
    method: 'GET',
    path: `/:workspaceId/kobo/server`,
    pathParams: z.object({
      workspaceId: schema.uuid,
    }),
    responses: {
      200: c.type<Ip.Server[]>(),
    },
    metadata: makeMeta({
      access: {
        workspace: ['server_canGet'],
      },
    }),
  },

  create: {
    method: 'PUT',
    path: `/:workspaceId/kobo/server`,
    pathParams: z.object({
      workspaceId: schema.uuid,
    }),
    body: c.type<Omit<Ip.Server.Payload.Create, 'workspaceId'>>(),
    responses: {
      200: c.type<Ip.Server>(),
    },
    metadata: makeMeta({
      access: {
        workspace: ['server_canCreate'],
      },
    }),
  },

  delete: {
    method: 'DELETE',
    pathParams: z.object({
      workspaceId: schema.uuid,
      id: schema.uuid,
    }),
    path: `/:workspaceId/kobo/server/:id`,
    responses: {
      200: c.type<void>(),
    },
    metadata: makeMeta({
      access: {
        workspace: ['server_canDelete'],
      },
    }),
  },
})

export const serverClient = (client: TsRestClient) => {
  return {
    get: (params: {id: Ip.Uuid; workspaceId: Ip.Uuid}) => {
      return client.server.get({params}).then(mapClientResponse)
    },

    getAll: ({workspaceId}: {workspaceId: Ip.Uuid}) => {
      return client.server
        .getAll({
          params: {workspaceId},
        })
        .then(mapClientResponse)
    },

    create: ({workspaceId, ...body}: Ip.Server.Payload.Create) => {
      return client.server
        .create({
          params: {workspaceId},
          body,
        })
        .then(mapClientResponse)
    },

    delete: ({workspaceId, id}: {workspaceId: Ip.Uuid; id: Ip.Uuid}) => {
      return client.server
        .delete({
          params: {workspaceId, id},
        })
        .then(mapClientResponse)
    },
  }
}
