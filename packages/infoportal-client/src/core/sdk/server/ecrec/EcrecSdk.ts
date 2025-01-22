import {ApiClient} from '../ApiClient'
import {KoboAnswerFilter} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {ApiPaginate, ApiSdkUtils} from '@/core/sdk/server/_core/ApiSdkUtils'
import {IKoboMeta} from 'infoportal-common'

export class EcrecSdk {
  constructor(private client: ApiClient) {}

  readonly search = async (filters: KoboAnswerFilter = {}): Promise<ApiPaginate<IKoboMeta>> => {
    return this.client.post(`/ecrec/search`, {body: {filters}}).then((result) => result)
  }

  readonly refresh = (): Promise<void> => {
    return this.client.post(`/ecrec/refresh`)
  }
}
