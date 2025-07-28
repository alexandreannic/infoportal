import {Ip} from 'infoportal-api-sdk'

export namespace IpEventParams {
  export interface SubmissionEdited {
    formId: Ip.FormId
    submissionIds: Ip.SubmissionId[]
    question: string
    answer?: any
    // answer: Record<string, any>
    index?: number
    total?: number
  }

  export interface SubmissionRemoved {
    formId: Ip.FormId
    submissionIds: Ip.SubmissionId[]
  }

  export interface SubmissionEditedValidation {
    formId: Ip.FormId
    submissionIds: Ip.SubmissionId[]
    status: Ip.Submission.Validation
    index?: number
    total?: number
  }

  export interface KoboFormSync {
    // extends KoboSyncServerResult
    index?: number
    total?: number
    formId: Ip.FormId
  }

  export interface NewSubmission {
    formId: Ip.FormId
    workspaceId: Ip.WorkspaceId
    submission: Ip.Submission
  }
}
