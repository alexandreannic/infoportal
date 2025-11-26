import {initContract} from '@ts-rest/core'
import {Ip} from '../../Api.js'
import {map200, TsRestClient} from '../../ApiClient.js'
import {z} from 'zod'
import {schema} from '../../helper/Schema.js'

const c = initContract()

export const userContract = c.router({
  update: {
    method: 'PATCH',
    path: '/:workspaceId/user/:id',
    pathParams: c.type<Pick<Ip.User.Payload.Update, 'workspaceId' | 'id'>>(),
    body: c.type<Omit<Ip.User.Payload.Update, 'workspaceId' | 'id'>>(),
    responses: {
      200: c.type<Ip.User>(),
    },
  },
  search: {
    method: 'GET',
    path: '/:workspaceId/user',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    responses: {
      200: c.type<Ip.User[]>(),
    },
  },
  getJobs: {
    method: 'GET',
    path: '/:workspaceId/user/job',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    responses: {
      200: c.type<string[]>(),
    },
  },
})

export const userClient = (client: TsRestClient, baseUrl: string) => {
  return {
    getAvatarUrl: ({email}: {email: Ip.User.Email}) => {
      return `${baseUrl}/user/avatar/${email}`
    },
    update: ({id, workspaceId, ...body}: Ip.User.Payload.Update) => {
      return client.user.update({params: {id, workspaceId}, body}).then(map200).then(Ip.User.map)
    },
    getJobs: ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
      return client.user.getJobs({params: {workspaceId}}).then(map200)
    },
    search: ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
      return client.user
        .search({params: {workspaceId}})
        .then(map200)
        .then(_ => _.map(Ip.User.map))
    },
  }
}
