import {KeyOf} from 'infoportal-common'
import * as React from 'react'
import {useMemo} from 'react'
import {ChartPieWidgetBy, ChartPieWidgetProps} from '@/shared/charts/ChartPieWidgetBy'

export const ChartPieWidgetByKey = <T, K extends KeyOf<T>>({
  property,
  filter,
  filterBase,
  data,
  compare,
  keepUndefined,
  ...props
}: ChartPieWidgetProps<T> & {
  property: K
} & (
    | {
        keepUndefined: true
        filter: (_: T[K]) => boolean
        filterBase?: (_: T[K]) => boolean
      }
    | {
        keepUndefined?: false
        filter: (_: NonNullable<T[K]>) => boolean
        filterBase?: (_: NonNullable<T[K]>) => boolean
      }
  )) => {
  const {dataDefined, compareDefined} = useMemo(() => {
    return {
      dataDefined: keepUndefined ? data : data.filter((_) => _[property] !== undefined),
      compareDefined: compare
        ? {
            before: compare?.before?.filter((_) => _[property] !== undefined),
            now: compare?.now?.filter((_) => _[property] !== undefined),
          }
        : undefined,
    }
  }, [data, property])
  return (
    <ChartPieWidgetBy
      data={dataDefined as any}
      compare={compareDefined}
      filter={(_) => filter(_[property] as any)}
      filterBase={filterBase ? (_) => filterBase(_[property] as any) : undefined}
      {...props}
    />
  )
}
