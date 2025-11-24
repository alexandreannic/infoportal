import {useXlsFormStore, XlsChoicesRow, XlsSurveyRow} from './useStore'

export type CellPointer =
  | {table: 'survey'; rowKey: string; field: keyof XlsSurveyRow; fieldIndex?: number}
  | {table: 'choices'; rowKey: string; field: keyof XlsChoicesRow; fieldIndex?: number}

export const useCell = <T extends boolean | string>({table, rowKey, field, fieldIndex}: CellPointer) => {
  const value = useXlsFormStore(s => {
    const row: any | undefined = s.schema[table].find(_ => _.$kuid === rowKey)
    if (!row) return undefined

    const fieldValue = row[field]
    if (fieldIndex !== undefined && Array.isArray(fieldValue)) {
      return fieldValue[fieldIndex] as T
    }
    return fieldValue as T
  })

  const updateCells = useXlsFormStore(s => s.updateCells)

  const onChange = (v: T | null) => {
    updateCells({table, rowKeys: [rowKey], field, value: v as any, fieldIndex})
  }

  return {value, onChange}
}
