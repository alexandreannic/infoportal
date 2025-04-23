import {ApiClient} from '@/core/sdk/server/ApiClient'
import {UserSession} from '@/core/sdk/server/session/Session'
import {User} from '@/core/sdk/server/user/User'

interface LoginRequest {
  name: string
  username: string
  accessToken: string
}

export class SessionSdk {
  constructor(private client: ApiClient) {}

  readonly login = (body: LoginRequest) => {
    return this.client.post<UserSession>(`/session/login`, {body})
  }

  readonly logout = () => {
    return this.client.delete(`/session`)
  }

  readonly get = (): Promise<UserSession> => {
    return this.client.get(`/session`)
  }

  readonly connectAs = (email: string) => {
    return this.client.post<UserSession>(`/session/connect-as`, {body: {email}})
  }

  readonly revertConnectAs = () => {
    return this.client.post<UserSession>(`/session/connect-as-revert`)
  }

  readonly track = (detail: string) => {
    return this.client.post<User>(`/session/track`, {body: {detail}})
  }
}
