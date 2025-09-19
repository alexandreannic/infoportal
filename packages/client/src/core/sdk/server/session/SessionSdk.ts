import {ApiClient} from '@/core/sdk/server/ApiClient'
import {Session, SessionHelper} from '@/core/sdk/server/session/Session'
import {Ip} from 'infoportal-api-sdk'

interface LoginRequest {
  name: string
  username: string
  accessToken: string
  provider: 'google' | 'microsoft'
}

export class SessionSdk {
  constructor(private client: ApiClient) {}

  readonly login = (body: LoginRequest) => {
    return this.client.post<Session>(`/session/login`, {body}).then(SessionHelper.map)
  }

  readonly logout = () => {
    return this.client.delete(`/session`)
  }

  readonly getMe = (): Promise<Session> => {
    return this.client.get(`/session/me`).then(SessionHelper.map)
  }

  readonly connectAs = (email: Ip.User.Email) => {
    return this.client.post<Session>(`/session/connect-as`, {body: {email}}).then(SessionHelper.map)
  }

  readonly revertConnectAs = () => {
    return this.client.post<Session>(`/session/connect-as-revert`).then(SessionHelper.map)
  }

  readonly track = (detail: string) => {
    return this.client.post<Ip.User>(`/session/track`, {body: {detail}})
  }
}
