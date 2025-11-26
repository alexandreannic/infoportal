import {initContract} from '@ts-rest/core'
import {Api} from '../../Api.js'
import {map200, TsRestClient} from '../../ApiClient.js'
import {z} from 'zod'
import {schema} from '../../helper/Schema.js'

const c = initContract()

export const userContract = c.router({
  update: {
    method: 'PATCH',
    path: '/:workspaceId/user/:id',
    pathParams: c.type<Pick<Api.User.Payload.Update, 'workspaceId' | 'id'>>(),
    body: c.type<Omit<Api.User.Payload.Update, 'workspaceId' | 'id'>>(),
    responses: {
      200: c.type<Api.User>(),
    },
  },
  search: {
    method: 'GET',
    path: '/:workspaceId/user',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    responses: {
      200: c.type<Api.User[]>(),
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
    getAvatarUrl: ({email}: {email: Api.User.Email}) => {
      return `${baseUrl}/user/avatar/${email}`
    },
    update: ({id, workspaceId, ...body}: Api.User.Payload.Update) => {
      return client.user.update({params: {id, workspaceId}, body}).then(map200).then(Api.User.map)
    },
    getJobs: ({workspaceId}: {workspaceId: Api.WorkspaceId}) => {
      return client.user.getJobs({params: {workspaceId}}).then(map200)
    },
    search: ({workspaceId}: {workspaceId: Api.WorkspaceId}) => {
      return client.user
        .search({params: {workspaceId}})
        .then(map200)
        .then(_ => _.map(Api.User.map))
    },
  }
}
