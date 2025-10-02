import {AccessLevel, Brand} from './Common.js'
import {WorkspaceId} from './Workspace.js'

  export type UserId = Brand<string, 'userId'>
  export type User = {
    id: UserId
    email: User.Email
    createdAt: Date
    lastConnectedAt?: Date
    name?: string
    avatar?: any
    accessLevel: AccessLevel
    location?: string
    job?: string
  }

  export namespace User {
    export const map = (u: Partial<Record<keyof User, any>>): User => {
      return {
        ...u,
        lastConnectedAt: u.lastConnectedAt ? new Date(u.lastConnectedAt) : undefined,
        createdAt: u.createdAt ? new Date(u.createdAt) : undefined,
      } as any
    }
    export type Email = Brand<string, 'email'>
    export namespace Payload {
      export type Update = {
        workspaceId: WorkspaceId
        id: UserId
        accessLevel?: AccessLevel
        job?: string
        location?: string
      }
    }
}
