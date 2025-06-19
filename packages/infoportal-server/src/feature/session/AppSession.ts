import {User, Workspace} from '@prisma/client'

export type AppSession = {
  user: User
  originalEmail?: string
}

export type UserProfile = {
  user: User
  workspaces: Workspace[]
}
