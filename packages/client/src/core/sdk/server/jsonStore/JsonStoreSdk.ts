import {UUID} from '@infoportal/common'
import {ApiClient} from '../ApiClient'
import {Ip} from '@infoportal/api-sdk'

export type JsonStore<T> = {
  id: UUID
  createdAt: Date
  updatedAt: Date
  updatedBy: Ip.User.Email
  key: JsonStoreKey
  value: T
}

export type JsonStoreMpcaBudget = {
  project: string
  office: string
  activity: string
  budget: number
}[]

export enum JsonStoreKey {
  MpcaBudget = 'MpcaBudget',
}

/** @deprecated as it is. Maybe useful in the future. */
export class JsonStoreSdk {
  constructor(private client: ApiClient) {}

  private readonly getRaw = <T>(key: JsonStoreKey.MpcaBudget): Promise<JsonStore<T>> => {
    return this.client.get(`/json-store/${key}`)
  }

  readonly getValue: {
    (key: JsonStoreKey.MpcaBudget): Promise<JsonStoreMpcaBudget>
  } = async key => {
    const data = await this.getRaw<any>(key).then(_ => _.value)
    if (key === JsonStoreKey.MpcaBudget && !Array.isArray(data)) {
      throw new Error(`Except JsonStoreKey.MpcaBudget value to be of type Array`)
    }
    return data
  }

  readonly set: {
    (key: JsonStoreKey.MpcaBudget, value: JsonStoreMpcaBudget): Promise<JsonStoreMpcaBudget>
  } = (key, value) => {
    return this.client.put(`/json-store`, {body: {key: key, json: value}})
  }

  readonly update: {
    (store: JsonStoreKey.MpcaBudget, value: JsonStoreMpcaBudget): Promise<JsonStoreMpcaBudget>
  } = (store, value) => {
    return this.client.patch(`/json-store`, {body: {key: store, json: value}})
  }
}
