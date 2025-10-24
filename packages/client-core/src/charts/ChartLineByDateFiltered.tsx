import {map, Obj} from '@axanc/ts-utils'
import React, {useMemo} from 'react'
import {isDate, PeriodHelper} from 'infoportal-common'
import {ChartLine, ChartLineProps} from './ChartLine'

export type ChartLineCurve<T = any> = {
  getDate: (_: T) => Date | undefined
  filter?: (_: T) => boolean | undefined
  color?: string
}

function formatDateByTick(date: Date, tick: 'day' | 'month' | 'year' = 'day'): string {
  // We don't use date-fns for perf reason
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')

  switch (tick) {
    case 'year':
      return `${y}`
    case 'month':
      return `${y}-${m}`
    case 'day':
    default:
      return `${y}-${m}-${d}`
  }
}

export const ChartLineByDateFiltered = <T,>({
  data,
  curves,
  label,
  height,
  start,
  end,
  tick = 'month',
  ...props
}: {
  curves: Record<string, ChartLineCurve<T>>
  label?: string | string[]
  data: T[]
  start?: Date
  end?: Date
  tick?: 'month' | 'year' | 'day'
} & Pick<ChartLineProps, 'height' | 'distinctYAxis' | 'hideYTicks' | 'colors' | 'sx'>) => {
  const curve = useMemo(() => {
    const res: Record<string, Record<string, number>> = {}
    const invalidDates: {row: T; date?: any}[] = []
    data.forEach(row => {
      Obj.entries(curves).forEach(([q, {getDate, filter}]) => {
        const date = map(getDate(row), _ => (typeof _ === 'string' ? new Date(_) : _)) as Date | undefined
        try {
          if (!date || !isDate(date)) throw Error('Invalid date')
          const formattedDate = formatDateByTick(date, tick)
          if (!PeriodHelper.isDateIn({start: start, end: end}, date)) return

          let bucket = res[formattedDate]
          if (!bucket) bucket = res[formattedDate] = {}
          // console.log('filter>>', {res: filter?.(row), row, filter})
          if (!filter || filter(row)) bucket[q] = (bucket[q] ?? 0) + 1
        } catch (e) {
          invalidDates.push({row, date})
          return
        }
      })
    })
    if (invalidDates.length) {
      console.error(`Invalid dates:`, invalidDates)
    }
    return Obj.entries(res)
      .map(([date, v]) => {
        Obj.keys(curves).forEach(q => {
          if (!v[q]) v[q] = 0
        })
        return [date, v] as [string, Record<string, number>]
      })
      .map(([date, v]) => ({name: date, values: v}))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [data, curves, start, end])

  const colors = useMemo(() => {
    return Obj.values(curves).map(_ => _.color)
  }, [curves])

  return <ChartLine {...props} fixMissingMonths hideLabelToggle={true} data={curve} colors={() => colors} />
  // {/*<Txt color="hint" size="small" sx={{display: 'flex', justifyContent: 'space-between'}}>*/}
  // {/*{map(curve.head, start => <Box>{start.label}</Box>)}*/}
  // {/*{map(_.last, end => <Box>{format(new Date(end.label), 'LLL yyyy')}</Box>)}*/}
  // {/*</Txt>*/}
}
