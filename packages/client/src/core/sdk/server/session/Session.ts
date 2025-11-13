import {Ip} from '@infoportal/api-sdk'

export type Session = {
  originalEmail?: string
  user: Ip.User
  workspaces: Ip.Workspace[]
}

export class SessionHelper {
  static readonly map = (_: any): Session => {
    return {
      ..._,
      user: _.user,
      workspaces: _.workspaces.map(Ip.Workspace.map),
    }
  }
}
