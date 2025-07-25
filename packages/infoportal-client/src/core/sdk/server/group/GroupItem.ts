import {Ip} from 'infoportal-api-sdk'

export type Group = Ip.Group

export class GroupHelper {
  static readonly map = (_: Record<keyof Group, any>): Group => {
    _.createdAt = new Date(_.createdAt)
    return _
  }
}

export type GroupItem = Ip.Group.Item
