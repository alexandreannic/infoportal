import {Api} from '@infoportal/api-sdk'

export type Session = {
  originalEmail?: string
  user: Api.User
  workspaces: Api.Workspace[]
}

export class SessionHelper {
  static readonly map = (_: any): Session => {
    return {
      ..._,
      user: _.user,
      workspaces: _.workspaces.map(Api.Workspace.map),
    }
  }
}
