import {genShortid} from 'infoportal-common'
import {Ip} from '@infoportal/api-sdk'

export class SchemaParser {
  constructor() {}

  private static readonly generateXpath = (questions: Ip.Form.Question[]): Ip.Form.Question[] => {
    const path: string[] = []
    return questions.map(_ => {
      const q = {..._}
      if (!q.$kuid) q.$kuid = this.gen$kuid()
      if (q.type === 'end_group' || q.type === 'end_repeat') {
        path.pop()
        return q
      }
      q.$xpath = [...path, q.name].join('/')
      if (q.type === 'begin_group' || q.type === 'begin_repeat') {
        path.push(q.name)
      }
      return q
    })
  }

  static readonly gen$kuid = () => genShortid(10)

  static readonly parse = (incompleteSchema: Ip.Form.Schema): Ip.Form.Schema => {
    return {
      ...incompleteSchema,
      survey: this.generateXpath(incompleteSchema.survey),
      choices: incompleteSchema.choices?.map(_ => {
        if (!_.$kuid) {
          _.$kuid = this.gen$kuid()
        }
        return _
      }),
    }
  }
}
