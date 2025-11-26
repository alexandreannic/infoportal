import {Api} from '@infoportal/api-sdk'

export interface KoboAnswerHistorySearch {
  formId: Api.FormId
}

export interface KoboAnswerHistory {
  id: string
  answerIds: string[]
  by: Api.User.Email
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
