import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {Kobo} from 'kobo-sdk'

export type XlsSurveyRow = Kobo.Form.Question & {key: string}

interface XlsFormState {
  survey: XlsSurveyRow[]
  setData: (rows: Kobo.Form.Question[]) => void
  updateCell: <K extends keyof XlsSurveyRow>(
    rowKey: string,
    field: K,
    value: XlsSurveyRow[K] extends (infer U)[]
      ? U // handle string[] or any[]
      : XlsSurveyRow[K],
    fieldIndex?: number,
  ) => void
}

export const skippedQuestionTypes = ['deviceid', 'username', 'start', 'end'] as const
const skippedQuestionTypesSet = new Set(skippedQuestionTypes)

export const useXlsFormStore = create<XlsFormState>()(
  immer(set => ({
    survey: [],
    setData: rows =>
      set({
        survey: rows
          .filter(_ => !skippedQuestionTypesSet.has(_.type as any))
          // .map((_, i) => ({..._, key: _.name})),
          .map((_, i) => ({..._, key: i + '_' + _.name})),
      }),

    updateCell: (rowKey, field, value, fieldIndex) =>
      set(state => {
        const row = state.survey.find(r => r.key === rowKey)
        if (!row) return

        const current = row[field]
        // row.key = row.key + 'i'
        if (fieldIndex !== undefined) {
          if (!Array.isArray(current)) {
            row[field] = [] as any
          }
          ;(row[field] as any[])[fieldIndex] = value
        } else {
          row[field] = value as any
        }
      }),
  })),
)

export const useCell = <T extends boolean | string>(key: string, field: keyof XlsSurveyRow, fieldIndex?: number) => {
  const value = useXlsFormStore(s => {
    const row = s.survey.find(_ => _.key === key)
    if (!row) return undefined

    const fieldValue = row[field]
    if (fieldIndex !== undefined && Array.isArray(fieldValue)) {
      return fieldValue[fieldIndex] as T
    }
    return fieldValue as T
  })

  const updateCell = useXlsFormStore(s => s.updateCell)

  const onChange = (v: T | null) => {
    updateCell(key, field, v as any, fieldIndex)
  }

  return {value, onChange}
}
