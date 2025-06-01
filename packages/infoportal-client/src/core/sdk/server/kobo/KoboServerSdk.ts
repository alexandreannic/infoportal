import {ApiClient} from '../ApiClient'
import {KoboServer} from './KoboMapper'
import {UUID} from 'infoportal-common'

export class KoboServerSdk {
  constructor(private client: ApiClient) {}

  readonly getAll = () => {
    return this.client.get<KoboServer[]>(`/kobo/server`)
  }

  readonly create = (body: Omit<KoboServer, 'id'>) => {
    return this.client.put<KoboServer>(`/kobo/server`, {body})
  }

  readonly delete = (id: UUID) => {
    return this.client.delete<void>(`/kobo/server/${id}`)
  }
}
