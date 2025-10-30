import {useCallback, useState} from 'react'
import {produce} from 'immer'
import {Ip} from 'infoportal-api-sdk'

export type Filters = {
  period: Ip.Period
  questions: Record<string, string[]>
}

export type UseDashboardFilters = ReturnType<typeof useDashboardFilters>

export const useDashboardFilters = ({defaultPeriod}: {defaultPeriod: Ip.Period}) => {
  const defaultFilters: Filters = {
    questions: {},
    period: {start: defaultPeriod.start, end: defaultPeriod.end},
  }

  const [filters, setFilters] = useState<Filters>(defaultFilters)

  const reset = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

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
    [filters],
  )
  return {
    get: filters,
    set: setFilters,
    reset,
    updateQuestion,
  }
}
