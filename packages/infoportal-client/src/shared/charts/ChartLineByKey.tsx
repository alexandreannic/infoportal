import {Obj, Seq} from '@axanc/ts-utils'
import {format} from 'date-fns'
import React, {useMemo} from 'react'
import {KeyOfType} from '@axanc/ts-utils'
import {ChartLine, ChartLineData} from '@/shared/charts/ChartLine'

export const ChartLineByKey = <T extends {end: Date}, K extends KeyOfType<T, undefined | string>, V extends T[K]>({
  data,
  question,
  getDate,
  displayedValues,
  translations,
  height,
}: {
  height?: number
  getDate: (_: T) => Date
  question: K
  data: Seq<T>
  displayedValues?: V[]
  // @ts-ignore
  translations?: Partial<Record<T[K], string>>
}) => {
  const transform: ChartLineData[] = useMemo(() => {
    return Obj.entries(data.groupBy((_) => format(getDate(_), 'yyyy-MM'))).map(([date, group]) => {
      const res = {} as ChartLineData
      group
        .map((_) => _[question])
        .filter((_) => _ !== undefined && (!displayedValues || displayedValues?.includes(_ as any)))
        .forEach((_) => {
          // @ts-ignore
          if (!res[_]) res[_] = 1
          // @ts-ignore
          else res[_] += 1
        })
      Obj.keys(res).forEach((k) => {
        res[k] = Math.round((res[k] / group.length) * 100)
      })
      res.name = date
      return res
    })
  }, [data, question])
  return <ChartLine data={transform} height={height} translation={translations as any} hideLabelToggle />
}
