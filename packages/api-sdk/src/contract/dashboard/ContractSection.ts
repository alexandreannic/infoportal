import {initContract} from '@ts-rest/core'
import {Ip} from '../../type/index.js'
import {map200, map204, TsRestClient} from '../../core/Client.js'
import {makeMeta, schema} from '../../core/Schema.js'
import {z} from 'zod'

const c = initContract()

export const sectionContract = c.router({
  search: {
    method: 'POST',
    path: `/dashboard/section/search`,
    body: c.type<Ip.Dashboard.Section.Payload.Search>(),
    responses: {200: z.any() as z.ZodType<Ip.Dashboard.Section[]>},
  },
  create: {
    method: 'POST',
    path: `/dashboard/section/create`,
    body: c.type<Ip.Dashboard.Section.Payload.Create>(),
    responses: {200: c.type<Ip.Dashboard.Section>()},
    metadata: makeMeta({
      access: {
        workspace: ['dashboard_canCreate'],
      },
    }),
  },
  update: {
    method: 'POST',
    path: `/dashboard/section/update`,
    body: c.type<Ip.Dashboard.Section.Payload.Update>(),
    responses: {200: c.type<Ip.Dashboard.Section>()},
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
    search: (body: Ip.Dashboard.Section.Payload.Search) =>
      client.dashboard.section
        .search({body})
        .then(map200)
        .then(_ => _.map(Ip.Dashboard.Section.map)),

    create: (body: Ip.Dashboard.Section.Payload.Create) =>
      client.dashboard.section.create({body}).then(map200).then(Ip.Dashboard.Section.map),

    update: (body: Ip.Dashboard.Section.Payload.Update) =>
      client.dashboard.section.update({body}).then(map200).then(Ip.Dashboard.Section.map),

    remove: (body: {workspaceId: Ip.WorkspaceId; id: Ip.Dashboard.SectionId}) =>
      client.dashboard.section.remove({body}).then(map204),
  }
}
