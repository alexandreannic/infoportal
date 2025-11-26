import {Obj, seq} from '@axanc/ts-utils'
import {Api} from '@infoportal/api-sdk'

export type SchemaValidationErrorReport = {
  errors?: {
    missingQuestionNames?: number[]
    duplicateQuestionNames?: string[]
    duplicateChoiceNames?: string[]
    missingChoicesLists?: string[]
    // 0 if they match, 1 if not closed, -1 if not opened
    matchingGroups?: number
    // 0 if they match, 1 if not closed, -1 if not opened
    matchingRepeats?: number
  }
  warnings?: {
    unusedChoicesLists?: string[]
  }
}

export class SchemaValidator {
  static readonly validate = (schema: Api.Form.Schema): SchemaValidationErrorReport | undefined => {
    const report = {
      errors: {
        missingQuestionNames: [] as number[],
        duplicateQuestionNames: [] as string[],
        duplicateChoiceNames: [] as string[],
        matchingGroups: 0,
        matchingRepeats: 0,
        missingChoicesLists: [] as string[],
      },
      warnings: {
        unusedChoicesLists: [] as string[],
      },
    }
    const listNamesRef = new Set<string>()
    const listNames = new Set<string>()
    const names = new Set<string>()

    schema.survey.forEach((q, index) => {
      if (q.select_from_list_name) {
        listNamesRef.add(q.select_from_list_name)
      }

      if (q.type !== 'end_group' && q.type !== 'end_repeat') {
        const name = (q.name ?? '').trim()
        if (name === '') {
          report.errors.missingQuestionNames.push(index)
        } else if (names.has(name)) {
          report.errors.duplicateQuestionNames.push(name)
        } else {
          names.add(name)
        }
      }

      if (q.type === 'begin_group') {
        report.errors.matchingGroups += 1
      } else if (q.type === 'end_group') {
        report.errors.matchingGroups -= 1
      } else if (q.type === 'begin_repeat') {
        report.errors.matchingRepeats += 1
      } else if (q.type === 'end_repeat') {
        report.errors.matchingRepeats -= 1
      }
    })

    seq(schema.choices)
      .distinct(_ => _.list_name)
      .forEach((c, index) => {
        listNames.add(c.list_name)
        if (!listNamesRef.has(c.list_name)) {
          report.warnings.unusedChoicesLists.push(c.list_name)
        }
      })
    schema.survey.forEach((q, index) => {
      if (!q.select_from_list_name) return
      const isFromFile = q.select_from_list_name.includes('.')
      if (!isFromFile && !listNames.has(q.select_from_list_name)) {
        report.errors.missingChoicesLists.push(q.select_from_list_name)
      }
    })

    const res = {
      warnings: this.cleanReport(report.warnings),
      errors: this.cleanReport(report.errors),
    }
    if (!res.warnings && res.errors) return
    return res
  }

  private static cleanReport = (obj: Record<string, any[] | number>) => {
    const res = Obj.filterValue(obj, _ => {
      if (Array.isArray(_) && _.length === 0) return false
      if (_ === 0) return false
      return true
    })
    if (Obj.keys(res).length === 0) return undefined
    return res
  }
}
