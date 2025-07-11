import {ApiClient} from '@/core/sdk/server/ApiClient'
import {User} from '@/core/sdk/server/user/User'
import {UUID} from 'infoportal-common'

export class UserSdk {
  constructor(private client: ApiClient) {}

  readonly update = ({workspaceId, user}: {workspaceId: UUID; user: Partial<User>}) => {
    return this.client.post<User>(`${workspaceId}/user/me`, {body: user})
  }

  readonly avatarUrl = ({email}: {email: string}) => {
    return `${this.client.baseUrl}/user/avatar/${email}`
  }

  readonly search = ({workspaceId}: {workspaceId: UUID}) => {
    return this.client.get<any[]>(`${workspaceId}/user`).then(res => res.map(User.map))
  }

  readonly fetchJobs = ({workspaceId}: {workspaceId: UUID}) => {
    return this.client.get<string[]>(`${workspaceId}/user/drc-job`)
  }
}
