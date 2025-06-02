import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {DatatableColumn, DatatableRow, DatatableTableProps} from '@/shared/Datatable/util/datatableType'

export type UseDatabaseColVisibility<T extends DatatableRow> = ReturnType<typeof useDatabaseColVisibility<T>>

export const useDatabaseColVisibility = <T extends DatatableRow>({
  columns,
  onHide,
  hideButton,
  defaultHidden,
  hidden,
  id,
  disableAutoSave,
}: {
  id: string
  columns: DatatableColumn.InnerProps<T>[]
} & DatatableTableProps<T>['columnsToggle']) => {
  const [hiddenColumns, setHiddenColumns] = useState<string[]>(() => {
    const saved = disableAutoSave ? undefined : localStorage.getItem(DatatableUtils.localStorageKey.column + id)
    return saved ? (JSON.parse(saved) as string[]) : (hidden ?? defaultHidden ?? [])
  })

  useEffect(() => {
    onHide?.(hiddenColumns)
    if (!disableAutoSave)
      localStorage.setItem(DatatableUtils.localStorageKey.column + id, JSON.stringify(hiddenColumns))
  }, [hiddenColumns])

  useEffect(() => {
    // if (seq(hidden).difference(hiddenColumns).length === 0) return
    if (hidden) setHiddenColumns(hidden)
  }, [hidden])

  const filteredColumns = useMemo(() => columns.filter(_ => !hiddenColumns.includes(_.id)), [columns, hiddenColumns])

  const handleHide = useCallback(
    (columns: string[]) => {
      setHiddenColumns(_ => {
        return [...new Set([..._, ...columns])]
      })
    },
    [setHiddenColumns],
  )

  return {
    columns,
    filteredColumns,
    hideButton,
    handleHide,
    hiddenColumns,
    setHiddenColumns,
  }
}
