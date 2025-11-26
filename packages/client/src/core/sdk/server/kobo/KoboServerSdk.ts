import {HttpClient} from '../HttpClient'
import {KoboServer} from './KoboMapper'
import {UUID} from '@infoportal/common'
import {Api} from '@infoportal/api-sdk'

export class KoboServerSdk {
  constructor(private client: HttpClient) {}

  readonly getAll = ({workspaceId}: {workspaceId: Api.WorkspaceId}) => {
    return this.client.get<KoboServer[]>(`/${workspaceId}/kobo/server`)
  }

  readonly create = ({workspaceId, ...body}: Omit<KoboServer, 'id'>) => {
    return this.client.put<KoboServer>(`/${workspaceId}/kobo/server`, {body})
  }

  readonly delete = ({workspaceId, id}: {workspaceId: Api.WorkspaceId; id: UUID}) => {
    return this.client.delete<void>(`/${workspaceId}/kobo/server/${id}`)
  }
}
