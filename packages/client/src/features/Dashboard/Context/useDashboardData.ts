import {Answers, DashboardContext} from '@/features/Dashboard/Context/DashboardContext'
import {fnSwitch, Seq} from '@axanc/ts-utils'
import {filterByColumn} from '@infoportal/client-datatable'
import {subDays} from 'date-fns'
import {Ip} from '@infoportal/api-sdk'
import {isDate, PeriodHelper} from '@infoportal/common'
import {SchemaInspector} from '@infoportal/form-helper'
import {useCallback, useMemo, useRef} from 'react'

type FilterFn<T> = (item: T, index: number, array: T[]) => boolean | undefined

export type UseDashboardFilteredDataCache = ReturnType<typeof useDashboardFilteredDataCache>

type Props = {
  data: Seq<Answers>
  schemaInspector: SchemaInspector<true>
  filters: DashboardContext['filter']['get']
  dashboard: Ip.Dashboard
}

export function useDashboardFilteredDataCache({data, ...props}: Props) {
  const cacheRef = useRef(createFilterCache<Answers>())

  const getFilteredData = useCallback(
    (filters_: (undefined | FilterFn<Answers>)[]) => {
      const filters = filters_.filter(_ => _ !== undefined)
      const cache = cacheRef.current
      const cached = cache.get(filters)
      if (cached) return cached

      let result = data
      for (const fn of filters) {
        result = result.filter(fn)
      }

      cache.set(filters, result)
      return result
    },
    [data],
  )

  const filterFns = useFiltersFn(props)
  return {source: data, filterFns, getFilteredData}
}

function useFiltersFn({dashboard, schemaInspector, filters: dashboardFilters}: Omit<Props, 'data'>) {
  const byPeriod = useCallback(
    (period: Ip.Period) => (row: Answers) => {
      return PeriodHelper.isDateIn(period, row.submissionTime)
    },
    [],
  )

  const byPeriodCurrent = useCallback(
    (row: Answers) => {
      return byPeriod(dashboardFilters.period)(row)
    },
    [dashboardFilters.period.start, dashboardFilters.period.end, byPeriod],
  )

  const deltaPeriod = useMemo(() => {
    if (!dashboard.periodComparisonDelta) return undefined
    return {
      ...dashboardFilters.period,
      end: subDays(dashboardFilters.period.end, dashboard.periodComparisonDelta),
    }
  }, [dashboardFilters.period.start, dashboardFilters.period.end, dashboard.periodComparisonDelta])

  const byPeriodCurrentDelta = useMemo(() => {
    if (!deltaPeriod) return
    return (row: Answers) => {
      return byPeriod(deltaPeriod)(row)
    }
  }, [byPeriodCurrent, deltaPeriod])

  const byWidgetFilter = useCallback(
    (widgetFilter?: Ip.Dashboard.Widget.ConfigFilter) => {
      return filterToFunction(schemaInspector, widgetFilter)
    },
    [schemaInspector],
  )
  const byDashboardFilter = useCallback(
    ({excludedQuestion}: {excludedQuestion?: string} = {}) => {
      const filtersCopy = {...dashboardFilters.questions}
      if (excludedQuestion) delete (filtersCopy as any)[excludedQuestion]
      const all = Object.keys(filtersCopy).map(questionName => {
        return filterByColumn<Answers>({
          columnId: questionName,
          getValue: row => row[questionName],
          type: fnSwitch(
            schemaInspector.lookup.questionIndex[questionName]?.type!,
            {
              today: 'date',
              start: 'date',
              end: 'date',
              datetime: 'date',
              date: 'date',
              select_one_from_file: 'select_one',
              select_one: 'select_one',
              select_multiple: 'select_multiple',
              integer: 'number',
              decimal: 'number',
            },
            () => 'string',
          ),
          filter: (filtersCopy as any)[questionName],
        })
      })
      return (row: Answers) => {
        return all.filter(_ => _ !== undefined).every(_ => _(row))
      }
    },
    [dashboardFilters],
  )

  return {
    byPeriod,
    byPeriodCurrent,
    byPeriodCurrentDelta,
    byWidgetFilter,
    byDashboardFilter,
  }
}

const _filterCache = new WeakMap<Ip.Dashboard.Widget.ConfigFilter, undefined | ((row: any) => boolean | undefined)>()

export function filterToFunction<T extends Record<string, any> = Record<string, any>>(
  schema: SchemaInspector<true>,
  filter?: Ip.Dashboard.Widget.ConfigFilter,
): undefined | ((_: T) => boolean | undefined) {
  if (!filter?.questionName) return

  const cached = _filterCache.get(filter)
  if (cached) return cached

  const fn = (() => {
    const filterNumber = filter.number
    const filterChoice = filter.choices
    const filterDate = filter.date
    if (filterDate) {
      return (_: T) => {
        const value = _[filter.questionName!]
        if (!isDate(value)) return false
        return PeriodHelper.isDateIn({start: filterDate?.[0], end: filterDate?.[1]}, value)
      }
    }
    if (filterNumber)
      return (_: T) => {
        const value = _[filter.questionName!]
        if (isNaN(value)) return false
        if (filterNumber.min && filterNumber.min > value) return false
        if (filterNumber.max && filterNumber.max < value) return false
        return true
      }
    if (filterChoice) {
      if (!filterChoice || filterChoice.length === 0) return (_: T) => true
      const isMultiple = schema.lookup.questionIndex[filter.questionName]?.type === 'select_multiple'
      const set = new Set(filterChoice)
      if (isMultiple) return (_: T) => _[filter.questionName!]?.some((_: string) => set.has(_))
      return (_: T) => set.has(_[filter.questionName!])
    }
  })()
  _filterCache.set(filter, fn)
  return fn
}

/** Nested WeakMap cache: [filter1][filter2][filter3]... = filteredArray*/
function createFilterCache<T>() {
  const root = new WeakMap<object, any>()

  function get(filters: FilterFn<T>[]): Seq<T> | undefined {
    let node: any = root
    for (const f of filters) {
      node = node.get?.(f)
      if (!node) return undefined
    }
    return node.value
  }

  function set(filters: FilterFn<T>[], value: Seq<T>) {
    let node: any = root
    for (const f of filters) {
      if (!node.has(f)) node.set(f, new WeakMap())
      node = node.get(f)
    }
    node.value = value
  }

  function clear() {
    // Reset the root WeakMap (can't truly clear WeakMap)
    return createFilterCache<T>()
  }

  return {get, set, clear}
}
