import {initContract} from '@ts-rest/core'
import {Ip} from '../../core/Types.js'
import {map200, TsRestClient} from '../../core/IpClient.js'
import {makeMeta, schema} from '../../core/Schema.js'
import {z} from 'zod'

const c = initContract()

export const workspaceAccessContract = c.router({
  create: {
    method: 'PUT',
    path: `/workspace/:workspaceId/access`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    body: c.type<Omit<Ip.Workspace.Access.Payload.Create, 'workspaceId'>>(),
    responses: {200: c.type<{newAccess?: Ip.Workspace.Access; newInvitation?: Ip.Workspace.Invitation}>()},
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
    create: ({workspaceId, ...body}: Ip.Workspace.Access.Payload.Create) => {
      return client.workspace.access
        .create({params: {workspaceId}, body})
        .then(map200)
        .then(_ => {
          return {
            ..._,
            newAccess: _.newAccess ? mapWorkspaceAccess(_.newAccess) : undefined,
          }
        })
    },
  }
}
