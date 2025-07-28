import {initContract} from '@ts-rest/core'
import {Ip} from '../../core/Types.js'
import {map200, map204, TsRestClient} from '../../core/IpClient.js'
import {makeMeta, schema} from '../../core/Schema.js'

const c = initContract()

export const workspaceContract = c.router({
  getMine: {
    method: 'GET',
    path: `/workspace/me`,
    responses: {200: c.type<Ip.Workspace[]>()},
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
    body: c.type<Ip.Workspace.Payload.Create>(),
    responses: {200: c.type<Ip.Workspace>()},
    metadata: makeMeta({
      access: {
        global: ['workspace_canCreate'],
      },
    }),
  },
  update: {
    method: 'POST',
    path: `/workspace/:id`,
    pathParams: c.type<{id: Ip.WorkspaceId}>(),
    body: c.type<Omit<Ip.Workspace.Payload.Update, 'id'>>(),
    responses: {200: c.type<Ip.Workspace>()},
    metadata: makeMeta({
      access: {
        workspace: ['canUpdate'],
      },
    }),
  },
  remove: {
    method: 'DELETE',
    path: `/workspace/:id`,
    pathParams: c.type<{id: Ip.Uuid}>(),
    responses: {204: schema.emptyResult},
    metadata: makeMeta({
      access: {
        workspace: ['canDelete'],
      },
    }),
  },
})

export const mapWorkspace = (u: Ip.Workspace): Ip.Workspace => {
  return {
    ...u,
    createdAt: new Date(u.createdAt),
  }
}

export const workspaceClient = (client: TsRestClient) => {
  return {
    getMine: () =>
      client.workspace
        .getMine()
        .then(map200)
        .then(_ => _.map(mapWorkspace)),
    checkSlug: (slug: string) => client.workspace.checkSlug({body: {slug}}).then(map200),
    create: (body: Ip.Workspace.Payload.Create) => client.workspace.create({body}).then(map200).then(mapWorkspace),
    update: ({id, ...body}: Ip.Workspace.Payload.Update) =>
      client.workspace.update({params: {id}, body}).then(map200).then(mapWorkspace),
    remove: (id: Ip.Uuid) => client.workspace.remove({params: {id}}).then(map204),
  }
}
