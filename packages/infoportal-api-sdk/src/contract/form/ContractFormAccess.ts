import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {makeMeta, schema} from '../../core/Schema.js'
import {Ip} from '../../core/Types.js'
import {mapClientResponse, TsRestClient} from '../../core/IpClient.js'

const c = initContract()

export const formAccessContract = c.router({
  create: {
    method: 'PUT',
    path: `/:workspaceId/form/:formId/access`,
    pathParams: c.type<Ip.Form.Access.Payload.PathParams>(),
    body: c.type<Omit<Ip.Form.Access.Payload.Create, 'formId' | 'workspaceId'>>(),
    responses: {
      200: z.any() as z.ZodType<Ip.Form.Access[]>,
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
    pathParams: c.type<Ip.Form.Access.Payload.PathParams & {id: Ip.Form.AccessId}>(),
    body: c.type<Omit<Ip.Form.Access.Payload.Update, 'id' | 'workspaceId' | 'formId'>>(),
    responses: {
      200: z.any() as z.ZodType<Ip.Form.Access>,
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
    pathParams: c.type<Ip.Form.Access.Payload.PathParams & {id: Ip.Form.AccessId}>(),
    responses: {
      200: schema.formAccessId,
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
      200: z.any() as z.ZodType<Ip.Form.Access[]>,
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
      200: z.any() as z.ZodType<Ip.Form.Access[]>,
    },
    metadata: makeMeta({
      access: {
        form: ['canGet'],
      },
    }),
  },
})

const mapFormAccess = (_: Ip.Form.Access): Ip.Form.Access => {
  _.createdAt = new Date(_.createdAt)
  if (_.updatedAt) _.updatedAt = new Date(_.updatedAt)
  return _
}

export const mapFormAccessNullable = (_?: Ip.Form.Access): undefined | Ip.Form.Access => {
  if (_) return mapFormAccess(_)
}

export const formAccessClient = (client: TsRestClient) => {
  return {
    create: ({workspaceId, formId, ...body}: Ip.Form.Access.Payload.Create) =>
      client.form.access
        .create({params: {workspaceId, formId}, body})
        .then(mapClientResponse)
        .then(_ => _.map(mapFormAccess)),

    update: ({workspaceId, id, formId, ...body}: Ip.Form.Access.Payload.Update) =>
      client.form.access.update({params: {workspaceId, formId, id}, body}).then(mapClientResponse).then(mapFormAccess),

    remove: (params: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId; id: Ip.Form.AccessId}) =>
      client.form.access.remove({params}).then(mapClientResponse),

    search: ({workspaceId, formId}: {formId?: Ip.FormId; workspaceId: Ip.WorkspaceId}) =>
      client.form.access
        .search({body: {formId}, params: {workspaceId}})
        .then(mapClientResponse)
        .then(_ => _.map(mapFormAccess)),

    searchMine: ({workspaceId}: {workspaceId: Ip.WorkspaceId}) =>
      client.form.access
        .searchMine({body: {}, params: {workspaceId}})
        .then(mapClientResponse)
        .then(_ => _.map(mapFormAccess)),
  }
}
