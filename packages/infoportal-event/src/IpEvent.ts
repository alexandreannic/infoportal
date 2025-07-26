import {Ip} from 'infoportal-api-sdk'

export namespace IpEventParams {
  export interface SubmissionEdited {
    formId: Ip.FormId
    submissionIds: Ip.SubmissionId[]
    answer: Record<string, any>
    index?: number
    total?: number
  }

  export interface KoboValidationEdited {
    formId: Ip.FormId
    answerIds: Ip.SubmissionId[]
    status?: Ip.Submission.Validation
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
