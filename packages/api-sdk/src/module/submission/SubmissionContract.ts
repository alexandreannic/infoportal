import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {makeMeta, schema} from '../../helper/Schema.js'
import {Api} from '../../Api.js'
import {map200, map204, TsRestClient} from '../../ApiClient.js'
import {KeyOf, map, Obj} from '@axanc/ts-utils'
import {endOfDay, startOfDay} from 'date-fns'

const c = initContract()

export const submissionContract = c.router({
  search: {
    method: 'POST',
    path: '/:workspaceId/form/:formId/submission/search',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    body: c.type<Omit<Api.Submission.Payload.Search, 'workspaceId' | 'formId'>>(),
    responses: {
      200: c.type<Api.Paginate<Api.Submission>>(),
    },
  },
  updateSingle: {
    method: 'POST',
    path: '/form/submission/updateSingle',
    body: z.object({
      formId: schema.formId,
      workspaceId: schema.workspaceId,
      submissionId: schema.submissionId,
      answers: z.record(z.string(), z.any()),
    }),
    responses: {
      200: c.type<Api.Submission>(),
    },
    metadata: makeMeta({
      access: {
        form: ['answers_canUpdate'],
      },
    }),
  },
  bulkUpdateQuestion: {
    method: 'POST',
    path: '/form/submission/bulkUpdateQuestion',
    body: z.object({
      formId: schema.formId,
      workspaceId: schema.workspaceId,
      submissionIds: z.array(schema.submissionId).min(1),
      question: z.string(),
      answer: z.any().nullable(),
    }),
    responses: {
      200: c.type<Api.BulkResponse<Api.SubmissionId>>(),
    },
    metadata: makeMeta({
      access: {
        form: ['answers_canUpdate'],
      },
    }),
  },
  bulkUpdateValidation: {
    method: 'POST',
    path: '/form/submission/bulkUpdateValidation',
    body: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
      submissionIds: z.array(schema.submissionId).min(1),
      status: z.enum(
        Obj.keys(Api.Submission.Validation) as [Api.Submission.Validation, ...Api.Submission.Validation[]],
      ),
    }),
    responses: {
      200: c.type<Api.BulkResponse<Api.SubmissionId>>(),
    },
    metadata: makeMeta({
      access: {
        form: ['answers_canUpdate'],
      },
    }),
  },
  remove: {
    method: 'DELETE',
    path: '/:workspaceId/form/:formId/submission',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    body: z.object({
      submissionIds: z.array(schema.submissionId).min(1),
    }),
    responses: {
      204: schema.emptyResult,
    },
    metadata: makeMeta({
      access: {
        form: ['answers_canDelete'],
      },
    }),
  },

  submit: {
    method: 'PUT',
    path: '/:workspaceId/form/:formId/submission',
    contentType: 'multipart/form-data',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    body: c.type<{
      answers: Record<string, any>
      geolocation?: [number, number]
      file: File[]
    }>(),
    responses: {
      200: c.type<Api.Submission>(),
    },
  },
})

export const submissionClient = (client: TsRestClient, baseUrl: string) => {
  return {
    submit: (params: Api.Submission.Payload.Submit) => {
      const fd = new FormData()
      for (const file of params.attachments) fd.append('file', file)
      fd.append('workspaceId', params.workspaceId)
      fd.append('formId', params.formId)
      fd.append('answers', JSON.stringify(params.answers))

      if (params.geolocation) fd.append('geolocation', JSON.stringify(params.geolocation))

      return client.submission
        .submit({
          params: {
            workspaceId: params.workspaceId,
            formId: params.formId,
          },
          body: fd,
        })
        .then(map200)
        .then(Api.Submission.map)
    },

    search: ({workspaceId, formId, ...body}: Api.Submission.Payload.Search) =>
      client.submission
        .search({
          params: {workspaceId, formId},
          body: {
            ...body,
            filters: {
              ...body.filters,
              start: map(body.filters?.start ?? undefined, startOfDay),
              end: map(body.filters?.end ?? undefined, endOfDay),
            },
          },
        })
        .then(map200)
        .then(Api.Paginate.map(Api.Submission.map)),

    remove: async ({
      workspaceId,
      submissionIds,
      formId,
    }: {
      workspaceId: Api.WorkspaceId
      submissionIds: Api.SubmissionId[]
      formId: Api.FormId
    }) => {
      return client.submission
        .remove({
          params: {workspaceId, formId},
          body: {submissionIds},
        })
        .then(map204)
    },

    updateSingle: ({workspaceId, formId, submissionId, answers}: Api.Submission.Payload.UpdateSingle) => {
      return client.submission
        .updateSingle({
          body: {
            workspaceId,
            formId,
            submissionId,
            answers,
          },
        })
        .then(map200)
    },

    bulkUpdateValidation: ({
      workspaceId,
      formId,
      submissionIds,
      status,
    }: Api.Submission.Payload.BulkUpdateValidation) => {
      return client.submission
        .bulkUpdateValidation({
          body: {
            workspaceId,
            formId,
            submissionIds,
            status,
          },
        })
        .then(map200)
    },

    bulkUpdateQuestion: <T extends Record<string, any>, K extends KeyOf<T>>({
      workspaceId,
      formId,
      submissionIds,
      question,
      answer,
    }: Api.Submission.Payload.BulkUpdateQuestion<T, K>) => {
      return client.submission
        .bulkUpdateQuestion({
          body: {
            workspaceId,
            formId,
            submissionIds,
            question,
            answer,
          },
        })
        .then(map200)
    },
  }
}
