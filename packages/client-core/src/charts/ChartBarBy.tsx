import {Obj, seq, Seq} from '@axanc/ts-utils'
import {useMemo} from 'react'
import {BarChartData, ChartBar} from './ChartBar'
import {ChartHelper} from './chartHelper'

interface ChartBarBaseProps<D extends Record<string, any>, K extends string> {
  onClickData?: (_: K) => void
  checked?: K[]
  data: D[]
  compareTo?: D[]
  limit?: number
  label?: Record<K, string>
  filterValue?: K[]
  orderKeys?: K[]
  /** @deprecated */
  onToggle?: (_: K) => void
  hideValue?: boolean
  displayOption?: undefined
}

export type ChartBarByProps<D extends Record<string, any>, K extends string> =
  | (ChartBarBaseProps<D, K> & {
      multiple: true
      by: (_: D) => K[]
      displayOption?: 'percentOfTotalAnswers' | 'percentOfTotalChoices'
    })
  | (ChartBarBaseProps<D, K> & {
      multiple?: false
      by: (_: D) => K
      displayOption?: undefined
    })

export const ChartBarBy = <D extends Record<string, any>, K extends string>({
  by,
  data,
  limit,
  onClickData,
  checked,
  // onToggle,
  label,
  hideValue,
  filterValue,
  displayOption,
  orderKeys,
  compareTo,
  multiple,
}: ChartBarByProps<D, K>) => {
  const computeData = (data: D[]) => {
    const source = seq(data)
      .compact()
      .map(by as any)
    const helper = multiple
      ? ChartHelper.multiple<K>({
          data: source as Seq<K[]>,
          filterValue,
          displayOption,
        })
      : ChartHelper.single({data: source as Seq<K>, filterValue})

    return helper
      .setLabel(label)
      .sortBy.value()
      .take(limit)
      .map(_ => (orderKeys ? Obj.sortManual(_, orderKeys) : _))
      .get()
  }

  const current = useMemo(() => {
    return computeData(data)
  }, [data, by, label, displayOption, multiple, orderKeys, limit, filterValue])

  const before = useMemo(() => {
    if (compareTo) return computeData(compareTo)
  }, [compareTo, by, label, displayOption, multiple, orderKeys, limit, filterValue])

  const res: Record<K, BarChartData> = useMemo(() => {
    if (!before) return current
    return Obj.mapValues(current, (_, k) => {
      return {
        ..._,
        comparativeValue: before[k]?.value,
      }
    })
  }, [current, before])

  return (
    <ChartBar
      hideValue={hideValue}
      data={res}
      onClickData={_ => onClickData?.(_)}
      checked={checked}
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
