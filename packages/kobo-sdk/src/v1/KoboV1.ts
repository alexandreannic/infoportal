import {Kobo} from '../Kobo'

export interface SubmitResponse {
  message?: 'Successful submission.',
  formid?: Kobo.Submission.Id
  encrypted?: boolean,
  instanceID?: string,
  submissionDate?: string,
  markedAsCompleteDate?: string
  error?: 'Duplicate submission'
}

export interface KoboV1Form {
  uuid: string
  id_string: Kobo.Submission.Id
}