import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {makeMeta, schema} from '../../../helper/Schema.js'
import {Ip} from '../../../Api.js'
import {map200, map204, TsRestClient} from '../../../ApiClient.js'

const c = initContract()

export const formAccessContract = c.router({
  create: {
    method: 'PUT',
    path: `/:workspaceId/form/:formId/access`,
    pathParams: c.type<Ip.Access.Payload.PathParams>(),
    body: c.type<Omit<Ip.Access.Payload.Create, 'formId' | 'workspaceId'>>(),
    responses: {
      200: z.any() as z.ZodType<Ip.Access[]>,
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
    pathParams: c.type<Ip.Access.Payload.PathParams & {id: Ip.AccessId}>(),
    body: c.type<Omit<Ip.Access.Payload.Update, 'id' | 'workspaceId' | 'formId'>>(),
    responses: {
      200: z.any() as z.ZodType<Ip.Access>,
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
    pathParams: c.type<Ip.Access.Payload.PathParams & {id: Ip.AccessId}>(),
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
    body: c.type<{formId?: Ip.FormId}>(),
    pathParams: c.type<{workspaceId: Ip.WorkspaceId}>(),
    path: `/:workspaceId/access/search`,
    responses: {
      200: z.any() as z.ZodType<Ip.Access[]>,
    },
    metadata: makeMeta({
      access: {
        form: ['access_canRead'],
      },
    }),
  },

  searchMine: {
    method: 'POST',
    body: c.type<{formId?: Ip.FormId}>(),
    pathParams: c.type<{workspaceId: Ip.WorkspaceId}>(),
    path: `/:workspaceId/access/search/me`,
    responses: {
      200: z.any() as z.ZodType<Ip.Access[]>,
    },
    metadata: makeMeta({
      access: {
        form: ['canGet'],
      },
    }),
  },
})

const mapFormAccess = (_: Ip.Access): Ip.Access => {
  _.createdAt = new Date(_.createdAt)
  if (_.updatedAt) _.updatedAt = new Date(_.updatedAt)
  return _
}

export const mapFormAccessNullable = (_?: Ip.Access): undefined | Ip.Access => {
  if (_) return mapFormAccess(_)
}

export const formAccessClient = (client: TsRestClient, baseUrl: string) => {
  return {
    create: ({workspaceId, formId, ...body}: Ip.Access.Payload.Create) =>
      client.form.access
        .create({params: {workspaceId, formId}, body})
        .then(map200)
        .then(_ => _.map(mapFormAccess)),

    update: ({workspaceId, id, formId, ...body}: Ip.Access.Payload.Update) =>
      client.form.access.update({params: {workspaceId, formId, id}, body}).then(map200).then(mapFormAccess),

    remove: (params: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId; id: Ip.AccessId}) =>
      client.form.access.remove({params}).then(map204),

    search: ({workspaceId, formId}: {formId?: Ip.FormId; workspaceId: Ip.WorkspaceId}) =>
      client.form.access
        .search({body: {formId}, params: {workspaceId}})
        .then(map200)
        .then(_ => _.map(mapFormAccess)),

    searchMine: ({workspaceId}: {workspaceId: Ip.WorkspaceId}) =>
      client.form.access
        .searchMine({body: {}, params: {workspaceId}})
        .then(map200)
        .then(_ => _.map(mapFormAccess)),
  }
}
