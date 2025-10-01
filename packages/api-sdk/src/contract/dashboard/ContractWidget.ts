import {initContract} from '@ts-rest/core'
import {Ip} from '../../core/Types.js'
import {map200, map204, TsRestClient} from '../../core/IpClient.js'
import {makeMeta, schema} from '../../core/Schema.js'
import {z} from 'zod'

const c = initContract()

export const widgetContract = c.router({
  search: {
    method: 'POST',
    path: `/dashboard/widget/search`,
    body: c.type<Ip.Dashboard.Widget.Payload.Search>(),
    responses: {200: z.any() as z.ZodType<Ip.Dashboard.Widget[]>},
  },
  create: {
    method: 'POST',
    path: `/dashboard/widget/create`,
    body: c.type<Ip.Dashboard.Widget.Payload.Create>(),
    responses: {200: c.type<Ip.Dashboard.Widget>()},
    metadata: makeMeta({
      access: {
        workspace: ['dashboard_canCreate'],
      },
    }),
  },
  update: {
    method: 'POST',
    path: `/dashboard/widget/update`,
    body: c.type<Ip.Dashboard.Widget.Payload.Update>(),
    responses: {200: c.type<Ip.Dashboard.Widget>()},
    metadata: makeMeta({
      access: {
        workspace: ['dashboard_canUpdate'],
      },
    }),
  },
  remove: {
    method: 'POST',
    path: `/dashboard/widget/remove`,
    body: z.object({
      workspaceId: schema.workspaceId,
      id: schema.widgetId,
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
    search: (body: Ip.Dashboard.Widget.Payload.Search) =>
      client.dashboard.widget
        .search({body})
        .then(map200)
        .then(_ => _.map(Ip.Dashboard.Widget.map)),

    create: (body: Ip.Dashboard.Widget.Payload.Create) =>
      client.dashboard.widget.create({body}).then(map200).then(Ip.Dashboard.Widget.map),

    update: (body: Ip.Dashboard.Widget.Payload.Update) =>
      client.dashboard.widget.update({body}).then(map200).then(Ip.Dashboard.Widget.map),

    remove: (body: {workspaceId: Ip.WorkspaceId; id: Ip.Dashboard.WidgetId}) =>
      client.dashboard.widget.remove({body}).then(map204),
  }
}
