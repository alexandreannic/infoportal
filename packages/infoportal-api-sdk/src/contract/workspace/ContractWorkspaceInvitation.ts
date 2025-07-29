import {initContract} from '@ts-rest/core'
import {Ip} from '../../core/Types.js'
import {map200, TsRestClient} from '../../core/IpClient.js'
import {makeMeta, schema} from '../../core/Schema.js'
import {z} from 'zod'

const c = initContract()

export const workspaceInvitationContract = c.router({
  search: {
    method: 'GET',
    path: `/workspace/:workspaceId/access/invitation`,
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
})

export const workspaceInvitationClient = (client: TsRestClient) => {
  return {
    search: ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
      return client.workspace.invitation.search({params: {workspaceId}}).then(map200)
    },
  }
}
