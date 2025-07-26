import type * as Prisma from '@prisma/client'
import {Kobo} from 'kobo-sdk'
import {KeyOf} from '@axanc/ts-utils'

type ReplaceNullWithUndefined<T> = {
  [K in keyof T]: Exclude<T[K], null> | Extract<T[K], null> extends never ? undefined : Exclude<T[K], null> | undefined
}

type Brand<K, T> = K & {
  /** @deprecated Should never be used: compile-time only trick to distinguish different ID types. */
  __brand: T
}

export namespace Ip {
  export type Uuid = Brand<string, 'Uuid'>

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

  // === PERMISSION
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
      access_canRead: boolean
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

  // === User
  export type User = Prisma.User
  export namespace User {}

  // === Workspace
  export type Workspace = Prisma.Workspace & {
    id: WorkspaceId
  }
  export type WorkspaceId = Brand<string, 'workspaceId'>
  export namespace Workspace {
    export type Access = Prisma.WorkspaceAccess
    export namespace Access {
      export namespace Payload {
        export type Create = {email: string; level: AccessLevel; workspaceId: WorkspaceId}
      }
    }

    export namespace Payload {
      export type Create = Omit<Workspace, 'id' | 'createdAt' | 'createdBy'>
      export type Update = {id: WorkspaceId} & Partial<Omit<Workspace, 'id' | 'createdAt' | 'createdBy'>>
    }
  }

  // === Server
  export type ServerId = Brand<string, 'serverId'>
  export type Server = Prisma.KoboServer & {
    id: ServerId
    workspaceId: WorkspaceId
  }
  export namespace Server {
    export namespace Payload {
      export type Create = Omit<Server, 'id'>
    }
  }

  // === Submission
  export type Submission<T extends Record<string, any> = Record<string, any>> = Omit<
    Prisma.FormSubmission,
    'answers' | 'deletedBy' | 'deletedAt' | 'formId' | 'form' | 'histories'
  > & {
    id: SubmissionId
    start?: Date | undefined
    end?: Date | undefined
    answers: T
    attachments: Kobo.Submission.Attachment[]
  }
  export type SubmissionId = Brand<string, 'submissionId'>
  export namespace Submission {
    export const map = (_: Submission): Submission => {
      if (_.start) _.start = new Date(_.start)
      if (_.end) _.end = new Date(_.end)
      _.submissionTime = new Date(_.submissionTime)
      return _
    }

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
      validationStatus?: Submission.Validation
      validatedBy?: string
      submittedBy?: string
      lastValidatedTimestamp?: number
      source?: string
      updatedAt?: Date
    }

    export namespace Payload {
      export type Submit = {
        workspaceId: WorkspaceId
        formId: FormId
        attachments: any[]
        answers: object
      }
      export type UpdateValidation = {
        formId: FormId
        workspaceId: WorkspaceId
        answerIds: SubmissionId[]
        status: Validation
      }
      export type Remove = {
        formId: FormId
        workspaceId: WorkspaceId
        answerIds: SubmissionId[]
      }
      export type Update<T extends Record<string, any> = any, K extends KeyOf<T> = any> = {
        formId: FormId
        workspaceId: WorkspaceId
        answerIds: SubmissionId[]
        question: K
        answer: T[K] | null
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
        workspaceId: WorkspaceId
        formId: FormId
        user?: User
      }
    }
  }

  // === Form
  export type FormId = Form.Id
  export type Form = Prisma.Form & {
    id: FormId
    kobo?: Form.KoboInfo
  }
  export namespace Form {
    export type DeploymentStatus = Prisma.DeploymentStatus
    export const DeploymentStatus = {
      deployed: 'deployed',
      archived: 'archived',
      draft: 'draft',
    } as const

    export type KoboInfo = Prisma.FormKoboInfo & {
      accountId: ServerId
      koboId: Kobo.FormId
    }

    export type Id = Brand<string, 'FormId'>

    export type Schema = Kobo.Form['content'] & {files?: Kobo.Form.File[]}

    export type Version = Omit<Prisma.FormVersion, 'schema' | 'id'> & {
      id: VersionId
    }

    export type Source = Prisma.FormSource
    export const Source = {
      kobo: 'kobo',
      disconnected: 'disconnected',
      internal: 'internal',
    } as const

    export namespace Payload {
      export type Update = {
        workspaceId: WorkspaceId
        formId: FormId
        archive?: boolean
      }

      export type Import = {
        serverId: ServerId
        uid: Kobo.FormId
      }

      export type Create = {
        name: string
        category?: string
      }
    }

    // === Access
    export type AccessId = Brand<string, 'accessId'>
    export type Access = Prisma.FormAccess & {
      id: AccessId
      groupName?: string
      filters?: Access.Filters
    }
    export namespace Access {
      export type Filters = Record<string, string[]>

      export namespace Payload {
        export type Create = {
          workspaceId: WorkspaceId
          formId: FormId
          level: Prisma.FormAccess['level']
          email?: Prisma.FormAccess['email']
          job?: Prisma.FormAccess['job'][]
          groupId?: GroupId
          filters?: Filters
        }
        export type Update = {
          id: AccessId
          workspaceId: WorkspaceId
          email?: Prisma.FormAccess['email']
          job?: Prisma.FormAccess['job']
          level?: Prisma.FormAccess['level']
          groupId?: GroupId
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

    export type VersionId = Brand<string, 'versionId'>
    export namespace Version {}
  }

  // === Group
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
      drcJob?: string
      drcOffice?: string
    }

    export namespace Payload {
      export type Create = Pick<Group, 'workspaceId' | 'name' | 'desc'>

      export type Update = Pick<Group, 'id' | 'workspaceId' | 'name' | 'desc'>

      export type ItemCreate = {
        workspaceId: WorkspaceId
        groupId: GroupId
        email?: string | null
        level: AccessLevel
        drcOffice?: string | null
        drcJob?: string[] | null
      }
      export type ItemUpdate = {
        itemId: ItemId
        workspaceId: WorkspaceId
        email?: string | null
        level: AccessLevel
        drcOffice?: string | null
        drcJob?: string | null
      }
    }
  }
}
