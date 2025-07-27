import {Ip} from 'infoportal-api-sdk'

export type AppSession = {
  user: Ip.User
  originalEmail?: Ip.User.Email
}

export type UserProfile = {
  user: Ip.User
  /** @deprecated ? */
  workspaces: Ip.Workspace[]
}
