import {ApiClient} from '../ApiClient'
import {KoboServer} from './KoboMapper'
import {UUID} from 'infoportal-common'

export class KoboServerSdk {
  constructor(private client: ApiClient) {}

  readonly getAll = ({workspaceId}: {workspaceId: UUID}) => {
    return this.client.get<KoboServer[]>(`/${workspaceId}/kobo/server`)
  }

  readonly create = ({workspaceId, ...body}: Omit<KoboServer, 'id'>) => {
    return this.client.put<KoboServer>(`/${workspaceId}/kobo/server`, {body})
  }

  readonly delete = ({workspaceId, id}: {workspaceId: UUID; id: UUID}) => {
    return this.client.delete<void>(`/${workspaceId}/kobo/server/${id}`)
  }
}
