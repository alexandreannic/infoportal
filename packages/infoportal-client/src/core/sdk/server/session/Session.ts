import {User} from '@/core/sdk/server/user/User'

export interface UserSession extends User {
  // email: string
  // name: string
  originalEmail?: string
  accessToken: string
  // admin?: boolean
  // drcJobTitle?: string
  // drcOffice?: string
}
