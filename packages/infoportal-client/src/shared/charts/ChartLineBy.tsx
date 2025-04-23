import {Obj, seq, Seq} from '@axanc/ts-utils'
import React, {useMemo} from 'react'
import {ChartLine, ChartLineData, ChartLineProps} from '@/shared/charts/ChartLine'

export const ChartLineBy = <T extends Record<string, any>>({
  data,
  getX,
  getY,
  height,
  label,
  ...props
}: {
  height?: number
  getX: (_: T) => string
  getY: (_: T) => number
  label: string
  data: Seq<T>
} & Pick<ChartLineProps, 'hideLegend' | 'hideLabelToggle' | 'hideXTicks' | 'hideYTicks' | 'sx'>) => {
  const transform = useMemo(() => {
    const gb = data.groupBy(getX)
    const w = new Obj(gb).entries().map(([k, v]) => {
      return {
        name: k,
        [label]: v.sum(getY as any),
      } as unknown as ChartLineData
    })
    return seq(w).sortByString((_) => _.name)
  }, [data])
  return <ChartLine {...props} data={transform} percent height={height} hideLabelToggle />
}
