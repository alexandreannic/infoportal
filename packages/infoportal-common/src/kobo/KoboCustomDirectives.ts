import {Kobo} from 'kobo-sdk'

/**
 * Track question name from Kobo submissions and trigger specific actions accordingly
 */
export enum KoboCustomDirectives {
  TRIGGER_EMAIL = 'TRIGGER_EMAIL',

  /** Kobo has only 3 validation status, this property is used to handle additional statuses*/
  _IP_VALIDATION_STATUS_EXTRA = '_IP_VALIDATION_STATUS_EXTRA',
}

export const koboCustomDirectivePrefix = '__IP__'

export const makeKoboCustomDirective = (_: keyof typeof KoboCustomDirectives) => koboCustomDirectivePrefix + _

type Directive = {directive: KoboCustomDirectives, question: Kobo.Form.Question}

export const getKoboCustomDirectives = (schema: Kobo.Form): Directive[] => {
  const collected: Directive[] = []
  for (let i = 0; i < schema.content.survey.length; i++) {
    if (['start', 'end'].includes(schema.content.survey[i].name!)) i++
    else {
      const directive = getKoboCustomDirective(schema.content.survey[i])
      if (directive) collected.push(directive)
      else break
    }
  }
  return collected
}

export const getKoboCustomDirective = (question: Kobo.Form.Question): Directive | undefined => {
  if (!question.name) return
  const directive = question.name.match(new RegExp(`^${koboCustomDirectivePrefix}([A-Z_]+)$`))?.[1]
  if (directive) return {directive: (KoboCustomDirectives as any)[directive!], question}
}