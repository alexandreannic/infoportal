import {ApiClient} from '../ApiClient'
import {UUID} from 'infoportal-common'
import {Group, GroupHelper} from '@/core/sdk/server/group/GroupItem'
import {Ip} from 'infoportal-api-sdk'

export class GroupSdk {
  constructor(private client: ApiClient) {}

  readonly create = (body: Ip.Group.Payload.Create) => {
    return this.client.put<Group>(`/${body.workspaceId}/group`, {body})
  }

  readonly update = ({workspaceId, id, ...body}: Ip.Group.Payload.Update) => {
    return this.client.post<Group>(`/${workspaceId}/group/${id}`, {body})
  }

  readonly remove = async ({workspaceId, id}: {workspaceId: Ip.WorkspaceId; id: UUID}) => {
    await this.client.delete(`/${workspaceId}/group/${id}`)
  }

  readonly search = async ({workspaceId, name}: {workspaceId: Ip.WorkspaceId; name?: string}): Promise<Group[]> => {
    return this.client.post(`/${workspaceId}/group`, {body: {name}}).then(_ => _.map(GroupHelper.map))
  }

  readonly updateItem = ({workspaceId, itemId, ...body}: Ip.Group.Payload.ItemUpdate) => {
    return this.client.post(`/${workspaceId}/group/item/${itemId}`, {body})
  }

  readonly deleteItem = ({id, workspaceId}: {workspaceId: Ip.WorkspaceId; id: UUID}) => {
    return this.client.delete(`/${workspaceId}/group/item/${id}`)
  }

  readonly createItem = ({workspaceId, groupId, ...body}: Ip.Group.Payload.ItemCreate) => {
    return this.client.put(`/${workspaceId}/group/${groupId}/item`, {body})
  }
}
