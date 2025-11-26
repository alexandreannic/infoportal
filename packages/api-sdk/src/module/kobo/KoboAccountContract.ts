import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {makeMeta, schema} from '../../helper/Schema.js'
import {Api} from '../../Api.js'
import {map200, map204, TsRestClient} from '../../ApiClient.js'

const c = initContract()

export const serverContract = c.router({
  get: {
    method: 'GET',
    path: `/:workspaceId/kobo/server/:id`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      id: schema.serverId,
    }),
    responses: {
      200: z.any() as z.ZodType<Api.Server | undefined>,
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
      workspaceId: schema.workspaceId,
    }),
    responses: {
      200: c.type<Api.Server[]>(),
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
      workspaceId: schema.workspaceId,
    }),
    body: c.type<Omit<Api.Server.Payload.Create, 'workspaceId'>>(),
    responses: {
      200: c.type<Api.Server>(),
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
      workspaceId: schema.workspaceId,
      id: schema.serverId,
    }),
    path: `/:workspaceId/kobo/server/:id`,
    responses: {
      204: schema.emptyResult,
    },
    metadata: makeMeta({
      access: {
        workspace: ['server_canDelete'],
      },
    }),
  },
})

export const serverClient = (client: TsRestClient, baseUrl: string) => {
  return {
    get: (params: {id: Api.ServerId; workspaceId: Api.WorkspaceId}) => {
      return client.server.get({params}).then(map200)
    },

    getAll: ({workspaceId}: {workspaceId: Api.WorkspaceId}) => {
      return client.server
        .getAll({
          params: {workspaceId},
        })
        .then(map200)
    },

    create: ({workspaceId, ...body}: Api.Server.Payload.Create) => {
      return client.server
        .create({
          params: {workspaceId},
          body,
        })
        .then(map200)
    },

    delete: ({workspaceId, id}: {workspaceId: Api.WorkspaceId; id: Api.ServerId}) => {
      return client.server
        .delete({
          params: {workspaceId, id},
        })
        .then(map204)
    },
  }
}
