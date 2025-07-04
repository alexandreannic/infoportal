import {ApiClient} from '../ApiClient'
import {AccessLevel} from '@/core/sdk/server/access/Access'
import {UUID} from 'infoportal-common'
import {Group, GroupHelper} from '@/core/sdk/server/group/GroupItem'
import {AppFeatureId} from '@/features/appFeatureId'

type GroupCreate = Pick<Group, 'workspaceId' | 'name' | 'desc'>

type GroupUpdate = Pick<Group, 'id' | 'workspaceId' | 'name' | 'desc'>

type GroupItemCreate = {
  workspaceId: UUID
  groupId: UUID
  email?: string | null
  level: AccessLevel
  drcOffice?: string | null
  drcJob?: string[] | null
}

export type GroupItemUpdate = {
  workspaceId: UUID
  itemId: UUID
  email?: string | null
  level: AccessLevel
  drcOffice?: string | null
  drcJob?: string | null
}

export class GroupSdk {
  constructor(private client: ApiClient) {}

  readonly create = (body: GroupCreate) => {
    return this.client.put<Group>(`/${body.workspaceId}/group`, {body})
  }

  readonly update = ({workspaceId, id, ...body}: GroupUpdate) => {
    return this.client.post<Group>(`/${workspaceId}/group/${id}`, {body})
  }

  readonly remove = async ({workspaceId, id}: {workspaceId: UUID; id: UUID}) => {
    await this.client.delete(`/${workspaceId}/group/${id}`)
  }

  readonly search = async ({
    workspaceId,
    name,
    featureId,
  }: {
    workspaceId: UUID
    name?: string
    featureId?: AppFeatureId
  }): Promise<Group[]> => {
    return this.client.post(`/${workspaceId}/group`, {body: {name, featureId}}).then(_ => _.map(GroupHelper.map))
  }

  readonly updateItem = ({workspaceId, itemId, ...body}: GroupItemUpdate) => {
    return this.client.post(`/${workspaceId}/group/item/${itemId}`, {body})
  }

  readonly deleteItem = ({id, workspaceId}: {workspaceId: UUID; id: UUID}) => {
    return this.client.delete(`/${workspaceId}/group/item/${id}`)
  }

  readonly createItem = ({workspaceId, groupId, ...body}: GroupItemCreate) => {
    return this.client.put(`/${workspaceId}/group/${groupId}/item`, {body})
  }
}
