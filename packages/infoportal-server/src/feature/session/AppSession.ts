import {Group, User, Workspace} from '@prisma/client'
import {Access} from '../access/AccessType'

export type AppSession = {
  user: User
  originalEmail?: string
}

export type UserProfile = {
  user: User
  groups: Group[]
  accesses: Access[]
  workspaces: Workspace[]
}
