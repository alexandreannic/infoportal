import {ReactNode} from 'react'
import {Obj} from '@axanc/ts-utils'

export type ChartValue = {
  value: number
  base: number
  ratio: number
  label?: ReactNode
  desc?: string
  delta?: number
}

export type ChartData<K extends string> = Record<K, ChartValue>

export class ChartBuilder {
  static readonly groupBySingle = <D, K extends string>({
    data,
    by,
    skippedValues,
    compareBy,
  }: {
    data: D[]
    by: (_: D) => K
    compareBy?: (_: D) => boolean
    skippedValues?: K[]
  }): Obj<K, ChartValue> => {
    const skipped = skippedValues ? new Set(skippedValues) : undefined
    const source = {} as ChartData<K>
    const reference = {} as ChartData<K>
    let base = 0
    let baseDelta = 0
    for (const item of data) {
      const key = by(item)

      if (skipped && skipped.has(key)) continue
      if (!source[key]) source[key] = {value: 0} as ChartValue
      source[key].value = source[key].value + 1
      base = base + 1

      if (compareBy && compareBy(item)) {
        if (!reference[key]) reference[key] = {value: 0} as ChartValue
        reference[key].value = reference[key].value + 1
        baseDelta = baseDelta + 1
      }
    }
    for (const key in source) {
      const s = source[key]
      s.base = base
      s.ratio = s.value / base
      if (compareBy) {
        const ref = reference[key]?.value ?? 0
        ;(s as any).delta_ = {ratio: ref / baseDelta, base: baseDelta, value: ref}
        s.delta = (s.ratio - ref / baseDelta) * 100
      }
    }
    return new Obj(source).sortByNumber(_ => _.value, '9-0')
  }

  static readonly getPercentage = <D>({
    data,
    baseCondition,
    condition,
    compareBy,
  }: {
    data: D[]
    baseCondition?: (_: D) => boolean | undefined
    condition: (_: D) => boolean | undefined
    compareBy?: (_: D) => boolean | undefined
  }): ChartValue => {
    let value = 0
    let base = 0
    let refValue = 0
    let refBase = 0

    for (const item of data) {
      if (baseCondition && !baseCondition(item)) continue
      base++

      if (condition(item)) value++

      if (compareBy?.(item)) {
        refBase++
        if (condition(item)) refValue++
      }
    }

    const ratio = base > 0 ? value / base : 0
    const delta = compareBy && refBase > 0 ? (ratio - refValue / refBase) * 100 : undefined

    return {value, base, ratio, delta}
  }

  static readonly groupByMultiple = <D, K extends string>({
    data,
    by,
    skippedValues,
    compareBy,
    basedOn = 'dataLength',
  }: {
    data: D[]
    by: (_: D) => undefined | K[]
    compareBy?: (_: D) => boolean
    skippedValues?: K[]
    basedOn?: 'dataLength' | 'flatDataLength'
  }): Obj<K, ChartValue> => {
    const filterSet = skippedValues ? new Set(skippedValues) : undefined
    const source = [] as ChartData<K>
    const reference = {} as ChartData<K>
    let base = 0
    let baseDelta = 0

    for (const item of data) {
      const value = by(item)
      if (!value) continue
      const keys = value.filter(_ => (filterSet ? !filterSet?.has(_) : true))
      if (keys.length === 0) continue
      base = base + (basedOn === 'dataLength' ? 1 : keys?.length)

      const hasDelta = compareBy && compareBy(item)
      if (hasDelta) baseDelta = baseDelta + (basedOn === 'dataLength' ? 1 : keys?.length)
      for (const key of keys) {
        if (!source[key]) source[key] = {value: 0} as ChartValue
        source[key].value = source[key].value + 1

        if (hasDelta) {
          if (!reference[key]) reference[key] = {value: 0} as ChartValue
          reference[key].value = reference[key].value + 1
        }
      }
    }
    for (const key in source) {
      const s = source[key]
      s.base = base
      s.ratio = s.value / base
      if (compareBy) {
        const ref = reference[key]?.value ?? 0
        s.delta = (s.ratio - ref / baseDelta) * 100
      }
    }
    return new Obj<K, ChartValue>(source).sortByNumber(_ => _.value, '9-0')
  }
}
