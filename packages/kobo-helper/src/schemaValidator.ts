import {Obj} from '@axanc/ts-utils'
import {Ip} from '@infoportal/api-sdk'

export type SchemaValidationErrorReport = {
  missingQuestionNames?: number[]
  duplicateQuestionNames?: string[]
  duplicateChoiceNames?: string[]
  unusedChoicesLists: string[]
  missingChoicesLists: string[]
  // 0 if they match, 1 if not closed, -1 if not opened
  matchingGroups?: number
  // 0 if they match, 1 if not closed, -1 if not opened
  matchingRepeats?: number
}

export class SchemaValidator {
  static readonly validate = (schema: Ip.Form.Schema): SchemaValidationErrorReport | undefined => {
    const report = {
      missingQuestionNames: [] as number[],
      duplicateQuestionNames: [] as string[],
      duplicateChoiceNames: [] as string[],
      missingChoicesLists: [] as string[],
      unusedChoicesLists: [] as string[],
      matchingGroups: 0,
      matchingRepeats: 0,
    }
    const listNamesRef = new Set<string>()
    const listNames = new Set<string>()
    const names = new Set<string>()
    const endType = new Set<Ip.Form.QuestionType>(['end_repeat', 'end_group'])

    schema.survey.forEach((q, index) => {
      if (q.select_from_list_name) {
        listNamesRef.add(q.select_from_list_name)
      }
      if (!q.name?.trim() && !endType.has(q.type)) {
        report.missingQuestionNames.push(index)
      } else if (names.has(q.name)) {
        report.duplicateQuestionNames.push(q.name)
      } else {
        names.add(q.name)
      }
      if (q.type === 'begin_group') {
        report.matchingGroups += 1
      } else if (q.type === 'end_group') {
        report.matchingGroups -= 1
      } else if (q.type === 'begin_repeat') {
        report.matchingRepeats += 1
      } else if (q.type === 'end_repeat') {
        report.matchingRepeats -= 1
      }
    })

    schema.choices?.forEach((c, index) => {
      listNames.add(c.list_name)
      if (!listNamesRef.has(c.list_name)) {
        report.unusedChoicesLists.push(c.list_name)
      }
    })
    schema.survey.forEach((q, index) => {
      if (!q.select_from_list_name) return
      if (!listNames.has(q.select_from_list_name)) {
        report.missingChoicesLists.push(q.select_from_list_name)
      }
    })
    const filteredReport = Obj.filterValue(report, _ => {
      if (Array.isArray(_) && _.length === 0) return false
      if (_ === 0) return false
      return true
    })
    if (Obj.keys(filteredReport).length === 0) return undefined
    return filteredReport as SchemaValidationErrorReport
  }
}
