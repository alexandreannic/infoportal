import {z} from 'zod'
import {schema} from '../../core/Schema'
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
      workspaceId: schema.uuid,
    }),
    body: c.type<Ip.Form.Payload.Import>(),
    responses: {
      200: z.any() as z.ZodType<Ip.Form>,
    },
  },
})

export const koboClient = (client: TsRestClient) => {
  return {
    importFromKobo: ({workspaceId, ...body}: {workspaceId: Ip.Uuid; serverId: Ip.Uuid; uid: Kobo.FormId}) => {
      return client.kobo.importFromKobo({params: {workspaceId}, body}).then(mapClientResponse).then(mapForm)
    },
  }
}
