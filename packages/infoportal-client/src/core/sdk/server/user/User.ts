import {UUID} from 'infoportal-common'
import {Ip} from 'infoportal-api-sdk'

export interface User {
  id: UUID
  email: string
  name: string
  accessToken: string
  accessLevel: Ip.AccessLevel
  drcJob?: string
  drcOffice?: string
  createdAt?: Date
  lastConnectedAt?: Date
  workspaceId: UUID
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
