import {Kobo} from 'kobo-sdk'
import {removeHtml} from '../../utils'
import {Ip} from 'infoportal-api-sdk'
import {KoboSchemaRepeatHelper} from './koboSchemaRepeatHelper'
import {seq} from '@axanc/ts-utils'

type KoboTranslateQuestion = (key: string) => string
type KoboTranslateChoice = (key: string, choice?: string) => string

type Translation = ReturnType<InstanceType<typeof KoboSchemaHelper2>['buildTranslation']>

type Helper = ReturnType<InstanceType<typeof KoboSchemaHelper2>['buildHelper']>

/** @deprecated alternative version but with the drawback to not be able to export types in the same namespace*/
class KoboSchemaHelper2<IncludeMeta extends boolean = false> {
  constructor(
    public schema: Ip.Form.Schema,
    public langIndex: number = 0,
  ) {}

  static readonly ignoredColType: Set<Kobo.Form.QuestionType> = new Set(['end_group', 'end_repeat', 'deviceid'])

  static readonly getLabel = (
    q: {
      name: string
      label?: string[]
    },
    langIndex?: number,
  ): string => {
    return q.label !== undefined ? ((q.label as any)[langIndex as any] ?? q.name) : q.name
  }

  public includeMeta: IncludeMeta = false as IncludeMeta

  public helper = this.buildHelper({schema: this.schema})

  public translate = this.buildTranslation({
    schema: this.schema,
    langIndex: this.langIndex,
    questionIndex: this.helper.questionIndex,
  })

  public schemaFlatAndSanitized = this.sanitizeQuestions(this.helper.group.questionsDepth0)

  public schemaSanitized = {
    ...this.schema,
    survey: this.sanitizeQuestions(this.schema.survey),
  }

  private sanitizeQuestions(questions: Kobo.Form.Question[]): Kobo.Form.Question[] {
    return questions
      .filter(
        _ =>
          !KoboSchemaHelper2.ignoredColType.has(_.type) &&
          !((_.type === 'note' && !_.calculation) || (_.type === 'calculate' && !_.label)),
      )
      .map(_ => ({
        ..._,
        label: _.label?.map(_ => removeHtml(_)),
      }))
  }

  private buildHelper({schema}: {schema: Ip.Form.Schema}) {
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

  private buildTranslation({
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
  } {
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

  upgradeWithMeta() {
    // const upgradedSchema = {
    //   ...this.schema,
    //   survey: {
    //     ...KoboMetaHelper.metaKeys.map(_ => {}),
    //     ...this.schema.survey,
    //   },
    // }
  }
}
