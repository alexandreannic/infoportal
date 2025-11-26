import {Api} from '@infoportal/api-sdk'

export type AppSession = {
  user: Api.User
  originalEmail?: Api.User.Email
}

export type UserProfile = {
  user: Api.User
  /** @deprecated ? */
  workspaces: Api.Workspace[]
}
