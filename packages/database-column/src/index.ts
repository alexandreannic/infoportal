import {Meta} from './columns/meta'
import {QuestionType} from './columns/questionType'

export {ExternalFilesChoices, KoboExternalFilesIndex} from './columns/type'
export {KoboTypeIcon} from './ui/KoboTypeIcon'
export {colorRepeatedQuestionHeader, defaultColWidth} from './columns/common'
export {OnRepeatGroupClick} from './columns/type'
export const buildDbColumns = {
  meta: Meta,
  question: QuestionType,
}
