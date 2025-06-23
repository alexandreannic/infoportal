import {ApiClient} from '../ApiClient'
import {KoboForm, KoboFormHelper} from './KoboMapper'
import {UUID} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'

export interface KoboFormCreate {
  workspaceId: UUID
  serverId: UUID
  uid: Kobo.FormId
}

export interface KoboParsedFormName {
  name: string
  program?: string
  donors?: string[]
}

export class KoboFormSdk {
  constructor(private client: ApiClient) {}

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

  readonly refreshAll = ({workspaceId}: {workspaceId: UUID}): Promise<KoboForm> => {
    return this.client.post(`/${workspaceId}/form/refresh`)
  }

  readonly add = ({workspaceId, ...body}: KoboFormCreate): Promise<KoboForm> => {
    return this.client.put(`/${workspaceId}/form`, {body})
  }

  readonly get = ({formId, workspaceId}: {workspaceId: UUID; formId: string}): Promise<KoboForm> => {
    return this.client.get(`/${workspaceId}/form/${formId}`).then(KoboFormHelper.map)
  }

  readonly getAll = ({workspaceId}: {workspaceId: UUID}): Promise<KoboForm[]> => {
    return this.client.get(`/${workspaceId}/form`).then(_ => _.map(KoboFormHelper.map))
  }
}
