import {initContract} from '@ts-rest/core'
import {Api} from '../../Api.js'
import {map200, map204, TsRestClient} from '../../ApiClient.js'
import {makeMeta, schema} from '../../helper/Schema.js'
import {z} from 'zod'

const c = initContract()

export const widgetContract = c.router({
  search: {
    method: 'POST',
    path: `/dashboard/widget/search`,
    body: c.type<Api.Dashboard.Widget.Payload.Search>(),
    responses: {200: z.any() as z.ZodType<Api.Dashboard.Widget[]>},
  },
  create: {
    method: 'POST',
    path: `/dashboard/widget/create`,
    body: c.type<Api.Dashboard.Widget.Payload.Create>(),
    responses: {200: c.type<Api.Dashboard.Widget>()},
    metadata: makeMeta({
      access: {
        workspace: ['dashboard_canCreate'],
      },
    }),
  },
  update: {
    method: 'POST',
    path: `/dashboard/widget/update`,
    body: c.type<Api.Dashboard.Widget.Payload.Update>(),
    responses: {200: c.type<Api.Dashboard.Widget>()},
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
    search: (body: Api.Dashboard.Widget.Payload.Search) =>
      client.dashboard.widget
        .search({body})
        .then(map200)
        .then(_ => _.map(Api.Dashboard.Widget.map)),

    create: (body: Api.Dashboard.Widget.Payload.Create) =>
      client.dashboard.widget.create({body}).then(map200).then(Api.Dashboard.Widget.map),

    update: (body: Api.Dashboard.Widget.Payload.Update) =>
      client.dashboard.widget.update({body}).then(map200).then(Api.Dashboard.Widget.map),

    remove: (body: {workspaceId: Api.WorkspaceId; id: Api.Dashboard.WidgetId}) =>
      client.dashboard.widget.remove({body}).then(map204),
  }
}
