import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {Api} from '../../Api.js'
import {map200, TsRestClient} from '../../ApiClient.js'
import {schema} from '../../helper/Schema.js'

const c = initContract()

const types: Api.Metrics.ByType[] = ['location', 'user', 'status', 'category', 'month', 'form']

export const metricsContract = c.router({
  getSubmissionsBy: {
    method: 'POST',
    path: '/metrics/submissionBy',
    body: z.object({
      workspaceId: schema.workspaceId,
      start: z.coerce.date().optional(),
      end: z.coerce.date().optional(),
      formIds: z.array(schema.formId).optional(),
      type: z.enum(types),
    }),
    responses: {
      200: c.type<Api.Metrics.CountByKey>(),
    },
  },
  getUsersByDate: {
    method: 'POST',
    path: '/metrics/usersByDate',
    body: z.object({
      workspaceId: schema.workspaceId,
      start: z.coerce.date().optional(),
      end: z.coerce.date().optional(),
      formIds: z.array(schema.formId).optional(),
    }),
    responses: {
      200: c.type<Api.Metrics.CountUserByDate>(),
    },
  },
})

const parseQsDate = <T extends {start?: Date; end?: Date}>(_: T): T & {start?: string; end?: string} => {
  if (_.end) _.end = new Date(_.end)
  if (_.start) _.start = new Date(_.start)
  return _ as any
}

export const metricsClient = (client: TsRestClient, baseUrl: string) => ({
  getSubmissionsBy: ({
    workspaceId,
    type,
    ...query
  }: {type: Api.Metrics.ByType; workspaceId: Api.WorkspaceId} & Api.Metrics.Payload.Filter) => {
    return client.metrics
      .getSubmissionsBy({
        body: {workspaceId, type, ...parseQsDate(query)},
      })
      .then(map200)
  },
  getUsersByDate: ({workspaceId, ...query}: {workspaceId: Api.WorkspaceId} & Api.Metrics.Payload.Filter) => {
    return client.metrics
      .getUsersByDate({
        body: {workspaceId, ...parseQsDate(query)},
      })
      .then(map200)
  },
})
