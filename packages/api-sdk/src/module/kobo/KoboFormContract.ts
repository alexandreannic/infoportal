import {z} from 'zod'
import {makeMeta, schema} from '../../helper/Schema.js'
import {Api} from '../../Api.js'
import {initContract} from '@ts-rest/core'
import {map200, TsRestClient} from '../../ApiClient.js'
import {Kobo} from 'kobo-sdk'

const c = initContract()

export const koboFormContract = c.router({
  import: {
    method: 'POST',
    path: '/form/kobo/import',
    body: c.type<Api.Kobo.Form.Payload.Import>(),
    responses: {
      200: z.any() as z.ZodType<Api.Form>,
    },
    metadata: makeMeta({
      access: {
        workspace: ['form_canCreate'],
      },
    }),
  },
})

export const koboFormClient = (client: TsRestClient) => {
  return {
    import: (body: Api.Kobo.Form.Payload.Import) => {
      return client.kobo.form.import({body}).then(map200).then(Api.Form.map)
    },
  }
}
