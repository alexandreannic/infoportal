import {Meta} from './columns/meta.js'
import {QuestionType} from './columns/questionType.js'

export {editableColsType} from './columns/common'
export {ExternalFilesChoices, KoboExternalFilesIndex} from './columns/type.js'
export {KoboTypeIcon} from './ui/KoboTypeIcon.js'
export {colorRepeatedQuestionHeader, defaultColWidth} from './columns/common.js'
export {OnRepeatGroupClick} from './columns/type.js'
export const buildDbColumns = {
  meta: Meta,
  question: QuestionType,
}
