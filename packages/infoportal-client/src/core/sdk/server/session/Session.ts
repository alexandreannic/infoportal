import {Workspace, WorkspaceHelper} from '@/core/sdk/server/workspace/Workspace'
import {User} from '@/core/sdk/server/user/User'

export type Session = {
  originalEmail?: string
  user: User
  workspaces: Workspace[]
  // accesses: Access[]
  // groups: Group[]
}

export class SessionHelper {
  static readonly map = (_: any): Session => {
    return {
      // groups: _.groups.map(GroupHelper.map),
      // accesses: _.accesses.map(Access.map),
      user: _.user,
      workspaces: _.workspaces.map(WorkspaceHelper.map),
    }
  }
}
