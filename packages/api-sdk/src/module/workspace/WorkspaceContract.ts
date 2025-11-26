import {initContract} from '@ts-rest/core'
import {Api} from '../../Api.js'
import {map200, map204, TsRestClient} from '../../ApiClient.js'
import {makeMeta, schema} from '../../helper/Schema.js'

const c = initContract()

export const workspaceContract = c.router({
  getMine: {
    method: 'GET',
    path: `/workspace/me`,
    responses: {200: c.type<Api.Workspace[]>()},
  },
  checkSlug: {
    method: 'POST',
    path: `/workspace/check-slug`,
    body: c.type<{slug: string}>(),
    responses: {200: c.type<{isFree: boolean; suggestedSlug: string}>()},
  },
  create: {
    method: 'PUT',
    path: `/workspace`,
    body: c.type<Api.Workspace.Payload.Create>(),
    responses: {200: c.type<Api.Workspace>()},
    metadata: makeMeta({
      access: {
        global: ['workspace_canCreate'],
      },
    }),
  },
  update: {
    method: 'POST',
    path: `/workspace/:id`,
    pathParams: c.type<{id: Api.WorkspaceId}>(),
    body: c.type<Omit<Api.Workspace.Payload.Update, 'id'>>(),
    responses: {200: c.type<Api.Workspace>()},
    metadata: makeMeta({
      access: {
        workspace: ['canUpdate'],
      },
    }),
  },
  remove: {
    method: 'DELETE',
    path: `/workspace/:id`,
    pathParams: c.type<{id: Api.Uuid}>(),
    responses: {204: schema.emptyResult},
    metadata: makeMeta({
      access: {
        workspace: ['canDelete'],
      },
    }),
  },
})

export const workspaceClient = (client: TsRestClient, baseUrl: string) => {
  return {
    getMine: () =>
      client.workspace
        .getMine()
        .then(map200)
        .then(_ => _.map(Api.Workspace.map)),
    checkSlug: (slug: string) => client.workspace.checkSlug({body: {slug}}).then(map200),
    create: (body: Api.Workspace.Payload.Create) => client.workspace.create({body}).then(map200).then(Api.Workspace.map),
    update: ({id, ...body}: Api.Workspace.Payload.Update) =>
      client.workspace.update({params: {id}, body}).then(map200).then(Api.Workspace.map),
    remove: (id: Api.Uuid) => client.workspace.remove({params: {id}}).then(map204),
  }
}
