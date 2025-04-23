import {ApiClient} from '@/core/sdk/server/ApiClient'
import {UUID} from 'infoportal-common'
import {Proxy} from '@/core/sdk/server/proxy/Proxy'

export class ProxySdk {
  constructor(private client: ApiClient) {}

  readonly create = (body: {name: string; slug: string; url: string}): Promise<Proxy> => {
    return this.client.put(`/proxy`, {body})
  }

  readonly update = (
    id: UUID,
    body: {
      name?: string
      url?: string
      disabled?: boolean
    },
  ): Promise<Proxy> => {
    return this.client.post(`/proxy/${id}`, {body})
  }

  readonly delete = (id: UUID) => {
    return this.client.delete(`/proxy/${id}`)
  }

  readonly search = (): Promise<Proxy[]> => {
    return this.client.get(`/proxy`).then((_) => _.map(Proxy.map))
  }
}
