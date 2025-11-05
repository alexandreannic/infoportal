import {Obj} from '@axanc/ts-utils'
import {ReactNode, useMemo} from 'react'
import {ChartBar} from './ChartBar.js'
import {ChartBuilder, ChartValue} from './ChartBuilder.js'
interface ChartBarBaseProps<D extends Record<string, any>, K extends string> {
  onClickData?: (_: K) => void
  checked?: K[]
  data: D[]
  limit?: number
  labels?: Record<K, ReactNode>
  skippedValues?: K[]
  compareBy?: (_: D) => boolean
  orderKeys?: K[]
  /** @deprecated */
  onToggle?: (_: K) => void
  hideValue?: boolean
  basedOn?: undefined
  dense?: boolean
}

type ChartBarByPropsMultiple<D extends Record<string, any>, K extends string> = ChartBarBaseProps<D, K> & {
  multiple: true
  by: (_: D) => K[] | undefined
  basedOn?: 'dataLength' | 'flatDataLength'
}

type ChartBarByPropsSingle<D extends Record<string, any>, K extends string> = ChartBarBaseProps<D, K> & {
  multiple?: false
  by: (_: D) => K
  basedOn?: undefined
}

export type ChartBarByProps<D extends Record<string, any>, K extends string> =
  | ChartBarByPropsMultiple<D, K>
  | ChartBarByPropsSingle<D, K>

export const ChartBarBy = <D extends Record<string, any>, K extends string>({
  by,
  compareBy,
  data,
  limit,
  onClickData,
  checked,
  labels,
  hideValue,
  skippedValues,
  orderKeys,
  basedOn,
  multiple,
  dense,
}: ChartBarByProps<D, K>) => {
  const computed: Obj<K, ChartValue> = useMemo(() => {
    if (multiple)
      return ChartBuilder.groupByMultiple({
        data,
        by,
        skippedValues,
        basedOn,
        compareBy,
      })
    return ChartBuilder.groupBySingle({
      data,
      by,
      skippedValues,
      compareBy,
    })
  }, [data, by, multiple, basedOn, skippedValues, compareBy])

  const result = useMemo(() => {
    return computed.take(limit).sortManual(orderKeys).get()
  }, [limit, computed, orderKeys, labels])

  return (
    <ChartBar
      hideValue={hideValue}
      data={result}
      onClickData={_ => onClickData?.(_)}
      checked={checked}
      dense={dense}
      labels={labels}
      // labels={
      //   !onToggle
      //     ? undefined
      //     : seq(Obj.keys(res)).reduceObject<Record<string, ReactNode>>(option => [
      //         option,
      //         <Checkbox
      //           key={option}
      //           size="small"
      //           checked={checked?.[option] ?? false}
      //           onChange={() => onToggle(option)}
      //         />,
      //       ])
      // }
    />
  )
}
