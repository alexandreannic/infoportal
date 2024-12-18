import {Kobo} from 'kobo-sdk'

export interface KoboAnswerHistorySearch {
  formId: Kobo.FormId
}

export interface KoboAnswerHistory {
  id: string
  answerIds: string[]
  by: string
  date: Date
  type: 'answer' | 'tag' | 'delete'
  property?: string
  oldValue?: any
  newValue?: any
}

export class KoboAnswerHistory {
  static readonly map = (_: any): KoboAnswerHistory => {
    _.date = new Date(_.date)
    return _
  }
}
