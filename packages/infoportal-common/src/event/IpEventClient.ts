import {EventEmitter} from 'events'
import {IpEventParams} from './IpEvent.js'
import {Logger as WinstonLogger} from 'winston'

export enum IpEvent {
  KOBO_FORM_SYNCHRONIZED = 'KOBO_FORM_SYNCHRONIZED',
  // KOBO_VALIDATION_EDITED_FROM_KOBO = 'KOBO_VALIDATION_EDITED_FROM_KOBO',
  SUBMISSION_NEW = 'SUBMISSION_NEW',
  SUBMISSION_EDITED = 'SUBMISSION_EDITED',
  SUBMISSION_EDITED_VALIDATION = 'SUBMISSION_EDITED_VALIDATION',
  SUBMISSION_REMOVED = 'SUBMISSION_REMOVED',
}

type IpEventParamMap = {
  // [IpEvent.KOBO_VALIDATION_EDITED_FROM_KOBO]: IpEventParams.KoboValidationEdited
  [IpEvent.KOBO_FORM_SYNCHRONIZED]: IpEventParams.KoboFormSync
  [IpEvent.SUBMISSION_NEW]: IpEventParams.NewSubmission
  [IpEvent.SUBMISSION_EDITED]: IpEventParams.SubmissionEdited
  [IpEvent.SUBMISSION_EDITED_VALIDATION]: IpEventParams.SubmissionEditedValidation
  [IpEvent.SUBMISSION_REMOVED]: IpEventParams.SubmissionRemoved
}

type Emit = <T extends keyof IpEventParamMap>(event: T, params: IpEventParamMap[T]) => void
type Listen = <T extends keyof IpEventParamMap>(event: T, cb: (params: IpEventParamMap[T]) => void) => void

export class IpEventClient {
  constructor(
    private log: WinstonLogger,
    private emitter: EventEmitter = new EventEmitter(),
  ) {
    this.log.info(`Initialize GlobalEvent.`)
    this.listen = this.emitter.on.bind(this.emitter)
  }

  readonly emit: Emit = (event, params): void => {
    this.emitter.emit(event, params)
    this.log.debug(`Emitted ${event} ${JSON.stringify(params ?? {}).slice(0, 40)}...`)
  }

  readonly listen: Listen
}
