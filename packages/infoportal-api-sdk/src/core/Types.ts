import type * as Prisma from '@prisma/client'
import {Kobo} from 'kobo-sdk'
import {KeyOf} from '@axanc/ts-utils'

type ReplaceNullWithUndefined<T> = {
  [K in keyof T]: Exclude<T[K], null> | Extract<T[K], null> extends never ? undefined : Exclude<T[K], null> | undefined
}

export namespace Ip {
  export type Uuid = string

  export type Period = {
    start: Date
    end: Date
  }

  export type Pagination = {
    offset?: number
    limit?: number
  }

  export type Paginate<T> = {
    total: number
    data: T[]
  }

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
    export namespace Access {
      export namespace Payload {
        export type Create = {email: string; level: AccessLevel; workspaceId: Uuid}
      }
    }

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

  export type Submission<T extends Record<string, any> = Record<string, any>> = Omit<
    Prisma.FormSubmission,
    'attachments' | 'answers' | 'deletedBy' | 'deletedAt' | 'formId' | 'form' | 'histories'
  > & {
    answers: T
    attachments: Kobo.Submission.Attachment[]
  }

  export type SubmissionId = Submission.Id
  export namespace Submission {
    export type Validation = Prisma.FormSubmissionValidation
    export const Validation = {
      Approved: 'Approved',
      Pending: 'Pending',
      Rejected: 'Rejected',
      Flagged: 'Flagged',
      UnderReview: 'UnderReview',
    } as const

    export type Meta = {
      start: Date
      /** Refresh whenever submission is updated */
      end: Date
      /** Set by Kobo Server, not editable */
      submissionTime: Kobo.Submission['_submission_time']
      version?: Kobo.Submission['__version__']
      attachments: Kobo.Submission.Attachment[]
      geolocation: Kobo.Submission['_geolocation']
      id: Kobo.SubmissionId
      uuid: Kobo.Submission['_uuid']
      validationStatus?: Ip.Submission.Validation
      validatedBy?: string
      submittedBy?: string
      lastValidatedTimestamp?: number
      source?: string
      updatedAt?: Date
    }

    export type Id = string
    export namespace Payload {
      export type UpdateValidation = {
        formId: FormId
        workspaceId: Uuid
        answerIds: Id[]
        status: Validation
      }
      export type Remove = {
        formId: FormId
        workspaceId: Uuid
        answerIds: Id[]
      }
      export type Update<T extends Record<string, any> = any, K extends KeyOf<T> = any> = {
        formId: FormId
        workspaceId: Uuid
        answerIds: Id[]
        question: K
        answer: T[K] | null
      }
      export type Create = {
        id: string
        uuid: string
        formId: string
        start: Date
        end: Date
        submissionTime: Date
        submittedBy?: string
        version?: string
        validationStatus?: Validation
        validatedBy?: string
        source: Form.Source
        lastValidatedTimestamp?: number
        geolocation: [number, number] | [null, null]
        answers: Record<string, any>
        attachments: Kobo.Submission.Attachment[]
        deletedAt?: Date
        deletedBy?: string
      }

      export type Filter = {
        ids?: Kobo.FormId[]
        filterBy?: {
          column: string
          value: (string | null | undefined)[]
          type?: 'array'
        }[]
      }

      export type Search = {
        filters?: Filter & Partial<Period>
        paginate?: Pagination
        workspaceId: Uuid
        formId: FormId
        user?: User
      }
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
