import {z} from 'zod'
import {makeMeta, schema} from '../../helper/Schema.js'
import {Ip} from '../../Api.js'
import {initContract} from '@ts-rest/core'
import {map200, TsRestClient} from '../../ApiClient.js'
import {Kobo} from 'kobo-sdk'

const c = initContract()

export const koboContract = c.router({
  importFromKobo: {
    method: 'POST',
    path: '/:workspaceId/form/kobo',
    pathParams: z.object({
      workspaceId: schema.workspaceId,
    }),
    body: c.type<Ip.Form.Payload.Import>(),
    responses: {
      200: z.any() as z.ZodType<Ip.Form>,
    },
    metadata: makeMeta({
      access: {
        workspace: ['form_canCreate'],
      },
    }),
  },
})

export const koboClient = (client: TsRestClient, baseUrl: string) => {
  return {
    importFromKobo: ({
      workspaceId,
      ...body
    }: {
      workspaceId: Ip.WorkspaceId
      serverId: Ip.ServerId
      uid: Kobo.FormId
    }) => {
      return client.kobo.importFromKobo({params: {workspaceId}, body}).then(map200).then(Ip.Form.map)
    },
  }
}
