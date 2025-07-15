import {ApiClient} from '@/core/sdk/server/ApiClient'
import {Workspace} from '@/core/sdk/server/workspace/Workspace'
import {UUID} from 'infoportal-common'
import {WorkspaceAccessLevel} from '@/features/Admin/AddUserForm'

export class WorkspaceAccessSdk {
  constructor(private client: ApiClient) {}

  readonly create = (body: {email: string; level: WorkspaceAccessLevel; workspaceId: UUID}) => {
    return this.client.put<Workspace>(`/workspace-access`, {body: body})
  }

  // readonly getMine = () => {
  //   return this.client.get<Workspace[]>(`/workspace`)
  // }
}
