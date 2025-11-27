import type * as Prisma from '@prisma/client'
import {Kobo} from 'kobo-sdk'
import {KeyOf} from '@axanc/ts-utils'
import {User} from '../user/User.js'
import {Brand, Geolocation, Pagination, Period, StateStatus, Uuid} from '../common/Common.js'
import {FormId} from '../form/Form.js'
import {WorkspaceId} from '../workspace/Workspace.js'
import {z} from 'zod'
import {SubmissionHistoryValidation} from './history/SubmissionHistoryValidation.js'
import {Api} from '../../Api.js'

export type Submission<T extends Record<string, any> = Record<string, any>> = Submission.Meta & {answers: T}
export type SubmissionId = Brand<string, 'submissionId'>
export namespace Submission {
  export const map = (_: Submission): Submission => {
    if (_.start) _.start = new Date(_.start)
    if (_.end) _.end = new Date(_.end)
    _.submissionTime = new Date(_.submissionTime)
    return _
  }

  export type Attachment = Kobo.Submission.Attachment
  export type Validation = Prisma.FormSubmissionValidation
  export const Validation = {
    Approved: 'Approved',
    Pending: 'Pending',
    Rejected: 'Rejected',
    Flagged: 'Flagged',
    UnderReview: 'UnderReview',
  } as const

  export const validationToStatus: Record<Submission.Validation, StateStatus> = {
    Approved: StateStatus.success,
    Pending: StateStatus.warning,
    Rejected: StateStatus.error,
    Flagged: StateStatus.info,
    UnderReview: StateStatus.warning,
  }

  export type Meta = {
    start: Date
    /** Refresh whenever submission is updated */
    end: Date
    originId?: string
    /** Set by Kobo Server, not editable */
    submissionTime: Date
    version?: string
    attachments: Kobo.Submission.Attachment[]
    geolocation?: Geolocation
    isoCode?: string
    id: SubmissionId
    uuid: Uuid
    /** From Kobo, used to Sync */
    validationStatus?: Submission.Validation
    validatedBy?: User.Email
    submittedBy?: User.Email
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
      user?: User
    }
  }

  export interface History {
    id: string
    answerIds: string[]
    by: Api.User.Email
    date: Date
    type: 'answer' | 'delete'
    property?: string
    oldValue?: any
    newValue?: any
  }

  export namespace History {
    export namespace Payload {
      export type Search = z.infer<typeof SubmissionHistoryValidation.search>
    }
    export const map = (_: any): History => {
      console.log('MAP', _)
      _.date = new Date(_.date)
      return _
    }
  }
}
