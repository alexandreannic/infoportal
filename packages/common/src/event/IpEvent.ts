import {Api} from '@infoportal/api-sdk'

export namespace IpEventParams {
  export interface SubmissionEdited {
    formId: Api.FormId
    submissionIds: Api.SubmissionId[]
    question: string
    answer?: any
    // answer: Record<string, any>
    index?: number
    total?: number
  }

  export interface SubmissionRemoved {
    formId: Api.FormId
    submissionIds: Api.SubmissionId[]
  }

  export interface SubmissionEditedValidation {
    formId: Api.FormId
    submissionIds: Api.SubmissionId[]
    status: Api.Submission.Validation
    index?: number
    total?: number
  }

  export interface KoboFormSync {
    // extends KoboSyncServerResult
    index?: number
    total?: number
    formId: Api.FormId
  }

  export interface NewSubmission {
    formId: Api.FormId
    workspaceId: Api.WorkspaceId
    submission: Api.Submission
  }
}
