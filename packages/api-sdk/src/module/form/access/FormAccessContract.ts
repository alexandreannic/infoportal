import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {makeMeta, schema} from '../../../helper/Schema.js'
import {Api} from '../../../Api.js'
import {map200, map204, TsRestClient} from '../../../ApiClient.js'

const c = initContract()

export const formAccessContract = c.router({
  create: {
    method: 'PUT',
    path: `/:workspaceId/form/:formId/access`,
    pathParams: c.type<Api.Access.Payload.PathParams>(),
    body: c.type<Omit<Api.Access.Payload.Create, 'formId' | 'workspaceId'>>(),
    responses: {
      200: z.any() as z.ZodType<Api.Access[]>,
    },
    metadata: makeMeta({
      access: {
        form: ['access_canAdd'],
      },
    }),
  },

  update: {
    method: 'PATCH',
    path: `/:workspaceId/form/:formId/access/:id`,
    pathParams: c.type<Api.Access.Payload.PathParams & {id: Api.AccessId}>(),
    body: c.type<Omit<Api.Access.Payload.Update, 'id' | 'workspaceId' | 'formId'>>(),
    responses: {
      200: z.any() as z.ZodType<Api.Access>,
    },
    metadata: makeMeta({
      access: {
        form: ['access_canEdit'],
      },
    }),
  },

  remove: {
    method: 'DELETE',
    path: `/:workspaceId/form/:formId/access/:id`,
    pathParams: c.type<Api.Access.Payload.PathParams & {id: Api.AccessId}>(),
    responses: {
      204: schema.emptyResult,
    },
    metadata: makeMeta({
      access: {
        form: ['access_canDelete'],
      },
    }),
  },

  search: {
    method: 'POST',
    body: c.type<{formId?: Api.FormId}>(),
    pathParams: c.type<{workspaceId: Api.WorkspaceId}>(),
    path: `/:workspaceId/access/search`,
    responses: {
      200: z.any() as z.ZodType<Api.Access[]>,
    },
    metadata: makeMeta({
      access: {
        form: ['access_canRead'],
      },
    }),
  },

  searchMine: {
    method: 'POST',
    body: c.type<{formId?: Api.FormId}>(),
    pathParams: c.type<{workspaceId: Api.WorkspaceId}>(),
    path: `/:workspaceId/access/search/me`,
    responses: {
      200: z.any() as z.ZodType<Api.Access[]>,
    },
    metadata: makeMeta({
      access: {
        form: ['canGet'],
      },
    }),
  },
})

const mapFormAccess = (_: Api.Access): Api.Access => {
  _.createdAt = new Date(_.createdAt)
  if (_.updatedAt) _.updatedAt = new Date(_.updatedAt)
  return _
}

export const mapFormAccessNullable = (_?: Api.Access): undefined | Api.Access => {
  if (_) return mapFormAccess(_)
}

export const formAccessClient = (client: TsRestClient, baseUrl: string) => {
  return {
    create: ({workspaceId, formId, ...body}: Api.Access.Payload.Create) =>
      client.form.access
        .create({params: {workspaceId, formId}, body})
        .then(map200)
        .then(_ => _.map(mapFormAccess)),

    update: ({workspaceId, id, formId, ...body}: Api.Access.Payload.Update) =>
      client.form.access.update({params: {workspaceId, formId, id}, body}).then(map200).then(mapFormAccess),

    remove: (params: {workspaceId: Api.WorkspaceId; formId: Api.FormId; id: Api.AccessId}) =>
      client.form.access.remove({params}).then(map204),

    search: ({workspaceId, formId}: {formId?: Api.FormId; workspaceId: Api.WorkspaceId}) =>
      client.form.access
        .search({body: {formId}, params: {workspaceId}})
        .then(map200)
        .then(_ => _.map(mapFormAccess)),

    searchMine: ({workspaceId}: {workspaceId: Api.WorkspaceId}) =>
      client.form.access
        .searchMine({body: {}, params: {workspaceId}})
        .then(map200)
        .then(_ => _.map(mapFormAccess)),
  }
}
