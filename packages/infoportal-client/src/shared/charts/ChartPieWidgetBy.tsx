import {ChartPieIndicatorProps, ChartPieWidget} from '@/shared/charts/ChartPieWidget'
import * as React from 'react'
import {ReactNode, useMemo} from 'react'
import {Seq} from '@axanc/ts-utils'

export type ChartPieWidgetProps<T> = {
  compare?: {before: Seq<T>; now?: Seq<T>}
  title?: ReactNode
  data: Seq<T>
  showValue?: boolean
  showBase?: boolean
  hideEvolution?: boolean
} & Omit<ChartPieIndicatorProps, 'base' | 'value'>

export const ChartPieWidgetBy = <T,>({
  title,
  compare,
  data,
  filter,
  filterBase,
  hideEvolution,
  ...props
}: ChartPieWidgetProps<T> & {
  filter: (_: T) => boolean
  filterBase?: (_: T) => boolean
}) => {
  const percent = ({res, base}: {res: number; base: number}) => res / base
  const run = (d: Seq<T>) => {
    const base = filterBase ? d.filter(filterBase) : d
    return {
      res: base.filter(filter).length,
      base: base.length || 1,
    }
  }
  const all = useMemo(() => run(data), [data, filter, filterBase])
  const comparedData = useMemo(() => {
    if (compare) {
      return {
        before: run(compare.before),
        now: compare.now ? run(compare.now) : undefined,
      }
    }
  }, [compare, filter, filterBase])

  return (
    <ChartPieWidget
      title={title}
      value={all.res}
      base={all.base}
      evolution={
        hideEvolution
          ? undefined
          : comparedData
            ? percent(comparedData.now ?? all) - percent(comparedData.before)
            : undefined
      }
      {...props}
    />
  )
}
