import {ChartDataVal, ChartHelperOld} from '@/shared/charts/chartHelperOld'
import {Enum, seq, Seq} from '@alexandreannic/ts-utils'
import React, {ReactNode, useMemo} from 'react'
import {chain, KeyOf} from '@infoportal-common'
import {ChartBar} from '@/shared/charts/ChartBar'
import {Checkbox} from '@mui/material'

export const ChartBarSingleBy = <
  D extends Record<string, any>,
  K extends string,
  O extends Record<K, ReactNode>,
>({
  by,
  data,
  limit,
  onClickData,
  sortBy,
  checked,
  onToggle,
  label,
  filter,
  mergeOptions,
  debug
}: {
  debug?: boolean
  onClickData?: (_: K) => void
  limit?: number
  sortBy?: typeof ChartHelperOld.sortBy.value
  data: Seq<D>,
  mergeOptions?: Partial<Record<KeyOf<O>, KeyOf<O>>>
  label?: O
  by: (_: D) => K | undefined,
  filter?: (_: D) => boolean,
  checked?: Record<K, boolean>
  onToggle?: (_: K) => void
}) => {
  const res = useMemo(() => {
    const source = seq(data).filter(filter ?? (_ => _)).map(d => {
      if (by(d) === undefined) return
      if (mergeOptions) return (mergeOptions as any)[by(d)] ?? by(d)
      return by(d)
    }).compact()
    const chart = ChartHelperOld.single({data: source})
    return chain(chart).map(label ? ChartHelperOld.setLabel(label) : _ => _)
      .map(sortBy ?? ChartHelperOld.sortBy.value)
      .map(limit ? ChartHelperOld.take(limit) : _ => _)
      .get() as Record<K, ChartDataVal>
  }, [data, by, label])
  return (
    <ChartBar
      data={res}
      onClickData={_ => onClickData?.(_ as K)}
      labels={label}
      // labels={!onToggle ? undefined :
      //   seq(Enum.keys(res)).reduceObject((option => [
      //       option,
      //       <Checkbox
      //         key={option as string}
      //         size="small"
      //         checked={checked?.[option] ?? false}
      //         onChange={() => onToggle(option)}
      //       />
      //     ]
      //   ))
      // }
    />
  )
}