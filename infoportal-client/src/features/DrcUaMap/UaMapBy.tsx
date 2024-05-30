import {ChartHelperOld} from '@/shared/charts/chartHelperOld'
import {UkraineMap} from '@/shared/UkraineMap/UkraineMap'
import React, {useMemo} from 'react'
import {Seq} from '@alexandreannic/ts-utils'
import {BoxProps} from '@mui/material'
import {OblastISO} from '@infoportal-common'

export const UaMapBy = <D extends Record<string, any>>({
  data,
  getOblast,
  total,
  value = () => true,
  base = () => true,
  fillBaseOn = 'percent',
  ...props
}: {
  fillBaseOn?: 'percent' | 'value'
  value?: (_: D) => boolean
  base?: (_: D) => boolean
  total?: number
  getOblast: (_: D) => OblastISO
  data: Seq<D>
  legend?: boolean
} & Pick<BoxProps, 'sx'>) => {
  const res = useMemo(() => {
    return ChartHelperOld.groupBy({
      data: data,
      groupBy: _ => getOblast(_),
      filter: value,
      filterBase: base,
    })
  }, [data, value, getOblast])
  return (
    <UkraineMap data={res} fillBaseOn={fillBaseOn} base={total} {...props}/>
  )
}