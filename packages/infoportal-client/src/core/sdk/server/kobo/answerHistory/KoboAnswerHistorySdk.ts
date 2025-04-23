import {ApiClient} from '@/core/sdk/server/ApiClient'
import {KoboAnswerHistory, KoboAnswerHistorySearch} from '@/core/sdk/server/kobo/answerHistory/KoboAnswerHistory'
import {ApiPaginate, ApiSdkUtils} from '@/core/sdk/server/_core/ApiSdkUtils'

export class KoboAnswerHistorySdk {
  constructor(private client: ApiClient) {}

  readonly search = (body: KoboAnswerHistorySearch): Promise<ApiPaginate<KoboAnswerHistory>> => {
    return this.client.post(`/kobo-answer-history/search`, {body}).then(ApiSdkUtils.mapPaginate(KoboAnswerHistory.map))
  }
}
