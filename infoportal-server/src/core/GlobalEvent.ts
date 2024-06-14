import {KoboAnswerId, KoboId} from '@infoportal-common'
import {EventEmitter} from 'events'
import {app} from '../index'

export namespace GlobalEvent {

  interface KoboTagEditedParams {
    formId: KoboId,
    answerIds: KoboAnswerId[],
    tags: Record<string, any>,
    index?: number
    total?: number
  }

  interface KoboAnswerEditedParams {
    formId: KoboId,
    answerIds: KoboAnswerId[],
    answer: Record<string, any>,
    index?: number
    total?: number
  }

  interface KoboFormSyncParams
    // extends KoboSyncServerResult
  {
    index?: number
    total?: number
    formId: KoboId
  }

  export enum Event {
    KOBO_FORM_SYNCHRONIZED = 'KOBO_FORM_SYNCHRONIZED',
    KOBO_ANSWER_EDITED = 'KOBO_ANSWER_EDITED',
    KOBO_TAG_EDITED = 'KOBO_TAG_EDITED',
    WFP_DEDUPLICATION_SYNCHRONIZED = 'WFP_DEDUPLICATION_SYNCHRONIZED',
  }

  type Emit = {
    (event: Event.KOBO_ANSWER_EDITED, params: KoboAnswerEditedParams): void
    (event: Event.KOBO_TAG_EDITED, params: KoboTagEditedParams): void
    (event: Event.KOBO_FORM_SYNCHRONIZED, params: KoboFormSyncParams): void
    (event: Event.WFP_DEDUPLICATION_SYNCHRONIZED, params: void): void
  }

  type Listen = {
    (event: Event.KOBO_ANSWER_EDITED, cb: (params: KoboAnswerEditedParams) => void): void
    (event: Event.KOBO_TAG_EDITED, cb: (params: KoboTagEditedParams) => void): void
    (event: Event.KOBO_FORM_SYNCHRONIZED, cb: (params: KoboFormSyncParams) => void): void
    (event: Event.WFP_DEDUPLICATION_SYNCHRONIZED, cb: () => void): void
  }


  export class Class {

    private static instance: Class
    static readonly getInstance = () => {
      if (!Class.instance) Class.instance = new Class()
      return Class.instance
    }

    private constructor(
      private emitter: EventEmitter = new EventEmitter(),
      private log = app.logger('GlobalEvent')
    ) {
      this.log.info(`Initialize GlobalEvent.`)
      this.listen = this.emitter.on.bind(this.emitter)
    }

    readonly emit: Emit = (event, params): void => {
      this.emitter.emit(event, params)
      this.log.info(`Emitted ${event} ` + JSON.stringify(params))
    }

    readonly listen: Listen
  }
}