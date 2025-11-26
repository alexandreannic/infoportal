import {Seq, seq} from '@axanc/ts-utils'
import {KoboSchemaRepeatHelper} from './koboSchemaRepeatHelper.js'
import {Ip} from '@infoportal/api-sdk'
import {KoboMetaHelper} from './koboMetaHelper.js'
import {removeHtml} from 'infoportal-common'

export interface SchemaHelperLookup {
  group: KoboSchemaRepeatHelper
  choicesIndex: Record<string, Ip.Form.Choice[]>
  questionIndex: Record<string, Ip.Form.Question | undefined>
  getOptionsByQuestionName(qName: string): Seq<Ip.Form.Choice> | undefined
}

export interface SchemaHelperTranslate {
  langIndex: number
  question: (key: string) => string
  choice: (key: string, choice?: string) => string
}

export class SchemaInspector<IncludeMeta extends boolean = false> {
  static readonly ignoredColType = new Set<Ip.Form.QuestionType>(['end_group', 'end_repeat', 'deviceid'])

  static getLabel(q?: {name: string; label?: string[]} | undefined, langIndex: number = 0): string {
    if (!q) return ''
    return q.label !== undefined ? ((q.label as any)[langIndex] ?? q.name) : q.name
  }

  constructor(
    public readonly schema: Ip.Form.Schema,
    public readonly langIndex: number = 0,
    public readonly includeMeta: IncludeMeta = false as unknown as IncludeMeta,
  ) {}

  private _lookup?: SchemaHelperLookup
  private _translate?: SchemaHelperTranslate
  private _schemaFlatAndSanitized?: Ip.Form.Question[]
  private _schemaSanitized?: Ip.Form.Schema

  get lookup(): SchemaHelperLookup {
    if (!this._lookup) this._lookup = this.buildLookup(this.schema)
    return this._lookup
  }

  get translate(): SchemaHelperTranslate {
    if (!this._translate)
      this._translate = this.buildTranslation({
        schema: this.schema,
        langIndex: this.langIndex,
        questionIndex: this.lookup.questionIndex,
      })
    return this._translate
  }

  get schemaFlatAndSanitized(): Ip.Form.Question[] {
    if (!this._schemaFlatAndSanitized)
      this._schemaFlatAndSanitized = SchemaInspector.sanitizeQuestions(this.lookup.group.questionsDepth0)
    return this._schemaFlatAndSanitized
  }

  get schemaSanitized(): Ip.Form.Schema {
    if (!this._schemaSanitized) {
      this._schemaSanitized = {
        ...this.schema,
        survey: SchemaInspector.sanitizeQuestions(this.schema.survey),
      }
    }
    return this._schemaSanitized
  }

  /**
   * Return a new KoboSchemaHelper instance with meta questions/choices prepended.
   * Does not mutate the current instance.
   */
  withMeta(labels: KoboMetaHelper.Labels, choices: KoboMetaHelper.ChoicesLabel): SchemaInspector<true> {
    const upgradedSchema: Ip.Form.Schema = {
      ...this.schema,
      survey: [...KoboMetaHelper.getMetaAsQuestion(labels), ...this.schema.survey],
      choices: [...KoboMetaHelper.getMetaAsChoices(choices), ...(this.schema.choices ?? [])],
    }
    return new SchemaInspector<true>(upgradedSchema, this.langIndex, true)
  }

  /**
   * Return a new instance with the same schema but different langIndex
   */
  withLang(langIndex: number): SchemaInspector {
    return new SchemaInspector(this.schema, langIndex)
  }

  private static sanitizeQuestions(questions: Ip.Form.Question[]): Ip.Form.Question[] {
    return questions
      .filter(
        _ =>
          !SchemaInspector.ignoredColType.has(_.type) &&
          !((_.type === 'note' && !_.calculation) || (_.type === 'calculate' && !_.label)),
      )
      .map(_ => ({
        ..._,
        label: _.label?.map(l => removeHtml(l)),
      }))
  }

  private buildLookup(schema: Ip.Form.Schema): SchemaHelperLookup {
    const groupHelper = new KoboSchemaRepeatHelper(schema.survey)
    const choicesIndex = seq(schema.choices ?? []).groupBy(_ => _.list_name) as Record<string, Seq<Ip.Form.Choice>>
    const questionIndex = seq([...schema.survey])
      .compactBy('name')
      .reduceObject<Record<string, Ip.Form.Question | undefined>>(_ => [_.name, _])

    const getOptionsByQuestionName = (qName: string) => {
      const listName = questionIndex[qName]?.select_from_list_name
      if (!listName) return undefined
      return choicesIndex[listName]
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
    questionIndex: SchemaHelperLookup['questionIndex']
  }): SchemaHelperTranslate {
    const questionsTranslation: Record<string, string> = {}
    const choicesTranslation: Record<string, Record<string, string>> = {}

    seq(schema.survey)
      .compactBy('name')
      .forEach(q => {
        questionsTranslation[q.name] = q.label?.[langIndex] ?? q.name
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
        const listName = questionIndex[questionName]?.select_from_list_name
        return choicesTranslation[listName ?? '']?.[choiceName] ?? choiceName
      },
    }
  }
}
