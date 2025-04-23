export interface User {
  email: string
  name: string
  accessToken: string
  admin?: boolean
  drcJob?: string
  createdAt?: Date
  lastConnectedAt?: Date
  drcOffice?: string
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
