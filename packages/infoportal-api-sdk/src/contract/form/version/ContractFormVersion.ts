import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {Ip} from '../../../core/Types'
import {schema} from '../../../core/Schema'

export const formVersionContract = initContract().router({
  validateXlsForm: {
    method: 'POST',
    path: '/:workspaceId/form/:formId/schema/validate',
    pathParams: z.object({
      workspaceId: schema.uuid,
      formId: z.string(),
    }),
    contentType: 'multipart/form-data',
    body: z.object({
      file: z.instanceof(File),
    }),
    responses: {
      200: z.any() as z.ZodType<Ip.Form.Schema.Validation>,
    },
    metadata: {
      uploadName: 'uf-xlsform',
    },
  },

  uploadXlsForm: {
    method: 'POST',
    path: '/:workspaceId/form/:formId/schema',
    contentType: 'multipart/form-data',
    pathParams: z.object({
      workspaceId: schema.uuid,
      formId: schema.formId,
    }),
    body: z.object({
      file: z.instanceof(File),
      message: z.string().optional(),
    }),
    responses: {
      200: z.any() as z.ZodType<Ip.Form.Version>,
    },
    metadata: {
      uploadName: 'uf-xlsform',
    },
  },

  getByFormId: {
    method: 'GET',
    path: '/:workspaceId/form/:formId/versions',
    pathParams: z.object({
      workspaceId: schema.uuid,
      formId: schema.formId,
    }),
    responses: {
      200: z.any() as z.ZodType<Ip.Form.Version>,
    },
  },

  getSchema: {
    method: 'GET',
    path: '/:workspaceId/form/:formId/version/:versionId',
    pathParams: z.object({
      workspaceId: schema.uuid,
      formId: schema.formId,
      versionId: schema.uuid,
    }),
    responses: {
      200: z.any() as z.ZodType<Ip.Form.Schema>,
    },
  },
})

// export const formVersionClient = (client: any) => {
//   return {
//     validateXlsForm: ({workspaceId, formId, xlsFile}: {workspaceId: Ip.Uuid; formId: Ip.FormId; xlsFile: File}) => {
//       return client.form.version.validateXlsForm({
//         params: {
//           workspaceId,
//           formId,
//         },
//         body: {
//           file: xlsFile,
//         },
//       })
//     },
//
//     uploadXlsForm: ({
//       workspaceId,
//       formId,
//       xlsFile,
//       ...rest
//     }: {
//       workspaceId: Ip.Uuid
//       formId: Ip.FormId
//       xlsFile: File
//       message?: string
//     }) => {
//       return client.form.version
//         .uploadXlsForm({
//           params: {formId, workspaceId},
//           body: {file: xlsFile, ...rest},
//         })
//         .then(mapClientReponse)
//     },
//
//     getByFormId: ({workspaceId, formId}: {formId: Ip.FormId; workspaceId: Ip.Uuid}) => {
//       return client.form.version
//         .getByFormId({
//           params: {formId, workspaceId},
//         })
//         .then(mapClientReponse)
//     },
//
//     getSchema: ({workspaceId, formId, versionId}: {versionId: Ip.Uuid; workspaceId: Ip.Uuid; formId: Ip.FormId}) => {
//       return client.form.version
//         .getSchema({
//           params: {formId, workspaceId, versionId},
//         })
//         .then(mapClientReponse)
//     },
//   }
// }
