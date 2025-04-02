import {EventEmitter} from 'events'
import {app} from '../index.js'
import {Kobo} from 'kobo-sdk'
import {KoboValidation} from 'infoportal-common'

export namespace GlobalEvent {
  export interface KoboTagEditedParams {
    formId: Kobo.FormId
    answerIds: Kobo.SubmissionId[]
    tags: Record<string, any>
    index?: number
    total?: number
  }

  export interface KoboAnswerEditedParams {
    formId: Kobo.FormId
    answerIds: Kobo.SubmissionId[]
    answer: Record<string, any>
    index?: number
    total?: number
  }

  export interface KoboValidationEditedParams {
    formId: Kobo.FormId
    answerIds: Kobo.SubmissionId[]
    status?: KoboValidation
    index?: number
    total?: number
  }

  interface KoboFormSyncParams {
    // extends KoboSyncServerResult
    index?: number
    total?: number
    formId: Kobo.FormId
  }

  export enum Event {
    KOBO_FORM_SYNCHRONIZED = 'KOBO_FORM_SYNCHRONIZED',
    KOBO_VALIDATION_EDITED_FROM_KOBO = 'KOBO_VALIDATION_EDITED_FROM_KOBO',
    KOBO_ANSWER_EDITED_FROM_KOBO = 'KOBO_ANSWER_EDITED_FROM_KOBO',
    KOBO_ANSWER_EDITED_FROM_IP = 'KOBO_ANSWER_EDITED_FROM_IP',
    KOBO_ANSWER_NEW = 'KOBO_ANSWER_NEW',
    KOBO_TAG_EDITED = 'KOBO_TAG_EDITED',
    WFP_DEDUPLICATION_SYNCHRONIZED = 'WFP_DEDUPLICATION_SYNCHRONIZED',
  }

  type Emit = {
    (event: Event.KOBO_ANSWER_EDITED_FROM_IP, params: KoboAnswerEditedParams): void
    (event: Event.KOBO_ANSWER_EDITED_FROM_KOBO, params: KoboAnswerEditedParams): void
    (event: Event.KOBO_VALIDATION_EDITED_FROM_KOBO, params: KoboValidationEditedParams): void
    (event: Event.KOBO_ANSWER_NEW, params: KoboAnswerEditedParams): void
    (event: Event.KOBO_TAG_EDITED, params: KoboTagEditedParams): void
    (event: Event.KOBO_FORM_SYNCHRONIZED, params: KoboFormSyncParams): void
    (event: Event.WFP_DEDUPLICATION_SYNCHRONIZED, params: void): void
  }

  type Listen = {
    (event: Event.KOBO_ANSWER_EDITED_FROM_IP, cb: (params: KoboAnswerEditedParams) => void): void
    (event: Event.KOBO_ANSWER_EDITED_FROM_KOBO, cb: (params: KoboAnswerEditedParams) => void): void
    (event: Event.KOBO_VALIDATION_EDITED_FROM_KOBO, cb: (params: KoboValidationEditedParams) => void): void
    (event: Event.KOBO_ANSWER_NEW, cb: (params: KoboAnswerEditedParams) => void): void
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
      private log = app.logger('GlobalEvent'),
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
}
