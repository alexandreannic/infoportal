import {UUID} from 'infoportal-common'
import {Ip} from 'infoportal-api-sdk'

export interface User {
  id: UUID
  email: Ip.User.Email
  name: string
  accessToken: string
  accessLevel: Ip.AccessLevel
  drcJob?: string
  drcOffice?: string
  createdAt?: Date
  lastConnectedAt?: Date
  workspaceId: Ip.WorkspaceId
}

export class User {
  static readonly map = (u: Record<keyof User, any>): User => {
    return {
      ...u,
      lastConnectedAt: u.lastConnectedAt ? new Date(u.lastConnectedAt) : undefined,
      createdAt: u.createdAt ? new Date(u.createdAt) : undefined,
    }
  }
}
