import * as React from 'react'
import {ReactNode, useMemo} from 'react'
import {Seq} from '@axanc/ts-utils'
import {ChartPieIndicatorProps, ChartPieWidget} from './ChartPieWidget'

export type ChartPieWidgetProps<T> = {
  title?: ReactNode
  data: Seq<T>
  previousData?: Seq<T>
  showValue?: boolean
  showBase?: boolean
  hideEvolution?: boolean
} & Omit<ChartPieIndicatorProps, 'base' | 'value'>

export const ChartPieWidgetBy = <T,>({
  title,
  previousData,
  data,
  filter,
  filterBase,
  hideEvolution,
  ...props
}: ChartPieWidgetProps<T> & {
  filter: (_: T) => boolean | undefined
  filterBase?: (_: T) => boolean | undefined
}) => {
  const percent = ({res, base}: {res: number; base: number}) => res / base
  const run = (d: Seq<T>) => {
    const base = filterBase ? d.filter(filterBase) : d
    return {
      res: base.filter(filter).length,
      base: base.length || 1,
    }
  }
  const computedData = useMemo(() => run(data), [data, filter, filterBase])

  const computedPreviousData = useMemo(() => {
    if (previousData) return run(previousData)
  }, [previousData, filter, filterBase])

  return (
    <ChartPieWidget
      title={title}
      value={computedData.res}
      base={computedData.base}
      evolution={
        hideEvolution
          ? undefined
          : computedPreviousData
            ? percent(computedData) * 100 - percent(computedPreviousData) * 100
            : undefined
      }
      {...props}
    />
  )
}
