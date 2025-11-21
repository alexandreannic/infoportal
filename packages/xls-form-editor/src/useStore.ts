import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {Ip} from '@infoportal/api-sdk'
import {genShortid} from 'infoportal-common'
import {RowId} from '@infoportal/client-datatable/dist/core/types'
import {getDataKey, TableName} from './XlsFormEditor'

export type RawQuestion = Omit<Ip.Form.Question, '$xpath'>

export type XlsSurveyRow = RawQuestion & {key: string}
export type XlsChoicesRow = Ip.Form.Choice & {key: string}

export type XlsSchema = Omit<Ip.Form.Schema, 'choices' | 'survey'> & {
  survey: XlsSurveyRow[]
  choices: XlsChoicesRow[]
}

interface XlsFormState {
  schema: XlsSchema
  setSchema: (_: Ip.Form.Schema) => void
  reorderRows: (_: {table: TableName; index: number; rowIds: string[]}) => void
  addRows: (_: {table: TableName; count: number}) => void
  updateCell: (_: {
    table: TableName
    rowKey: string
    value: any // XlsSurveyRow[K] extends (infer U)[] ? U : XlsSurveyRow[K]
    fieldIndex?: number
    field: keyof XlsSurveyRow | keyof XlsChoicesRow
  }) => void
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
          choices: schema.choices?.map(choice => ({...choice, key: genShortid(9)})) ?? [],
          survey: schema.survey
            .filter(_ => !skippedQuestionTypesSet.has(_.type as any))
            .map((_, i) => ({..._, key: genShortid(8)})),
        },
      }),

    addRows: ({table, count}) =>
      set(state => {
        const t = state.schema[table]
        const start = t.length
        const end = t.length + count
        const name = ''
        const emptySurveyRow: XlsSurveyRow = {
          name,
          calculation: '',
          type: 'text',
          key: genShortid(6),
        }
        const emptyChoiceRow: XlsChoicesRow = {
          name,
          key: genShortid(6),
          list_name: '',
          label: [],
        }
        const emptyRow = table === 'survey' ? emptySurveyRow : emptyChoiceRow
        for (let i = start; i < end; i++) {
          t.push(emptyRow as any)
        }
      }),

    reorderRows: ({table, index, rowIds}) => {
      set(draft => {
        const rows = draft.schema[table]
        const movingSet = new Set(rowIds)
        const remaining: any[] = []
        const moved: any[] = []

        for (const row of rows) {
          const id = getDataKey(row) as RowId
          if (movingSet.has(id)) moved.push(row)
          else remaining.push(row)
        }

        const target = Math.min(index, remaining.length)
        draft.schema.survey = [...remaining.slice(0, target), ...moved, ...remaining.slice(target)]
      })
    },

    updateCell: ({table, rowKey, field, value, fieldIndex}) =>
      set(state => {
        const row: any = state.schema[table].find(r => r.key === rowKey)
        if (!row) return
        const current = row[field]
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

export type CellPointer =
  | {table: 'survey'; rowKey: string; field: keyof XlsSurveyRow; fieldIndex?: number}
  | {table: 'choices'; rowKey: string; field: keyof XlsChoicesRow; fieldIndex?: number}

export const useCell = <T extends boolean | string>({table, rowKey, field, fieldIndex}: CellPointer) => {
  const value = useXlsFormStore(s => {
    const row: any | undefined = s.schema[table].find(_ => _.key === rowKey)
    if (!row) return undefined

    const fieldValue = row[field]
    if (fieldIndex !== undefined && Array.isArray(fieldValue)) {
      return fieldValue[fieldIndex] as T
    }
    return fieldValue as T
  })

  const updateCell = useXlsFormStore(s => s.updateCell)

  const onChange = (v: T | null) => {
    updateCell({table, rowKey, field, value: v as any, fieldIndex})
  }

  return {value, onChange}
}
