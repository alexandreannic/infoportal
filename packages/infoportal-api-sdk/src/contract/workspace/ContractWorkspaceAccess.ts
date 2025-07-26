import {initContract} from '@ts-rest/core'
import {Ip} from '../../core/Types.js'
import {mapClientResponse, TsRestClient} from '../../core/IpClient.js'
import {makeMeta} from '../../core/Schema.js'

const c = initContract()

export const workspaceAccessContract = c.router({
  create: {
    method: 'PUT',
    path: `/workspace-access`,
    body: c.type<Ip.Workspace.Access.Payload.Create>(),
    responses: {200: c.type<Ip.Workspace.Access>()},
    metadata: makeMeta({
      access: {
        workspace: ['user_canCreate'],
      },
    }),
  },
})

export const mapWorkspaceAccess = (u: Ip.Workspace.Access): Ip.Workspace.Access => {
  return {
    ...u,
    createdAt: new Date(u.createdAt),
  }
}

export const workspaceAccessClient = (client: TsRestClient) => {
  return {
    create: (body: Ip.Workspace.Access.Payload.Create) =>
      client.workspace.access.create({body}).then(mapClientResponse).then(mapWorkspaceAccess),
  }
}
