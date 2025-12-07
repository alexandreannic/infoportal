import {XMLParser} from 'fast-xml-parser'
import {Api} from '@infoportal/api-sdk'

type QIndex = Record<string, Pick<Api.Form.Question, 'type'> | undefined>

export class SubmissionXmlToJson {
  constructor(private questionIndex: QIndex) {}

  readonly convert = (xmlStr: string): Record<string, any> => {
    const parser = new XMLParser({
      ignoreAttributes: true,
      attributeNamePrefix: '',
      preserveOrder: false,
      removeNSPrefix: true,
      trimValues: true,
    })
    const raw = parser.parse(xmlStr)
    const rootKey = Object.keys(raw)[0]
    const rootNode = raw[rootKey]

    return this.convertNode(rootNode)
  }

  private readonly convertNode = (node: any): any => {
    const result: any = {}

    for (const key of Object.keys(node)) {
      const value = node[key]
      const q = this.questionIndex[key]
      const qType = q?.type ?? 'unknown'

      // begin_repeat  → always array
      if (qType === 'begin_repeat') {
        if (!Array.isArray(value)) {
          // Parser may return a single object, wrap it
          result[key] = [this.convertNode(value)]
        } else {
          result[key] = value.map(v => this.convertNode(v))
        }
        continue
      }

      // begin_group → flatten children
      if (qType === 'begin_group') {
        const groupData = this.convertNode(value)
        Object.assign(result, groupData)
        continue
      }

      // Leaf or normal nested object

      // Nested object (not a primitive)
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = this.convertNode(value)
        continue
      }

      // Primitive / text
      result[key] = value
    }

    return result
  }
}
