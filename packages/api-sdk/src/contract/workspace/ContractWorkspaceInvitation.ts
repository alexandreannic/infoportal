import {initContract} from '@ts-rest/core'
import {Ip} from '../../type/index.js'
import {map200, map204, TsRestClient} from '../../core/Client.js'
import {makeMeta, schema} from '../../core/Schema.js'
import {z} from 'zod'

const c = initContract()

export const workspaceInvitationContract = c.router({
  search: {
    method: 'GET',
    path: `/workspace/:workspaceId/invitation`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    responses: {200: c.type<Ip.Workspace.Invitation[]>()},
    metadata: makeMeta({
      access: {
        workspace: ['user_canRead'],
      },
    }),
  },
  getMine: {
    method: 'GET',
    path: `/workspace/invitation/me`,
    responses: {200: c.type<Ip.Workspace.InvitationW_workspace[]>()},
  },
  accept: {
    method: 'POST',
    path: `/workspace/invitation/:id/accept`,
    body: z.object({
      accept: z.boolean(),
    }),
    pathParams: z.object({
      id: schema.workspaceInvitationId,
    }),
    responses: {204: schema.emptyResult},
  },
  create: {
    method: 'PUT',
    path: `/workspace/:workspaceId/invitation`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    body: c.type<Omit<Ip.Workspace.Invitation.Payload.Create, 'workspaceId'>>(),
    responses: {200: c.type<Ip.Workspace.Invitation>()},
    metadata: makeMeta({
      access: {
        workspace: ['user_canCreate'],
      },
    }),
  },

  remove: {
    method: 'DELETE',
    path: `/workspace/:workspaceId/invitation/:id`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
      id: schema.workspaceInvitationId,
    }),
    responses: {204: schema.emptyResult},
    metadata: makeMeta({
      access: {
        workspace: ['user_canDelete'],
      },
    }),
  },
})

export const workspaceInvitationClient = (client: TsRestClient, baseUrl: string) => {
  return {
    accept: ({id, accept}: {accept: boolean; id: Ip.Workspace.InvitationId}) => {
      return client.workspace.invitation.accept({params: {id}, body: {accept}}).then(map204)
    },
    getMine: () => {
      return client.workspace.invitation
        .getMine()
        .then(map200)
        .then(_ => _.map(Ip.Workspace.Invitation.mapW_workspace))
    },
    search: ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
      return client.workspace.invitation
        .search({params: {workspaceId}})
        .then(map200)
        .then(_ => _.map(Ip.Workspace.Invitation.map))
    },
    create: ({workspaceId, ...body}: Ip.Workspace.Invitation.Payload.Create) => {
      return client.workspace.invitation
        .create({params: {workspaceId}, body})
        .then(map200)
        .then(Ip.Workspace.Invitation.map)
    },
    remove: (params: {workspaceId: Ip.WorkspaceId; id: Ip.Workspace.InvitationId}) => {
      return client.workspace.invitation.remove({params}).then(map204)
    },
  }
}
