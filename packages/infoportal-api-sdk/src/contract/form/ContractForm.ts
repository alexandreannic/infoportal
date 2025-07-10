import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {schema} from '../../core/Schema'
import {Ip} from '../../core/Types'
import {mapClientResponse, TsRestClient} from '../../core/IpClient'

const c = initContract()

export const formContract = c.router({
  refreshAll: {
    method: 'POST',
    path: '/:workspaceId/form/refresh',
    body: c.type<void>(),
    pathParams: z.object({
      workspaceId: schema.uuid,
    }),
    responses: {
      200: z.void(),
    },
  },

  getSchema: {
    method: 'GET',
    path: '/:workspaceId/form/:formId/schema',
    pathParams: z.object({
      workspaceId: schema.uuid,
      formId: schema.formId,
    }),
    responses: {
      200: z.any() as z.ZodType<Ip.Form.Schema | undefined>,
    },
  },

  getSchemaByVersion: {
    method: 'GET',
    path: '/:workspaceId/form/:formId/schema/:versionId',
    pathParams: z.object({
      workspaceId: schema.uuid,
      formId: schema.formId,
      versionId: schema.uuid,
    }),
    responses: {
      200: z.any() as z.ZodType<Ip.Form.Schema | undefined>,
    },
  },

  create: {
    method: 'PUT',
    path: '/:workspaceId/form',
    pathParams: z.object({
      workspaceId: schema.uuid,
    }),
    body: c.type<Ip.Form.Payload.Create>(),
    responses: {
      200: z.any() as z.ZodType<Ip.Form>,
    },
  },

  get: {
    method: 'GET',
    path: '/:workspaceId/form/:formId',
    pathParams: z.object({
      workspaceId: schema.uuid,
      formId: z.string(),
    }),
    responses: {
      200: z.any() as z.ZodType<Ip.Form | undefined>,
    },
  },

  remove: {
    method: 'DELETE',
    path: '/:workspaceId/form/:formId',
    pathParams: z.object({
      workspaceId: schema.uuid,
      formId: z.string(),
    }),
    responses: {
      200: z.number(),
    },
  },

  getAll: {
    method: 'GET',
    path: '/:workspaceId/form',
    pathParams: z.object({
      workspaceId: schema.uuid,
    }),
    responses: {
      200: z.any() as z.ZodType<Ip.Form[]>,
    },
  },
})

export const mapForm = (_: Ip.Form): Ip.Form => {
  if (_.updatedAt) _.updatedAt = new Date(_.updatedAt)
  _.createdAt = new Date(_.createdAt)
  return _ as any
}

export const mapFormNullable = (_?: Ip.Form): undefined | Ip.Form => {
  if (_) return mapForm(_)
}

export const formClient = (client: TsRestClient) => {
  return {
    refreshAll: ({workspaceId}: {workspaceId: Ip.Uuid}) => {
      return client.form.refreshAll({params: {workspaceId}, body: undefined}).then(mapClientResponse)
    },

    create: ({workspaceId, ...body}: {workspaceId: Ip.Uuid; name: string; category?: string}) => {
      return client.form.create({params: {workspaceId}, body}).then(mapClientResponse).then(mapForm)
    },

    remove: ({formId, workspaceId}: {workspaceId: Ip.Uuid; formId: string}) => {
      return client.form.remove({params: {workspaceId, formId}}).then(mapClientResponse)
    },

    get: ({formId, workspaceId}: {workspaceId: Ip.Uuid; formId: string}) => {
      return client.form.get({params: {workspaceId, formId}}).then(mapClientResponse).then(mapFormNullable)
    },

    getAll: ({workspaceId}: {workspaceId: Ip.Uuid}) => {
      return client.form
        .getAll({params: {workspaceId}})
        .then(mapClientResponse)
        .then(_ => _.map(mapForm))
    },

    getSchemaByVersion: (params: {workspaceId: Ip.Uuid; formId: Ip.FormId; versionId: Ip.Uuid}) => {
      return client.form.getSchemaByVersion({params}).then(mapClientResponse)
    },

    getSchema: (params: {workspaceId: Ip.Uuid; formId: Ip.FormId}) => {
      return client.form.getSchema({params}).then(mapClientResponse)
    },
  }
}
