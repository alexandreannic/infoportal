import {initContract} from '@ts-rest/core'
import {Ip} from '../../core/Types.js'
import {map200, TsRestClient} from '../../core/IpClient.js'
import {makeMeta, schema} from '../../core/Schema.js'
import {z} from 'zod'

const c = initContract()

export const dashboardContract = c.router({
  getAll: {
    method: 'GET',
    path: `/:workspaceId/dashboard/search`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    responses: {200: z.any() as z.ZodType<Ip.Dashboard[]>},
  },
  checkSlug: {
    method: 'POST',
    path: `/:workspaceId/dashboard/check-slug`,
    body: c.type<{slug: string}>(),
    responses: {200: c.type<{isFree: boolean; suggestedSlug: string}>()},
  },
  create: {
    method: 'PUT',
    path: `/:workspaceId/dashboard`,
    body: c.type<Omit<Ip.Dashboard.Payload.Create, 'workspaceId'>>(),
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    responses: {200: c.type<Ip.Dashboard>()},
    metadata: makeMeta({
      access: {
        workspace: ['dashboard_canCreate'],
      },
    }),
  },
  // update: {
  //   method: 'POST',
  //   path: `/:workspaceId/dashboard/:id`,
  //   pathParams: c.type<{id: Ip.WorkspaceId}>(),
  //   body: c.type<Omit<Ip.Workspace.Payload.Update, 'id'>>(),
  //   responses: {200: c.type<Ip.Workspace>()},
  //   metadata: makeMeta({
  //     access: {
  //       dashboard: ['canUpdate'],
  //     },
  //   }),
  // },
  // remove: {
  //   method: 'DELETE',
  //   path: `/:workspaceId/dashboard/:id`,
  //   pathParams: c.type<{id: Ip.Uuid}>(),
  //   responses: {204: schema.emptyResult},
  //   metadata: makeMeta({
  //     access: {
  //       dashboard: ['canDelete'],
  //     },
  //   }),
  // },
})

export const dashboardClient = (client: TsRestClient) => {
  return {
    getAll: (params: {workspaceId: Ip.WorkspaceId}) =>
      client.dashboard
        .getAll({params})
        .then(map200)
        .then(_ => _.map(Ip.Dashboard.map)),
    checkSlug: ({slug, workspaceId}: {workspaceId: Ip.WorkspaceId; slug: string}) =>
      client.dashboard.checkSlug({params: {workspaceId}, body: {slug}}).then(map200),
    create: ({workspaceId, ...body}: Ip.Dashboard.Payload.Create) =>
      client.dashboard.create({params: {workspaceId}, body}).then(map200).then(Ip.Dashboard.map),
    // update: ({id, ...body}: Ip.Workspace.Payload.Update) =>
    //   client.dashboard.update({params: {id}, body}).then(map200).then(Ip.Workspace.map),
    // remove: (id: Ip.Uuid) => client.dashboard.remove({params: {id}}).then(map204),
  }
}
