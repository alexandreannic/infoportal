import {Obj} from '@axanc/ts-utils'
import {ignoredColType} from './koboSchemaHelper.js'
import {Kobo} from 'kobo-sdk'

export type KoboGroupInfo = {
  name: string
  path: string
  pathArr: string[]
  depth: number
  questions: Kobo.Form.Question[]
}

export class KoboSchemaRepeatHelper {
  static readonly $xpathSeparator = '/'
  readonly schemaIndex: Record<string, Kobo.Form.Question[]> = {}
  /** Questions except `begin_repeat` */
  readonly questionsFlat: Kobo.Form.Question[] = []
  private readonly infosIndex: Record<string, KoboGroupInfo>
  readonly size: number

  private readonly getInfo = (path: string): KoboGroupInfo => {
    const items = path.split(KoboSchemaRepeatHelper.$xpathSeparator)
    return {
      name: items[items.length - 1],
      path,
      pathArr: items,
      depth: items.length,
      questions: this.schemaIndex[path],
    }
  }

  constructor(survey: Kobo.Form['content']['survey']) {
    let depth: string[] = []
    survey.forEach((q) => {
      if (q.type === 'end_repeat') depth.pop()
      if (!ignoredColType.has(q.type)) {
        if (depth.length === 0) this.questionsFlat.push(q)
        else {
          const repeatPathWithoutSection = depth.join('/')
          if (this.schemaIndex[repeatPathWithoutSection] === undefined) this.schemaIndex[repeatPathWithoutSection] = []
          this.schemaIndex[repeatPathWithoutSection].push(q)
        }
      }
      if (q.type === 'begin_repeat') depth.push(q.name)
    })
    const keys = Object.keys(this.schemaIndex)
    this.size = keys.length
    this.infosIndex = Obj.mapValues(this.schemaIndex, (v, k) => this.getInfo(k))
  }

  readonly getByPath = (path: string): KoboGroupInfo | undefined => {
    return this.infosIndex[path]
  }

  readonly getByName = (name: string): KoboGroupInfo | undefined => {
    return Obj.values(this.infosIndex).find((_) => _.pathArr.includes(name))
  }

  readonly search = ({
    exactName,
    depth,
  }: {
    // exactPath?: string,
    exactName?: string
    depth?: number
  } = {}): KoboGroupInfo[] => {
    return Obj.values(this.infosIndex).filter((info) => {
      if (depth && depth !== info.depth) return false
      if (exactName && !info.pathArr.includes(exactName)) return false
      return info
    })
  }
}
