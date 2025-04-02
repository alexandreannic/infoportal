import {Kobo} from 'kobo-sdk'
import {KoboSubmissionMetaData, KoboValidation} from 'infoportal-common'

export type KoboMetaOrigin<
  TAnswer extends Record<string, any> = any,
  TTag extends undefined | Record<string, any> = undefined,
> = {
  formId: Kobo.FormId
  uuid: string
  attachments: Kobo.Submission.Attachment[]
  answers: TAnswer
  date: Date
  submissionTime: Date
  id: Kobo.SubmissionId
  validationStatus: KoboValidation
  /** Timestamp in second. new Date(_.lastValidatedTimestamp) to convert as Date.*/
  lastValidatedTimestamp?: number
  updatedAt?: KoboSubmissionMetaData['updatedAt']
  tags?: TTag | null
}
