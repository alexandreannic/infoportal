import {Group, User, Workspace} from '@prisma/client'
import {Access} from '../access/AccessType'

export interface AppSession {
  user: User
  groups: Group[]
  accesses: Access[]
  workspaces: Workspace[]
  originalEmail?: string
}
