import {ApiClient} from '../ApiClient'
import {AccessLevel} from '@/core/sdk/server/access/Access'
import {UUID} from 'infoportal-common'
import {Group, GroupHelper} from '@/core/sdk/server/group/GroupItem'
import {AppFeatureId} from '@/features/appFeatureId'

type GroupCreate = Pick<Group, 'name' | 'desc'>

type GroupUpdate = GroupCreate

type GroupItemCreate = {
  email?: string | null
  level: AccessLevel
  drcOffice?: string | null
  drcJob?: string[] | null
}

export type GroupItemUpdate = {
  email?: string | null
  level: AccessLevel
  drcOffice?: string | null
  drcJob?: string | null
}

export class GroupSdk {
  constructor(private client: ApiClient) {}

  readonly create = (body: GroupCreate) => {
    return this.client.put<Group>(`/group`, {body})
  }

  readonly update = (id: UUID, body: GroupUpdate) => {
    return this.client.post<Group>(`/group/${id}`, {body})
  }

  readonly remove = async (id: UUID) => {
    await this.client.delete(`/group/${id}`)
  }

  readonly search = async ({
    name,
    featureId,
  }: {
    name?: string
    featureId?: AppFeatureId
  } = {}): Promise<Group[]> => {
    return this.client.post(`/group`, {body: {name, featureId}}).then(_ => _.map(GroupHelper.map))
  }

  readonly updateItem = (itemId: UUID, body: GroupItemUpdate) => {
    return this.client.post(`/group/item/${itemId}`, {body})
  }

  readonly deleteItem = (itemId: UUID) => {
    return this.client.delete(`/group/item/${itemId}`)
  }

  readonly createItem = (groupId: UUID, body: GroupItemCreate) => {
    return this.client.put(`/group/${groupId}/item`, {body})
  }
}
