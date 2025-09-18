import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {makeMeta, schema} from '../../core/Schema.js'
import {Ip} from '../../core/Types.js'
import {map200, map204, TsRestClient} from '../../core/IpClient.js'

const c = initContract()

export const formContract = c.router({
  getMine: {
    method: 'GET',
    path: '/:workspaceId/form/me',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    responses: {
      200: z.any() as z.ZodType<Ip.Form[]>,
    },
  },

  refreshAll: {
    method: 'POST',
    path: '/:workspaceId/form/refresh',
    body: c.type<void>(),
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    responses: {
      200: z.void(),
    },
    metadata: makeMeta({
      access: {
        form: ['canSyncWithKobo'],
      },
    }),
  },

  getSchema: {
    method: 'GET',
    path: '/:workspaceId/form/:formId/schema',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
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
      workspaceId: schema.workspaceId,
      formId: schema.formId,
      versionId: schema.versionId,
    }),
    responses: {
      200: z.any() as z.ZodType<Ip.Form.Schema | undefined>,
    },
    metadata: makeMeta({
      access: {
        form: ['canGet'],
      },
    }),
  },

  update: {
    method: 'PATCH',
    path: '/:workspaceId/form/:formId',
    pathParams: c.type<Pick<Ip.Form.Payload.Update, 'workspaceId' | 'formId'>>(),
    body: c.type<Omit<Ip.Form.Payload.Update, 'workspaceId' | 'formId'>>(),
    responses: {
      200: z.any() as z.ZodType<Ip.Form>,
    },
    metadata: makeMeta({
      access: {
        form: ['canUpdate'],
      },
    }),
  },

  updateKoboConnexion: {
    method: 'POST',
    path: '/:workspaceId/form/:formId/disconnect',
    pathParams: c.type<Pick<Ip.Form.Payload.UpdateKoboConnexion, 'workspaceId' | 'formId'>>(),
    body: c.type<Omit<Ip.Form.Payload.UpdateKoboConnexion, 'workspaceId' | 'formId'>>(),
    responses: {
      200: z.any() as z.ZodType<Ip.Form>,
    },
    metadata: makeMeta({
      access: {
        form: ['canUpdate'],
      },
    }),
  },

  create: {
    method: 'PUT',
    path: '/:workspaceId/form',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    body: c.type<Omit<Ip.Form.Payload.Create, 'workspaceId'>>(),
    responses: {
      200: z.any() as z.ZodType<Ip.Form>,
    },
    metadata: makeMeta({
      access: {
        workspace: ['form_canCreate'],
      },
    }),
  },

  get: {
    method: 'GET',
    path: '/:workspaceId/form/:formId',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    responses: {
      200: z.any() as z.ZodType<Ip.Form | undefined>,
    },
    metadata: makeMeta({
      access: {
        form: ['canGet'],
      },
    }),
  },

  remove: {
    method: 'DELETE',
    path: '/:workspaceId/form/:formId',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    responses: {
      204: schema.emptyResult,
    },
    metadata: makeMeta({
      access: {
        form: ['canDelete'],
      },
    }),
  },

  getAll: {
    method: 'GET',
    path: '/:workspaceId/form',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    responses: {
      200: z.any() as z.ZodType<Ip.Form[]>,
    },
    metadata: makeMeta({
      access: {
        // global: ['form_canGetAll'],
        workspace: ['form_canGetAll'],
      },
    }),
  },
})

export const formClient = (client: TsRestClient, baseUrl: string) => {
  return {
    refreshAll: ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
      return client.form.refreshAll({params: {workspaceId}, body: undefined}).then(map200)
    },

    create: ({workspaceId, ...body}: Ip.Form.Payload.Create) => {
      return client.form.create({params: {workspaceId}, body}).then(map200).then(Ip.Form.map)
    },

    remove: ({formId, workspaceId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) => {
      return client.form.remove({params: {workspaceId, formId}}).then(map204)
    },

    get: ({formId, workspaceId}: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) => {
      return client.form
        .get({params: {workspaceId, formId}})
        .then(map200)
        .then(_ => (_ ? Ip.Form.map(_) : _))
    },

    getAll: ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
      return client.form
        .getAll({params: {workspaceId}})
        .then(map200)
        .then(_ => _.map(Ip.Form.map))
    },

    getMine: ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
      return client.form
        .getMine({params: {workspaceId}})
        .then(map200)
        .then(_ => _.map(Ip.Form.map))
    },

    getSchemaByVersion: (params: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId; versionId: Ip.Form.VersionId}) => {
      return client.form.getSchemaByVersion({params}).then(map200)
    },

    getSchema: (params: {workspaceId: Ip.WorkspaceId; formId: Ip.FormId}) => {
      return client.form.getSchema({params}).then(map200)
    },

    update: ({workspaceId, formId, ...body}: Ip.Form.Payload.Update): Promise<Ip.Form> => {
      return client.form.update({params: {workspaceId, formId}, body}).then(map200).then(Ip.Form.map)
    },

    updateKoboConnexion: ({workspaceId, formId, ...body}: Ip.Form.Payload.UpdateKoboConnexion): Promise<Ip.Form> => {
      return client.form.updateKoboConnexion({params: {workspaceId, formId}, body}).then(map200).then(Ip.Form.map)
    },
  }
}
