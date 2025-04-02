import {Kobo} from 'kobo-sdk'

/**
 * Track question name from Kobo submissions and trigger specific actions accordingly
 */
export namespace KoboCustomDirective {
  export enum Name {
    TRIGGER_EMAIL = 'TRIGGER_EMAIL',

    /** Kobo has only 3 validation status, this property is used to handle additional statuses*/
    _IP_VALIDATION_STATUS_EXTRA = '_IP_VALIDATION_STATUS_EXTRA',
  }

  export const PREFIX = '__IP__'

  export const make = (_: keyof typeof Name) => PREFIX + _

  type Directive = {directive: Name; question: Kobo.Form.Question}

  export const getAllInSchemas = (schema: Kobo.Form): Directive[] => {
    const collected: Directive[] = []
    for (let i = 0; i < schema.content.survey.length; i++) {
      if (['start', 'end'].includes(schema.content.survey[i].name!)) i++
      else {
        const directive = getFromQuestionIfExist(schema.content.survey[i])
        if (directive) collected.push(directive)
        else break
      }
    }
    return collected
  }

  export const getFromQuestionIfExist = (question: Kobo.Form.Question): Directive | undefined => {
    if (!question.name) return
    const directive = question.name.match(new RegExp(`^${PREFIX}([A-Z_]+)$`))?.[1]
    if (directive) return {directive: (Name as any)[directive!], question}
  }
}
