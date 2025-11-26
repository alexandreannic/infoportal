import {Obj, seq} from '@axanc/ts-utils'
import {Ip} from '@infoportal/api-sdk'
import {removeHtml} from '@infoportal/common'
import {SchemaInspector} from './SchemaInspector.js'

export class SchemaTsInterfaceBuilder {
  constructor(
    private name: string,
    private schema: Ip.Form.Schema,
    private langIndex: number = 0,
    private skipChoicesOverLimit = 100,
    schemaInspector?: SchemaInspector,
  ) {
    this.schemaInspector = schemaInspector ?? new SchemaInspector(this.schema, this.langIndex)
  }

  private readonly schemaInspector: SchemaInspector

  private readonly ignoredQuestionTypes: Set<Ip.Form.QuestionType> = new Set([
    'start',
    'end',
    'begin_group',
    'end_group',
    'end_repeat',
    // 'calculate',
    // 'note',
  ])

  private generateChoices = () => {
    const byList = seq(this.schema.choices).groupBy(_ => _.list_name)
    const body = Obj.entries(byList).map(([listName, choices]) => {
      return `${listName}: [${choices.map(_ => `'${_.name}'`).join(',')}]`
    })
    return [
      `export type Choice<List extends keyof typeof choices> = (typeof choices)[List][number]`,
      `const choices = { ${body.join(',\n')} } as const`,
    ].join('\n\n')
  }

  private buildType = ({question}: {question: Ip.Form.Question}) => {
    switch (question.type) {
      case 'select_multiple':
      case 'select_one': {
        if (!question.select_from_list_name) return 'string'
        const choicesCount = this.schemaInspector.lookup.choicesIndex[question.select_from_list_name].length
        if (choicesCount > this.skipChoicesOverLimit) return `string`
        return `Choice<'${question.select_from_list_name}'>` + (question.type === 'select_multiple' ? '[]' : '')
      }
      case 'integer':
      case 'decimal': {
        return 'number'
      }
      case 'date':
      case 'datetime': {
        return 'Date'
      }
      // case 'begin_repeat': {
      //   return (
      //     this.generateInterface(this.schemaInspector.lookup.group.getByName(question.name)?.questions ?? []) + `[]`
      //   )
      // }
      default: {
        return 'string'
      }
    }
  }

  private sanitizeLabel = (label: string, maxLength = 100) => {
    return removeHtml(label)
      .replaceAll(/\r?\n|\r/g, ' ')
      .slice(0, maxLength)
  }

  private generateInterface = (questions: Ip.Form.Question[]): string => {
    const body = questions
      .filter(_ => !this.ignoredQuestionTypes.has(_.type))
      .map(question => {
        const type = this.buildType({question})
        return [
          `// [${question.type}] ${this.sanitizeLabel(this.schemaInspector.translate.question(question.name))} (${question.$xpath})`,
          `'${question.name}': ${type};`,
        ].join('\n')
      })
    return `{\n ${body.join('\n')} }`
  }

  readonly build = () => {
    const mainInterface = `export type Type = ${this.generateInterface(this.schema.survey)}`
    const choices = this.generateChoices()
    return `export namespace ${this.name} { ${mainInterface}\n\n${choices} }`
  }
}
