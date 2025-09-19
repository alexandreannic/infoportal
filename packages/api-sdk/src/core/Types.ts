import type * as Prisma from '@prisma/client'
import {Kobo} from 'kobo-sdk'
import {KeyOf} from '@axanc/ts-utils'
import {Defined} from 'yup'

type NullToOptional<T> = {
  // keep required keys (no null)
  [K in keyof T as null extends T[K] ? never : K]: T[K] extends object ? NullToOptional<T[K]> : T[K]
} & {
  // make nullable keys optional, remove null from their type
  [K in keyof T as null extends T[K] ? K : never]?: Exclude<T[K], null> extends object
    ? NullToOptional<Exclude<T[K], null>>
    : Exclude<T[K], null>
}

type Brand<K, T> = K & {
  /** @deprecated Should never be used: compile-time only trick to distinguish different ID types. */
  __brand: T
}

export namespace Ip {
  export type StateStatus = 'error' | 'warning' | 'info' | 'success' | 'disabled'

  export type BulkResponse<ID extends string> = {id: ID; status: 'success'}[]

  export type Uuid = Brand<string, 'Uuid'>

  export type Geolocation = [number, number]

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
      action_canRead: boolean
      action_canDelete: boolean
      action_canRun: boolean
      action_canUpdate: boolean
      action_canCreate: boolean
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
      user_canConnectAs: boolean
      form_canGetAll: boolean
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
    export const map = (u: Partial<Record<keyof Ip.User, any>>): Ip.User => {
      return {
        ...u,
        lastConnectedAt: u.lastConnectedAt ? new Date(u.lastConnectedAt) : undefined,
        createdAt: u.createdAt ? new Date(u.createdAt) : undefined,
      } as any
    }
    export type Email = Brand<string, 'email'>
    export namespace Payload {
      export type Update = {
        workspaceId: Ip.WorkspaceId
        id: Ip.UserId
        accessLevel?: AccessLevel
        job?: string
        location?: string
      }
    }
  }

  // === Workspace
  export type Workspace = Prisma.Workspace & {
    id: WorkspaceId
    level?: AccessLevel
  }
  export type WorkspaceId = Brand<string, 'workspaceId'>
  export namespace Workspace {
    export const map = (u: Ip.Workspace): Ip.Workspace => {
      return {
        ...u,
        createdAt: new Date(u.createdAt),
      }
    }

    export type InvitationId = Brand<string, 'workspaceInvitation'>
    export type Invitation = Prisma.WorkspaceInvitation & {
      id: InvitationId
      createdBy: User.Email
      toEmail: User.Email
    }
    export type InvitationW_workspace = Prisma.WorkspaceInvitation & {
      id: InvitationId
      toEmail: User.Email
      createdBy: User.Email
      workspace: Workspace
    }
    export namespace Invitation {
      export namespace Payload {
        export type Create = {email: Ip.User.Email; level: AccessLevel; workspaceId: WorkspaceId}
      }
      export const map = (_: Ip.Workspace.Invitation): Ip.Workspace.Invitation => {
        _.createdAt = new Date(_.createdAt)
        return _
      }
      export const mapW_workspace = (_: Ip.Workspace.InvitationW_workspace): Ip.Workspace.InvitationW_workspace => {
        _.createdAt = new Date(_.createdAt)
        _.workspace = Workspace.map(_.workspace)
        return _
      }
    }

    export type Access = Prisma.WorkspaceAccess
    export type AccessId = Brand<string, 'workspaceAccessId'>
    export namespace Access {}

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

    export const validationToStatus: Record<Ip.Submission.Validation, StateStatus> = {
      Approved: 'success',
      Pending: 'warning',
      Rejected: 'error',
      Flagged: 'info',
      UnderReview: 'warning',
    }

    export type Meta = {
      start: Date
      /** Refresh whenever submission is updated */
      end: Date
      /** Set by Kobo Server, not editable */
      submissionTime: Kobo.Submission['_submission_time']
      version?: Kobo.Submission['__version__']
      attachments: Kobo.Submission.Attachment[]
      geolocation?: Geolocation
      isoCode?: string
      id: Kobo.SubmissionId
      uuid: Kobo.Submission['_uuid']
      validationStatus?: Submission.Validation
      validatedBy?: Ip.User.Email
      submittedBy?: Ip.User.Email
      lastValidatedTimestamp?: number
      updatedAt?: Date
    }

    export namespace Payload {
      export type Submit = {
        workspaceId: WorkspaceId
        formId: FormId
        attachments: any[]
        answers: object
        geolocation?: Geolocation
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
        user?: Ip.User
      }
    }
  }

  // === Form
  export type FormId = Form.Id
  export type Form = Prisma.Form & {
    id: FormId
    kobo?: Form.KoboInfo
    category?: string
    deploymentStatus?: string
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

    export const map = (_: Ip.Form): Ip.Form => {
      _.createdAt = new Date(_.createdAt)
      if (_.updatedAt) _.updatedAt = new Date(_.updatedAt)
      if (_.kobo?.deletedAt) _.kobo.deletedAt = new Date(_.kobo.deletedAt)
      return _ as any
    }

    export const isConnectedToKobo = <
      T extends {
        kobo?: Ip.Form.KoboInfo | null
      },
    >(
      _: T,
    ): _ is Defined<T & {type: 'kobo'; kobo: NonNullable<Ip.Form['kobo']>}> => !!_.kobo && !_.kobo.deletedAt

    export const isKobo = (_: {
      type: Ip.Form['type']
    }): _ is Ip.Form & {type: 'kobo'; kobo: NonNullable<Ip.Form['kobo']>} => _.type === 'kobo'

    export type Id = Brand<string, 'FormId'>

    export type Schema = Kobo.Form['content'] & {files?: Kobo.Form.File[]}

    export type Type = Prisma.FormType
    export const Type = {
      kobo: 'kobo',
      smart: 'smart',
      internal: 'internal',
    } as const

    export namespace Payload {
      export type Update = {
        workspaceId: WorkspaceId
        formId: FormId
        archive?: boolean
        category?: string
      }

      export type UpdateKoboConnexion = {
        workspaceId: WorkspaceId
        formId: FormId
        connected: boolean
      }

      export type Import = {
        serverId: ServerId
        uid: Kobo.FormId
      }

      export type Create = {
        workspaceId: WorkspaceId
        name: string
        category?: string
        type: Form.Type
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
        export type PathParams = {
          workspaceId: WorkspaceId
          formId: FormId
        }
        export type Create = PathParams & {
          level: Prisma.FormAccess['level']
          email?: Prisma.FormAccess['email']
          job?: Prisma.FormAccess['job'][]
          groupId?: GroupId
          filters?: Filters
        }
        export type Update = PathParams & {
          id: AccessId
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

    // === Version
    export type VersionId = Brand<string, 'versionId'>
    export type Version = Omit<Prisma.FormVersion, 'uploadedBy' | 'schema' | 'id'> & {
      uploadedBy: Ip.User.Email
      id: VersionId
    }
    export namespace Version {}

    export type ActionId = Brand<string, 'FormActionId'>

    export type Action = Omit<Prisma.FormAction, 'id' | 'targetFormId' | 'formId'> & {
      id: ActionId
      targetFormId: FormId
      formId: FormId
    }
    export namespace Action {
      export type Type = Prisma.FormActionType
      export const Type = {
        insert: 'insert',
        mutate: 'mutate',
      }

      export const map = (_: Record<keyof Action, any>): Action => {
        _.createdAt = new Date(_.createdAt)
        return _
      }

      export namespace Payload {
        export type Create = {
          workspaceId: WorkspaceId
          body?: string
          name: string
          description?: string
          formId: FormId
          targetFormId: FormId
          type: Action.Type
        }
        export type Update = {
          formId: FormId
          id: ActionId
          disabled?: boolean
          workspaceId: WorkspaceId
          body?: string
          bodyErrors?: number
          bodyWarnings?: number
          name?: string
          description?: string
        }
        export type Run = {
          workspaceId: WorkspaceId
          formId: FormId
        }
      }

      export type Report = Omit<Prisma.FormActionReport, 'startedBy'> & {
        startedBy: User.Email
      }

      export namespace Report {
        export const map = (_: Record<keyof Report, any>): Report => {
          _.startedAt = new Date(_.startedAt)
          _.endedAt = new Date(_.endedAt)
          return _
        }
      }

      export type LogId = Brand<string, 'FormActionLogId'>
      export type Log = Omit<Prisma.FormActionLog, 'details' | 'id' | 'submission'> & {
        id: LogId
        actionId: ActionId
        submission: Submission
        details?: string
      }
      export namespace Log {
        export const map = (_: Partial<Record<keyof Log, any>>): Log => {
          _.createdAt = new Date(_.createdAt)
          return _ as Log
        }
        export namespace Payload {
          export type Search = Pagination & {
            workspaceId: WorkspaceId
            formId?: FormId
            actionId?: Form.ActionId
          }
        }
      }
    }
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
      job?: string
      location?: string
    }

    export namespace Payload {
      export type Create = Pick<Group, 'workspaceId' | 'name' | 'desc'>

      export type Update = Pick<Group, 'id' | 'workspaceId' | 'name' | 'desc'>

      export type Search = {
        workspaceId: WorkspaceId
        name?: string
        user?: Ip.User
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

  export namespace Metrics {
    export type ByType = 'location' | 'user' | 'status' | 'category' | 'month' | 'form'
    export namespace Payload {
      export type Filter = {
        start?: Date
        end?: Date
        formIds: Ip.FormId[]
      }
    }

    export type CountUserByDate = {date: string; countCreatedAt: number; countLastConnectedCount: number}[]
    export type CountBy<K extends string> = Array<Record<K, string> & {count: number}>
    export type CountByKey = CountBy<'key'>
  }
}
