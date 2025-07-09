import {seq} from '@axanc/ts-utils'
import {removeHtml} from './../../index.js'
import {KoboSchemaRepeatHelper} from './koboSchemaRepeatHelper.js'
import {Kobo} from 'kobo-sdk'
import {Ip} from 'infoportal-api-sdk'

export type KoboTranslateQuestion = (key: string) => string
export type KoboTranslateChoice = (key: string, choice?: string) => string

export const ignoredColType: Set<Kobo.Form.QuestionType> = new Set(['end_group', 'end_repeat', 'deviceid'])

export namespace KoboSchemaHelper {
  export const getLabel = (
    q: {
      name: string
      label?: string[]
    },
    langIndex?: number,
  ): string => {
    return q.label !== undefined ? ((q.label as any)[langIndex as any] ?? q.name) : q.name
  }

  export type Translation = ReturnType<typeof buildTranslation>

  export type Helper = ReturnType<typeof buildHelper>

  export interface Bundle {
    helper: Helper
    schema: Ip.Form.Schema
    schemaFlatAndSanitized: Kobo.Form.Question[]
    schemaSanitized: Ip.Form.Schema
    translate: Translation
  }

  const sanitizeQuestions = (questions: Kobo.Form.Question[]): Kobo.Form.Question[] => {
    return questions
      .filter(
        _ =>
          !ignoredColType.has(_.type) &&
          !((_.type === 'note' && !_.calculation) || (_.type === 'calculate' && !_.label)),
      )
      .map(_ => ({
        ..._,
        label: _.label?.map(_ => removeHtml(_)),
      }))
  }

  export const buildHelper = ({schema}: {schema: Ip.Form.Schema}) => {
    const groupHelper = new KoboSchemaRepeatHelper(schema.survey)
    const choicesIndex = seq(schema.choices).groupBy(_ => _.list_name)
    const questionIndex = seq([...schema.survey])
      .compactBy('name')
      .reduceObject<Record<string, Kobo.Form.Question>>(_ => [_.name, _])

    const getOptionsByQuestionName = (qName: string) => {
      const listName = questionIndex[qName].select_from_list_name
      return choicesIndex[listName!]
    }

    return {
      group: groupHelper,
      choicesIndex,
      questionIndex,
      getOptionsByQuestionName,
    }
  }

  export const buildTranslation = ({
    schema,
    langIndex,
    questionIndex,
  }: {
    schema: Ip.Form.Schema
    langIndex: number
    questionIndex: Helper['questionIndex']
  }): {
    question: KoboTranslateQuestion
    choice: KoboTranslateChoice
  } => {
    const questionsTranslation: Record<string, string> = {}
    const choicesTranslation: Record<string, Record<string, string>> = {}
    seq(schema.survey)
      .compactBy('name')
      .forEach(_ => {
        questionsTranslation[_.name] = _.label?.[langIndex] ?? _.name
      })
    ;(schema.choices ?? []).forEach(choice => {
      if (!choicesTranslation[choice.list_name]) choicesTranslation[choice.list_name] = {}
      choicesTranslation[choice.list_name][choice.name] = choice.label?.[langIndex] ?? choice.name
    })
    return {
      question: (questionName: string) => {
        return questionsTranslation[questionName]
      },
      choice: (questionName: string, choiceName?: string) => {
        if (!choiceName) return ''
        return choicesTranslation[questionIndex[questionName]?.select_from_list_name!]?.[choiceName] ?? choiceName
      },
    }
  }

  export const buildBundle = ({schema, langIndex = 0}: {schema: Ip.Form.Schema; langIndex?: number}): Bundle => {
    const helper = buildHelper({schema: schema})
    const translate = buildTranslation({
      schema: schema,
      langIndex,
      questionIndex: helper.questionIndex,
    })
    return {
      schema: schema,
      schemaFlatAndSanitized: sanitizeQuestions(helper.group.questionsFlat),
      schemaSanitized: {
        ...schema,
        survey: sanitizeQuestions(schema.survey),
      },
      helper,
      translate,
    }
  }
}
