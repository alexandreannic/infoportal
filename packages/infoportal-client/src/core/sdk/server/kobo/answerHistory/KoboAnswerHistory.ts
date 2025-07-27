import {Ip} from 'infoportal-api-sdk'

export interface KoboAnswerHistorySearch {
  formId: Ip.FormId
}

export interface KoboAnswerHistory {
  id: string
  answerIds: string[]
  by: Ip.User.Email
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
