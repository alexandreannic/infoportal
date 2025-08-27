import {useCallback, useEffect, useMemo} from 'react'
import {multipleFilters, safeNumber} from 'infoportal-common'
import {fnSwitch, KeyOf, map, Obj} from '@axanc/ts-utils'
import {Column, Filters, FilterTypeMapping, Row, SortBy} from '@/core/types'
import {Utils} from '@/helper/utils'

export type UseDatatableData<T extends Row> = ReturnType<typeof useDatatableData<T>>

export const useDatatableData = <T extends Row>({
  data,
  filters,
  sortBy,
  colIndex,
  showRowIndex,
}: {
  showRowIndex?: boolean
  data: T[]
  filters: Filters<any>
  sortBy?: SortBy
  colIndex: Record<string, Column.InnerProps<any>>
}) => {
  useEffect(() => {
    if (!showRowIndex) return
    data?.forEach((d: any, i) => {
      d.index = i
    })
  }, [data])

  const filteredData = useMemo(() => {
    return filterBy({data, filters: filters, colIndex: colIndex})
  }, [data, filters])

  const filterExceptBy = useCallback(
    (key: KeyOf<T>) => {
      const filtersCopy = {...filters} as Filters<any>
      delete filtersCopy[key]
      return filterBy({data, filters: filtersCopy, colIndex: colIndex})
    },
    [data, filters],
  )

  const filteredAndSortedData = useMemo(() => {
    return (
      map(filteredData, sortBy, (d, sortBy) => {
        const col = colIndex[sortBy.orderBy]
        if (!col) {
          return filteredData
        }
        if (!col.type) return
        const sorted = d.sort(
          fnSwitch(
            col.type,
            {
              number: () => (a: T, b: T) => {
                const av = safeNumber(col.render(a).value as number, Number.MIN_SAFE_INTEGER)
                const bv = safeNumber(col.render(b).value as number, Number.MIN_SAFE_INTEGER)
                return (av - bv) * (sortBy.orderBy === 'asc' ? -1 : 1)
              },
              date: () => (a: T, b: T) => {
                try {
                  const av = (col.render(a).value as Date).getTime() ?? 0
                  const bv = (col.render(b).value as Date).getTime() ?? 0
                  return (av - bv) * (sortBy.orderBy === 'asc' ? -1 : 1)
                } catch (e) {
                  // console.warn('Invalid date', col.render(a).value)
                  return -1
                }
              },
            },
            () => (a: T, b: T) => {
              const av = (col.render(a).value ?? '') + ''
              const bv = (col.render(b).value ?? '') + ''
              return av.localeCompare(bv) * (sortBy.orderBy === 'asc' ? -1 : 1)
            },
          ),
        )
        return [...sorted]
      }) ?? filteredData
    )
  }, [filteredData, sortBy])

  return {
    filterExceptBy,
    data,
    filteredData,
    filteredAndSortedData,
  }
}

const filterBy = <T extends Row>({
  data,
  filters,
  colIndex,
}: {
  data: T[]
  filters: Filters<T>
  colIndex: Record<KeyOf<T>, Column.InnerProps<T>>
}) => {
  return multipleFilters(
    data,
    Obj.keys(filters).map((k, i) => {
      const filter = filters[k]
      const col = colIndex[k]
      if (col === undefined || filter === undefined) return
      switch (col.type) {
        case 'id': {
          const typedFilter = filter as FilterTypeMapping['id']
          const filteredIds = typedFilter.split(/\s/)
          return row => {
            let v = col.render(row).value as string | undefined
            if (v === undefined) return false
            if (filteredIds.length === 1) return v.includes(filteredIds[0])
            if (filteredIds.length > 1) return filteredIds.includes(v)
            return false
          }
        }
        case 'date': {
          const typedFilter = filter as FilterTypeMapping['date']
          return row => {
            let v = col.render(row).value as Date | undefined
            if (v === undefined) return false
            if (!((v as any) instanceof Date)) {
              console.warn(`Value of ${String(k)} is`, v, `but Date expected.`)
              v = new Date(v)
              // throw new Error(`Value of ${String(k)} is ${v} but Date expected.`)
            }
            const [min, max] = typedFilter
            return (!min || v.getTime() >= min.getTime()) && (!max || v.getTime() <= max.getTime())
          }
        }
        case 'select_one': {
          const typedFilter = filter as FilterTypeMapping['select_one']
          return row => {
            const v = col.render(row).value as string
            if (v === undefined) return false
            return typedFilter.includes(v)
          }
        }
        case 'select_multiple': {
          const typedFilter = filter as FilterTypeMapping['select_multiple']
          return row => {
            const v = col.render(row).value as string[]
            return v.some(_ => typedFilter.includes(_))
          }
        }
        case 'number': {
          const typedFilter = filter as FilterTypeMapping['number']
          return row => {
            const v = col.render(row).value as number | undefined
            const min = typedFilter[0] as number | undefined
            const max = typedFilter[1] as number | undefined
            return v !== undefined && (max === undefined || v <= max) && (min === undefined || v >= min)
          }
        }
        default: {
          if (!col.type) return
          const typedFilter = filter as FilterTypeMapping['string']
          return row => {
            const v = col.render(row).value
            if (v === Utils.blank && typedFilter?.filterBlank !== false) return false
            if (typedFilter?.value === undefined) return true
            if (typeof v !== 'string' && typeof v !== 'number') {
              console.warn('Value of ${String(k)} is', v)
              throw new Error(`Value of ${String(k)} is ${v} but expected string.`)
            }
            return ('' + v).toLowerCase().includes(typedFilter.value.toLowerCase())
          }
        }
      }
    }),
  )
}
