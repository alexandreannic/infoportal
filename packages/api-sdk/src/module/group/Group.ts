import type * as Prisma from '@infoportal/prisma'
import {User} from '../user/User.js'
import {WorkspaceId} from '../workspace/Workspace.js'
import {AccessLevel, Brand, Uuid} from '../common/Common.js'

  export type GroupId = Brand<string, 'groupId'>
  export type Group = Omit<Prisma.Group, 'id' | 'workspaceId' | 'desc'> & {
    id: GroupId
    workspaceId: WorkspaceId
    desc?: string
    items: Group.Item[]
  }
  export namespace Group {
    export type ItemId = Brand<string, 'itemId'>
    export type Item = {
      id: ItemId
      level: AccessLevel
      email?: string
      job?: string
      location?: string
    }

    export namespace Payload {
      export type Create = Pick<Group, 'workspaceId' | 'name' | 'desc'>

      export type Update = Pick<Group, 'id' | 'workspaceId' | 'name' | 'desc'>

      export type Search = {
        workspaceId: WorkspaceId
        name?: string
        user?: User
        featureId?: Uuid
      }

      export type ItemCreate = {
        workspaceId: WorkspaceId
        groupId: GroupId
        email?: string | null
        level: AccessLevel
        location?: string | null
        jobs?: string[] | null
      }
      export type ItemUpdate = {
        id: ItemId
        workspaceId: WorkspaceId
        email?: string | null
        level: AccessLevel
        location?: string | null
        job?: string | null
      }
    }
  }
