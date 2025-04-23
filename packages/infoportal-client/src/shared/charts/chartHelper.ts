import {fnSwitch, Obj, seq, Seq} from '@axanc/ts-utils'
import {ReactNode} from 'react'
import {NonNullableKey} from 'infoportal-common'

export interface ChartDataValPercent extends NonNullableKey<ChartDataVal, 'base'> {
  percent: number
}

export interface ChartDataVal {
  value: number
  base?: number
  label?: ReactNode
  desc?: string
}

export type ChartData<K extends string = string> = Record<K, ChartDataVal>

export const makeChartData: {
  (_: ChartDataValPercent): ChartDataValPercent
  (_: ChartDataVal): ChartDataVal
} = (_) => {
  return _ as any
}

export class ChartHelper<K extends string = string> {
  static readonly single = <K extends string>({
    data,
    percent,
    filterValue,
  }: {
    data: K[]
    filterValue?: K[]
    percent?: boolean
  }): ChartHelper<K> => {
    const obj = seq(data.filter((_) => (filterValue ? !filterValue.includes(_) : true))).reduceObject<
      Record<K, number>
    >((curr, acc) => {
      return [curr, (acc[curr] ?? 0) + 1]
    })
    const res = {} as ChartData<K>
    Obj.keys(obj).forEach((k) => {
      res[k] = {value: obj[k] / (percent ? data.length : 1)}
    })
    return new ChartHelper(res).sortBy.value()
  }

  static readonly multiple = <K extends string>({
    data,
    base = 'percentOfTotalAnswers',
    filterValue,
  }: {
    data: Seq<K[] | undefined>
    filterValue?: K[]
    base?: 'percentOfTotalAnswers' | 'percentOfTotalChoices'
  }): ChartHelper<K> => {
    const filteredData = data.compact().filter((_) => {
      return filterValue ? seq(_).intersect(filterValue).length === 0 : true
    })
    const flatData: K[] = filteredData.flatMap((_) => _)
    const obj = seq(flatData).reduceObject<Record<K, number>>((_, acc) => [_!, (acc[_!] ?? 0) + 1])
    const baseCount = fnSwitch(
      base!,
      {
        percentOfTotalAnswers: filteredData.length,
        percentOfTotalChoices: flatData.length,
      },
      (_) => undefined,
    )
    const res = {} as ChartData<K>
    Obj.keys(obj).forEach((k) => {
      if (!res[k]) res[k] = {value: 0, base: 0}
      res[k].value = obj[k]
      res[k].base = baseCount
    })
    return new ChartHelper(res).sortBy.value()
  }

  static readonly byCategory = <A extends Record<string, any>, K extends string>({
    data,
    filter,
    categories,
    filterBase,
    filterZeroCategory,
  }: {
    data: A[]
    filter: (_: A) => boolean | undefined
    filterBase?: (_: A) => boolean | undefined
    filterZeroCategory?: boolean
    categories: Record<K, (_: A) => boolean>
  }): ChartHelper<K> => {
    const res = Obj.keys(categories).reduce(
      (acc, category) => ({...acc, [category]: {value: 0, base: 0, percent: 0}}),
      {} as Record<K, ChartDataValPercent>,
    )
    data.forEach((x) => {
      Obj.entries(categories).forEach(([category, isCategory]) => {
        if (!isCategory(x)) return
        if (filterBase && !filterBase(x)) return
        const r = res[category]
        r.base += 1
        if (filter(x)) {
          r.value += 1
          r.percent = r.value / r.base
        }
      })
    })
    if (filterZeroCategory) {
      Obj.keys(res).forEach((k) => {
        if (res[k].value === 0) delete res[k]
      })
    }
    return new ChartHelper(res)
  }

  constructor(private value: ChartData<K>) {}

  readonly get = () => this.value

  static readonly filterValue =
    <K extends string>(fn: (_: ChartDataVal) => boolean) =>
    (obj: ChartData<K>): ChartData<K> => {
      return Obj.filterValue(obj, fn) as any
    }

  readonly filterValue = (fn: (_: ChartDataVal) => boolean) => {
    this.value = ChartHelper.filterValue(fn)(this.value)
    return this
  }

  static readonly take =
    <K extends string>(n?: number) =>
    (obj: Record<K, ChartDataVal>): ChartData<K> => {
      if (n) return seq(Obj.entries(obj).splice(0, n)).reduceObject((_) => _)
      return obj
    }

  readonly map = (fn?: (_: ChartData<K>) => ChartData<K>) => {
    if (fn) this.value = fn(this.value)
    return this
  }

  readonly take = (n?: number) => {
    this.value = ChartHelper.take(n)(this.value)
    return this
  }

