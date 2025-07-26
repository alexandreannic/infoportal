import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {Ip} from '../../core/Types.js'
import {makeMeta, schema} from '../../core/Schema.js'
import {mapClientResponse, TsRestClient} from '../../core/IpClient.js'

const c = initContract()

export const formVersionContract = c.router({
  validateXlsForm: {
    method: 'POST',
    path: '/:workspaceId/form/:formId/schema/validate',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    contentType: 'multipart/form-data',
    body: c.type<{
      file: File
    }>(),
    responses: {
      200: z.any() as z.ZodType<Ip.Form.Schema.Validation>,
    },
    metadata: makeMeta({
      access: {
        form: ['version_canCreate'],
      },
    }),
  },

  uploadXlsForm: {
    method: 'POST',
    path: '/:workspaceId/form/:formId/schema',
    contentType: 'multipart/form-data',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    body: c.type<{
      file: File
      message?: string
    }>(),
    responses: {
      200: z.any() as z.ZodType<Ip.Form.Version>,
    },
    metadata: makeMeta({
      access: {
        form: ['version_canCreate'],
      },
    }),
  },

  getByFormId: {
    method: 'GET',
    path: '/:workspaceId/form/:formId/versions',
    // pathParams: c.type<{
    //   workspaceId: Ip.WorkspaceId
    //   formId: Ip.FormId
    // }>(),
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    responses: {
      200: z.array(z.custom<Ip.Form.Version>()),
    },
    metadata: makeMeta({
      access: {
        form: ['version_canGet'],
      },
    }),
  },

  deployLast: {
    method: 'POST',
    path: '/:workspaceId/form/:formId/version',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    body: z.object({}),
    responses: {
      200: z.custom<Ip.Form.Version>(),
    },
    metadata: makeMeta({
      access: {
        form: ['version_canDeploy'],
      },
    }),
  },
})

export const formVersionClient = (client: TsRestClient) => {
  return {
    validateXlsForm: ({
      workspaceId,
      formId,
      xlsFile,
    }: {
      workspaceId: Ip.WorkspaceId
      formId: Ip.FormId
      xlsFile: File
    }) => {
      return client.form.version
        .validateXlsForm({
          params: {
            workspaceId,
            formId,
          },
          body: {file: xlsFile},
        })
        .then(mapClientResponse)
    },

    uploadXlsForm: ({
      workspaceId,
      formId,
      xlsFile,
      message,
    }: {
      workspaceId: Ip.WorkspaceId
      formId: Ip.FormId
      xlsFile: File
      message?: string
    }) => {
      const formData = new FormData()
      formData.append('file', xlsFile)
      if (message) formData.append('message', message)
      return client.form.version
        .uploadXlsForm({
          params: {formId, workspaceId},
          body: formData,
        })
        .then(mapClientResponse)
    },

    getByFormId: ({workspaceId, formId}: {formId: Ip.FormId; workspaceId: Ip.WorkspaceId}) => {
      return client.form.version
        .getByFormId({
          params: {formId, workspaceId},
        })
        .then(mapClientResponse)
    },

    deployLast: ({workspaceId, formId}: {formId: Ip.FormId; workspaceId: Ip.WorkspaceId}) => {
      return client.form.version
        .deployLast({
          params: {workspaceId, formId},
        })
        .then(mapClientResponse)
    },
  }
}
