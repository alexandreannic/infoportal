import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {Api} from '../../Api.js'
import {makeMeta, schema} from '../../helper/Schema.js'
import {map200, TsRestClient} from '../../ApiClient.js'

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
      200: z.any() as z.ZodType<Api.Form.Schema.Validation>,
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
      200: z.any() as z.ZodType<Api.Form.Version>,
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
    //   workspaceId: Api.WorkspaceId
    //   formId: Api.FormId
    // }>(),
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    responses: {
      200: z.array(z.custom<Api.Form.Version>()),
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
      200: z.custom<Api.Form.Version>(),
    },
    metadata: makeMeta({
      access: {
        form: ['version_canDeploy'],
      },
    }),
  },

  importLastKoboSchema: {
    method: 'POST',
    path: '/:workspaceId/form/:formId/version/import-kobo',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    body: z.object({}),
    responses: {
      200: z.custom<Api.Form.Version>(),
    },
    metadata: makeMeta({
      access: {
        form: ['version_canCreate'],
      },
    }),
  },
  createNewVersion: {
    method: 'POST',
    path: '/form/version/createNewVersion',
    body: z.custom<Api.Form.Version.Payload.CreateNewVersion>(),
    responses: {
      200: z.custom<Api.Form.Version>(),
    },
    metadata: makeMeta({
      access: {
        form: ['version_canCreate'],
      },
    }),
  },
})

export const formVersionClient = (client: TsRestClient, baseUrl: string) => {
  return {
    validateXlsForm: ({
      workspaceId,
      formId,
      xlsFile,
    }: {
      workspaceId: Api.WorkspaceId
      formId: Api.FormId
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
        .then(map200)
    },

    uploadXlsForm: ({
      workspaceId,
      formId,
      xlsFile,
      message,
    }: {
      workspaceId: Api.WorkspaceId
      formId: Api.FormId
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
        .then(map200)
    },

    getByFormId: ({workspaceId, formId}: {formId: Api.FormId; workspaceId: Api.WorkspaceId}) => {
      return client.form.version
        .getByFormId({
          params: {formId, workspaceId},
        })
        .then(map200)
    },

    deployLast: ({workspaceId, formId}: {formId: Api.FormId; workspaceId: Api.WorkspaceId}) => {
      return client.form.version
        .deployLast({
          params: {workspaceId, formId},
        })
        .then(map200)
    },

    importLastKoboSchema: ({workspaceId, formId}: {formId: Api.FormId; workspaceId: Api.WorkspaceId}) => {
      return client.form.version
        .importLastKoboSchema({
          params: {workspaceId, formId},
        })
        .then(map200)
    },

    createNewVersion: (body: Api.Form.Version.Payload.CreateNewVersion) => {
      return client.form.version.createNewVersion({body}).then(map200)
    },
  }
}
