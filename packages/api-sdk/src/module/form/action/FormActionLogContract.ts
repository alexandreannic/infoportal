import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {makeMeta, schema} from '../../../helper/Schema.js'
import {Ip} from '../../../Api.js'
import {map200, TsRestClient} from '../../../ApiClient.js'
import {CommonHelper} from '../../common/CommonHelper.js'

const c = initContract()

export const formActionLogContract = c.router({
  search: {
    method: 'POST',
    path: `/:workspaceId/form/action/log/search`,
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    body: c.type<Omit<Ip.Form.Action.Log.Payload.Search, 'workspaceId'>>(),
    responses: {
      200: c.type<Ip.Paginate<Ip.Form.Action.Log>>(),
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
    search: ({workspaceId, ...body}: Ip.Form.Action.Log.Payload.Search): Promise<Ip.Paginate<Ip.Form.Action.Log>> => {
      return client.form.action.log
        .search({
          body,
          params: {workspaceId},
        })
        .then(map200)
        .then(CommonHelper.map(Ip.Form.Action.Log.map))
    },
  }
}
