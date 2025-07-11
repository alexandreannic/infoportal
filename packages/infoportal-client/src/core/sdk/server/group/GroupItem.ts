import {UUID} from 'infoportal-common'
import {Ip} from 'infoportal-api-sdk'

export interface Group {
  workspaceId: UUID
  id: UUID
  name: string
  desc?: string
  createdAt?: Date
  items: GroupItem[]
}

export class GroupHelper {
  static readonly map = (_: Record<keyof Group, any>): Group => {
    _.createdAt = new Date(_.createdAt)
    return _
  }
}

export interface GroupItem {
  id: UUID
  level: Ip.Form.Access.Level
  email?: string
  drcJob?: string
  drcOffice?: string
}
