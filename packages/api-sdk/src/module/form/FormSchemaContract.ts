import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {makeMeta, schema} from '../../helper/Schema.js'
import {Api} from '../../Api.js'
import {map200, TsRestClient} from '../../ApiClient.js'

const c = initContract()

export const formSchemaContract = c.router({
  get: {
    method: 'POST',
    path: '/form/schema/get',
    body: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    responses: {
      200: z.any() as z.ZodType<Api.Form.Schema | undefined>,
    },
  },

  getXml: {
    method: 'POST',
    path: '/form/schema/getXml',
    body: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    responses: {
      200: z.any() as z.ZodType<Api.Form.SchemaXml | undefined>,
    },
  },

  getByVersion: {
    method: 'POST',
    path: '/form/schema/getByVersion',
    body: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
      versionId: schema.versionId,
    }),
    responses: {
      200: z.any() as z.ZodType<Api.Form.Schema | undefined>,
    },
    metadata: makeMeta({
      access: {
        form: ['canGet'],
      },
    }),
  },

  getByVersionXml: {
    method: 'POST',
    path: '/form/schema/getByVersionXml',
    body: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
      versionId: schema.versionId,
    }),
    responses: {
      200: z.any() as z.ZodType<Api.Form.SchemaXml | undefined>,
    },
    metadata: makeMeta({
      access: {
        form: ['canGet'],
      },
    }),
  },
})

export const formSchemaClient = (client: TsRestClient) => {
  return {
    get: (body: {workspaceId: Api.WorkspaceId; formId: Api.FormId}) => {
      return client.form.schema.get({body}).then(map200)
    },

    getXml: (body: {workspaceId: Api.WorkspaceId; formId: Api.FormId}) => {
      return client.form.schema.getXml({body}).then(map200)
    },

    getByVersion: (body: {workspaceId: Api.WorkspaceId; formId: Api.FormId; versionId: Api.Form.VersionId}) => {
      return client.form.schema.getByVersion({body}).then(map200)
    },

    getByVersionXml: (body: {workspaceId: Api.WorkspaceId; formId: Api.FormId; versionId: Api.Form.VersionId}) => {
      return client.form.schema.getByVersionXml({body}).then(map200)
    },
  }
}
