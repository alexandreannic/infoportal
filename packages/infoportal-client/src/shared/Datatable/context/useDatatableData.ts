import {useCallback, useEffect, useMemo, useState} from 'react'
import {ApiPaginateHelper, KeyOf, multipleFilters, safeNumber} from 'infoportal-common'
import {fnSwitch, map, Obj} from '@alexandreannic/ts-utils'
import {DatatableColumn, DatatableFilterTypeMapping, DatatableFilterValue, DatatableRow, DatatableSearch, DatatableTableProps} from '@/shared/Datatable/util/datatableType'
import {OrderBy} from '@alexandreannic/react-hooks-lib'
import {usePersistentState} from '@/shared/hook/usePersistantState'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'

export type UseDatatableData<T extends DatatableRow> = ReturnType<typeof useDatatableData<T>>

export const useDatatableData = <T extends DatatableRow>({
  id,
  data,
  columnsIndex,
  defaultLimit = 20,
  defaultFilters,
}: {
  id: string
  defaultLimit?: number
  defaultFilters?: DatatableTableProps<T>['defaultFilters']
  data?: T[]
  columnsIndex: Record<KeyOf<T>, DatatableColumn.InnerProps<T>>
}) => {
  const [filters, setFilters] = useState<Record<KeyOf<T>, DatatableFilterValue>>(defaultFilters ?? {} as any)
  const [search, setSearch] = usePersistentState<DatatableSearch<any>>({
    limit: defaultLimit,
    offset: 0,
  }, {
    transformFromStorage: _ => {
      _.offset = 0
      return _
    },
    storageKey: `datatable-paginate-${id}`,
  })

  useEffect(() => {
    if (defaultFilters) setFilters(defaultFilters)
  }, [defaultFilters])
  const resetSearch = () => setSearch({limit: defaultLimit, offset: 0,})

  const onOrderBy = useCallback((columnId: string, orderBy?: OrderBy) => {
    setSearch(prev => ({...prev, orderBy, sortBy: columnId}))
  }, [])

  const filteredData = useMemo(() => {
    return filterBy({data, filters, columnsIndex})
  }, [data, filters])

  const filterExceptBy = useCallback((key: KeyOf<T>) => {
    const filtersCopy = {...filters}
    delete filtersCopy[key]
    return filterBy({data, filters: filtersCopy, columnsIndex})
  }, [data, filters])

  const filteredAndSortedData = useMemo(() => {
    return map(filteredData, search.sortBy, (d, sortBy) => {
      const col = columnsIndex[sortBy]
      if (!col.type) return
      const sorted = d.sort(fnSwitch(col.type, {
        number: () => (a: T, b: T) => {
          const av = safeNumber(col.render(a).value as number, Number.MIN_SAFE_INTEGER)
          const bv = safeNumber(col.render(b).value as number, Number.MIN_SAFE_INTEGER)
          return (av - bv) * (search.orderBy === 'asc' ? -1 : 1)
        },
        date: () => (a: T, b: T) => {
          try {
            const av = (col.render(a).value as Date).getTime() ?? 0
            const bv = (col.render(b).value as Date).getTime() ?? 0
            return (av - bv) * (search.orderBy === 'asc' ? -1 : 1)
          } catch (e) {
            // console.warn('Invalid date', col.render(a).value)
            return -1
          }
        },
      }, () => (a: T, b: T) => {
        const av = (col.render(a).value ?? '') + ''
        const bv = (col.render(b).value ?? '') + ''
        return av.localeCompare(bv) * (search.orderBy === 'asc' ? -1 : 1)
      }))
      return [...sorted]
    }) ?? filteredData
  }, [filteredData, search.sortBy, search.orderBy])

  const filteredSortedAndPaginatedData = useMemo(() => {
    if (!filteredAndSortedData) return
    return ApiPaginateHelper.make(search.limit, search.offset)<T>(filteredAndSortedData)
  }, [search.limit, search.offset, filteredAndSortedData])

  return {
    filters,
    filterExceptBy,
    setFilters,
    search,
    setSearch,
    resetSearch,
    data,
    onOrderBy,
    filteredData,
    filteredAndSortedData,
    filteredSortedAndPaginatedData,
  }
}

const filterBy = <T extends DatatableRow>({
  data,
  filters,
  columnsIndex,
}: {
  data?: T[],
  filters: Record<KeyOf<T>, DatatableFilterValue>
  columnsIndex: Record<KeyOf<T>, DatatableColumn.InnerProps<T>>
}) => {
  if (!data) return
  return multipleFilters(data, Obj.keys(filters).map((k, i) => {
    const filter = filters[k]
    const col = columnsIndex[k]
    if (col === undefined || filter === undefined) return
    switch (col.type) {
      case 'id': {
        const typedFilter = filter as DatatableFilterTypeMapping['id']
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
        const typedFilter = filter as DatatableFilterTypeMapping['date']
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
        const typedFilter = filter as DatatableFilterTypeMapping['select_one']
        return row => {
          const v = col.render(row).value as string
          if (v === undefined) return false
          return (typedFilter).includes(v)
        }
      }
      case 'select_multiple': {
        const typedFilter = filter as DatatableFilterTypeMapping['select_multiple']
        return row => {
          const v = col.render(row).value as string[]
          return v.some(_ => (typedFilter).includes(_))
        }
      }
      case 'number': {
        const typedFilter = filter as DatatableFilterTypeMapping['number']
        return row => {
          const v = col.render(row).value as number | undefined
          const min = typedFilter[0] as number | undefined
          const max = typedFilter[1] as number | undefined
          return v !== undefined && (max === undefined || v <= max) && (min === undefined || v >= min)
        }
      }
      default: {
        if (!col.type) return
        const typedFilter = filter as DatatableFilterTypeMapping['string']
        return row => {
          const v = col.render(row).value
          if ((v === DatatableUtils.blank) && typedFilter?.filterBlank !== false) return false
          if (typedFilter?.value === undefined) return true
          if (typeof v !== 'string' && typeof v !== 'number') {
            console.warn('Value of ${String(k)} is', v)
            throw new Error(`Value of ${String(k)} is ${v} but expected string.`)
          }
          return ('' + v).toLowerCase().includes(typedFilter.value.toLowerCase())
        }
      }
    }
  }))
}