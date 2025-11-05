import * as React from 'react'
import {ReactNode, useMemo} from 'react'
import {Seq} from '@axanc/ts-utils'
import {ChartPieIndicatorProps, ChartPieWidget} from './ChartPieWidget.js'
import {ChartBuilder} from './ChartBuilder.js'
export type ChartPieWidgetProps<T> = {
  title?: ReactNode
  data: T[]
  baseCondition?: (_: T) => boolean | undefined
  condition: (_: T) => boolean | undefined
  compareBy?: (_: T) => boolean | undefined
} & Omit<ChartPieIndicatorProps, 'base' | 'value'>

export const ChartPieWidgetBy = <T,>({
  title,
  data,
  baseCondition,
  condition,
  compareBy,
  ...props
}: ChartPieWidgetProps<T>) => {
  const result = useMemo(() => {
    return ChartBuilder.getPercentage({
      data,
      baseCondition,
      condition,
      compareBy,
    })
  }, [data, baseCondition, condition, compareBy])
  return <ChartPieWidget title={title} value={result.value} base={result.base} evolution={result.delta} {...props} />
}
