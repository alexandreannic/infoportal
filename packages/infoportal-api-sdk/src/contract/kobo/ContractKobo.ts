import {z} from 'zod'
import {makeMeta, schema} from '../../core/Schema'
import {Ip} from '../../core/Types'
import {initContract} from '@ts-rest/core'
import {mapClientResponse, TsRestClient} from '../../core/IpClient'
import {Kobo} from 'kobo-sdk'
import {mapForm} from '../form/ContractForm'

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

export const koboClient = (client: TsRestClient) => {
  return {
    importFromKobo: ({
      workspaceId,
      ...body
    }: {
      workspaceId: Ip.WorkspaceId
      serverId: Ip.ServerId
      uid: Kobo.FormId
    }) => {
      return client.kobo.importFromKobo({params: {workspaceId}, body}).then(mapClientResponse).then(mapForm)
    },
  }
}
