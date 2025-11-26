import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {Ip} from '@infoportal/api-sdk'
import {genShortid} from '@infoportal/common'
import {RowId} from '@infoportal/client-datatable/dist/core/types'
import {TableName} from '../table/XlsFormEditor'
import {SchemaParser} from '@infoportal/form-helper'

interface XlsFormState {
  schema: Ip.Form.Schema
  past: Ip.Form.Schema[]
  future: Ip.Form.Schema[]
  undo: () => void
  redo: () => void
  setTranslations: (translations: Ip.Form.Schema['translations']) => void
  setSchema: (_: Ip.Form.Schema) => void
  reorderRows: (_: {table: TableName; index: number; rowIds: string[]}) => void
  addRows: (_: {table: TableName; count: number}) => void
  deleteRows: (_: {table: TableName; rowIds: string[]}) => void
  updateCells: (_: {
    table: TableName
    value: any
    fieldIndex?: number
    field: keyof Ip.Form.Question | keyof Ip.Form.Choice
    rowKeys: string[]
  }) => void
}

export const getDataKey = (_: Ip.Form.Question | Ip.Form.Choice) => _.$kuid
export const skippedQuestionTypes = ['deviceid', 'username', 'start', 'end'] as const

const HISTORY_LIMIT = 50

export const useXlsFormStore = create<XlsFormState>()(
  immer((set, get) => {
    const withHistory = (fn: (draft: XlsFormState) => void) => {
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
        survey: [{type: 'select_one', name: '', $xpath: null as any, $kuid: genShortid(8)}],
        translations: ['English (en)'],
        settings: {},
        translated: [],
        schema: '',
      },

      past: [],
      future: [],

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

      setSchema: schema =>
        set(draft => {
          draft.schema = {
            ...schema,
            choices: schema.choices ?? [],
            survey: schema.survey.filter(_ => !skippedQuestionTypes.includes(_.type as any)),
          }
        }),

      setTranslations: translations => {
        withHistory(draft => {
          draft.schema.translations = translations
        })
      },

      addRows: ({table, count}) =>
        withHistory(draft => {
          const t = draft.schema[table] ?? []
          const start = t.length
          const end = t.length + count

          for (let i = start; i < end; i++) {
            const emptySurvey: Ip.Form.Question = {
              name: '',
              $xpath: null as any, // Filled later
              calculation: '',
              type: 'text',
              $kuid: SchemaParser.gen$kuid(),
            }
            const emptyChoice: Ip.Form.Choice = {
              name: '',
              $kuid: SchemaParser.gen$kuid(),
              list_name: '',
              label: [],
            }
            const emptyRow = table === 'survey' ? emptySurvey : emptyChoice
            t.push({...emptyRow} as any)
          }
        }),

      deleteRows: ({table, rowIds}) =>
        withHistory(draft => {
          const rows = draft.schema[table] ?? []
          const toDelete = new Set(rowIds)
          draft.schema[table] = rows.filter(row => !toDelete.has(getDataKey(row))) as any
        }),

      reorderRows: ({table, index, rowIds}) =>
        withHistory(draft => {
          const rows = draft.schema[table] ?? []
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
            const rows: Array<Ip.Form.Question | Ip.Form.Choice> = draft.schema[table] ?? []
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
