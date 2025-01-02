import {ApiClient} from '../ApiClient'
import {KoboForm, KoboFormHelper} from './KoboMapper'
import {UUID} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'

export interface KoboFormCreate {
  serverId: UUID
  uid: Kobo.FormId
}

interface KoboParsedFormName {
  name: string
  program?: string
  donors?: string[]
}

export class KoboFormSdk {

  constructor(private client: ApiClient) {
  }

  /**@deprecated*/
  static readonly parseFormName = (name: string): KoboParsedFormName => {
    const match = name?.match(/^\[(.*?)]\s*(?:\{(.*?)})?\s*(.*)$/)
    if (match) {
      const [, sector, donors, formName] = match
      return {
        program: sector,
        name: formName,
        donors: donors?.split(','),
      }
    }
    return {
      name,
    }
  }

  readonly refreshAll = (): Promise<KoboForm> => {
    return this.client.post(`kobo/form/refresh`)
  }

  readonly add = (body: KoboFormCreate): Promise<KoboForm> => {
    return this.client.put(`/kobo/form`, {body})
  }

  readonly get = (formId: string): Promise<KoboForm> => {
    return this.client.get(`/kobo/form/${formId}`).then(KoboFormHelper.map)
  }

  readonly getAll = (): Promise<KoboForm[]> => {
    return this.client.get(`/kobo/form`).then(_ => _.map(KoboFormHelper.map))
  }
}
