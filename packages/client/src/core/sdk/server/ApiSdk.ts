import {HttpClient, RequestOption} from './HttpClient'
import {KoboApiSdk} from './kobo/KoboApiSdk'
import {Method} from 'axios'
import {SessionSdk} from '@/core/sdk/server/session/SessionSdk'
import {KoboServerSdk} from '@/core/sdk/server/kobo/KoboServerSdk'
import {ProxySdk} from '@/core/sdk/server/proxy/ProxySdk'
import {JsonStoreSdk} from '@/core/sdk/server/jsonStore/JsonStoreSdk'
import {KoboAnswerHistorySdk} from '@/core/sdk/server/kobo/answerHistory/KoboAnswerHistorySdk'
import {CacheSdk} from '@/core/sdk/server/cache/CacheSdk'
import {DatabaseViewSdk} from '@/core/sdk/server/databaseView/DatabaseViewSdk'
import {ImportFromXlsDataSdk} from '@/core/sdk/server/importXls/ImportFromXlsSdk'

export class ApiSdk {
  constructor(private client: HttpClient) {
    this.session = new SessionSdk(client)
    this.kobo = {
      answerHistory: new KoboAnswerHistorySdk(this.client),
      server: new KoboServerSdk(this.client),
    }
    this.koboApi = new KoboApiSdk(client)
    this.databaseView = new DatabaseViewSdk(client)
    this.proxy = new ProxySdk(client)
    this.jsonStore = new JsonStoreSdk(client)
    this.cache = new CacheSdk(client)
    this.importData = new ImportFromXlsDataSdk(client)
  }

  readonly proxyRequest = <T = any>(method: Method, url: string, options?: RequestOption) => {
    return this.client.post<T>(`/proxy-request`, {
      responseType: 'blob',
      body: {
        method,
        url,
        body: options?.body,
        headers: options?.headers,
        mapData: (_: any) => _,
      },
    })
  }
  readonly session: SessionSdk
  readonly kobo: {
    answerHistory: KoboAnswerHistorySdk
    server: KoboServerSdk
  }
  readonly koboApi: KoboApiSdk
  readonly databaseView: DatabaseViewSdk
  readonly proxy: ProxySdk
  readonly jsonStore: JsonStoreSdk
  readonly cache: CacheSdk
  readonly importData: ImportFromXlsDataSdk
}
