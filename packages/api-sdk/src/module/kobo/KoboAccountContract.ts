import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {makeMeta, schema} from '../../helper/Schema.js'
import {Api} from '../../Api.js'
import {map200, map204, TsRestClient} from '../../ApiClient.js'

const c = initContract()

export const koboAccountContract = c.router({
  get: {
    method: 'GET',
    path: `/:workspaceId/kobo/server/:id`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      id: schema.serverId,
    }),
    responses: {
      200: z.any() as z.ZodType<Api.Kobo.Account | undefined>,
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
      200: c.type<Api.Kobo.Account[]>(),
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
    body: c.type<Omit<Api.Kobo.Account.Payload.Create, 'workspaceId'>>(),
    responses: {
      200: c.type<Api.Kobo.Account>(),
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

export const koboAccountClient = (client: TsRestClient, baseUrl: string) => {
  return {
    get: (params: {id: Api.Kobo.AccountId; workspaceId: Api.WorkspaceId}) => {
      return client.kobo.account.get({params}).then(map200)
    },

    getAll: ({workspaceId}: {workspaceId: Api.WorkspaceId}) => {
      return client.kobo.account
        .getAll({
          params: {workspaceId},
        })
        .then(map200)
    },

    create: ({workspaceId, ...body}: Api.Kobo.Account.Payload.Create) => {
      return client.kobo.account
        .create({
          params: {workspaceId},
          body,
        })
        .then(map200)
    },

    delete: ({workspaceId, id}: {workspaceId: Api.WorkspaceId; id: Api.Kobo.AccountId}) => {
      return client.kobo.account
        .delete({
          params: {workspaceId, id},
        })
        .then(map204)
    },
  }
}
