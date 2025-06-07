import {Access} from '@/core/sdk/server/access/Access'
import {Workspace, WorkspaceHelper} from '@/core/sdk/server/workspace/Workspace'
import {Group, GroupHelper} from '@/core/sdk/server/group/GroupItem'
import {User} from '@/core/sdk/server/user/User'

export type Session = {
  originalEmail?: string
  user: User
  accesses: Access[]
  workspaces: Workspace[]
  groups: Group[]
}

export class SessionHelper {
  static readonly map = (_: any): Session => {
    return {
      accesses: _.accesses.map(Access.map),
      user: _.user,
      groups: _.groups.map(GroupHelper.map),
      workspaces: _.workspaces.map(WorkspaceHelper.map),
    }
  }
}
