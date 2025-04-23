import {DatatableColumn, DatatableOptions, DatatableRow} from '@/shared/Datatable/util/datatableType'
import {useCallback, useEffect, useMemo} from 'react'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'
import {seq} from '@axanc/ts-utils'
import {UseDatatableData} from '@/shared/Datatable/context/useDatatableData'

import {KeyOf} from 'infoportal-common'

export type UseDatatableOptions<T extends DatatableRow> = ReturnType<typeof useDatatableOptions<T>>

const optionsRef = new Map<string, DatatableOptions[] | undefined>()

export const useDatatableOptions = <T extends DatatableRow>({
  data,
  columns,
  columnsIndex,
}: {
  data: UseDatatableData<T>
  columns: DatatableColumn.InnerProps<any>[]
  columnsIndex: Record<KeyOf<T>, DatatableColumn.InnerProps<any>>
}) => {
  const automaticOptionColumns = useMemo(
    () => columns.filter((_) => (_.type === 'select_multiple' || _.type === 'select_one') && _.options === undefined),
    [columns],
  )

  useEffect(
    function resetAutomaticRef() {
      automaticOptionColumns.forEach((c) => {
        optionsRef.delete(c.id)
      })
    },
    [data.filteredData],
  )

  return useCallback(
    (columnId: KeyOf<T>) => {
      if (!optionsRef.has(columnId)) {
        const col = columnsIndex[columnId]
        if ((col.type === 'select_one' || col.type === 'select_multiple') && col.options) {
          optionsRef.set(columnId, col.options())
        } else {
          if (col.type === 'select_one') {
            optionsRef.set(
              columnId,
              seq(data.filterExceptBy(columnId))
                ?.map(col.render)
                .distinct((_) => _.value)
                .sort((a, b) => (b.value ?? '').localeCompare(a.value ?? ''))
                .map((_) => DatatableUtils.buildCustomOption(_.value as string, _.option as string)),
            )
          } else if (col.type === 'select_multiple') {
            throw new Error(`options not implemented for ${columnId}.`)
            // optionsRef.set(columnId, seq(data.filterExceptBy(columnId))
            //   ?.flatMap(_ => col.render(_).value)
            //   .distinct(_ => _)
            //   .sort((a, b) => (a ?? '').localeCompare(b ?? ''))
            //   .map(_ => {
            //     console.log(col)
            //     console.log(_)
            //     console.log(col.render(_))
            //     return _ ? DatatableUtils.buildCustomOption(_, col.render(_).option as string) : DatatableUtils.blankOption
            //   })
            // )
          }
        }
      }
      return optionsRef.get(columnId)
    },
    [data.filteredData, data.filters, columns],
  )
}
