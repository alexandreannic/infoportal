import {seq} from '@axanc/ts-utils'
import {KoboSchemaRepeatHelper} from './koboSchemaRepeatHelper.js'
import {Ip} from '@infoportal/api-sdk'
import {KoboMetaHelper} from './koboMetaHelper.js'
import {removeHtml} from 'infoportal-common'

export type KoboTranslateQuestion = (key: string) => string
export type KoboTranslateChoice = (key: string, choice?: string) => string

export const ignoredColType: Set<Ip.Form.QuestionType> = new Set(['end_group', 'end_repeat', 'deviceid'])

export namespace KoboSchemaHelper {
  export interface Bundle<IncludeMeta extends boolean = false> {
    includeMeta?: IncludeMeta
    helper: Helper
    schema: Ip.Form.Schema
    schemaFlatAndSanitized: Ip.Form.Question[]
    schemaSanitized: Ip.Form.Schema
    translate: Translation
  }

  export const getLabel = (
    q?: {
      name: string
      label?: string[]
    },
    langIndex: number = 0,
  ): string => {
    if (!q) return ''
    return q.label !== undefined ? ((q.label as any)[langIndex] ?? q.name) : q.name
  }

  export type Translation = ReturnType<typeof buildTranslation>

  export type Helper = ReturnType<typeof buildHelper>

  const sanitizeQuestions = (questions: Ip.Form.Question[]): Ip.Form.Question[] => {
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

  const buildHelper = ({schema}: {schema: Ip.Form.Schema}) => {
    const groupHelper = new KoboSchemaRepeatHelper(schema.survey)
    const choicesIndex = seq(schema.choices).groupBy(_ => _.list_name)
    const questionIndex = seq([...schema.survey])
      .compactBy('name')
      .reduceObject<Record<string, undefined | Ip.Form.Question>>(_ => [_.name, _])

    const getOptionsByQuestionName = (qName: string) => {
      const listName = questionIndex[qName]?.select_from_list_name
      if (!listName) return
      return choicesIndex[listName]
    }

    return {
      group: groupHelper,
      choicesIndex,
      questionIndex,
      getOptionsByQuestionName,
    }
  }

  const buildTranslation = ({
    schema,
    langIndex,
    questionIndex,
  }: {
    schema: Ip.Form.Schema
    langIndex: number
    questionIndex: Helper['questionIndex']
  }): {
    langIndex: number
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
      langIndex,
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
      schemaFlatAndSanitized: sanitizeQuestions(helper.group.questionsDepth0),
      schemaSanitized: {
        ...schema,
        survey: sanitizeQuestions(schema.survey),
      },
      helper,
      translate,
    }
  }

  export const withMeta = (
    bundle: Bundle,
    labels: KoboMetaHelper.Labels,
    choices: KoboMetaHelper.ChoicesLabel,
  ): Bundle<true> => {
    const upgradedSchema: Ip.Form.Schema = {
      ...bundle.schema,
      survey: [...KoboMetaHelper.getMetaAsQuestion(labels), ...bundle.schema.survey],
      choices: [...KoboMetaHelper.getMetaAsChoices(choices), ...(bundle.schema.choices ?? [])],
    }
    return {
      ...buildBundle({schema: upgradedSchema, langIndex: bundle.translate.langIndex}),
      includeMeta: true,
    }
  }
}
