import {UUID} from 'infoportal-common'

export interface User {
  id: UUID
  email: string
  name: string
  accessToken: string
  admin?: boolean
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
