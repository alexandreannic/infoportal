import {format} from 'date-fns'
import {map, Obj} from '@axanc/ts-utils'
import React, {useMemo} from 'react'
import {ChartLine, ChartLineProps} from '@/shared/charts/ChartLine'
import {isDate} from 'infoportal-common'

export type DateKeys<T> = {
  [K in keyof T]: T[K] extends Date | undefined ? K : never
}[keyof T]

export const ChartLineByDate = <T, K extends DateKeys<T>>({
  data,
  curves,
  label,
  height,
  start,
  end,
  // translations,
  ...props
}: {
  height?: number
  curves: Record<string, (_: T) => Date | undefined>
  label?: string | string[]
  data: T[]
  start?: Date
  end?: Date
  // @ts-ignore
  // translations?: Partial<Record<T[K], string>>
} & Pick<ChartLineProps, 'hideYTicks' | 'colors' | 'sx'>) => {
  const curve = useMemo(() => {
    const res: Record<string, Record<string, number>> = {}
    let hasInvalidDate = false
    data.forEach((d) => {
      Obj.entries(curves)
        .map(([q, fn]) => {
          const date = map(fn(d), (d) => (typeof d === 'string' ? new Date(d) : d)) as Date | undefined
          try {
            if (!date || !isDate(date)) throw Error('Invalid date')
            const yyyyMM = format(date, 'yyyy-MM')
            if ((end && date.getTime() > end.getTime()) || (start && date.getTime() < start.getTime())) {
              return
            }
            if (!res[yyyyMM]) res[yyyyMM] = {} as any
            if (!res[yyyyMM][q]) res[yyyyMM][q] = 0
            res[yyyyMM][q] += 1
          } catch (e) {
            hasInvalidDate = true
            return
          }
        })
        .filter((_) => _ !== undefined)
    })
    if (hasInvalidDate) {
      console.log(`Invalid date`, {data, res})
    }
    return Obj.entries(res)
      .map(([date, v]) => {
        Obj.keys(curves).forEach((q) => {
          if (!v[q]) v[q] = 0
        })
        return [date, v] as [string, Record<K, number>]
      })
      .map(([date, v]) => ({name: date, ...v}))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [data, curves, end])

  return (
    <>
      <ChartLine
        {...props}
        fixMissingMonths
        hideLabelToggle={true}
        height={height ?? 220}
        data={curve}
        // translation={translations as any}
      />
      {/*<Txt color="hint" size="small" sx={{display: 'flex', justifyContent: 'space-between'}}>*/}
      {/*{map(curve.head, start => <Box>{start.label}</Box>)}*/}
      {/*{map(_.last, end => <Box>{format(new Date(end.label), 'LLL yyyy')}</Box>)}*/}
      {/*</Txt>*/}
    </>
  )
}
