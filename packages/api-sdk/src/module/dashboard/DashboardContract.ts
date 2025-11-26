import {initContract} from '@ts-rest/core'
import {Api} from '../../Api.js'
import {map200, map204, TsRestClient} from '../../ApiClient.js'
import {makeMeta, schema} from '../../helper/Schema.js'
import {z} from 'zod'

const c = initContract()

export const dashboardContract = c.router({
  publish: {
    method: 'POST',
    path: '/dashboard/publish',
    body: c.type<Api.Dashboard.Payload.Publish>(),
    responses: {204: schema.emptyResult},
  },
  getPublished: {
    method: 'POST',
    path: `/dashboard/getPublished`,
    body: z.object({
      workspaceSlug: z.string(),
      dashboardSlug: z.string(),
    }),
    responses: {200: z.any() as z.ZodType<Api.DashboardWithSnapshot>},
  },
  getProtectedSubmission: {
    method: 'POST',
    path: `/dashboard/getProtectedSubmission`,
    body: z.object({
      workspaceSlug: z.string(),
      dashboardSlug: z.string(),
    }),
    responses: {200: z.any() as z.ZodType<Api.Submission[]>},
  },
  restorePublishedVersion: {
    method: 'POST',
    path: `/dashboard/restorePublishedVersion`,
    body: z.object({
      workspaceId: schema.workspaceId,
      id: schema.dashboardId,
    }),
    responses: {204: schema.emptyResult},
  },
  search: {
    method: 'POST',
    path: `/dashboard/search`,
    body: z.object({
      workspaceId: schema.workspaceId,
    }),
    responses: {200: z.any() as z.ZodType<Api.Dashboard[]>},
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
    body: c.type<Api.Dashboard.Payload.Create>(),
    responses: {200: c.type<Api.Dashboard>()},
    metadata: makeMeta({
      access: {
        workspace: ['dashboard_canCreate'],
      },
    }),
  },
  update: {
    method: 'POST',
    path: `/dashboard/update`,
    body: c.type<Api.Dashboard.Payload.Update>(),
    responses: {200: c.type<Api.Dashboard>()},
    metadata: makeMeta({
      access: {
        workspace: ['dashboard_canUpdate'],
      },
    }),
  },
  remove: {
    method: 'POST',
    path: `/dashboard/delete`,
    body: c.type<Api.Dashboard.Payload.Delete>(),
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
    search: (body: {workspaceId: Api.WorkspaceId}) => {
      return client.dashboard
        .search({body})
        .then(map200)
        .then(_ => _.map(Api.Dashboard.map))
    },
    checkSlug: (body: {workspaceId: Api.WorkspaceId; slug: string}) => {
      return client.dashboard.checkSlug({body}).then(map200)
    },
    create: (body: Api.Dashboard.Payload.Create) => {
      return client.dashboard.create({body}).then(map200).then(Api.Dashboard.map)
    },
    update: (body: Api.Dashboard.Payload.Update) => {
      return client.dashboard.update({body}).then(map200).then(Api.Dashboard.map)
    },
    remove: (body: Api.Dashboard.Payload.Delete) => client.dashboard.remove({body}).then(map204),

    publish: (body: Api.Dashboard.Payload.Publish) => client.dashboard.publish({body}).then(map204),

    getBySlug: (body: {workspaceSlug: string; dashboardSlug: string}) =>
      client.dashboard.getPublished({body}).then(map200),

    getProtectedSubmission: (body: {workspaceSlug: string; dashboardSlug: string}) =>
      client.dashboard
        .getProtectedSubmission({body})
        .then(map200)
        .then(_ => _.map(Api.Submission.map)),

    restorePublishedVersion: (body: {workspaceId: Api.WorkspaceId; id: Api.DashboardId}) => {
      return client.dashboard.restorePublishedVersion({body}).then(map204)
    },
  }
}
