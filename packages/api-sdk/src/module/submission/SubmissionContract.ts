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
  updateAnswers: {
    method: 'PATCH',
    path: '/:workspaceId/form/:formId/submission',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    body: z.object({
      answerIds: z.array(schema.submissionId).min(1),
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
  updateValidation: {
    method: 'PATCH',
    path: '/:workspaceId/form/:formId/submission/validation',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    body: z.object({
      answerIds: z.array(schema.submissionId).min(1),
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
      answerIds: z.array(schema.submissionId).min(1),
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
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      formId: schema.formId,
    }),
    body: z.object({
      answers: z.record(z.any()),
      attachments: z.array(z.any()),
      geolocation: z.tuple([z.number(), z.number()]).optional(),
    }),
    responses: {
      200: c.type<Api.Submission>(),
    },
  },
})

export const submissionClient = (client: TsRestClient, baseUrl: string) => {
  return {
    submit: (params: Api.Submission.Payload.Submit) =>
      client.submission
        .submit({
          params,
          body: params,
        })
        .then(map200)
        .then(Api.Submission.map),

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
      answerIds,
      formId,
    }: {
      workspaceId: Api.WorkspaceId
      answerIds: Api.SubmissionId[]
      formId: Api.FormId
    }) => {
      return client.submission
        .remove({
          params: {workspaceId, formId},
          body: {answerIds},
        })
        .then(map204)
    },

    updateValidation: ({workspaceId, formId, answerIds, status}: Api.Submission.Payload.UpdateValidation) => {
      return client.submission
        .updateValidation({
          params: {workspaceId, formId},
          body: {
            answerIds: answerIds,
            status,
          },
        })
        .then(map200)
    },

    updateAnswers: <T extends Record<string, any>, K extends KeyOf<T>>({
      workspaceId,
      formId,
      answerIds,
      question,
      answer,
    }: Api.Submission.Payload.Update<T, K>) => {
      return client.submission
        .updateAnswers({
          params: {workspaceId, formId},
          body: {
            answerIds: answerIds,
            question,
            answer,
          },
        })
        .then(map200)
    },
  }
}
