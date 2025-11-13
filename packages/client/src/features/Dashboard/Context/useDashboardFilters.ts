import {useCallback, useMemo, useState} from 'react'
import {produce} from 'immer'
import {Ip} from '@infoportal/api-sdk'
import {Obj} from '@axanc/ts-utils'

export type Filters = {
  period: Ip.Period
  questions: Record<string, undefined | string[]>
}

export type UseDashboardFilters = ReturnType<typeof useDashboardFilters>

export const useDashboardFilters = ({defaultPeriod}: {defaultPeriod: Ip.Period}) => {
  const defaultFilters: Filters = {
    questions: {},
    period: {start: defaultPeriod.start, end: defaultPeriod.end},
  }

  const [dirtyFilters, setFilters] = useState<Filters>(defaultFilters)

  const filters: Filters = useMemo(() => {
    const cleanedQuestions = Obj.filterValue(dirtyFilters.questions, _ => !!_ && _.length > 0)
    return {
      ...dirtyFilters,
      questions: cleanedQuestions,
    }
  }, [dirtyFilters])

  const reset = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  const clearQuestion = useCallback(
    (qName: string) => {
      setFilters(prev =>
        produce(prev, draft => {
          delete draft.questions[qName]
        }),
      )
    },
    [setFilters],
  )

  const updateQuestion = useCallback(
    (qName: string, values: string[], label?: string) => {
      setFilters(prev =>
        produce(prev, draft => {
          const currentValues = draft.questions[qName] ?? []
          values.forEach(value => {
            const idx = currentValues.indexOf(value)
            if (idx >= 0) currentValues.splice(idx, 1)
            else currentValues.push(value)
          })
          draft.questions[qName] = currentValues
        }),
      )
    },
    [setFilters],
  )
  return {
    get: filters,
    set: setFilters,
    reset,
    updateQuestion,
    clearQuestion,
  }
}
