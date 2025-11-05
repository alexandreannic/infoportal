import {KeyOfType, Obj, Seq} from '@axanc/ts-utils'
import {format} from 'date-fns'
import React, {useMemo} from 'react'
import {ChartLine, ChartLineData} from './ChartLine.js'
/** @deprecated rather use ChartLineByDateFiltered.tsx. Better API, better perf */
export const ChartLineByProperty = <
  T extends Record<string, any>,
  K extends KeyOfType<T, undefined | string>,
  V extends T[K],
>({
  data,
  property,
  getDate,
  displayedValues,
  translations,
  height,
}: {
  height?: number
  getDate: (_: T) => Date
  property: K
  data: Seq<T>
  displayedValues?: V[]
  // @ts-ignore
  translations?: Partial<Record<T[K], string>>
}) => {
  const transform: ChartLineData[] = useMemo(() => {
    const byDate = data.groupBy(_ => format(getDate(_), 'yyyy-MM'))
    return Obj.entries(byDate).map(([date, group]) => {
      const countOfEach = group
        .map(_ => _[property])
        .filter(_ => _ !== undefined && (!displayedValues || displayedValues?.includes(_)))
        .groupByAndApply(
          _ => _,
          _ => _.length,
        )
      return {
        name: date,
        values: countOfEach,
        // Obj.mapValues(countOfEach, _ => Math.round((_ / group.length) * 100)),
      }
    })
  }, [data, property])
  return <ChartLine data={transform} height={height} translation={translations as any} hideLabelToggle />
}
