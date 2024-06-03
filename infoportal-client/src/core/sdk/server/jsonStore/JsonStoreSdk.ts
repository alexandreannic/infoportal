import {DrcOffice, DrcProgram, DrcProject} from '@infoportal-common'
import {ApiClient} from '../ApiClient'
import {UUID} from 'crypto'

export type JsonStore<T> = {
  id: UUID,
  createdAt: Date,
  updatedAt: Date,
  updatedBy: string,
  key: JsonStoreKey,
  value: T
}

export type JsonStoreMpcaBudget = {
  project: DrcProject
  office: DrcOffice
  activity: DrcProgram
  budget: number
}[]

export type JsonStoreShelterContractor = {
  office: DrcOffice
  name: string
}

export enum JsonStoreKey {
  MpcaBudget = 'MpcaBudget',
  ShelterContractor = 'ShelterContractor',
}

export class JsonStoreSdk {

  constructor(private client: ApiClient) {
  }

  private readonly getRaw = <T>(key: string): Promise<JsonStore<T>> => {
    return this.client.get(`/json-store/${key}`)
  }

  readonly getValue: {
    (key: JsonStoreKey.MpcaBudget): Promise<JsonStoreMpcaBudget>
    (key: JsonStoreKey.ShelterContractor): Promise<JsonStoreShelterContractor[]>
  } = async (key) => {
    const data = await this.getRaw<any>(key).then(_ => _.value)
    if (key === JsonStoreKey.MpcaBudget && !Array.isArray(data)) {
      throw new Error(`Except JsonStoreKey.MpcaBudget value to be of type Array`)
    }
    if (key === JsonStoreKey.ShelterContractor && !Array.isArray(data)) {
      throw new Error(`Except JsonStoreKey.ShelterContractor value to be of type Array`)
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
