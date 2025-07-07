import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {schema} from '../core/Schema'
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
  },

  create: {
    method: 'PUT',
    path: `/:workspaceId/kobo/server`,
    pathParams: z.object({
      workspaceId: schema.uuid,
    }),
    body: c.type<Omit<Ip.Server, 'id' | 'workspaceId'>>(),
    responses: {
      200: c.type<Ip.Server>(),
    },
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

    create: ({workspaceId, ...body}: Omit<Ip.Server, 'id'>) => {
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
