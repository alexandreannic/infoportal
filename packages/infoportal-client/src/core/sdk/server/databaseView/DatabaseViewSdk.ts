import {ApiClient} from '@/core/sdk/server/ApiClient'
import {DatabaseView, DatabaseViewCol, DatabaseViewHelper} from '@/core/sdk/server/databaseView/DatabaseView'
import {UUID} from 'infoportal-common'

export class DatabaseViewSdk {
  constructor(private client: ApiClient) {}

  readonly search = (body: {databaseId: string}): Promise<DatabaseView[]> => {
    return this.client.post(`/database-view`, {body}).then((_) => _.map(DatabaseViewHelper.map))
  }

  readonly create = (body: Pick<DatabaseView, 'name' | 'databaseId' | 'visibility'>): Promise<DatabaseView> => {
    return this.client.put(`/database-view/${body.databaseId}`, {body})
  }

  readonly update = ({
    id,
    ...body
  }: Partial<Omit<DatabaseView, 'id' | 'details'>> & {id: UUID}): Promise<DatabaseView> => {
    return this.client.post(`/database-view/${id}`, {body})
  }

  readonly delete = (viewId: UUID): Promise<DatabaseView[]> => {
    return this.client.delete(`/database-view/${viewId}`)
  }

  readonly updateCol = (
    viewId: UUID,
    body: Partial<Pick<DatabaseViewCol, 'name' | 'width' | 'visibility'>>,
  ): Promise<DatabaseView> => {
    return this.client.post(`/database-view/${viewId}/col/${body.name}`, {body})
  }
}
