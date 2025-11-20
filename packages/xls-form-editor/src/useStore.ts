import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {Ip} from '@infoportal/api-sdk'

export type RawQuestion = Omit<Ip.Form.Question, '$xpath'>

export type XlsSurveyRow = RawQuestion & {key: string}

export type XlsSchema = Omit<Ip.Form.Schema, 'survey'> & {
  survey: XlsSurveyRow[]
}

interface XlsFormState {
  schema: XlsSchema
  setSchema: (_: Ip.Form.Schema) => void
  // translations: Kobo.Form['content']['translations']
  // setTranslations: (rows: Kobo.Form['content']['translations']) => void
  // survey: XlsSurveyRow[]
  // setSurvey: (rows: Kobo.Form.Question[]) => void
  // choices: XlsChoiceRow[]
  // setChoices: (rows: Kobo.Form.Choice[]) => void
  addSurveyRow: (count: number) => void
  updateSurveyCell: <K extends keyof XlsSurveyRow>(
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
    schema: {
      choices: [],
      survey: [{type: 'select_one', name: '', key: '0_'}],
      translations: ['English (en)'],
      settings: {},
      translated: [],
      schema: '',
    },
    setSchema: schema =>
      set({
        schema: {
          ...schema,
          choices: schema.choices ?? [],
          survey: schema.survey
            .filter(_ => !skippedQuestionTypesSet.has(_.type as any))
            .map((_, i) => ({..._, key: i + '_' + _.name})),
        },
      }),

    addSurveyRow: (count: number) =>
      set(state => {
        const survey = state.schema.survey
        const start = survey.length
        const end = survey.length + count
        for (let i = start; i < end; i++) {
          const name = ''
          survey.push({
            name,
            calculation: '',
            type: 'text',
            key: i + '_' + name,
          })
        }
      }),

    updateSurveyCell: (rowKey, field, value, fieldIndex) =>
      set(state => {
        const row = state.schema.survey.find(r => r.key === rowKey)
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
    const row = s.schema.survey.find(_ => _.key === key)
    if (!row) return undefined

    const fieldValue = row[field]
    if (fieldIndex !== undefined && Array.isArray(fieldValue)) {
      return fieldValue[fieldIndex] as T
    }
    return fieldValue as T
  })

  const updateCell = useXlsFormStore(s => s.updateSurveyCell)

  const onChange = (v: T | null) => {
    updateCell(key, field, v as any, fieldIndex)
  }

  return {value, onChange}
}
