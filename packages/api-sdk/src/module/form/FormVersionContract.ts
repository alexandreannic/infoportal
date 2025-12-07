import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {Api} from '../../Api.js'
import {makeMeta, schema} from '../../helper/Schema.js'
import {map200, TsRestClient} from '../../ApiClient.js'

const c = initContract()

export const formVersionContract = c.router({
  validateXlsForm: {
    method: 'POST',
    path: '/form/version/validateXlsForm/:workspaceId/:formId',
    contentType: 'multipart/form-data',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    body: c.type<{
      file: File
    }>(),
    responses: {
      200: z.any() as z.ZodType<Api.Form.Schema.ValidationWithSchema>,
    },
    metadata: makeMeta({
      access: {
        form: ['version_canCreate'],
      },
    }),
  },

  uploadXlsForm: {
    method: 'POST',
    path: '/form/version/uploadXlsForm/:workspaceId/:formId',
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
    method: 'POST',
    path: '/form/version/getByFormId',
    body: c.type<{
      workspaceId: Api.WorkspaceId
      formId: Api.FormId
    }>(),
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
    path: '/form/version/deployLast',
    body: c.type<{
      workspaceId: Api.WorkspaceId
      formId: Api.FormId
    }>(),
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
    path: '/form/version/importLastKoboSchema',
    body: c.type<{
      workspaceId: Api.WorkspaceId
      formId: Api.FormId
    }>(),
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
          body: {file: xlsFile},
          params: {workspaceId, formId},
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
          body: {formId, workspaceId},
        })
        .then(map200)
    },

    deployLast: ({workspaceId, formId}: {formId: Api.FormId; workspaceId: Api.WorkspaceId}) => {
      return client.form.version
        .deployLast({
          body: {workspaceId, formId},
        })
        .then(map200)
    },

    importLastKoboSchema: ({workspaceId, formId}: {formId: Api.FormId; workspaceId: Api.WorkspaceId}) => {
      return client.form.version
        .importLastKoboSchema({
          body: {workspaceId, formId},
        })
        .then(map200)
    },

    createNewVersion: (body: Api.Form.Version.Payload.CreateNewVersion) => {
      return client.form.version.createNewVersion({body}).then(map200)
    },
  }
}
