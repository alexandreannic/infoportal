import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {makeMeta, schema} from '../../../helper/Schema.js'
import {Api} from '../../../Api.js'
import {map200, TsRestClient} from '../../../ApiClient.js'

const c = initContract()

export const formActionLogContract = c.router({
  search: {
    method: 'POST',
    path: `/:workspaceId/form/action/log/search`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    body: c.type<Omit<Api.Form.Action.Log.Payload.Search, 'workspaceId'>>(),
    responses: {
      200: c.type<Api.Paginate<Api.Form.Action.Log>>(),
    },
    metadata: makeMeta({
      access: {
        form: ['action_canRead'],
      },
    }),
  },
})

export const formActionLogClient = (client: TsRestClient) => {
  return {
    search: ({workspaceId, ...body}: Api.Form.Action.Log.Payload.Search): Promise<Api.Paginate<Api.Form.Action.Log>> => {
      return client.form.action.log
        .search({
          body,
          params: {workspaceId},
        })
        .then(map200)
        .then(Api.Paginate.map(Api.Form.Action.Log.map))
    },
  }
}
