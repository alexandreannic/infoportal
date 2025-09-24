import {initContract} from '@ts-rest/core'
import {Ip} from '../../core/Types.js'
import {map200, map204, TsRestClient} from '../../core/IpClient.js'
import {makeMeta, schema} from '../../core/Schema.js'
import {z} from 'zod'

const c = initContract()

export const widgetContract = c.router({
  getByDashboard: {
    method: 'GET',
    path: `/:workspaceId/dashboard/:dashboardId/widget`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      dashboardId: schema.dashboardId,
    }),
    responses: {200: z.any() as z.ZodType<Ip.Dashboard.Widget[]>},
  },
  create: {
    method: 'PUT',
    path: `/:workspaceId/dashboard/:dashboardId/widget`,
    body: c.type<Omit<Ip.Dashboard.Widget.Payload.Create, 'workspaceId' | 'dashboardId'>>(),
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      dashboardId: schema.dashboardId,
    }),
    responses: {200: c.type<Ip.Dashboard.Widget>()},
    metadata: makeMeta({
      access: {
        workspace: ['dashboard_canCreate'],
      },
    }),
  },
  update: {
    method: 'PATCH',
    path: `/:workspaceId/dashboard/:dashboardId/widget/:widgetId`,
    body: c.type<Omit<Ip.Dashboard.Widget.Payload.Update, 'workspaceId' | 'dashboardId' | 'widgetId'>>(),
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      dashboardId: schema.dashboardId,
      widgetId: schema.widgetId,
    }),
    responses: {200: c.type<Ip.Dashboard.Widget>()},
    metadata: makeMeta({
      access: {
        workspace: ['dashboard_canUpdate'],
      },
    }),
  },
  remove: {
    method: 'DELETE',
    path: `/:workspaceId/dashboard/:dashboardId/widget/:widgetId`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      dashboardId: schema.dashboardId,
      widgetId: schema.widgetId,
    }),
    responses: {204: schema.emptyResult},
    metadata: makeMeta({
      access: {
        workspace: ['dashboard_canUpdate'],
      },
    }),
  },
})

export const widgetClient = (client: TsRestClient) => {
  return {
    getByDashboard: (params: {workspaceId: Ip.WorkspaceId; dashboardId: Ip.DashboardId}) =>
      client.dashboard.widget
        .getByDashboard({params})
        .then(map200)
        .then(_ => _.map(Ip.Dashboard.Widget.map)),
    create: ({workspaceId, dashboardId, ...body}: Ip.Dashboard.Widget.Payload.Create) =>
      client.dashboard.widget
        .create({params: {workspaceId, dashboardId}, body})
        .then(map200)
        .then(Ip.Dashboard.Widget.map),
    update: ({dashboardId, workspaceId, widgetId, ...body}: Ip.Dashboard.Widget.Payload.Update) =>
      client.dashboard.widget
        .update({params: {workspaceId, dashboardId, widgetId}, body})
        .then(map200)
        .then(Ip.Dashboard.Widget.map),
    remove: (params: {dashboardId: Ip.DashboardId; workspaceId: Ip.WorkspaceId; widgetId: Ip.Dashboard.WidgetId}) =>
      client.dashboard.widget.remove({params}).then(map204),
  }
}
