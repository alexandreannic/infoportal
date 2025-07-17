import {ApiClient} from '@/core/sdk/server/ApiClient'
import {WorkspaceCreate, WorkspaceUpdate} from '@/core/sdk/server/workspace/Workspace'
import {UUID} from 'infoportal-common'
import {Ip} from 'infoportal-api-sdk'

export class WorkspaceSdk {
  constructor(private client: ApiClient) {}

  readonly getMine = () => {
    return this.client.get<Ip.Workspace[]>(`/workspace/me`)
  }

  readonly checkSlug = (slug: string): Promise<{isFree: boolean; suggestedSlug: string}> => {
    return this.client.post(`/workspace/check-slug`, {body: {slug}})
  }

  readonly create = (body: WorkspaceCreate) => {
    return this.client.put<Ip.Workspace>(`/workspace`, {body: body})
  }

  readonly update = (id: UUID, body: WorkspaceUpdate) => {
    return this.client.post<Ip.Workspace>(`/workspace/${id}`, {body: body})
  }

  readonly delete = (id: UUID) => {
    return this.client.delete<void>(`/workspace/${id}`)
  }

  // readonly getMine = () => {
  //   return this.client.get<Workspace[]>(`/workspace`)
  // }
}
