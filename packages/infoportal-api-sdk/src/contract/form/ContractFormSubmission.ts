import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {makeMeta, schema} from '../../core/Schema'
import {Ip} from '../../core/Types'
import {mapClientResponse, TsRestClient} from '../../core/IpClient'
import {Paginate} from '../../core/Paginate'
import {KeyOf, map, Obj} from '@axanc/ts-utils'
import {endOfDay, startOfDay} from 'date-fns'

const c = initContract()

export const contractFormSubmission = c.router({
  search: {
    method: 'POST',
    path: '/:workspaceId/form/:formId/answer/search',
    pathParams: z.object({
      workspaceId: schema.uuid,
      formId: schema.formId,
    }),
    body: c.type<Omit<Ip.Submission.Payload.Search, 'workspaceId' | 'formId'>>(),
    responses: {
      200: c.type<Ip.Paginate<Ip.Submission>>(),
    },
  },
  updateAnswers: {
    method: 'PATCH',
    path: '/:workspaceId/form/:formId/answer',
    pathParams: z.object({
      workspaceId: schema.uuid,
      formId: schema.formId,
    }),
    body: z.object({
      answerIds: z.array(z.string()).min(1),
      question: z.string(),
      answer: z.any().nullable(),
    }),
    responses: {
      200: c.type<void>(),
    },
    metadata: makeMeta({
      access: {
        form: ['canUpdate'],
      },
    }),
  },
  updateValidation: {
    method: 'PATCH',
    path: '/:workspaceId/form/:formId/answer/validation',
    pathParams: z.object({
      workspaceId: schema.uuid,
      formId: schema.formId,
    }),
    body: z.object({
      answerIds: z.array(z.string()).min(1),
      status: z.enum(Obj.keys(Ip.Submission.Validation) as [Ip.Submission.Validation, ...Ip.Submission.Validation[]]),
    }),
    responses: {
      200: c.type<void>(),
    },
    metadata: makeMeta({
      access: {
        form: ['canUpdate'],
      },
    }),
  },
  remove: {
    method: 'DELETE',
    path: '/:workspaceId/form/:formId/answer',
    pathParams: z.object({
      workspaceId: schema.uuid,
      formId: schema.formId,
    }),
    body: z.object({
      answerIds: z.array(z.string()).min(1),
    }),
    responses: {
      200: c.type<void>(),
    },
    metadata: makeMeta({
      access: {
        form: ['canDelete'],
      },
    }),
  },
})

export const mapFormSubmission = (_: Ip.Submission): Ip.Submission => {
  return {
    ..._,
    start: new Date(_.start),
    end: new Date(_.end),
    submissionTime: new Date(_.submissionTime),
  }
}

export const formSubmissionClient = (client: TsRestClient) => {
  return {
    search: ({workspaceId, formId, ...body}: Ip.Submission.Payload.Search) =>
      client.submission
        .search({
          params: {workspaceId, formId},
          body: {
            ...body,
            filters: {
              ...body.filters,
              start: map(body.filters.start ?? undefined, startOfDay),
              end: map(body.filters.end ?? undefined, endOfDay),
            },
          },
        })
        .then(mapClientResponse)
        .then(Paginate.map(mapFormSubmission)),

    remove: async ({
      workspaceId,
      answerIds,
      formId,
    }: {
      workspaceId: Ip.Uuid
      answerIds: Ip.SubmissionId[]
      formId: Ip.FormId
    }) => {
      return client.submission
        .remove({
          params: {workspaceId, formId},
          body: {answerIds},
        })
        .then(mapClientResponse)
    },

    updateValidation: ({workspaceId, formId, answerIds, status}: Ip.Submission.Payload.UpdateValidation) => {
      return client.submission
        .updateValidation({
          params: {workspaceId, formId},
          body: {
            answerIds: answerIds,
            status,
          },
        })
        .then(mapClientResponse)
    },

    updateAnswers: <T extends Record<string, any>, K extends KeyOf<T>>({
      workspaceId,
      formId,
      answerIds,
      question,
      answer,
    }: Ip.Submission.Payload.Update<T, K>) => {
      return client.submission
        .updateAnswers({
          params: {workspaceId, formId},
          body: {
            answerIds: answerIds,
            question,
            answer,
          },
        })
        .then(mapClientResponse)
    },
  }
}
