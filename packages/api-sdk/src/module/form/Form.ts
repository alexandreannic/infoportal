import type * as Prisma from '@infoportal/prisma'
import {Defined} from 'yup'
import {Brand, Pagination} from '../common/Common.js'
import {User} from '../user/User.js'
import {WorkspaceId} from '../workspace/Workspace.js'
import {Submission} from '../submission/Submission.js'
import {Api} from '../../Api.js'
import {Kobo} from '../kobo/Kobo'
import {Kobo as KoboSdk} from 'kobo-sdk'

export type FormId = Form.Id
export type Form = Prisma.Form & {
  id: FormId
  kobo?: Kobo.Form.Info
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

  export const map = (_: Form): Form => {
    _.createdAt = new Date(_.createdAt)
    if (_.updatedAt) _.updatedAt = new Date(_.updatedAt)
    if (_.kobo?.deletedAt) _.kobo.deletedAt = new Date(_.kobo.deletedAt)
    return _ as any
  }

  export const isConnectedToKobo = <
    T extends {
      kobo?: Kobo.Form.Info | null
    },
  >(
    _: T,
  ): _ is Defined<T & {type: 'kobo'; kobo: NonNullable<Form['kobo']>}> => !!_.kobo && !_.kobo.deletedAt

  export const isKobo = (_: {type: Form['type']}): _ is Form & {type: 'kobo'; kobo: NonNullable<Form['kobo']>} =>
    _.type === 'kobo'

  export type Id = Brand<string, 'FormId'>

  export type Schema = {
    choices?: Choice[]
    settings: Partial<{
      version: string
      default_language: string
    }>
    survey: Question[]
    translated: KoboSdk.Form.Translated[]
    translations: string[]
    files?: KoboSdk.Form.File[]
  }

  export type Choice = Omit<KoboSdk.Form.Choice, '$autovalue'>
  export type QuestionType = KoboSdk.Form.QuestionType
  export type Question = Omit<KoboSdk.Form.Question, 'calculation' | '$autoname' | '$qpath'> & {
    // Should be optional in kobo-sdk
    calculation?: string
  }

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
  export type SchemaXml = Brand<string, 'schema_xml'>
  export namespace Schema {
    export type Validation = {
      status: 'error' | 'warning' | 'success'
      code: number
      message: string
      warnings?: string[]
      schemaXml?: SchemaXml
    }
    export type ValidationWithSchema = Omit<Validation, 'schemaXml'> & {
      schemaJson: Schema
    }
  }

  export type VersionId = Brand<string, 'versionId'>
  export type Version = Omit<Prisma.FormVersion, 'uploadedBy' | 'schemaJson' | 'schemaXml' | 'id'> & {
    uploadedBy: User.Email
    id: VersionId
  }
  export namespace Version {
    export namespace Payload {
      export type CreateNewVersion = {
        workspaceId: Api.WorkspaceId
        formId: Api.Form.Id
        message?: string
        fileName?: string
        schemaJson: Api.Form.Schema
      }
    }
  }
}
