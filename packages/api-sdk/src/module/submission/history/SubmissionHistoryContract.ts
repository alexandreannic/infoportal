import {initContract} from '@ts-rest/core'
import {z} from 'zod'
import {SubmissionHistoryValidation} from './SubmissionHistoryValidation.js'
import {Api} from '../../../Api.js'
import {map200, TsRestClient} from '../../../ApiClient.js'

const c = initContract()

export const submissionHistoryContract = c.router({
  search: {
    method: 'POST',
    path: '/form/history/search',
    body: SubmissionHistoryValidation.search,
    responses: {
      200: z.any() as z.ZodType<Api.Paginate<Api.Submission.History>>,
    },
  },
})

export const submissionHistoryClient = (client: TsRestClient) => {
  return {
    search: (body: Api.Submission.History.Payload.Search) => {
      return client.submission.history
        .search({body})
        .then(map200)
        .then(_ => _.data.map(Api.Submission.History.map))
    },
  }
}
