import React, {ReactNode, useEffect, useMemo, useState} from 'react'
import {seq} from '@axanc/ts-utils'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'

export type MultipleChoicesChoice<T extends string> = {
  value: T
  label?: ReactNode
  key?: number | string
}

export type UseMultipleChoicesProps<T extends string> = {
  options?: MultipleChoicesChoice<T>[]
  initialValue?: T[]
  addBlankOption?: boolean
  value?: T[]
  onChange: (t: T[], e?: any) => void
}

export type UseMultipleChoicesRes<T extends string> = {
  allChecked: boolean
  someChecked: boolean
  onClick: (_: T) => void
  toggleAll: () => void
  options: {
    value: T
    checked?: boolean
    label?: ReactNode
    key?: string | number
    onChange: () => void
  }[]
}

type MultipleChoicesMultiple<T extends string> = UseMultipleChoicesProps<T> & {
  label?: ReactNode
  children: (_: UseMultipleChoicesRes<T>) => React.JSX.Element
}

export const useMultipleChoices = <T extends string>({
  initialValue,
  value,
  onChange,
  addBlankOption,
  options = [],
}: UseMultipleChoicesProps<T>): UseMultipleChoicesRes<T> => {
  const [innerValue, setInnerValue] = useState<T[]>(value ?? initialValue ?? [])

  const allValues = useMemo(() => options.map((_) => _.value), [options])

  const someChecked = !!allValues.find((_) => innerValue?.includes(_))

  const allChecked = allValues.length === innerValue?.length

  const toggleAll = () => {
    setInnerValue(innerValue?.length === 0 ? allValues : [])
  }

  const onClick = (v: T) => {
    setInnerValue((prev) => (prev.includes(v) ? prev.filter((_) => _ !== v) : [...prev, v]))
  }

  useEffect(() => {
    if (!seq(value).equals(innerValue)) setInnerValue(value ?? [])
  }, [value])

  useEffect(() => {
    if (!seq(innerValue).equals(initialValue)) onChange(innerValue)
  }, [innerValue])

  return {
    someChecked,
    allChecked,
    toggleAll,
    onClick,
    options: [
      ...(addBlankOption
        ? [{value: DatatableUtils.blank, label: DatatableUtils.blankLabel} as MultipleChoicesChoice<any>]
        : []),
      ...options,
    ].map((_) => ({
      ..._,
      key: _.key ?? _.value,
      checked: innerValue.includes(_.value),
      onChange: () => onClick(_.value),
    })),
  }
}

export const MultipleChoices = <T extends string>({children, ...props}: MultipleChoicesMultiple<T>) => {
  const res = useMultipleChoices(props)
  return children(res)
}
