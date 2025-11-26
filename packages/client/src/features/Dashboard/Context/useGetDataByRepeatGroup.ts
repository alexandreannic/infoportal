import {useRef} from 'react'
import {Answers} from '@/features/Dashboard/Context/DashboardContext'
import {SchemaInspector} from '@infoportal/form-helper'
import {Seq} from '@axanc/ts-utils'

export type UseFlattenRepeatGroupData = ReturnType<typeof useFlattenRepeatGroupData>

/**
 * React hook that returns a schema to flatten Kobo submissions
 * when a widget accesses data from a repeat group question.
 */
export const useFlattenRepeatGroupData = (inspector: SchemaInspector<any>) => {
  const cache = useRef(new WeakMap<any[], Map<string, Seq<Answers>>>())

  const flattenByGroupName = (data: Seq<Answers>, groupName?: string): Seq<Answers> => {
    if (!groupName) return data
    return data.flatMap(record => {
      const repeats: object[] = (record as any)[groupName] ?? []
      return repeats.map(rep => ({
        ...record,
        ...rep,
      }))
    })
  }

  const flattenIfRepeatGroup = (data: Seq<Answers>, questionName?: string): Seq<Answers> => {
    if (!questionName) return data

    // Read or init cache for this data reference
    let dataCache = cache.current.get(data)
    if (!dataCache) {
      dataCache = new Map()
      cache.current.set(data, dataCache)
    }

    // Try cached
    const cached = dataCache.get(questionName)
    if (cached) return cached

    // Compute if needed
    const group = inspector.lookup.group.getByQuestionName(questionName)
    if (!group) return data

    const flattened = flattenByGroupName(data, group.name)
    dataCache.set(questionName, flattened)
    return flattened
  }

  return {flattenIfRepeatGroup, flattenByGroupName}
}
