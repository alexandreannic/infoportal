import {ApiClient} from '../ApiClient'
import {IpCacheData} from 'infoportal-common'
import {Obj} from '@axanc/ts-utils'

export class CacheSdk {
  constructor(private client: ApiClient) {}

  readonly get = (): Promise<Record<string, IpCacheData<any>>> => {
    return this.client.get<Record<string, IpCacheData<any>>>(`/cache`).then((res) => {
      return Obj.mapValues(res, (_) => {
        if (_.lastUpdate) _.lastUpdate = new Date(_.lastUpdate)
        return _
      })
    })
  }

  readonly clear = (key: string, subKey?: string): Promise<void> => {
    return this.client.post(`/cache/clear`, {body: {key, subKey}})
  }
}
