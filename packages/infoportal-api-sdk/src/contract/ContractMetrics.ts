import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {Ip} from '../core/Types.js'
import {map200, TsRestClient} from '../core/IpClient.js'
import {schema} from '../core/Schema.js'

const c = initContract()

const filters = z.object({
  start: z
    .string()
    // .transform(s => new Date(s))
    .optional(),
  end: z
    .string()
    // .transform(s => new Date(s))
    .optional(),
  formIds: z.array(schema.formId).optional(),
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
  getUsersByDate: {
    method: 'GET',
    path: '/:workspaceId/metrics/users/by-date',
    pathParams: c.type<{
      workspaceId: Ip.WorkspaceId
    }>(),
    query: filters,
    responses: {
      200: c.type<Ip.Metrics.CountUserByDate>(),
    },
  },
})

const parseQsDate = <T extends {start?: Date; end?: Date}>(_: T): T & {start?: string; end?: string} => {
  if (_.end) _.end = new Date(_.end)
  if (_.start) _.start = new Date(_.start)
  return _ as any
}

export const metricsClient = (client: TsRestClient) => ({
  getSubmissionsBy: ({
    workspaceId,
    type,
    ...query
  }: {type: Ip.Metrics.ByType; workspaceId: Ip.WorkspaceId} & Ip.Metrics.Payload.Filter) => {
    return client.metrics
      .getSubmissionsBy({
        params: {workspaceId, type},
        query: parseQsDate(query),
      })
      .then(map200)
  },
  getUsersByDate: ({workspaceId, ...query}: {workspaceId: Ip.WorkspaceId} & Ip.Metrics.Payload.Filter) => {
    return client.metrics
      .getUsersByDate({
        params: {workspaceId},
        query: parseQsDate(query),
      })
      .then(map200)
  },
})
