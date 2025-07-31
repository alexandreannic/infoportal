import {initContract} from '@ts-rest/core'
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
  getSubmissionsBy: {
    method: 'GET',
    path: '/:workspaceId/metrics/submission/:type',
    pathParams: c.type<{
      workspaceId: Ip.WorkspaceId
      type: Ip.Metrics.ByType
    }>(),
    query: filters,
    responses: {
      200: c.type<Ip.Metrics.CountByKey>(),
    },
  },
})

export const metricsClient = (client: TsRestClient) => ({
  getSubmissionsBy: ({
    workspaceId,
    type,
    ...query
  }: {type: Ip.Metrics.ByType; workspaceId: Ip.WorkspaceId} & Ip.Metrics.Payload.Filter) => {
    return client.metrics
      .getSubmissionsBy({
        params: {workspaceId, type},
        query: query,
      })
      .then(map200)
  },
})
