import {User} from '@/core/sdk/server/user/User'
import {Ip} from 'infoportal-api-sdk'

export type Session = {
  originalEmail?: string
  user: User
  workspaces: Ip.Workspace[]
}

export class SessionHelper {
  static readonly map = (_: any): Session => {
    return {
      ..._,
      user: _.user,
      workspaces: _.workspaces, // TODO Need mapping!
    }
  }
}
