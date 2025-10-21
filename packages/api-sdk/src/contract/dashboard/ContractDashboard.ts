import {initContract} from '@ts-rest/core'
import {Ip} from '../../type/index.js'
import {map200, map204, TsRestClient} from '../../core/Client.js'
import {makeMeta, schema} from '../../core/Schema.js'
import {z} from 'zod'

const c = initContract()

export const dashboardContract = c.router({
  search: {
    method: 'POST',
    path: `/dashboard/search`,
    body: z.object({
      workspaceId: schema.workspaceId,
    }),
    responses: {200: z.any() as z.ZodType<Ip.Dashboard[]>},
  },
  checkSlug: {
    method: 'POST',
    path: `/dashboard/check-slug`,
    body: c.type<{slug: string}>(),
    responses: {200: c.type<{isFree: boolean; suggestedSlug: string}>()},
  },
  create: {
    method: 'POST',
    path: `/dashboard`,
    body: c.type<Ip.Dashboard.Payload.Create>(),
    responses: {200: c.type<Ip.Dashboard>()},
    metadata: makeMeta({
      access: {
        workspace: ['dashboard_canCreate'],
      },
    }),
  },
  update: {
    method: 'POST',
    path: `/dashboard/update`,
    body: c.type<Ip.Dashboard.Payload.Update>(),
    responses: {200: c.type<Ip.Dashboard>()},
    metadata: makeMeta({
      access: {
        workspace: ['dashboard_canUpdate'],
      },
    }),
  },
  remove: {
    method: 'POST',
    path: `/dashboard/delete`,
    body: c.type<Ip.Dashboard.Payload.Delete>(),
    responses: {204: schema.emptyResult},
    metadata: makeMeta({
      access: {
        workspace: ['dashboard_canDelete'],
      },
    }),
  },
})

export const dashboardClient = (client: TsRestClient) => {
  return {
    search: (body: {workspaceId: Ip.WorkspaceId}) => {
      return client.dashboard
        .search({body})
        .then(map200)
        .then(_ => _.map(Ip.Dashboard.map))
    },
    checkSlug: (body: {workspaceId: Ip.WorkspaceId; slug: string}) => {
      return client.dashboard.checkSlug({body}).then(map200)
    },
    create: (body: Ip.Dashboard.Payload.Create) => {
      return client.dashboard.create({body}).then(map200).then(Ip.Dashboard.map)
    },
    update: (body: Ip.Dashboard.Payload.Update) => {
      return client.dashboard.update({body}).then(map200).then(Ip.Dashboard.map)
    },
    remove: (body: Ip.Dashboard.Payload.Delete) => client.dashboard.remove({body}).then(map204),
  }
}
