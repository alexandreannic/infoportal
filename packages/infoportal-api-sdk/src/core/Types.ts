import type * as Prisma from '@prisma/client'
import {Kobo} from 'kobo-sdk'

export namespace Ip {
  export type Uuid = string

  export type AccessLevel = Prisma.AccessLevel
  export const AccessLevel = {
    Read: 'Read',
    Write: 'Write',
    Admin: 'Admin',
  } as const

  export type FormId = Form.Id

  export type Form = Prisma.Form

  export type Server = Prisma.KoboServer

  export type User = Prisma.User

  export namespace User {}

  export type Workspace = Prisma.Workspace

  export namespace Workspace {
    export type Access = Prisma.WorkspaceAccess
  }

  export namespace Server {
    export namespace Payload {
      export type Create = Omit<Server, 'id'>
    }
  }

  export namespace Form {
    export type Id = string

    export type Schema = Kobo.Form['content'] & {files?: Kobo.Form.File[]}

    export type Version = Omit<Prisma.FormVersion, 'schema'>

    export enum Source {
      kobo = 'kobo',
      disconnected = 'disconnected',
      internal = 'internal',
    }

    export namespace Payload {
      export type Update = {
        workspaceId: Ip.Uuid
        formId: Ip.FormId
        source?: 'disconnected' | 'kobo'
        archive?: boolean
      }

      export type Import = {
        serverId: Ip.Uuid
        uid: Kobo.FormId
      }

      export type Create = {
        name: string
        category?: string
      }
    }

    export type Access = Prisma.FormAccess & {
      groupName?: string
      filters?: Access.Filters
    }

    export namespace Access {
      export type Filters = Record<string, string[]>

      export namespace Payload {
        export type Create = {
          workspaceId: Prisma.FormAccess['workspaceId']
          formId: Prisma.FormAccess['formId']
          level: Prisma.FormAccess['level']
          email?: Prisma.FormAccess['email']
          job?: Prisma.FormAccess['job'][]
          groupId?: Prisma.FormAccess['groupId']
          filters?: Filters
        }
        export type Update = {
          id: Prisma.FormAccess['id']
          workspaceId: Prisma.FormAccess['workspaceId']
          email?: Prisma.FormAccess['email']
          job?: Prisma.FormAccess['job']
          level?: Prisma.FormAccess['level']
          groupId?: Prisma.FormAccess['groupId']
        }
      }
    }

    export namespace Schema {
      export type Validation = {
        status: 'error' | 'warning' | 'success'
        code: number
        message: string
        warnings?: string[]
        schema?: any
      }
    }

    export namespace Version {}
  }
}
