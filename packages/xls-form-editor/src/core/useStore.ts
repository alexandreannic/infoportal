import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {Ip} from '@infoportal/api-sdk'
import {genShortid} from 'infoportal-common'
import {RowId} from '@infoportal/client-datatable/dist/core/types'
import {TableName} from '../table/XlsFormEditor'

export type XlsSurveyRow = Omit<Ip.Form.Question, '$xpath'>
export type XlsChoicesRow = Ip.Form.Choice

export type XlsSchema = Omit<Ip.Form.Schema, 'choices' | 'survey'> & {
  survey: XlsSurveyRow[]
  choices: XlsChoicesRow[]
}

function getTable<T extends TableName>(
  draft: XlsFormState,
  table: T,
): T extends 'survey' ? XlsSurveyRow[] : XlsChoicesRow[] {
  return draft.schema[table] as any
}

interface XlsFormState {
  schema: XlsSchema
  past: XlsSchema[]
  future: XlsSchema[]
  undo: () => void
  redo: () => void

  setSchema: (_: Ip.Form.Schema) => void
  reorderRows: (_: {table: TableName; index: number; rowIds: string[]}) => void
  addRows: (_: {table: TableName; count: number}) => void
  deleteRows: (_: {table: TableName; rowIds: string[]}) => void
  updateCells: (_: {
    table: TableName
    value: any
    fieldIndex?: number
    field: keyof XlsSurveyRow | keyof XlsChoicesRow
    rowKeys: string[]
  }) => void
}

export const getDataKey = (_: XlsSurveyRow | XlsChoicesRow) => _.$kuid
export const gen$kuid = () => genShortid(10)
export const skippedQuestionTypes = ['deviceid', 'username', 'start', 'end'] as const
const skippedQuestionTypesSet = new Set(skippedQuestionTypes)

const HISTORY_LIMIT = 50

export const useXlsFormStore = create<XlsFormState>()(
  immer((set, get) => {
    const withHistory = (fn: (draft: any) => void) => {
      const prev = get().schema

      set(state => {
        state.past.push(prev)
        if (state.past.length > HISTORY_LIMIT) state.past.shift()
        state.future = []
      })

      set(fn)
    }

    return {
      schema: {
        choices: [],
        survey: [{type: 'select_one', name: '', $kuid: genShortid(8)}],
        translations: ['English (en)'],
        settings: {},
        translated: [],
        schema: '',
      },

      past: [],
      future: [],

      // -----------------------------
      // UNDO / REDO
      // -----------------------------
      undo: () =>
        set(state => {
          if (state.past.length === 0) return
          const previous = state.past.pop()!
          state.future.push(state.schema)
          state.schema = previous
        }),

      redo: () =>
        set(state => {
          if (state.future.length === 0) return
          const next = state.future.pop()!
          state.past.push(state.schema)
          state.schema = next
        }),

      // -----------------------------
      // MUTATIONS (all wrapped)
      // -----------------------------
      setSchema: schema =>
        withHistory(draft => {
          draft.schema = {
            ...schema,
            choices: schema.choices ?? [],
            survey: schema.survey.filter(_ => !skippedQuestionTypesSet.has(_.type as any)),
          }
        }),

      addRows: ({table, count}) =>
        withHistory(draft => {
          const t = draft.schema[table]
          const start = t.length
          const end = t.length + count
          const emptySurvey: XlsSurveyRow = {
            name: '',
            calculation: '',
            type: 'text',
            $kuid: gen$kuid(),
          }
          const emptyChoice: XlsChoicesRow = {
            name: '',
            $kuid: gen$kuid(),
            list_name: '',
            label: [],
          }
          const emptyRow = table === 'survey' ? emptySurvey : emptyChoice

          for (let i = start; i < end; i++) t.push({...emptyRow})
        }),

      deleteRows: ({table, rowIds}) =>
        withHistory(draft => {
          const rows = getTable(draft, table)
          const toDelete = new Set(rowIds)
          draft.schema[table] = rows.filter(row => !toDelete.has(getDataKey(row)))
        }),

      reorderRows: ({table, index, rowIds}) =>
        withHistory(draft => {
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
          draft.schema[table] = [...remaining.slice(0, target), ...moved, ...remaining.slice(target)]
        }),

      updateCells: ({table, rowKeys, field, value, fieldIndex}) =>
        withHistory(draft => {
          for (const key of rowKeys) {
            const rows: Array<XlsSurveyRow | XlsChoicesRow> = draft.schema[table]
            const row: any = rows.find(r => r.$kuid === key)
            if (!row) continue

            const current = row[field]

            if (fieldIndex !== undefined) {
              if (!Array.isArray(current)) row[field] = []
              ;(row[field] as any[])[fieldIndex] = value
            } else {
              row[field] = value
            }
          }
        }),
    }
  }),
)
