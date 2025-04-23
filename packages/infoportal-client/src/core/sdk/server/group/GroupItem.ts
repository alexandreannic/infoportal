import {UUID} from 'infoportal-common'
import {AccessLevel} from '@/core/sdk/server/access/Access'

export interface Group {
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
  level: AccessLevel
  email?: string
  drcJob?: string
  drcOffice?: string
}
