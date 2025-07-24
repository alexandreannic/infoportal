import {Ip} from 'infoportal-api-sdk'

export namespace IpEventParams {
  export interface KoboTagEdited {
    formId: Ip.FormId
    answerIds: Ip.SubmissionId[]
    tags: Record<string, any>
    index?: number
    total?: number
  }

  export interface KoboAnswerEdited {
    formId: Ip.FormId
    answerIds: Ip.SubmissionId[]
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
    submission: Ip.Submission
  }
}
