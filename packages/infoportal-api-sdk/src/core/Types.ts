import type * as Prisma from '@prisma/client'
import {Kobo} from 'kobo-sdk'
import {Permission} from './Permission'
import {KeyOf} from '@axanc/ts-utils'

export namespace Ip {
  export type Uuid = string

  export namespace Permission {
    export type Scope = 'global' | 'workspace' | 'form'

    export type Requirements = {
      global?: KeyOf<Permission.Global>[]
      workspace?: KeyOf<Permission.Workspace>[]
      form?: KeyOf<Permission.Form>[]
    }

    export type Form = {
      canGet: boolean
      canUpdate: boolean
      canDelete: boolean
      canSyncWithKobo: boolean
      user_canAdd: boolean
      user_canDelete: boolean
      user_canEdit: boolean
      access_canAdd: boolean
      access_canDelete: boolean
      access_canEdit: boolean
      answers_canSubmit: boolean
      answers_canUpdate: boolean
      answers_canDelete: boolean
      version_canCreate: boolean
      version_canDeploy: boolean
      version_canGet: boolean
      answers_import: boolean
      databaseview_manage: boolean
    }

    export type Workspace = {
      canUpdate: boolean
      canDelete: boolean
      form_canCreate: boolean
      server_canGet: boolean
      server_canCreate: boolean
      server_canDelete: boolean
      server_canUpdate: boolean
      group_canCreate: boolean
      group_canDelete: boolean
      group_canUpdate: boolean
      group_canRead: boolean
      proxy_manage: boolean
      proxy_canRead: boolean
      user_canCreate: boolean
      user_canDelete: boolean
      user_canUpdate: boolean
      user_canRead: boolean
      use_canConnectAs: boolean
    }

    export type Global = {
      workspace_canCreate: boolean
      cache_manage: boolean
    }
  }

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

    export namespace Payload {
      export type Create = Omit<Workspace, 'id' | 'createdAt' | 'createdBy'>
      export type Update = {id: Uuid} & Partial<Omit<Workspace, 'id' | 'createdAt' | 'createdBy'>>
    }
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

    export type Source = Prisma.FormSource
    export const Source = {
      kobo: 'kobo',
      disconnected: 'disconnected',
      internal: 'internal',
    } as const

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
