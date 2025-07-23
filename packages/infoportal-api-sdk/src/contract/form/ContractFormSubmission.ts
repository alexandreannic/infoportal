import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {schema} from '../../core/Schema'
import {Ip} from '../../core/Types'
import {mapClientResponse, TsRestClient} from '../../core/IpClient'
import {Paginate} from '../../core/Paginate'

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
          body,
        })
        .then(mapClientResponse)
        .then(Paginate.map(mapFormSubmission)),
  }
}
