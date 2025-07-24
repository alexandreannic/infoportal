import {EventEmitter} from 'events'
import {IpEventParams} from './IpEvent.js'
import {Logger as WinstonLogger} from 'winston'

export enum IpEvent {
  KOBO_FORM_SYNCHRONIZED = 'KOBO_FORM_SYNCHRONIZED',
  KOBO_VALIDATION_EDITED_FROM_KOBO = 'KOBO_VALIDATION_EDITED_FROM_KOBO',
  KOBO_ANSWER_EDITED_FROM_KOBO = 'KOBO_ANSWER_EDITED_FROM_KOBO',
  KOBO_ANSWER_EDITED_FROM_IP = 'KOBO_ANSWER_EDITED_FROM_IP',
  KOBO_ANSWER_NEW = 'KOBO_ANSWER_NEW',
  KOBO_TAG_EDITED = 'KOBO_TAG_EDITED',
  NEW_SUBMISSION = 'NEW_SUBMISSION',
}

type IpEventParamMap = {
  [IpEvent.KOBO_ANSWER_EDITED_FROM_IP]: IpEventParams.KoboAnswerEdited
  [IpEvent.KOBO_ANSWER_EDITED_FROM_KOBO]: IpEventParams.KoboAnswerEdited
  [IpEvent.KOBO_VALIDATION_EDITED_FROM_KOBO]: IpEventParams.KoboValidationEdited
  [IpEvent.KOBO_ANSWER_NEW]: IpEventParams.KoboAnswerEdited
  [IpEvent.KOBO_TAG_EDITED]: IpEventParams.KoboTagEdited
  [IpEvent.KOBO_FORM_SYNCHRONIZED]: IpEventParams.KoboFormSync
  [IpEvent.NEW_SUBMISSION]: IpEventParams.NewSubmission
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