  static readonly sortBy = {
    custom:
      <T extends string>(order: T[]) =>
      <V>(obj: ChartData<T>): ChartData<T> => {
        return Obj.sort(obj, ([aK, aV], [bK, bV]) => {
          return order.indexOf(aK) - order.indexOf(bK)
        })
      },
    percent: <T extends string>(obj: ChartData<T>): ChartData<T> => {
      return Obj.sort(obj, ([aK, aV], [bK, bV]) => {
        try {
          return bV.value / (bV.base ?? 1) - aV.value / (aV.base ?? 1)
        } catch (e) {
          return 0
        }
      })
    },
    value: <T extends string>(obj: ChartData<T>): ChartData<T> => {
      return Obj.sort(obj, ([aK, aV], [bK, bV]) => {
        return bV.value - aV.value
      })
    },
    label: <T extends string>(obj: ChartData<T>): ChartData<T> => {
      return Obj.sort(obj, ([aK, aV], [bK, bV]) => {
        return ((bV.label as string) ?? '').localeCompare((aV.label as string) ?? '')
      })
    },
  }

  readonly sortBy = {
    custom: (order: K[]): ChartHelper<K> => {
      this.value = ChartHelper.sortBy.custom(order)(this.value)
      return this
    },
    percent: (): ChartHelper<K> => {
      this.value = ChartHelper.sortBy.percent(this.value)
      return this
    },
    value: (): ChartHelper<K> => {
      this.value = ChartHelper.sortBy.value(this.value)
      return this
    },
    label: (): ChartHelper<K> => {
      this.value = ChartHelper.sortBy.label(this.value)
      return this
    },
  }

  static readonly groupBy = <A extends Record<string, any>, K extends string>({
    data,
    filter,
    filterBase,
    groupBy,
  }: {
    data: A[]
    groupBy: (_: A) => K | undefined
    filter: (_: A) => boolean
    filterBase?: (_: A) => boolean
  }): ChartData<K> => {
    const res: ChartData<any> = {} as any
    data.forEach((x) => {
      const value = groupBy(x) ?? 'undefined'
      if (!res[value]) res[value] = {value: 0} as ChartDataVal
      if (filterBase && filterBase(x)) {
        res[value].base = (res[value].base ?? 0) + 1
      }
      if (filter(x)) {
        res[value].value = res[value].value! + 1
      }
    })
    return res
  }

  static readonly sumByCategory = <A extends Record<string, any>, K extends string>({
    data,
    filter,
    sumBase,
    categories,
  }: {
    data: A[]
    filter: (_: A) => number
    sumBase?: (_: A) => number
    categories: Record<K, (_: A) => boolean>
  }): Record<K, ChartDataVal> => {
    const res = Obj.keys(categories).reduce(
      (acc, category) => ({...acc, [category]: {value: 0, base: 0}}),
      {} as Record<K, {value: number; base: 0}>,
    )
    data.forEach((x) => {
      Obj.entries(categories).forEach(([category, isCategory]) => {
        if (!isCategory(x)) return
        const base = sumBase ? sumBase(x) : 1
        if (base) {
          res[category].base += base
          res[category].value += filter(x) ?? 0
        }
      })
    })
    return res
  }

  readonly setLabel = (m?: Record<K, ReactNode>): ChartHelper<K> => {
    if (m) {
      Obj.keys(this.value).forEach((k) => {
        this.value[k].label = m[k]
      })
    }
    return this
  }

  readonly setDesc =
    (m: Record<string, string>) =>
    (data: ChartData): ChartData => {
      Object.keys(data).forEach((k) => {
        data[k].desc = m[k]
      })
      return data
    }

  static readonly percentage = <A>({
    data,
    value,
    base,
  }: {
    data: A[]
    value: (a: A) => boolean
    base?: (a: A) => boolean
  }): ChartDataValPercent => {
    const v = seq(data).count(value)
    const b = (base ? seq(data).count(base) : data.length) || 1
    return {value: v, base: b, percent: v / b}
  }

  readonly groupByDate = <F extends string>({
    data,
    getDate,
    percentageOf,
  }: {
    data: F[]
    getDate: (_: F) => string | undefined
    percentageOf?: (_: F) => boolean
  }): ChartData<F> => {
    const obj = seq(data).reduceObject<Record<string, {filter: number; total: number}>>((x, acc) => {
      const date = getDate(x) ?? 'undefined'
      let value = acc[date]
      if (!value) value = {filter: 0, total: 0}
      if (percentageOf) {
        value.filter += percentageOf(x) ? 1 : 0
      }
      value.total += 1
      return [date, value]
    })
    const res: ChartData = {}
    Object.entries(obj).forEach(([k, v]) => {
      res[k] = {
        label: k,
        value: percentageOf ? v.filter / v.total : v.total,
      }
    })
    return res
  }
}
