import {User} from '@prisma/client'

export interface UserSession {
  email: string
  name: string
  admin?: boolean
  accessToken?: string
  drcJob?: string
  drcOffice?: string
  originalEmail?: string
}

export class UserSession {
  static readonly fromUser = (user: User): UserSession => {
    return {
      accessToken: user.accessToken ?? undefined,
      name: user.name ?? '',
      admin: user.admin,
      email: user.email,
      drcJob: user.drcJob ?? undefined,
      drcOffice: user.drcOffice ?? undefined,
    }
  }
}
