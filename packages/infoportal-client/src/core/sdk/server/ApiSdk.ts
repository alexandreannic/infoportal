import {ApiClient, RequestOption} from './ApiClient'
import {KoboApiSdk} from './kobo/KoboApiSdk'
import {Method} from 'axios'
import {SessionSdk} from '@/core/sdk/server/session/SessionSdk'
import {KoboAnswerSdk} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {KoboServerSdk} from '@/core/sdk/server/kobo/KoboServerSdk'
import {KoboFormSdk} from '@/core/sdk/server/kobo/KoboFormSdk'
import {AccessSdk} from '@/core/sdk/server/access/AccessSdk'
import {UserSdk} from '@/core/sdk/server/user/UserSdk'
import {ProxySdk} from '@/core/sdk/server/proxy/ProxySdk'
import {GroupSdk} from '@/core/sdk/server/group/GroupSdk'
import {JsonStoreSdk} from '@/core/sdk/server/jsonStore/JsonStoreSdk'
import {KoboAnswerHistorySdk} from '@/core/sdk/server/kobo/answerHistory/KoboAnswerHistorySdk'
import {CacheSdk} from '@/core/sdk/server/cache/CacheSdk'
import {DatabaseViewSdk} from '@/core/sdk/server/databaseView/DatabaseViewSdk'
import {ImportFromXlsDataSdk} from '@/core/sdk/server/importXls/ImportFromXlsSdk'
import {WorkspaceSdk} from '@/core/sdk/server/workspace/WorkspaceSdk'

export class ApiSdk {
  constructor(private client: ApiClient) {
    this.workspace = new WorkspaceSdk(client)
    this.session = new SessionSdk(client)
    this.kobo = {
      answerHistory: new KoboAnswerHistorySdk(this.client),
      answer: new KoboAnswerSdk(this.client),
      server: new KoboServerSdk(this.client),
      form: new KoboFormSdk(this.client),
    }
    this.koboApi = new KoboApiSdk(client)
    this.user = new UserSdk(client)
    this.access = new AccessSdk(this.client, this.user)
    this.group = new GroupSdk(client)
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
  readonly workspace: WorkspaceSdk
  readonly session: SessionSdk
  readonly kobo: {
    answerHistory: KoboAnswerHistorySdk
    answer: KoboAnswerSdk
    server: KoboServerSdk
    form: KoboFormSdk
  }
  readonly koboApi: KoboApiSdk
  readonly user: UserSdk
  readonly access: AccessSdk
  readonly group: GroupSdk
  readonly databaseView: DatabaseViewSdk
  readonly proxy: ProxySdk
  readonly jsonStore: JsonStoreSdk
  readonly cache: CacheSdk
  readonly importData: ImportFromXlsDataSdk
}
