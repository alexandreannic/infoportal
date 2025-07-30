import {initContract} from '@ts-rest/core'
import {schema} from '../core/Schema.js'
import {z} from 'zod'
import {Ip} from '../core/Types.js'
import {map200, TsRestClient} from '../core/IpClient.js'

const c = initContract()

const filters = z.object({
  start: z
    .date()
    .transform(s => s.toISOString())
    .optional(),
  end: z
    .date()
    .transform(s => s.toISOString())
    .optional(),
  // start: z.coerce.date().optional(),
  // end: z.coerce.date().optional(),
})

export const metricsContract = c.router({
  // getUser: {
  //   method: 'GET',
  //   path: '/:workspaceId/stats/users',
  // }
  getSubmissionsByForm: {
    method: 'GET',
    path: '/:workspaceId/metrics/submission/by-form',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    query: filters,
    responses: {
      200: c.type<Ip.Metrics.CountBy<'formId'>>(),
    },
  },
  getSubmissionsByMonth: {
    method: 'GET',
    path: '/:workspaceId/metrics/submission/by-month',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    query: filters,
    responses: {
      200: c.type<Ip.Metrics.CountBy<'date'>>(),
    },
  },
})

export const metricsClient = (client: TsRestClient) => ({
  getSubmissionsByMonth: ({workspaceId, ...query}: {workspaceId: Ip.WorkspaceId} & Ip.Metrics.Payload.Filter) => {
    return client.metrics
      .getSubmissionsByMonth({
        params: {workspaceId},
        query: query,
      })
      .then(map200)
  },
  getSubmissionsByForm: ({workspaceId, ...query}: {workspaceId: Ip.WorkspaceId} & Ip.Metrics.Payload.Filter) => {
    return client.metrics
      .getSubmissionsByForm({
        params: {workspaceId},
        query: query,
      })
      .then(map200)
  },
})
