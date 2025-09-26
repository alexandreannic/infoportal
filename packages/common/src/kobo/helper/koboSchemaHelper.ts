import {Obj, seq} from '@axanc/ts-utils'
import {KoboSchemaRepeatHelper} from './koboSchemaRepeatHelper.js'
import {Kobo} from 'kobo-sdk'
import {Ip} from 'infoportal-api-sdk'
import {KoboMetaHelper} from './koboMetaHelper.js'
import {removeHtml} from '../../utils/Common.js'

export type KoboTranslateQuestion = (key: string) => string
export type KoboTranslateChoice = (key: string, choice?: string) => string

export const ignoredColType: Set<Kobo.Form.QuestionType> = new Set(['end_group', 'end_repeat', 'deviceid'])

export namespace KoboSchemaHelper {
  export interface Bundle<IncludeMeta extends boolean = false> {
    includeMeta?: IncludeMeta
    helper: Helper
    schema: Ip.Form.Schema
    schemaFlatAndSanitized: Kobo.Form.Question[]
    schemaSanitized: Ip.Form.Schema
    translate: Translation
  }

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

  const buildHelper = ({schema}: {schema: Ip.Form.Schema}) => {
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
      schemaFlatAndSanitized: sanitizeQuestions(helper.group.questionsFlat),
      schemaSanitized: {
        ...schema,
        survey: sanitizeQuestions(schema.survey),
      },
      helper,
      translate,
    }
  }


  export const upgradeIncludingMeta = (bundle: Bundle, labels: MetaLabels): Bundle<true> => {
    const upgradedSchema: Ip.Form.Schema = {
      ...bundle.schema,
      survey: [
        ...KoboMetaHelper.metaKeys.map(_ => {
          const type = KoboMetaHelper.metaType[_]
          const q: Kobo.Form.Question = {
            type,
            name: _,
            label: [labels[_] ?? _],
            select_from_list_name: type === 'select_one' || type === 'select_multiple' ? _ : undefined,
            $xpath: _,
            $qpath: _,
            $kuid: _,
            $autoname: _,
            // TODO Fix kobo-sdk where calculation is required
            calculation: undefined as any,
          }
          return q
        }),
        ...bundle.schema.survey,
      ],
      choices: [
        ...(bundle.schema.choices ?? []),
        ...Obj.keys(labels.choices).flatMap(list_name => {
          return Obj.keys(labels.choices[list_name]).map(_ => {
            const c: Kobo.Form.Choice = {
              list_name,
              name: _,
              $autovalue: _,
              $kuid: _,
              label: [labels.choices[list_name][_]],
            }
            return c
          })
        }),
      ],
    }
    return {
      ...buildBundle({schema: upgradedSchema, langIndex: bundle.translate.langIndex}),
      includeMeta: true,
    }
  }
}
