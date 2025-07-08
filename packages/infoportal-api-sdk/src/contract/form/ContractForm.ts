import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {schema} from '../../core/Schema'
import {Ip} from '../../core/Types'
import {Kobo} from 'kobo-sdk'
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

  importFromKobo: {
    method: 'POST',
    path: '/:workspaceId/form/kobo',
    pathParams: z.object({
      workspaceId: schema.uuid,
    }),
    body: c.type<Ip.Form.Payload.Import>(),
    responses: {
      200: z.any() as z.ZodType<Ip.Form>,
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

export const formClient = (client: TsRestClient) => {
  const mapForm = (_: Ip.Form): Ip.Form => {
    if (_.updatedAt) _.updatedAt = new Date(_.updatedAt)
    _.createdAt = new Date(_.createdAt)
    return _ as any
  }

  const mapFormNullable = (_?: Ip.Form): undefined | Ip.Form => {
    if (_) return mapForm(_)
  }

  return {
    refreshAll: ({workspaceId}: {workspaceId: Ip.Uuid}) => {
      return client.form.refreshAll({params: {workspaceId}, body: undefined}).then(mapClientResponse)
    },

    create: ({workspaceId, ...body}: {workspaceId: Ip.Uuid; name: string; category?: string}) => {
      return client.form.create({params: {workspaceId}, body}).then(mapClientResponse).then(mapForm)
    },

    importFromKobo: ({workspaceId, ...body}: {workspaceId: Ip.Uuid; serverId: Ip.Uuid; uid: Kobo.FormId}) => {
      return client.form.importFromKobo({params: {workspaceId}, body}).then(mapClientResponse).then(mapForm)
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
  }
}
