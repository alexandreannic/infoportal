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

  /** Questions not inside any repeat */
  readonly questionsDepth0: Kobo.Form.Question[] = []
  readonly size: number

  private readonly questionsByGroupPath: Record<string, Kobo.Form.Question[]> = {}
  private readonly groupByPath: Record<string, KoboGroupInfo | undefined> = {}
  private readonly groupByName: Record<string, KoboGroupInfo | undefined> = {}
  private readonly groupByQuestionName: Record<string, KoboGroupInfo | undefined> = {}

  constructor(survey: Kobo.Form['content']['survey']) {
    const depthStack: string[] = []

    for (const q of survey) {
      if (q.type === 'end_repeat') {
        depthStack.pop()
        continue
      }

      if (!ignoredColType.has(q.type)) {
        if (depthStack.length === 0) {
          this.questionsDepth0.push(q)
        } else {
          const path = depthStack.join(KoboSchemaRepeatHelper.$xpathSeparator)
          ;(this.questionsByGroupPath[path] ??= []).push(q)
        }
      }

      if (q.type === 'begin_repeat') {
        depthStack.push(q.name)
      }
    }

    for (const [path, questions] of Object.entries(this.questionsByGroupPath)) {
      const pathArr = path.split(KoboSchemaRepeatHelper.$xpathSeparator)
      const groupInfo: KoboGroupInfo = {
        name: pathArr.at(-1)!,
        path,
        pathArr,
        depth: pathArr.length,
        questions,
      }

      this.groupByPath[path] = groupInfo
      this.groupByName[groupInfo.name] = groupInfo

      for (const q of questions) {
        this.groupByQuestionName[q.name] = groupInfo
      }
    }

    this.size = Object.keys(this.groupByPath).length
  }

  getByPath(path: string) {
    return this.groupByPath[path]
  }

  getByName(name: string) {
    return this.groupByName[name]
  }

  getByQuestionName(qName: string): KoboGroupInfo | undefined {
    return this.groupByQuestionName[qName]
  }

  search({
    exactName,
    depth,
  }: {
    exactName?: string
    depth?: number
  } = {}) {
    return Object.values(this.groupByPath)
      .filter(_ => _ !== undefined)
      .filter(info => {
        if (depth !== undefined && info.depth !== depth) return false
        if (exactName && !info.pathArr.includes(exactName)) return false
        return true
      })
  }
}
