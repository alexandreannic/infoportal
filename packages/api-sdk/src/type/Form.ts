import type * as Prisma from '@prisma/client'
import {Kobo} from 'kobo-sdk'
import {Defined} from 'yup'
import {Brand, Pagination} from './Common.js'
import {User} from './User.js'
import {ServerId} from './KoboAccount.js'
import {WorkspaceId} from './Workspace.js'
import {Submission} from './Submission.js'

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

  export const map = (_: Form): Form => {
    _.createdAt = new Date(_.createdAt)
    if (_.updatedAt) _.updatedAt = new Date(_.updatedAt)
    if (_.kobo?.deletedAt) _.kobo.deletedAt = new Date(_.kobo.deletedAt)
    return _ as any
  }

  export const isConnectedToKobo = <
    T extends {
      kobo?: Form.KoboInfo | null
    },
  >(
    _: T,
  ): _ is Defined<T & {type: 'kobo'; kobo: NonNullable<Form['kobo']>}> => !!_.kobo && !_.kobo.deletedAt

  export const isKobo = (_: {type: Form['type']}): _ is Form & {type: 'kobo'; kobo: NonNullable<Form['kobo']>} =>
    _.type === 'kobo'

  export type Id = Brand<string, 'FormId'>

  export type Schema = {
    choices?: Choice[];
    settings: Partial<{
      version: string;
      default_language: string;
    }>;
    survey: Question[];
    translated: Kobo.Form.Translated[];
    translations: string[];
    files?: Kobo.Form.File[]
  }

  export type Choice = Omit<Kobo.Form.Choice, '$autovalue' | '$kuid'>
  export type QuestionType = Kobo.Form.QuestionType
  export type Question = Omit<Kobo.Form.Question,
    '$autoname' |
    '$kuid' |
    '$qpath'
  >

  export type Type = Prisma.FormType
  export const Type = {
    internal: 'internal',
    kobo: 'kobo',
    smart: 'smart',
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
  export type Version = Omit<Prisma.FormVersion, 'uploadedBy' | 'schema' | 'id'> & {
    uploadedBy: User.Email
    id: VersionId
  }
  export namespace Version {
  }
}
