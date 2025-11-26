import {initContract} from '@ts-rest/core'
import {makeMeta, schema} from '../../helper/Schema.js'
import {z} from 'zod'
import {Api} from '../../Api.js'
import {map200, map204, TsRestClient} from '../../ApiClient.js'

const c = initContract()

export const groupContract = c.router({
  create: {
    method: 'PUT',
    path: `/:workspaceId/group`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    body: c.type<Omit<Api.Group.Payload.Create, 'workspaceId'>>(),
    responses: {
      200: z.any() as z.ZodType<Api.Group>,
    },
    metadata: makeMeta({
      access: {
        workspace: ['group_canCreate'],
      },
    }),
  },

  update: {
    method: 'PATCH',
    path: `/:workspaceId/group/:id`,
    body: c.type<Omit<Api.Group.Payload.Update, 'workspaceId' | 'id'>>(),
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      id: schema.groupId,
    }),
    responses: {
      200: z.any() as z.ZodType<Api.Group>,
    },
    metadata: makeMeta({
      access: {
        workspace: ['group_canUpdate'],
      },
    }),
  },
  // ({workspaceId, id, ...body}: Api.Group.Payload.Update) => {
  //     return this.client.post<Group>(`/${workspaceId}/group/${id}`, {body})
  //   }

  remove: {
    method: 'DELETE',
    path: `/:workspaceId/group/:id`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      id: schema.groupId,
    }),
    responses: {
      204: schema.emptyResult,
    },
    metadata: makeMeta({
      access: {
        workspace: ['group_canDelete'],
      },
    }),
  },

  search: {
    method: 'POST',
    path: `/:workspaceId/group/search`,
    body: c.type<Omit<Api.Group.Payload.Search, 'workspaceId'>>(),
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    responses: {
      200: z.any() as z.ZodType<Api.Group[]>,
    },
    metadata: makeMeta({
      access: {
        workspace: ['group_canRead'],
      },
    }),
  },

  updateItem: {
    method: 'PATCH',
    path: `/:workspaceId/group/item/:id`,
    body: c.type<Omit<Api.Group.Payload.ItemUpdate, 'workspaceId' | 'id'>>(),
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      id: schema.groupItemId,
    }),
    responses: {
      200: z.any() as z.ZodType<Api.Group.Item>,
    },
    metadata: makeMeta({
      access: {
        workspace: ['group_canUpdate'],
      },
    }),
  },

  deleteItem: {
    method: 'DELETE',
    path: `/:workspaceId/group/item/:id`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      id: schema.groupItemId,
    }),
    responses: {
      204: schema.emptyResult,
    },
    metadata: makeMeta({
      access: {
        workspace: ['group_canDelete'],
      },
    }),
  },

  createItem: {
    method: 'PUT',
    path: `/:workspaceId/group/:groupId/item`,
    body: c.type<Omit<Api.Group.Payload.ItemCreate, 'workspaceId' | 'groupId'>>(),
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      groupId: schema.groupId,
    }),
    responses: {
      200: z.any() as z.ZodType<Api.Group.Item[]>,
    },
    metadata: makeMeta({
      access: {
        workspace: ['group_canCreate'],
      },
    }),
  },
})

export const groupClient = (client: TsRestClient, baseUrl: string) => {
  return {
    create: ({workspaceId, ...body}: Api.Group.Payload.Create) => {
      return client.group.create({params: {workspaceId}, body}).then(map200)
    },

    update: ({workspaceId, id, ...body}: Api.Group.Payload.Update) => {
      return client.group.update({params: {workspaceId, id}, body}).then(map200)
    },

    remove: async ({workspaceId, id}: {workspaceId: Api.WorkspaceId; id: Api.GroupId}) => {
      await client.group.remove({params: {workspaceId, id}}).then(map204)
    },

    search: async ({workspaceId, ...body}: {workspaceId: Api.WorkspaceId; name?: string}): Promise<Api.Group[]> => {
      return client.group.search({params: {workspaceId}, body}).then(map200)
    },

    updateItem: ({workspaceId, id, ...body}: Api.Group.Payload.ItemUpdate) => {
      return client.group.updateItem({params: {workspaceId, id}, body}).then(map200)
    },

    deleteItem: ({id, workspaceId}: {workspaceId: Api.WorkspaceId; id: Api.Group.ItemId}) => {
      return client.group.deleteItem({params: {workspaceId, id}}).then(map204)
    },

    createItem: ({workspaceId, groupId, ...body}: Api.Group.Payload.ItemCreate) => {
      return client.group.createItem({params: {workspaceId, groupId}, body}).then(map200)
    },
  }
}
