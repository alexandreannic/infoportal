import {ChartData, ChartDataVal, ChartHelper} from '@/shared/charts/chartHelper'
import {Obj, seq, Seq} from '@axanc/ts-utils'
import React, {ReactNode, useMemo} from 'react'
import {KeyOf} from 'infoportal-common'
import {ChartBar} from '@/shared/charts/ChartBar'
import {Checkbox} from '@mui/material'

export const ChartBarSingleBy = <D extends Record<string, any>, K extends string, O extends Record<K, ReactNode>>({
  by,
  data,
  limit,
  finalTransform = _ => _,
  onClickData,
  checked,
  label,
  filter,
  mergeOptions,
  min,
  debug,
}: {
  debug?: boolean
  onClickData?: (_: K) => void
  checked?: K[]
  limit?: number
  finalTransform?: (_: ChartData<KeyOf<O>>) => ChartData<any>
  data: Seq<D>
  mergeOptions?: Partial<Record<KeyOf<O>, KeyOf<O>>>
  label?: O
  min?: number
  by: (_: D) => K | undefined
  filter?: (_: D) => boolean
}) => {
  const res = useMemo(() => {
    const source = seq(data)
      .filter(filter ?? (_ => _))
      .map(d => {
        if (by(d) === undefined) return
        if (mergeOptions) return (mergeOptions as any)[by(d)] ?? by(d)
        return by(d)
      })
      .compact()
    return ChartHelper.single({data: source})
      .setLabel(label)
      .sortBy.value()
      .filterValue(_ => (min ? _.value > min : true))
      .take(limit)
      .map(finalTransform)
      .get() as Record<K, ChartDataVal>
  }, [data, by, label])
  return <ChartBar checked={checked} data={res} onClickData={onClickData} />
}
