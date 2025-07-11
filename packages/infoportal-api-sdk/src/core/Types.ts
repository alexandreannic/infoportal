import type {FormAccess, FormVersion, KoboForm, KoboServer} from '@prisma/client'
import {Kobo} from 'kobo-sdk'

export namespace Ip {
  export type Uuid = string

  export type FormId = Form.Id

  export type Form = KoboForm

  export type Server = KoboServer

  export namespace Server {
    export namespace Payload {
      export type Create = Omit<Server, 'id'>
    }
  }

  export namespace Form {
    export type Id = string

    export type Schema = Kobo.Form['content'] & {files?: Kobo.Form.File[]}

    export type Version = Omit<FormVersion, 'schema'>

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

    export type Access = FormAccess & {
      groupName?: string
      filters?: Access.Filters
    }

    export namespace Access {
      export type Filters = Record<string, string[]>

      export enum Level {
        Read = 'Read',
        Write = 'Write',
        Admin = 'Admin',
      }

      export namespace Payload {
        export type Create = {
          workspaceId: FormAccess['workspaceId']
          formId: FormAccess['formId']
          level: FormAccess['level']
          email?: FormAccess['email']
          job?: FormAccess['job'][]
          groupId?: FormAccess['groupId']
          filters?: Filters
        }
        export type Update = {
          id: FormAccess['id']
          workspaceId: FormAccess['workspaceId']
          email?: FormAccess['email']
          job?: FormAccess['job']
          level?: FormAccess['level']
          groupId?: FormAccess['groupId']
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
