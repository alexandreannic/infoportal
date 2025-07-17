import {ApiClient} from '@/core/sdk/server/ApiClient'
import {UUID} from 'infoportal-common'
import {Ip} from 'infoportal-api-sdk'

export class WorkspaceAccessSdk {
  constructor(private client: ApiClient) {}

  readonly create = (body: {email: string; level: Ip.AccessLevel; workspaceId: UUID}) => {
    return this.client.put<Ip.Workspace>(`/workspace-access`, {body: body})
  }

  // readonly getMine = () => {
  //   return this.client.get<Workspace[]>(`/workspace`)
  // }
}
