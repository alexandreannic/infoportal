import {HttpClient} from '@/core/sdk/server/HttpClient'
import {Session, SessionHelper} from '@/core/sdk/server/session/Session'
import {Api} from '@infoportal/api-sdk'

interface LoginRequest {
  name: string
  username: string
  accessToken: string
  provider: 'google' | 'microsoft'
}

export class SessionSdk {
  constructor(private client: HttpClient) {}

  readonly login = (body: LoginRequest) => {
    return this.client.post<Session>(`/session/login`, {body}).then(SessionHelper.map)
  }

  readonly logout = () => {
    return this.client.delete(`/session`)
  }

  readonly getMe = (): Promise<Session> => {
    return this.client.get(`/session/me`).then(SessionHelper.map)
  }

  readonly connectAs = (email: Api.User.Email) => {
    return this.client.post<Session>(`/session/connect-as`, {body: {email}}).then(SessionHelper.map)
  }

  readonly revertConnectAs = () => {
    return this.client.post<Session>(`/session/connect-as-revert`).then(SessionHelper.map)
  }

  readonly track = (detail: string) => {
    return this.client.post<Api.User>(`/session/track`, {body: {detail}})
  }
}
