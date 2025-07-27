import {IpEvent} from '../event/IpEventClient.js'
import {IpEventParams} from '../event/IpEvent.js'
import {Ip} from 'infoportal-api-sdk'

export interface ServerToClientEvents {
  [IpEvent.SUBMISSION_NEW]: (data: IpEventParams.NewSubmission) => void
  [IpEvent.SUBMISSION_EDITED]: (data: IpEventParams.SubmissionEdited) => void
}

export interface ClientToServerEvents {
  subscribe: (formId: Ip.FormId) => void
  unsubscribe: (formId: Ip.FormId) => void
}
