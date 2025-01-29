import {KoboClientV2} from './v2/KoboClientV2'
import {KoboClientV1} from './v1/KoboClientV1'
import {ApiClient, ApiClientParams} from './api-client/ApiClient'
import {Logger} from './Kobo'

export class KoboClient {
  constructor({
    urlv1,
    urlv2,
    token,
    ApiClientClass = ApiClient,
    log,
  }: {
    urlv1: string
    urlv2: string
    token: string
    ApiClientClass?: new (_: ApiClientParams) => ApiClient
    log: Logger
  }) {
    this.v1 = new KoboClientV1(
      new ApiClientClass({
        baseUrl: urlv1,
        headers: {
          Authorization: KoboClient.makeAuthorizationHeader(token),
        },
      }),
      log,
    )
    this.v2 = new KoboClientV2(
      new ApiClientClass({
        baseUrl: urlv2,
        headers: {
          Authorization: KoboClient.makeAuthorizationHeader(token),
        },
      }),
      log,
    )
  }

  readonly v1: KoboClientV1
  readonly v2: KoboClientV2
  static readonly makeAuthorizationHeader = (token: string) => `Token ${token}`
}
