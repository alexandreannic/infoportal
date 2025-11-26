import {initContract} from '@ts-rest/core'
import {Api} from '../../Api.js'
import {map200, map204, TsRestClient} from '../../ApiClient.js'
import {makeMeta, schema} from '../../helper/Schema.js'
import {z} from 'zod'

const c = initContract()

export const sectionContract = c.router({
  search: {
    method: 'POST',
    path: `/dashboard/section/search`,
    body: c.type<Api.Dashboard.Section.Payload.Search>(),
    responses: {200: z.any() as z.ZodType<Api.Dashboard.Section[]>},
  },
  create: {
    method: 'POST',
    path: `/dashboard/section/create`,
    body: c.type<Api.Dashboard.Section.Payload.Create>(),
    responses: {200: c.type<Api.Dashboard.Section>()},
    metadata: makeMeta({
      access: {
        workspace: ['dashboard_canCreate'],
      },
    }),
  },
  update: {
    method: 'POST',
    path: `/dashboard/section/update`,
    body: c.type<Api.Dashboard.Section.Payload.Update>(),
    responses: {200: c.type<Api.Dashboard.Section>()},
    metadata: makeMeta({
      access: {
        workspace: ['dashboard_canUpdate'],
      },
    }),
  },
  remove: {
    method: 'POST',
    path: `/dashboard/section/remove`,
    body: z.object({
      workspaceId: schema.workspaceId,
      id: schema.sectionId,
    }),
    responses: {204: schema.emptyResult},
    metadata: makeMeta({
      access: {
        workspace: ['dashboard_canUpdate'],
      },
    }),
  },
})

export const sectionClient = (client: TsRestClient) => {
  return {
    search: (body: Api.Dashboard.Section.Payload.Search) =>
      client.dashboard.section
        .search({body})
        .then(map200)
        .then(_ => _.map(Api.Dashboard.Section.map)),

    create: (body: Api.Dashboard.Section.Payload.Create) =>
      client.dashboard.section.create({body}).then(map200).then(Api.Dashboard.Section.map),

    update: (body: Api.Dashboard.Section.Payload.Update) =>
      client.dashboard.section.update({body}).then(map200).then(Api.Dashboard.Section.map),

    remove: (body: {workspaceId: Api.WorkspaceId; id: Api.Dashboard.SectionId}) =>
      client.dashboard.section.remove({body}).then(map204),
  }
}
